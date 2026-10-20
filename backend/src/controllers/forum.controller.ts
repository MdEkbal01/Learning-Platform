import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { logAuditEvent } from '../services/audit.service';

export async function getTopics(req: Request, res: Response): Promise<void> {
  try {
    const courseId = req.params.courseId as string;
    const isStaff = ['SUPER_ADMIN', 'MODERATOR'].includes(req.user?.role || '');

    const topics = await prisma.courseForumTopic.findMany({
      where: {
        courseId,
        ...(isStaff ? {} : { isHidden: false }),
      },
      include: {
        author: { select: { id: true, name: true, role: true } },
        _count: { select: { posts: true } },
      },
      orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
    });

    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve topics.' });
  }
}

export async function createTopic(req: Request, res: Response): Promise<void> {
  try {
    const courseId = req.params.courseId as string;
    const { title, content } = req.body;
    const userId = req.user!.id;

    if (!title || !content) {
      res.status(400).json({ error: 'Title and content are required.' });
      return;
    }

    const topic = await prisma.courseForumTopic.create({
      data: {
        courseId,
        authorId: userId,
        title: title.trim(),
        content: content.trim(),
      },
      include: {
        author: { select: { id: true, name: true, role: true } },
      },
    });

    res.status(201).json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create topic.' });
  }
}

export async function getTopicDetails(req: Request, res: Response): Promise<void> {
  try {
    const topicId = req.params.topicId as string;
    const isStaff = ['SUPER_ADMIN', 'MODERATOR'].includes(req.user?.role || '');

    const topic = await prisma.courseForumTopic.findUnique({
      where: { id: topicId },
      include: {
        author: { select: { id: true, name: true, role: true } },
        course: { select: { id: true, title: true } },
        posts: {
          where: isStaff ? {} : { isHidden: false },
          orderBy: { createdAt: 'asc' },
          include: {
            author: { select: { id: true, name: true, role: true } },
          },
        },
      },
    });

    if (!topic || (!isStaff && topic.isHidden)) {
      res.status(404).json({ error: 'Discussion topic not found.' });
      return;
    }

    res.json(topic);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve topic.' });
  }
}

export async function addPost(req: Request, res: Response): Promise<void> {
  try {
    const topicId = req.params.topicId as string;
    const { content } = req.body;
    const userId = req.user!.id;

    if (!content || content.trim().length === 0) {
      res.status(400).json({ error: 'Content cannot be empty.' });
      return;
    }

    const topic = await prisma.courseForumTopic.findUnique({
      where: { id: topicId },
    });

    if (!topic) {
      res.status(404).json({ error: 'Topic not found.' });
      return;
    }

    if (topic.isLocked) {
      res.status(403).json({ error: 'This topic has been locked by a moderator.' });
      return;
    }

    const post = await prisma.courseForumPost.create({
      data: {
        topicId,
        authorId: userId,
        content: content.trim(),
      },
      include: {
        author: { select: { id: true, name: true, role: true } },
      },
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to reply.' });
  }
}

export async function reportContent(req: Request, res: Response): Promise<void> {
  try {
    const { targetType, targetId, reason } = req.body;
    const userId = req.user!.id;

    if (!targetType || !targetId || !reason) {
      res.status(400).json({ error: 'Target type, target ID, and reason are required.' });
      return;
    }

    const report = await prisma.moderationReport.create({
      data: {
        reporterId: userId,
        targetType,
        targetId,
        reason: reason.trim(),
        status: 'PENDING',
      },
    });

    await logAuditEvent({
      actorId: userId,
      actorEmail: req.user!.email,
      action: 'CONTENT_REPORTED',
      entityType: 'MODERATION_REPORT',
      entityId: report.id,
      details: { targetType, targetId, reason },
      req,
    });

    res.status(201).json({
      message: 'Report submitted. Our moderation team will review this shortly.',
      reportId: report.id,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit report.' });
  }
}
