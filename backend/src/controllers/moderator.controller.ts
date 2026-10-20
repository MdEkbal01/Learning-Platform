import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { logAuditEvent } from '../services/audit.service';

export async function getModerationQueue(req: Request, res: Response): Promise<void> {
  try {
    const { status } = req.query;

    const reports = await prisma.moderationReport.findMany({
      where: {
        ...(status && status !== 'ALL' ? { status: status as string } : {}),
      },
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        resolvedBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const populated = await Promise.all(
      reports.map(async (rep) => {
        let targetContent: any = null;

        if (rep.targetType === 'FORUM_TOPIC') {
          targetContent = await prisma.courseForumTopic.findUnique({
            where: { id: rep.targetId },
            include: {
              author: { select: { name: true, email: true } },
              course: { select: { title: true } },
            },
          });
        } else if (rep.targetType === 'FORUM_POST') {
          targetContent = await prisma.courseForumPost.findUnique({
            where: { id: rep.targetId },
            include: {
              author: { select: { name: true, email: true } },
            },
          });
        }

        return {
          ...rep,
          targetContent,
        };
      })
    );

    res.json(populated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve moderation queue.' });
  }
}

export async function takeModerationAction(req: Request, res: Response): Promise<void> {
  try {
    const reportId = req.params.reportId as string;
    const { action, resolutionNotes } = req.body;
    const moderatorId = req.user!.id;

    if (!['DISMISS', 'HIDE_CONTENT', 'REMOVE_CONTENT'].includes(action)) {
      res.status(400).json({ error: 'Invalid moderation action.' });
      return;
    }

    const report = await prisma.moderationReport.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      res.status(404).json({ error: 'Report not found.' });
      return;
    }

    if (action === 'HIDE_CONTENT') {
      if (report.targetType === 'FORUM_TOPIC') {
        await prisma.courseForumTopic.update({
          where: { id: report.targetId },
          data: { isHidden: true },
        });
      } else if (report.targetType === 'FORUM_POST') {
        await prisma.courseForumPost.update({
          where: { id: report.targetId },
          data: { isHidden: true },
        });
      }
    } else if (action === 'REMOVE_CONTENT') {
      if (report.targetType === 'FORUM_TOPIC') {
        await prisma.courseForumTopic.delete({
          where: { id: report.targetId },
        });
      } else if (report.targetType === 'FORUM_POST') {
        await prisma.courseForumPost.delete({
          where: { id: report.targetId },
        });
      }
    }

    const updatedReport = await prisma.moderationReport.update({
      where: { id: report.id },
      data: {
        status: action === 'DISMISS' ? 'DISMISSED' : 'ACTION_TAKEN',
        resolvedByUserId: moderatorId,
        resolutionNotes: resolutionNotes || `Action executed: ${action}`,
      },
    });

    await logAuditEvent({
      actorId: moderatorId,
      actorEmail: req.user!.email,
      action: 'MODERATION_ACTION_TAKEN',
      entityType: 'MODERATION_REPORT',
      entityId: report.id,
      details: { action, targetType: report.targetType, targetId: report.targetId, notes: resolutionNotes },
      req,
    });

    res.json({
      message: 'Moderation action applied successfully.',
      report: updatedReport,
    });
  } catch (error) {
    console.error('takeModerationAction error:', error);
    res.status(500).json({ error: 'Failed to execute moderation action.' });
  }
}
