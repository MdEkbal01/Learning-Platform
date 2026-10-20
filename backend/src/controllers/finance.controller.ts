import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { logAuditEvent } from '../services/audit.service';

export async function getFinanceOverview(req: Request, res: Response): Promise<void> {
  try {
    const paidOrders = await prisma.order.findMany({
      where: { status: 'PAID' },
      select: { amount: true },
    });

    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);

    const refundedOrders = await prisma.order.findMany({
      where: { status: 'REFUNDED' },
      select: { amount: true },
    });

    const totalRefunded = refundedOrders.reduce((sum, o) => sum + o.amount, 0);

    const pendingCount = await prisma.order.count({ where: { status: 'PENDING' } });
    const failedCount = await prisma.order.count({ where: { status: 'FAILED' } });

    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } },
        refund: true,
      },
    });

    res.json({
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      totalRefunded: Math.round(totalRefunded * 100) / 100,
      paidCount: paidOrders.length,
      refundedCount: refundedOrders.length,
      pendingCount,
      failedCount,
      recentOrders,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve finance overview.' });
  }
}

export async function getAllOrders(req: Request, res: Response): Promise<void> {
  try {
    const { status, search } = req.query;

    const whereClause: any = {};
    if (status && typeof status === 'string' && status !== 'ALL') {
      whereClause.status = status;
    }

    if (search && typeof search === 'string') {
      whereClause.OR = [
        { orderNumber: { contains: search } },
        { user: { email: { contains: search } } },
        { user: { name: { contains: search } } },
        { course: { title: { contains: search } } },
      ];
    }

    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        user: { select: { id: true, name: true, email: true } },
        course: { select: { id: true, title: true } },
        transactions: true,
        refund: {
          include: {
            processedBy: { select: { name: true, email: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve orders.' });
  }
}

export async function processRefund(req: Request, res: Response): Promise<void> {
  try {
    const { orderId, reason } = req.body;
    const staffId = req.user!.id;

    if (!orderId || !reason || reason.trim().length === 0) {
      res.status(400).json({ error: 'Order ID and refund reason are required.' });
      return;
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { course: true, user: true },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }

    if (order.status !== 'PAID') {
      res.status(400).json({
        error: `Only PAID orders can be refunded. Current status is ${order.status}.`,
      });
      return;
    }

    const [refund, updatedOrder] = await prisma.$transaction([
      prisma.refund.create({
        data: {
          orderId: order.id,
          processedByUserId: staffId,
          amount: order.amount,
          reason: reason.trim(),
          status: 'COMPLETED',
        },
      }),
      prisma.order.update({
        where: { id: order.id },
        data: { status: 'REFUNDED' },
      }),
      prisma.enrolment.updateMany({
        where: {
          userId: order.userId,
          courseId: order.courseId,
          orderId: order.id,
        },
        data: {
          status: 'REVOKED',
          grantReason: `Enrolment revoked due to refund. Reason: ${reason.trim()}`,
        },
      }),
    ]);

    await prisma.notification.create({
      data: {
        userId: order.userId,
        title: 'Refund Processed for Course Order',
        message: `Your payment of $${order.amount} for "${order.course.title}" has been refunded. Access has been updated. Reason: ${reason.trim()}`,
        type: 'SYSTEM',
      },
    });

    await logAuditEvent({
      actorId: staffId,
      actorEmail: req.user!.email,
      action: 'ORDER_REFUNDED_AND_ACCESS_REVOKED',
      entityType: 'ORDER',
      entityId: order.id,
      details: {
        orderNumber: order.orderNumber,
        amount: order.amount,
        reason: reason.trim(),
        learnerEmail: order.user.email,
      },
      req,
    });

    res.json({
      message: 'Refund successfully processed and course enrolment revoked.',
      refund,
      order: updatedOrder,
    });
  } catch (error) {
    console.error('processRefund error:', error);
    res.status(500).json({ error: 'Failed to process refund.' });
  }
}

export async function reconcileOrder(req: Request, res: Response): Promise<void> {
  try {
    const orderId = req.params.orderId as string;
    const { forceStatus, notes } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { course: true },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }

    if (forceStatus === 'PAID') {
      await prisma.$transaction([
        prisma.order.update({
          where: { id: order.id },
          data: { status: 'PAID' },
        }),
        prisma.enrolment.upsert({
          where: {
            userId_courseId: {
              userId: order.userId,
              courseId: order.courseId,
            },
          },
          create: {
            userId: order.userId,
            courseId: order.courseId,
            orderId: order.id,
            accessType: 'PURCHASE',
            status: 'ACTIVE',
            startDate: new Date(),
          },
          update: {
            status: 'ACTIVE',
          },
        }),
      ]);
    } else if (forceStatus === 'FAILED') {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'FAILED' },
      });
    }

    await logAuditEvent({
      actorId: req.user!.id,
      actorEmail: req.user!.email,
      action: 'PAYMENT_RECONCILIATION_SYNCED',
      entityType: 'ORDER',
      entityId: order.id,
      details: { forceStatus, notes },
      req,
    });

    res.json({ message: 'Order state reconciled.' });
  } catch (error) {
    res.status(500).json({ error: 'Reconciliation failed.' });
  }
}
