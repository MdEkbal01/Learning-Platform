import { Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../prisma';
import { logAuditEvent } from '../services/audit.service';
import { sendEnrollmentReceiptEmail } from '../services/email.service';

export async function createOrder(req: Request, res: Response): Promise<void> {
  try {
    const { courseId } = req.body;
    const userId = req.user!.id;

    if (!courseId) {
      res.status(400).json({ error: 'Course ID is required.' });
      return;
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found.' });
      return;
    }

    // Check if already actively enrolled
    const existingEnrolment = await prisma.enrolment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id,
        },
      },
    });

    if (existingEnrolment && existingEnrolment.status === 'ACTIVE') {
      res.status(400).json({ error: 'You are already actively enrolled in this course.' });
      return;
    }

    // Free course instant enrolment
    if (course.isFree || course.price <= 0) {
      const enrolment = await prisma.enrolment.upsert({
        where: {
          userId_courseId: {
            userId,
            courseId: course.id,
          },
        },
        create: {
          userId,
          courseId: course.id,
          accessType: 'FREE',
          status: 'ACTIVE',
          startDate: new Date(),
        },
        update: {
          status: 'ACTIVE',
          accessType: 'FREE',
        },
      });

      await logAuditEvent({
        actorId: userId,
        actorEmail: req.user!.email,
        action: 'FREE_ENROLMENT_ACTIVATED',
        entityType: 'ENROLMENT',
        entityId: enrolment.id,
        details: { courseId: course.id, courseTitle: course.title },
        req,
      });

      sendEnrollmentReceiptEmail(req.user!.email, {
        studentName: req.user!.name,
        courseTitle: course.title,
        orderNumber: `FREE-${enrolment.id.slice(0, 8).toUpperCase()}`,
        amount: 0,
        paymentMethod: '100% Free Scholarship',
        courseId: course.id,
      }).catch((err) => console.error('Free enrolment receipt error:', err));

      res.status(200).json({
        message: 'Successfully enrolled in free course!',
        isFree: true,
        enrolment,
      });
      return;
    }

    // Server-side price authority (PAY-01)
    const orderNumber = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const gatewayOrderId = `gateway_ord_${crypto.randomBytes(8).toString('hex')}`;

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId,
        courseId: course.id,
        amount: course.price,
        currency: 'INR',
        status: 'PENDING',
        paymentGateway: 'SIMULATED_GATEWAY',
        gatewayOrderId,
      },
      include: {
        course: { select: { id: true, title: true, price: true } },
      },
    });

    await logAuditEvent({
      actorId: userId,
      actorEmail: req.user!.email,
      action: 'ORDER_CREATED',
      entityType: 'ORDER',
      entityId: order.id,
      details: { orderNumber: order.orderNumber, amount: order.amount },
      req,
    });

    res.status(201).json({
      orderId: order.id,
      orderNumber: order.orderNumber,
      amount: order.amount,
      currency: order.currency,
      courseTitle: course.title,
      gatewayOrderId,
    });
  } catch (error) {
    console.error('createOrder error:', error);
    res.status(500).json({ error: 'Failed to initiate order.' });
  }
}

export async function verifyPayment(req: Request, res: Response): Promise<void> {
  try {
    const { orderId, paymentId, signature, status } = req.body;
    const userId = req.user!.id;

    if (!orderId) {
      res.status(400).json({ error: 'Order ID is required.' });
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

    if (order.userId !== userId && req.user!.role !== 'SUPER_ADMIN') {
      res.status(403).json({ error: 'Unauthorized to verify this order.' });
      return;
    }

    // Idempotency: If order is already PAID, return existing enrolment without re-processing
    if (order.status === 'PAID') {
      const existingEnrolment = await prisma.enrolment.findUnique({
        where: {
          userId_courseId: {
            userId: order.userId,
            courseId: order.courseId,
          },
        },
      });

      res.json({
        message: 'Payment already confirmed (Idempotent).',
        orderId: order.id,
        status: 'PAID',
        enrolment: existingEnrolment,
      });
      return;
    }

    if (status === 'FAILED') {
      await prisma.order.update({
        where: { id: order.id },
        data: { status: 'FAILED' },
      });

      await prisma.paymentTransaction.create({
        data: {
          orderId: order.id,
          gatewayPaymentId: paymentId || 'failed_trans',
          amount: order.amount,
          currency: order.currency,
          status: 'FAILED',
          rawResponseJson: JSON.stringify({ reason: 'Payment failed at gateway' }),
        },
      });

      res.status(400).json({
        error: 'Payment was declined or failed at gateway. No course access granted.',
        status: 'FAILED',
      });
      return;
    }

    // Cryptographic signature check simulation
    // In production: crypto.createHmac('sha256', secret).update(...).digest('hex') === signature
    const verifiedPaymentId = paymentId || `pay_${crypto.randomBytes(8).toString('hex')}`;
    const verifiedSignature = signature || `sig_${crypto.randomBytes(16).toString('hex')}`;

    // Atomic transaction: mark order paid, create transaction record, create active enrolment
    const [updatedOrder, transaction, enrolment] = await prisma.$transaction([
      prisma.order.update({
        where: { id: order.id },
        data: { status: 'PAID' },
      }),
      prisma.paymentTransaction.create({
        data: {
          orderId: order.id,
          gatewayPaymentId: verifiedPaymentId,
          gatewaySignature: verifiedSignature,
          amount: order.amount,
          currency: order.currency,
          status: 'SUCCESS',
          rawResponseJson: JSON.stringify({
            verified: true,
            method: 'simulated_card_or_upi',
            timestamp: new Date().toISOString(),
          }),
        },
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
          endDate:
            order.course.accessDurationDays > 0
              ? new Date(Date.now() + order.course.accessDurationDays * 24 * 60 * 60 * 1000)
              : null,
        },
        update: {
          status: 'ACTIVE',
          orderId: order.id,
          accessType: 'PURCHASE',
        },
      }),
    ]);

    // Send in-app notification
    await prisma.notification.create({
      data: {
        userId: order.userId,
        title: 'Payment Successful & Course Enrolled!',
        message: `Your payment for "${order.course.title}" was verified. Receipt #${order.orderNumber} is available.`,
        link: `/student/classroom/${order.courseId}`,
        type: 'ENROLMENT',
      },
    });

    sendEnrollmentReceiptEmail(req.user!.email, {
      studentName: req.user!.name,
      courseTitle: order.course.title,
      orderNumber: order.orderNumber,
      amount: order.amount,
      paymentMethod: 'UPI / QR Gateway',
      courseId: order.course.id,
    }).catch((err) => console.error('Paid enrolment receipt error:', err));

    await logAuditEvent({
      actorId: userId,
      actorEmail: req.user!.email,
      action: 'PAYMENT_VERIFIED_AND_ENROLLED',
      entityType: 'ORDER',
      entityId: order.id,
      details: {
        orderNumber: order.orderNumber,
        amount: order.amount,
        courseTitle: order.course.title,
        gatewayPaymentId: verifiedPaymentId,
      },
      req,
    });

    res.json({
      message: 'Payment verified successfully and enrolment activated!',
      order: updatedOrder,
      transaction,
      enrolment,
    });
  } catch (error) {
    console.error('verifyPayment error:', error);
    res.status(500).json({ error: 'Payment verification failed.' });
  }
}

// Developer / Admin Gateway Webhook Simulator (PRD PAY-07 & 12)
export async function simulateWebhook(req: Request, res: Response): Promise<void> {
  try {
    const { event, orderId, paymentId } = req.body;

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { course: true },
    });

    if (!order) {
      res.status(404).json({ error: 'Order not found.' });
      return;
    }

    if (event === 'payment.captured') {
      if (order.status === 'PAID') {
        res.json({
          message: 'Webhook received. Idempotent skip: Order is already marked PAID.',
          idempotent: true,
          orderId: order.id,
        });
        return;
      }

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

      res.json({
        message: 'Webhook processed: Order marked PAID and enrolment granted.',
        orderId: order.id,
      });
      return;
    }

    res.json({ message: `Webhook event ${event} acknowledged.` });
  } catch (error) {
    res.status(500).json({ error: 'Webhook simulation failed.' });
  }
}
