import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { logAuditEvent } from '../services/audit.service';

export async function createDoubt(req: Request, res: Response): Promise<void> {
  try {
    const { courseId, lessonId, title, description } = req.body;
    const userId = req.user!.id;

    if (!courseId || !title || !description) {
      res.status(400).json({ error: 'Course, title, and description are required.' });
      return;
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, mentorId: true },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found.' });
      return;
    }

    let attachmentUrl: string | undefined;
    let attachmentName: string | undefined;
    let attachmentType: string | undefined;

    if (req.file) {
      attachmentUrl = `/api/uploads/${req.file.filename}`;
      attachmentName = req.file.originalname;
      attachmentType = req.file.mimetype;
    }

    const doubt = await prisma.doubtTicket.create({
      data: {
        studentId: userId,
        mentorId: course.mentorId,
        courseId: course.id,
        lessonId: lessonId || null,
        title: title.trim(),
        description: description.trim(),
        status: 'OPEN',
        messages: {
          create: {
            senderId: userId,
            message: description.trim(),
            attachmentUrl,
            attachmentName,
            attachmentType,
          },
        },
      },
      include: {
        course: { select: { title: true } },
        student: { select: { name: true, email: true } },
      },
    });

    if (course.mentorId) {
      await prisma.notification.create({
        data: {
          userId: course.mentorId,
          title: 'New Student Doubt Submitted',
          message: `${req.user!.name} submitted a doubt in "${course.title}": "${title}"`,
          link: `/mentor/doubts`,
          type: 'DOUBT',
        },
      });
    }

    await logAuditEvent({
      actorId: userId,
      actorEmail: req.user!.email,
      action: 'DOUBT_TICKET_CREATED',
      entityType: 'DOUBT_TICKET',
      entityId: doubt.id,
      details: { courseId: course.id, title },
      req,
    });

    res.status(201).json(doubt);
  } catch (error) {
    console.error('createDoubt error:', error);
    res.status(500).json({ error: 'Failed to create doubt ticket.' });
  }
}

export async function getDoubts(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;
    const role = req.user!.role;
    const { status, courseId } = req.query;

    const whereClause: any = {};

    if (role === 'STUDENT') {
      whereClause.studentId = userId;
    } else if (role === 'MENTOR') {
      whereClause.mentorId = userId;
    }

    if (status && typeof status === 'string' && status !== 'ALL') {
      whereClause.status = status;
    }

    if (courseId && typeof courseId === 'string') {
      whereClause.courseId = courseId;
    }

    const doubts = await prisma.doubtTicket.findMany({
      where: whereClause,
      include: {
        course: { select: { id: true, title: true } },
        lesson: { select: { id: true, title: true } },
        student: { select: { id: true, name: true, email: true } },
        mentor: { select: { id: true, name: true } },
        _count: { select: { messages: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json(doubts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve doubts.' });
  }
}

export async function getDoubtDetails(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const userId = req.user!.id;
    const role = req.user!.role;

    const doubt = await prisma.doubtTicket.findUnique({
      where: { id },
      include: {
        course: { select: { id: true, title: true } },
        lesson: { select: { id: true, title: true } },
        student: { select: { id: true, name: true, email: true } },
        mentor: { select: { id: true, name: true, email: true } },
        messages: {
          orderBy: { createdAt: 'asc' },
          include: {
            sender: { select: { id: true, name: true, role: true } },
          },
        },
      },
    });

    if (!doubt) {
      res.status(404).json({ error: 'Doubt ticket not found.' });
      return;
    }

    const canAccess =
      doubt.studentId === userId ||
      doubt.mentorId === userId ||
      role === 'SUPER_ADMIN' ||
      role === 'MODERATOR';

    if (!canAccess) {
      res.status(403).json({ error: 'Unauthorized to view this conversation.' });
      return;
    }

    res.json(doubt);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve doubt details.' });
  }
}

export async function addDoubtMessage(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { message } = req.body;
    const userId = req.user!.id;

    if (!message || message.trim().length === 0) {
      res.status(400).json({ error: 'Message cannot be empty.' });
      return;
    }

    const doubt = await prisma.doubtTicket.findUnique({
      where: { id },
      include: { course: true },
    });

    if (!doubt) {
      res.status(404).json({ error: 'Doubt ticket not found.' });
      return;
    }

    let attachmentUrl: string | undefined;
    let attachmentName: string | undefined;
    let attachmentType: string | undefined;

    if (req.file) {
      attachmentUrl = `/api/uploads/${req.file.filename}`;
      attachmentName = req.file.originalname;
      attachmentType = req.file.mimetype;
    }

    const doubtMessage = await prisma.doubtMessage.create({
      data: {
        doubtId: doubt.id,
        senderId: userId,
        message: message.trim(),
        attachmentUrl,
        attachmentName,
        attachmentType,
      },
      include: {
        sender: { select: { id: true, name: true, role: true } },
      },
    });

    let updatedStatus = doubt.status;
    if (doubt.status === 'OPEN' && req.user!.role === 'MENTOR') {
      updatedStatus = 'IN_PROGRESS';
    }

    await prisma.doubtTicket.update({
      where: { id: doubt.id },
      data: {
        status: updatedStatus,
        updatedAt: new Date(),
      },
    });

    const recipientId = userId === doubt.studentId ? doubt.mentorId : doubt.studentId;
    if (recipientId) {
      await prisma.notification.create({
        data: {
          userId: recipientId,
          title: `Reply on Doubt: "${doubt.title}"`,
          message: `${req.user!.name}: ${message.substring(0, 80)}...`,
          link: `/student/doubts`,
          type: 'DOUBT',
        },
      });
    }

    res.status(201).json(doubtMessage);
  } catch (error) {
    res.status(500).json({ error: 'Failed to post message.' });
  }
}

export async function updateDoubtStatus(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    if (!['OPEN', 'IN_PROGRESS', 'RESOLVED'].includes(status)) {
      res.status(400).json({ error: 'Invalid status. Must be OPEN, IN_PROGRESS, or RESOLVED.' });
      return;
    }

    const doubt = await prisma.doubtTicket.update({
      where: { id },
      data: {
        status,
        resolvedAt: status === 'RESOLVED' ? new Date() : null,
      },
    });

    res.json({ message: 'Doubt status updated.', doubt });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status.' });
  }
}
