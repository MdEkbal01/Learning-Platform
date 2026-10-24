import { Request, Response } from 'express';
import crypto from 'crypto';
import { prisma } from '../prisma';
import { logAuditEvent } from '../services/audit.service';
import { sendCertificateEmail } from '../services/email.service';

export async function getMyCourses(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;

    const enrolments = await prisma.enrolment.findMany({
      where: {
        userId,
        status: 'ACTIVE',
      },
      include: {
        course: {
          include: {
            category: true,
            modules: {
              include: {
                lessons: {
                  select: { id: true, durationMinutes: true },
                },
              },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const progressRecords = await prisma.lessonProgress.findMany({
      where: { userId },
    });

    const progressMap = new Map<string, { isCompleted: boolean; lastPos: number }>();
    progressRecords.forEach((p) => {
      progressMap.set(p.lessonId, {
        isCompleted: p.isCompleted,
        lastPos: p.lastPlaybackPositionSeconds,
      });
    });

    const result = enrolments.map((enr) => {
      const allLessons = enr.course.modules.flatMap((m) => m.lessons);
      const totalLessons = allLessons.length;
      let completedLessons = 0;

      allLessons.forEach((l) => {
        if (progressMap.get(l.id)?.isCompleted) {
          completedLessons++;
        }
      });

      const completionPercentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

      return {
        enrolmentId: enr.id,
        accessType: enr.accessType,
        enrolledAt: enr.startDate,
        course: {
          id: enr.course.id,
          title: enr.course.title,
          slug: enr.course.slug,
          thumbnail: enr.course.thumbnail,
          instructorName: enr.course.instructorName,
          category: enr.course.category.name,
          durationHours: enr.course.durationHours,
        },
        progress: {
          totalLessons,
          completedLessons,
          completionPercentage,
        },
      };
    });

    res.json(result);
  } catch (error) {
    console.error('getMyCourses error:', error);
    res.status(500).json({ error: 'Failed to retrieve enrolled courses.' });
  }
}

export async function getClassroom(req: Request, res: Response): Promise<void> {
  try {
    const courseId = req.params.courseId as string;
    const userId = req.user!.id;

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        category: true,
        mentor: {
          select: { id: true, name: true, email: true },
        },
        modules: {
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: {
              orderBy: { orderIndex: 'asc' },
              include: {
                resources: true,
              },
            },
            quiz: {
              select: {
                id: true,
                title: true,
                passPercentage: true,
                _count: { select: { questions: true } },
              },
            },
          },
        },
      },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found.' });
      return;
    }

    const enrolment = await prisma.enrolment.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id,
        },
      },
    });

    const isAuthorized =
      req.user!.role === 'SUPER_ADMIN' ||
      (enrolment && enrolment.status === 'ACTIVE') ||
      course.isFree;

    if (!isAuthorized) {
      res.status(403).json({
        error: 'Active enrolment required to access course classroom.',
        courseId: course.id,
        isFree: course.isFree,
      });
      return;
    }

    const lessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
    const progressRecords = await prisma.lessonProgress.findMany({
      where: {
        userId,
        lessonId: { in: lessonIds },
      },
    });

    const progressLookup = Object.fromEntries(
      progressRecords.map((p) => [
        p.lessonId,
        {
          isCompleted: p.isCompleted,
          lastPlaybackPositionSeconds: p.lastPlaybackPositionSeconds,
        },
      ])
    );

    const quizIds = course.modules.map((m) => m.quiz?.id).filter(Boolean) as string[];
    const quizAttempts = await prisma.quizAttempt.findMany({
      where: {
        userId,
        quizId: { in: quizIds },
      },
      orderBy: { createdAt: 'desc' },
    });

    const certificate = await prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId: course.id,
        },
      },
    });

    res.json({
      course,
      progressLookup,
      quizAttempts,
      certificate,
    });
  } catch (error) {
    console.error('getClassroom error:', error);
    res.status(500).json({ error: 'Failed to access classroom.' });
  }
}

export async function updateLessonProgress(req: Request, res: Response): Promise<void> {
  try {
    const lessonId = req.params.lessonId as string;
    const { isCompleted, lastPlaybackPositionSeconds } = req.body;
    const userId = req.user!.id;

    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: true },
    });

    if (!lesson) {
      res.status(404).json({ error: 'Lesson not found.' });
      return;
    }

    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId,
        },
      },
      create: {
        userId,
        lessonId,
        isCompleted: isCompleted ?? false,
        completedAt: isCompleted ? new Date() : null,
        lastPlaybackPositionSeconds: lastPlaybackPositionSeconds || 0,
      },
      update: {
        ...(isCompleted !== undefined
          ? {
              isCompleted,
              completedAt: isCompleted ? new Date() : null,
            }
          : {}),
        ...(lastPlaybackPositionSeconds !== undefined
          ? { lastPlaybackPositionSeconds }
          : {}),
      },
    });

    res.json({
      message: 'Progress recorded.',
      progress,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update progress.' });
  }
}

export async function getModuleQuiz(req: Request, res: Response): Promise<void> {
  try {
    const moduleId = req.params.moduleId as string;
    const userId = req.user!.id;

    const quiz = await prisma.moduleQuiz.findUnique({
      where: { moduleId },
      include: {
        questions: {
          orderBy: { orderIndex: 'asc' },
          select: {
            id: true,
            question: true,
            explanation: false,
            options: {
              select: {
                id: true,
                optionText: true,
                isCorrect: false,
              },
            },
          },
        },
        attempts: {
          where: { userId },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!quiz) {
      res.status(404).json({ error: 'Quiz not found for this module.' });
      return;
    }

    res.json(quiz);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve quiz.' });
  }
}

export async function submitModuleQuiz(req: Request, res: Response): Promise<void> {
  try {
    const moduleId = req.params.moduleId as string;
    const { answers } = req.body;
    const userId = req.user!.id;

    const quiz = await prisma.moduleQuiz.findUnique({
      where: { moduleId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      res.status(404).json({ error: 'Quiz not found.' });
      return;
    }

    let score = 0;
    const totalQuestions = quiz.questions.length;
    const feedback: any[] = [];

    quiz.questions.forEach((q) => {
      const selectedOptionId = answers ? answers[q.id] : null;
      const correctOption = q.options.find((o) => o.isCorrect);
      const isCorrect = correctOption?.id === selectedOptionId;

      if (isCorrect) {
        score++;
      }

      feedback.push({
        questionId: q.id,
        question: q.question,
        explanation: q.explanation,
        selectedOptionId,
        correctOptionId: correctOption?.id,
        isCorrect,
      });
    });

    const percentage = Math.round((score / totalQuestions) * 100);
    const isPassed = percentage >= quiz.passPercentage;

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        quizId: quiz.id,
        score,
        maxScore: totalQuestions,
        percentage,
        isPassed,
      },
    });

    res.json({
      attemptId: attempt.id,
      score,
      maxScore: totalQuestions,
      percentage,
      isPassed,
      passPercentage: quiz.passPercentage,
      feedback,
    });
  } catch (error) {
    console.error('submitModuleQuiz error:', error);
    res.status(500).json({ error: 'Failed to grade quiz.' });
  }
}

export async function getOrGenerateCertificate(req: Request, res: Response): Promise<void> {
  try {
    const courseId = req.params.courseId as string;
    const userId = req.user!.id;

    let cert = await prisma.certificate.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    if (cert) {
      res.json(cert);
      return;
    }

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: true,
            quiz: true,
          },
        },
      },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found.' });
      return;
    }

    const allLessons = course.modules.flatMap((m) => m.lessons);
    const completedProgress = await prisma.lessonProgress.count({
      where: {
        userId,
        lessonId: { in: allLessons.map((l) => l.id) },
        isCompleted: true,
      },
    });

    if (completedProgress < allLessons.length) {
      res.status(400).json({
        error: 'Course completion requirements not yet met.',
        totalLessons: allLessons.length,
        completedLessons: completedProgress,
      });
      return;
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });
    const code = `CERT-2026-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    cert = await prisma.certificate.create({
      data: {
        certificateCode: code,
        userId,
        courseId,
        studentName: user?.name || 'Verified Learner',
        courseTitle: course.title,
      },
    });

    await logAuditEvent({
      actorId: userId,
      actorEmail: user?.email,
      action: 'CERTIFICATE_ISSUED',
      entityType: 'CERTIFICATE',
      entityId: cert.id,
      details: { certificateCode: code, courseTitle: course.title },
      req,
    });

    if (user?.email) {
      sendCertificateEmail(user.email, {
        studentName: user.name || 'Verified Learner',
        courseTitle: course.title,
        certificateCode: code,
      }).catch((err) => console.error('Certificate email notification error:', err));
    }

    res.status(201).json(cert);
  } catch (error) {
    console.error('Certificate generation error:', error);
    res.status(500).json({ error: 'Failed to generate certificate.' });
  }
}

export async function getStudentOrders(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;

    const orders = await prisma.order.findMany({
      where: { userId },
      include: {
        course: { select: { id: true, title: true, slug: true } },
        transactions: true,
        refund: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve order history.' });
  }
}

export async function getStudentLiveClasses(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user!.id;

    const enrolments = await prisma.enrolment.findMany({
      where: { userId, status: 'ACTIVE' },
      select: { courseId: true },
    });

    const courseIds = enrolments.map((e) => e.courseId);

    const liveClasses = await prisma.liveClass.findMany({
      where: {
        courseId: { in: courseIds },
      },
      include: {
        course: { select: { id: true, title: true } },
        mentor: { select: { id: true, name: true, email: true } },
      },
      orderBy: { scheduledAt: 'asc' },
    });

    res.json(liveClasses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve live classes.' });
  }
}
