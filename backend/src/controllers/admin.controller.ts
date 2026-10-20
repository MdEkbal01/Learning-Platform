import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { logAuditEvent } from '../services/audit.service';

export async function getAdminAnalytics(req: Request, res: Response): Promise<void> {
  try {
    const totalUsers = await prisma.user.count();
    const studentsCount = await prisma.user.count({ where: { role: 'STUDENT' } });
    const mentorsCount = await prisma.user.count({ where: { role: 'MENTOR' } });
    const staffCount = totalUsers - studentsCount;

    const totalCourses = await prisma.course.count();
    const publishedCourses = await prisma.course.count({ where: { status: 'PUBLISHED' } });
    const inReviewCourses = await prisma.course.count({ where: { status: 'IN_REVIEW' } });

    const totalEnrolments = await prisma.enrolment.count({ where: { status: 'ACTIVE' } });

    const paidOrders = await prisma.order.findMany({
      where: { status: 'PAID' },
      select: { amount: true },
    });
    const totalRevenue = paidOrders.reduce((sum, o) => sum + o.amount, 0);

    const totalDoubts = await prisma.doubtTicket.count();
    const resolvedDoubts = await prisma.doubtTicket.count({ where: { status: 'RESOLVED' } });
    const openDoubts = totalDoubts - resolvedDoubts;

    const pendingReports = await prisma.moderationReport.count({ where: { status: 'PENDING' } });

    // Recent audit logs
    const recentAuditLogs = await prisma.auditEvent.findMany({
      take: 8,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    res.json({
      metrics: {
        totalUsers,
        studentsCount,
        mentorsCount,
        staffCount,
        totalCourses,
        publishedCourses,
        inReviewCourses,
        totalEnrolments,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalDoubts,
        resolvedDoubts,
        openDoubts,
        pendingReports,
      },
      recentAuditLogs,
    });
  } catch (error) {
    console.error('getAdminAnalytics error:', error);
    res.status(500).json({ error: 'Failed to retrieve analytics.' });
  }
}

export async function getUsers(req: Request, res: Response): Promise<void> {
  try {
    const { role, status, search } = req.query;

    const whereClause: any = {};
    if (role && typeof role === 'string' && role !== 'ALL') {
      whereClause.role = role;
    }
    if (status && typeof status === 'string' && status !== 'ALL') {
      whereClause.status = status;
    }
    if (search && typeof search === 'string') {
      whereClause.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { username: { contains: search } },
      ];
    }

    const users = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        mobile: true,
        username: true,
        role: true,
        status: true,
        suspensionReason: true,
        isEmailVerified: true,
        createdAt: true,
        lastLoginAt: true,
        profile: true,
        _count: {
          select: { enrolments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve users.' });
  }
}

export async function updateUserRole(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { newRole, reason } = req.body;
    const adminId = req.user!.id;

    const validRoles = [
      'STUDENT',
      'MENTOR',
      'CONTENT_MANAGER',
      'FINANCE_SUPPORT',
      'MODERATOR',
      'SUPER_ADMIN',
    ];

    if (!validRoles.includes(newRole)) {
      res.status(400).json({ error: 'Invalid role.' });
      return;
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: { role: newRole },
    });

    await logAuditEvent({
      actorId: adminId,
      actorEmail: req.user!.email,
      action: 'USER_ROLE_CHANGED',
      entityType: 'USER',
      entityId: id,
      details: {
        targetEmail: targetUser.email,
        oldRole: targetUser.role,
        newRole,
        reason: reason || 'Administrative role assignment',
      },
      req,
    });

    res.json({ message: 'User role updated successfully.', user: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user role.' });
  }
}

export async function updateUserStatus(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { status, reason } = req.body; // status: 'ACTIVE', 'SUSPENDED'
    const adminId = req.user!.id;

    if (!['ACTIVE', 'SUSPENDED'].includes(status)) {
      res.status(400).json({ error: 'Status must be ACTIVE or SUSPENDED.' });
      return;
    }

    if (status === 'SUSPENDED' && (!reason || reason.trim().length === 0)) {
      res.status(400).json({ error: 'A documented suspension reason is mandatory.' });
      return;
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    const updated = await prisma.user.update({
      where: { id },
      data: {
        status,
        suspensionReason: status === 'SUSPENDED' ? reason.trim() : null,
      },
    });

    // If suspended, revoke active sessions
    if (status === 'SUSPENDED') {
      await prisma.session.updateMany({
        where: { userId: id, isRevoked: false },
        data: { isRevoked: true },
      });
    }

    await logAuditEvent({
      actorId: adminId,
      actorEmail: req.user!.email,
      action: status === 'SUSPENDED' ? 'USER_SUSPENDED' : 'USER_REACTIVATED',
      entityType: 'USER',
      entityId: id,
      details: {
        targetEmail: targetUser.email,
        reason: reason || 'Administrative status change',
      },
      req,
    });

    res.json({ message: `User account is now ${status}.`, user: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update user status.' });
  }
}

export async function manualEnrolmentGrant(req: Request, res: Response): Promise<void> {
  try {
    const { userId, courseId, action, reason } = req.body;
    const adminId = req.user!.id;

    if (!userId || !courseId || !action || !reason) {
      res.status(400).json({ error: 'User ID, Course ID, action (GRANT/REVOKE), and reason are required.' });
      return;
    }

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!course || !user) {
      res.status(404).json({ error: 'Course or User not found.' });
      return;
    }

    if (action === 'GRANT') {
      const enrolment = await prisma.enrolment.upsert({
        where: {
          userId_courseId: { userId, courseId },
        },
        create: {
          userId,
          courseId,
          accessType: 'MANUAL_GRANT',
          status: 'ACTIVE',
          startDate: new Date(),
          grantedByUserId: adminId,
          grantReason: reason.trim(),
        },
        update: {
          status: 'ACTIVE',
          accessType: 'MANUAL_GRANT',
          grantReason: reason.trim(),
          grantedByUserId: adminId,
        },
      });

      await logAuditEvent({
        actorId: adminId,
        actorEmail: req.user!.email,
        action: 'MANUAL_ENROLMENT_GRANTED',
        entityType: 'ENROLMENT',
        entityId: enrolment.id,
        details: { targetEmail: user.email, courseTitle: course.title, reason },
        req,
      });

      res.json({ message: 'Course access manually granted.', enrolment });
    } else if (action === 'REVOKE') {
      await prisma.enrolment.updateMany({
        where: { userId, courseId },
        data: {
          status: 'REVOKED',
          grantReason: `Manual revocation: ${reason.trim()}`,
        },
      });

      await logAuditEvent({
        actorId: adminId,
        actorEmail: req.user!.email,
        action: 'MANUAL_ENROLMENT_REVOKED',
        entityType: 'ENROLMENT',
        entityId: `${userId}-${courseId}`,
        details: { targetEmail: user.email, courseTitle: course.title, reason },
        req,
      });

      res.json({ message: 'Course access revoked.' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update enrolment.' });
  }
}

export async function getAuditLogs(req: Request, res: Response): Promise<void> {
  try {
    const { action, entityType, search, limit } = req.query;

    const whereClause: any = {};
    if (action && typeof action === 'string' && action !== 'ALL') {
      whereClause.action = action;
    }
    if (entityType && typeof entityType === 'string' && entityType !== 'ALL') {
      whereClause.entityType = entityType;
    }
    if (search && typeof search === 'string') {
      whereClause.OR = [
        { actorEmail: { contains: search } },
        { action: { contains: search } },
        { detailsJson: { contains: search } },
      ];
    }

    const logs = await prisma.auditEvent.findMany({
      where: whereClause,
      take: limit ? parseInt(limit as string, 10) : 50,
      orderBy: { createdAt: 'desc' },
      include: {
        actor: { select: { id: true, name: true, email: true, role: true } },
      },
    });

    res.json(logs);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve audit logs.' });
  }
}

export async function getMaintenanceFlags(req: Request, res: Response): Promise<void> {
  try {
    const flags = await prisma.maintenanceFlag.findMany();
    res.json(flags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve maintenance flags.' });
  }
}

export async function toggleMaintenanceFlag(req: Request, res: Response): Promise<void> {
  try {
    const { featureKey, isEnabled, message } = req.body;
    const adminId = req.user!.id;

    if (!featureKey) {
      res.status(400).json({ error: 'Feature key is required.' });
      return;
    }

    const flag = await prisma.maintenanceFlag.upsert({
      where: { featureKey },
      create: {
        featureKey,
        isEnabled: Boolean(isEnabled),
        message: message || 'Undergoing scheduled maintenance.',
        updatedByUserId: adminId,
      },
      update: {
        isEnabled: Boolean(isEnabled),
        message: message !== undefined ? message : undefined,
        updatedByUserId: adminId,
      },
    });

    await logAuditEvent({
      actorId: adminId,
      actorEmail: req.user!.email,
      action: 'MAINTENANCE_FLAG_TOGGLED',
      entityType: 'MAINTENANCE_FLAG',
      entityId: flag.id,
      details: { featureKey, isEnabled: flag.isEnabled, message: flag.message },
      req,
    });

    res.json({ message: 'Maintenance mode updated.', flag });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update maintenance setting.' });
  }
}
