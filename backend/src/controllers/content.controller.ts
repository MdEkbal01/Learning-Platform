import { Request, Response } from 'express';
import { prisma } from '../prisma';
import { logAuditEvent } from '../services/audit.service';

export async function getAllCourses(req: Request, res: Response): Promise<void> {
  try {
    const courses = await prisma.course.findMany({
      include: {
        category: true,
        mentor: { select: { id: true, name: true, email: true } },
        _count: { select: { modules: true, enrolments: true } },
      },
      orderBy: { updatedAt: 'desc' },
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve courses.' });
  }
}

export async function createCourse(req: Request, res: Response): Promise<void> {
  try {
    const {
      title,
      description,
      shortDescription,
      categoryId,
      level,
      price,
      isFree,
      instructorName,
      mentorId,
      thumbnail,
      previewVideoUrl,
      accessDurationDays,
    } = req.body;

    if (!title || !description || !categoryId || !instructorName) {
      res.status(400).json({ error: 'Title, description, category, and instructor name are required.' });
      return;
    }

    const slug =
      title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '') +
      '-' +
      Math.floor(1000 + Math.random() * 9000);

    const course = await prisma.course.create({
      data: {
        title: title.trim(),
        slug,
        description: description.trim(),
        shortDescription: shortDescription?.trim(),
        categoryId,
        level: level || 'BEGINNER',
        price: isFree ? 0 : parseFloat(price || '0'),
        isFree: Boolean(isFree),
        status: 'DRAFT',
        instructorName: instructorName.trim(),
        mentorId: mentorId || null,
        thumbnail: thumbnail?.trim() || null,
        previewVideoUrl: previewVideoUrl?.trim() || null,
        accessDurationDays: parseInt(accessDurationDays || '365', 10),
      },
    });

    await logAuditEvent({
      actorId: req.user!.id,
      actorEmail: req.user!.email,
      action: 'COURSE_CREATED',
      entityType: 'COURSE',
      entityId: course.id,
      details: { title: course.title, status: course.status },
      req,
    });

    res.status(201).json(course);
  } catch (error) {
    console.error('createCourse error:', error);
    res.status(500).json({ error: 'Failed to create course.' });
  }
}

export async function updateCourse(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const {
      title,
      description,
      shortDescription,
      categoryId,
      level,
      price,
      isFree,
      instructorName,
      mentorId,
      thumbnail,
      previewVideoUrl,
      accessDurationDays,
    } = req.body;

    const updated = await prisma.course.update({
      where: { id },
      data: {
        ...(title ? { title: title.trim() } : {}),
        ...(description ? { description: description.trim() } : {}),
        ...(shortDescription !== undefined ? { shortDescription: shortDescription?.trim() } : {}),
        ...(categoryId ? { categoryId } : {}),
        ...(level ? { level } : {}),
        ...(price !== undefined ? { price: isFree ? 0 : parseFloat(price) } : {}),
        ...(isFree !== undefined ? { isFree: Boolean(isFree) } : {}),
        ...(instructorName ? { instructorName: instructorName.trim() } : {}),
        ...(mentorId !== undefined ? { mentorId: mentorId || null } : {}),
        ...(thumbnail !== undefined ? { thumbnail: thumbnail?.trim() || null } : {}),
        ...(previewVideoUrl !== undefined ? { previewVideoUrl: previewVideoUrl?.trim() || null } : {}),
        ...(accessDurationDays !== undefined ? { accessDurationDays: parseInt(accessDurationDays, 10) } : {}),
      },
    });

    await logAuditEvent({
      actorId: req.user!.id,
      actorEmail: req.user!.email,
      action: 'COURSE_UPDATED',
      entityType: 'COURSE',
      entityId: updated.id,
      details: { title: updated.title },
      req,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update course.' });
  }
}

export async function updateCourseStatus(req: Request, res: Response): Promise<void> {
  try {
    const id = req.params.id as string;
    const { status } = req.body;

    if (!['DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED'].includes(status)) {
      res.status(400).json({ error: 'Invalid status. Must be DRAFT, IN_REVIEW, PUBLISHED, or ARCHIVED.' });
      return;
    }

    const updated = await prisma.course.update({
      where: { id },
      data: {
        status,
        publishedAt: status === 'PUBLISHED' ? new Date() : undefined,
      },
    });

    await logAuditEvent({
      actorId: req.user!.id,
      actorEmail: req.user!.email,
      action: 'COURSE_STATUS_CHANGED',
      entityType: 'COURSE',
      entityId: updated.id,
      details: { newStatus: status, title: updated.title },
      req,
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to change course status.' });
  }
}

export async function addModule(req: Request, res: Response): Promise<void> {
  try {
    const courseId = req.params.courseId as string;
    const { title, description, orderIndex } = req.body;

    if (!title) {
      res.status(400).json({ error: 'Module title is required.' });
      return;
    }

    const count = await prisma.courseModule.count({ where: { courseId } });

    const newModule = await prisma.courseModule.create({
      data: {
        courseId,
        title: title.trim(),
        description: description?.trim(),
        orderIndex: orderIndex ? parseInt(orderIndex, 10) : count + 1,
      },
    });

    res.status(201).json(newModule);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create module.' });
  }
}

export async function addLesson(req: Request, res: Response): Promise<void> {
  try {
    const moduleId = req.params.moduleId as string;
    const { title, description, durationMinutes, videoUrl, notesMarkdown, isPreview, orderIndex } = req.body;

    if (!title) {
      res.status(400).json({ error: 'Lesson title is required.' });
      return;
    }

    const count = await prisma.lesson.count({ where: { moduleId } });

    const lesson = await prisma.lesson.create({
      data: {
        moduleId,
        title: title.trim(),
        description: description?.trim(),
        durationMinutes: durationMinutes ? parseInt(durationMinutes, 10) : 15,
        videoUrl: videoUrl?.trim() || null,
        notesMarkdown: notesMarkdown?.trim() || null,
        isPreview: Boolean(isPreview),
        orderIndex: orderIndex ? parseInt(orderIndex, 10) : count + 1,
      },
    });

    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create lesson.' });
  }
}

export async function updateLesson(req: Request, res: Response): Promise<void> {
  try {
    const lessonId = req.params.lessonId as string;
    const { title, description, durationMinutes, videoUrl, notesMarkdown, isPreview, orderIndex } = req.body;

    const updated = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        ...(title ? { title: title.trim() } : {}),
        ...(description !== undefined ? { description: description?.trim() } : {}),
        ...(durationMinutes !== undefined ? { durationMinutes: parseInt(durationMinutes, 10) } : {}),
        ...(videoUrl !== undefined ? { videoUrl: videoUrl?.trim() || null } : {}),
        ...(notesMarkdown !== undefined ? { notesMarkdown: notesMarkdown?.trim() || null } : {}),
        ...(isPreview !== undefined ? { isPreview: Boolean(isPreview) } : {}),
        ...(orderIndex !== undefined ? { orderIndex: parseInt(orderIndex, 10) } : {}),
      },
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update lesson.' });
  }
}

export async function deleteLesson(req: Request, res: Response): Promise<void> {
  try {
    const lessonId = req.params.lessonId as string;
    await prisma.lesson.delete({ where: { id: lessonId } });
    res.json({ message: 'Lesson deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete lesson.' });
  }
}

export async function createOrUpdateQuiz(req: Request, res: Response): Promise<void> {
  try {
    const moduleId = req.params.moduleId as string;
    const { title, passPercentage, questions } = req.body;

    if (!title || !questions || !Array.isArray(questions)) {
      res.status(400).json({ error: 'Title and questions array are required.' });
      return;
    }

    const existingQuiz = await prisma.moduleQuiz.findUnique({ where: { moduleId } });
    if (existingQuiz) {
      await prisma.moduleQuiz.delete({ where: { id: existingQuiz.id } });
    }

    const quiz = await prisma.moduleQuiz.create({
      data: {
        moduleId,
        title: title.trim(),
        passPercentage: passPercentage ? parseInt(passPercentage, 10) : 70,
        questions: {
          create: questions.map((q: any, idx: number) => ({
            question: q.question.trim(),
            explanation: q.explanation?.trim(),
            orderIndex: idx + 1,
            options: {
              create: q.options.map((opt: any) => ({
                optionText: opt.optionText.trim(),
                isCorrect: Boolean(opt.isCorrect),
              })),
            },
          })),
        },
      },
      include: {
        questions: {
          include: { options: true },
        },
      },
    });

    res.status(201).json(quiz);
  } catch (error) {
    console.error('createOrUpdateQuiz error:', error);
    res.status(500).json({ error: 'Failed to save quiz.' });
  }
}
