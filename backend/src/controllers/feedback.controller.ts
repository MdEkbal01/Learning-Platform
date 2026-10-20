import { Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../prisma';
import { logAuditEvent } from '../services/audit.service';

export async function submitFeedback(req: Request, res: Response): Promise<void> {
  try {
    const { category, courseId, title, description, rating } = req.body;
    const userId = req.user?.id;

    if (!title || !description) {
      res.status(400).json({ error: 'Title and description are required.' });
      return;
    }

    // If course feedback, verify user is enrolled in course (FDBK-01/02)
    if (category === 'COURSE_FEEDBACK') {
      if (!courseId) {
        res.status(400).json({ error: 'Course selection is required for course-specific feedback.' });
        return;
      }

      if (userId) {
        const enrolment = await prisma.enrolment.findUnique({
          where: {
            userId_courseId: {
              userId,
              courseId,
            },
          },
        });

        if (!enrolment && req.user?.role !== 'SUPER_ADMIN') {
          res.status(403).json({ error: 'Course feedback can only be submitted for enrolled courses.' });
          return;
        }
      }
    }

    let attachmentUrl: string | undefined;
    if (req.file) {
      attachmentUrl = `/api/uploads/${req.file.filename}`;
    }

    const referenceNumber = `FDBK-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const feedback = await prisma.feedback.create({
      data: {
        referenceNumber,
        userId: userId || null,
        courseId: courseId || null,
        category: category || 'GENERAL',
        title: title.trim(),
        description: description.trim(),
        rating: rating ? parseInt(rating, 10) : null,
        attachmentUrl,
        status: 'NEW',
      },
      include: {
        course: { select: { title: true } },
      },
    });

    if (userId) {
      await logAuditEvent({
        actorId: userId,
        actorEmail: req.user?.email,
        action: 'FEEDBACK_SUBMITTED',
        entityType: 'FEEDBACK',
        entityId: feedback.id,
        details: { referenceNumber, category, title },
        req,
      });
    }

    res.status(201).json({
      message: 'Feedback submitted successfully. Thank you for helping us improve!',
      referenceNumber: feedback.referenceNumber,
      feedbackId: feedback.id,
    });
  } catch (error) {
    console.error('submitFeedback error:', error);
    res.status(500).json({ error: 'Failed to submit feedback.' });
  }
}

export async function getFeedbacks(req: Request, res: Response): Promise<void> {
  try {
    const isStaff = ['SUPER_ADMIN', 'CONTENT_MANAGER', 'FINANCE_SUPPORT', 'MODERATOR'].includes(
      req.user?.role || ''
    );
    const userId = req.user?.id;
    const { category, status } = req.query;

    const whereClause: any = {};

    if (!isStaff) {
      // Students only see their own feedback
      whereClause.userId = userId;
    }

    if (category && typeof category === 'string' && category !== 'ALL') {
      whereClause.category = category;
    }

    if (status && typeof status === 'string' && status !== 'ALL') {
      whereClause.status = status;
    }

    const feedbacks = await prisma.feedback.findMany({
      where: whereClause,
      include: {
        user: { select: { name: true, email: true } },
        course: { select: { id: true, title: true } },
        assignedTo: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    // FDBK-05: Restrict internal notes from regular students
    const sanitized = feedbacks.map((f) => {
      if (!isStaff) {
        return {
          ...f,
          internalNotes: undefined, // Hidden
        };
      }
      return f;
    });

    res.json(sanitized);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve feedback.' });
  }
}

export async function updateFeedbackStatus(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { status, internalNotes, assignedToUserId } = req.body;
    const staffId = req.user!.id;

    const validStatuses = ['NEW', 'UNDER_REVIEW', 'PLANNED', 'RESOLVED', 'DECLINED'];
    if (status && !validStatuses.includes(status)) {
      res.status(400).json({ error: 'Invalid feedback status.' });
      return;
    }

    const updated = await prisma.feedback.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(internalNotes !== undefined ? { internalNotes } : {}),
        ...(assignedToUserId !== undefined ? { assignedToUserId: assignedToUserId || null } : {}),
      },
    });

    await logAuditEvent({
      actorId: staffId,
      actorEmail: req.user!.email,
      action: 'FEEDBACK_TRIAGED',
      entityType: 'FEEDBACK',
      entityId: id,
      details: { status, referenceNumber: updated.referenceNumber },
      req,
    });

    res.json({ message: 'Feedback updated successfully.', feedback: updated });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update feedback.' });
  }
}
