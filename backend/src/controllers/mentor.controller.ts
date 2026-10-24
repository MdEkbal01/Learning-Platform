import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { logAuditEvent } from '../services/audit.service';
import { sendLiveLectureReminderEmail } from '../services/email.service';

export async function getMentorDashboard(req: Request, res: Response): Promise<void> {
  try {
    const mentorId = req.user!.id;
    const isSuperAdmin = req.user!.role === 'SUPER_ADMIN';

    const assignedCourses = await prisma.course.findMany({
      where: isSuperAdmin ? {} : { mentorId },
      include: {
        _count: { select: { enrolments: true } },
        modules: {
          select: { id: true, title: true },
        },
      },
    });

    const openDoubtsCount = await prisma.doubtTicket.count({
      where: isSuperAdmin
        ? { status: { in: ['OPEN', 'IN_PROGRESS'] } }
        : {
            mentorId,
            status: { in: ['OPEN', 'IN_PROGRESS'] },
          },
    });

    const upcomingLiveClasses = await prisma.liveClass.findMany({
      where: isSuperAdmin
        ? {}
        : {
            mentorId,
          },
      include: {
        course: { select: { id: true, title: true } },
      },
      orderBy: { scheduledAt: 'desc' },
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
    console.error('getMentorDashboard error:', error);
    res.status(500).json({ error: 'Failed to retrieve mentor dashboard.' });
  }
}

export async function getMentorCourses(req: Request, res: Response): Promise<void> {
  try {
    const mentorId = req.user!.id;
    const isSuperAdmin = req.user!.role === 'SUPER_ADMIN';

    const courses = await prisma.course.findMany({
      where: isSuperAdmin ? {} : { mentorId },
      include: {
        category: true,
        modules: {
          select: { id: true, title: true },
        },
        _count: { select: { enrolments: true, doubtTickets: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(courses);
  } catch (error) {
    console.error('getMentorCourses error:', error);
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

    // Notify enrolled active students via email
    prisma.enrolment
      .findMany({
        where: { courseId, status: 'ACTIVE' },
        include: { user: { select: { email: true, name: true } } },
      })
      .then((enrolments) => {
        for (const enr of enrolments) {
          if (enr.user?.email) {
            sendLiveLectureReminderEmail(enr.user.email, {
              studentName: enr.user.name,
              lectureTitle: liveClass.title,
              courseTitle: liveClass.course.title,
              scheduledAt:
                new Date(liveClass.scheduledAt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }) + ' IST',
              durationMinutes: liveClass.durationMinutes,
              meetingUrl: liveClass.meetingUrl,
              mentorName: req.user!.name,
            }).catch(() => {});
          }
        }
      })
      .catch((err) => console.error('Live class email broadcast error:', err));

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

/**
 * Automatically publish a completed live lecture to the course recorded curriculum
 */
export async function publishLiveClassRecording(req: Request, res: Response): Promise<void> {
  try {
    const liveClassId = req.params.id as string;
    const { moduleId, recordingVideoUrl, lessonTitle, notesMarkdown } = req.body;

    const liveClass = await prisma.liveClass.findUnique({
      where: { id: liveClassId },
      include: { course: { include: { modules: true } } },
    });

    if (!liveClass) {
      res.status(404).json({ error: 'Live class not found.' });
      return;
    }

    // Default to first module if not provided
    const targetModuleId = moduleId || liveClass.course.modules[0]?.id;

    if (!targetModuleId) {
      res.status(400).json({ error: 'The course has no modules to attach the recording to. Please create a module first.' });
      return;
    }

    // Determine highest order index
    const existingLessons = await prisma.lesson.findMany({
      where: { moduleId: targetModuleId },
      orderBy: { orderIndex: 'desc' },
      take: 1,
    });
    const nextOrder = (existingLessons[0]?.orderIndex ?? -1) + 1;

    // Create recorded lesson
    const newLesson = await prisma.lesson.create({
      data: {
        moduleId: targetModuleId,
        title: lessonTitle || `[Live Recording] ${liveClass.title}`,
        description: liveClass.description || 'Recorded session from live masterclass.',
        videoUrl: recordingVideoUrl || liveClass.meetingUrl,
        notesMarkdown: notesMarkdown || `### Live Masterclass Recording\n\nConducted on: ${liveClass.scheduledAt.toLocaleDateString()}\n\nDuration: ${liveClass.durationMinutes} minutes.`,
        durationMinutes: liveClass.durationMinutes,
        orderIndex: nextOrder,
        isPreview: false,
      },
    });

    // Mark live class as COMPLETED
    await prisma.liveClass.update({
      where: { id: liveClassId },
      data: { status: 'COMPLETED' },
    });

    await logAuditEvent({
      actorId: req.user!.id,
      actorEmail: req.user!.email,
      action: 'LIVE_CLASS_RECORDING_PUBLISHED',
      entityType: 'LESSON',
      entityId: newLesson.id,
      details: { liveClassId, lessonId: newLesson.id, courseId: liveClass.courseId },
      req,
    });

    res.status(201).json({
      message: 'Live lecture successfully published to course curriculum!',
      lesson: newLesson,
    });
  } catch (error: any) {
    console.error('publishLiveClassRecording error:', error);
    res.status(500).json({ error: error.message || 'Failed to publish recording.' });
  }
}
