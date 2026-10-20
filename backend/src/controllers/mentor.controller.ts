import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { logAuditEvent } from '../services/audit.service';

export async function getMentorDashboard(req: Request, res: Response): Promise<void> {
  try {
    const mentorId = req.user!.id;

    const assignedCourses = await prisma.course.findMany({
      where: { mentorId },
      include: {
        _count: { select: { enrolments: true } },
      },
    });

    const openDoubtsCount = await prisma.doubtTicket.count({
      where: {
        mentorId,
        status: { in: ['OPEN', 'IN_PROGRESS'] },
      },
    });

    const upcomingLiveClasses = await prisma.liveClass.findMany({
      where: {
        mentorId,
        scheduledAt: { gte: new Date() },
      },
      include: {
        course: { select: { id: true, title: true } },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    const totalStudents = assignedCourses.reduce((sum, c) => sum + c._count.enrolments, 0);

    res.json({
      assignedCoursesCount: assignedCourses.length,
      totalStudents,
      openDoubtsCount,
      upcomingLiveClasses,
      courses: assignedCourses,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve mentor dashboard.' });
  }
}

export async function getMentorCourses(req: Request, res: Response): Promise<void> {
  try {
    const mentorId = req.user!.id;

    const courses = await prisma.course.findMany({
      where: { mentorId },
      include: {
        category: true,
        _count: { select: { enrolments: true, doubtTickets: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve assigned courses.' });
  }
}

export async function scheduleLiveClass(req: Request, res: Response): Promise<void> {
  try {
    const mentorId = req.user!.id;
    const { courseId, title, description, scheduledAt, durationMinutes, meetingUrl } = req.body;

    if (!courseId || !title || !scheduledAt || !meetingUrl) {
      res.status(400).json({ error: 'Course, title, schedule date/time, and meeting link are required.' });
      return;
    }

    const liveClass = await prisma.liveClass.create({
      data: {
        courseId,
        mentorId,
        title: title.trim(),
        description: description?.trim(),
        scheduledAt: new Date(scheduledAt),
        durationMinutes: durationMinutes ? parseInt(durationMinutes, 10) : 60,
        meetingUrl: meetingUrl.trim(),
        status: 'SCHEDULED',
      },
      include: {
        course: { select: { title: true } },
      },
    });

    await logAuditEvent({
      actorId: mentorId,
      actorEmail: req.user!.email,
      action: 'LIVE_CLASS_SCHEDULED',
      entityType: 'LIVE_CLASS',
      entityId: liveClass.id,
      details: { title, scheduledAt },
      req,
    });

    res.status(201).json(liveClass);
  } catch (error) {
    console.error('scheduleLiveClass error:', error);
    res.status(500).json({ error: 'Failed to schedule live class.' });
  }
}

export async function updateLiveClass(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { status, meetingUrl, scheduledAt, title } = req.body;

    const updated = await prisma.liveClass.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(meetingUrl ? { meetingUrl: meetingUrl.trim() } : {}),
        ...(scheduledAt ? { scheduledAt: new Date(scheduledAt) } : {}),
        ...(title ? { title: title.trim() } : {}),
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update live class.' });
  }
}
