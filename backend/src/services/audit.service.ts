import { Request } from 'express';
import { prisma } from '../prisma';

export interface AuditParams {
  actorId?: string | null;
  actorEmail?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: Record<string, any>;
  req?: Request;
}

export async function logAuditEvent({
  actorId,
  actorEmail,
  action,
  entityType,
  entityId,
  details,
  req,
}: AuditParams) {
  try {
    const ipAddress =
      req?.headers['x-forwarded-for']?.toString() || req?.socket?.remoteAddress || '127.0.0.1';
    const userAgent = req?.headers['user-agent'] || 'System';

    await prisma.auditEvent.create({
      data: {
        actorId: actorId || null,
        actorEmail: actorEmail || null,
        action,
        entityType,
        entityId: entityId || null,
        detailsJson: details ? JSON.stringify(details) : null,
        ipAddress,
        userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
  }
}
