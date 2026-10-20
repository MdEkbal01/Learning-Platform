import { Request, Response } from 'express';
import { prisma } from '../prisma';

export async function getCourses(req: Request, res: Response): Promise<void> {
  try {
    const { category, search, level, priceType } = req.query;

    const whereClause: any = {
      status: 'PUBLISHED',
    };

    if (category && typeof category === 'string' && category !== 'all') {
      whereClause.category = {
        slug: category,
      };
    }

    if (level && typeof level === 'string' && level !== 'all') {
      whereClause.level = level;
    }

    if (priceType === 'free') {
      whereClause.isFree = true;
    } else if (priceType === 'paid') {
      whereClause.isFree = false;
    }

    if (search && typeof search === 'string') {
      whereClause.OR = [
        { title: { contains: search } },
        { description: { contains: search } },
        { shortDescription: { contains: search } },
        { instructorName: { contains: search } },
      ];
    }

    const courses = await prisma.course.findMany({
      where: whereClause,
      include: {
        category: true,
        modules: {
          select: {
            id: true,
            title: true,
            lessons: {
              select: {
                id: true,
                title: true,
                durationMinutes: true,
                isPreview: true,
              },
            },
          },
        },
        _count: {
          select: { enrolments: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = courses.map((c) => {
      const totalLessons = c.modules.reduce((sum, m) => sum + m.lessons.length, 0);
      const totalDuration = c.modules.reduce(
        (sum, m) => sum + m.lessons.reduce((lsum, l) => lsum + l.durationMinutes, 0),
        0
      );

      return {
        id: c.id,
        title: c.title,
        slug: c.slug,
        shortDescription: c.shortDescription,
        description: c.description,
        thumbnail: c.thumbnail,
        price: c.price,
        isFree: c.isFree,
        level: c.level,
        language: c.language,
        instructorName: c.instructorName,
        durationHours: c.durationHours,
        category: c.category,
        totalModules: c.modules.length,
        totalLessons,
        totalMinutes: totalDuration,
        enrolledCount: c._count.enrolments,
      };
    });

    res.json(formatted);
  } catch (error) {
    console.error('getCourses error:', error);
    res.status(500).json({ error: 'Failed to retrieve courses.' });
  }
}

export async function getCourseDetails(req: Request, res: Response): Promise<void> {
  try {
    const idOrSlug = req.params.idOrSlug as string;

    const course = await prisma.course.findFirst({
      where: {
        OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      },
      include: {
        category: true,
        mentor: {
          select: {
            id: true,
            name: true,
            email: true,
            profile: { select: { bio: true, college: true } },
          },
        },
        modules: {
          orderBy: { orderIndex: 'asc' },
          include: {
            lessons: {
              orderBy: { orderIndex: 'asc' },
              select: {
                id: true,
                title: true,
                description: true,
                orderIndex: true,
                durationMinutes: true,
                isPreview: true,
                videoUrl: true,
                notesMarkdown: true,
                resources: {
                  select: {
                    id: true,
                    title: true,
                    fileName: true,
                    fileType: true,
                    fileSize: true,
                    isPublic: true,
                  },
                },
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
        _count: {
          select: { enrolments: true },
        },
      },
    });

    if (!course) {
      res.status(404).json({ error: 'Course not found.' });
      return;
    }

    let isEnrolled = false;
    let enrolmentStatus = null;

    if (req.user) {
      const enrolment = await prisma.enrolment.findUnique({
        where: {
          userId_courseId: {
            userId: req.user.id,
            courseId: course.id,
          },
        },
      });

      if (enrolment && enrolment.status === 'ACTIVE') {
        isEnrolled = true;
        enrolmentStatus = enrolment.status;
      }
    }

    const sanitizedModules = course.modules.map((m) => ({
      ...m,
      lessons: m.lessons.map((l) => {
        if (!isEnrolled && !course.isFree && !l.isPreview) {
          return {
            id: l.id,
            title: l.title,
            description: l.description,
            orderIndex: l.orderIndex,
            durationMinutes: l.durationMinutes,
            isPreview: false,
            videoUrl: null,
            notesMarkdown: null,
            resources: l.resources.filter((r) => r.isPublic),
          };
        }
        return l;
      }),
    }));

    res.json({
      ...course,
      modules: sanitizedModules,
      isEnrolled,
      enrolmentStatus,
      enrolledCount: course._count.enrolments,
    });
  } catch (error) {
    console.error('getCourseDetails error:', error);
    res.status(500).json({ error: 'Failed to retrieve course details.' });
  }
}

export async function getCategories(req: Request, res: Response): Promise<void> {
  try {
    const categories = await prisma.courseCategory.findMany({
      include: {
        _count: {
          select: {
            courses: {
              where: { status: 'PUBLISHED' },
            },
          },
        },
      },
    });

    res.json(
      categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        icon: cat.icon,
        courseCount: cat._count.courses,
      }))
    );
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve categories.' });
  }
}
