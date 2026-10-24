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

export const DEFAULT_PLATFORM_CATEGORIES = [
  {
    name: 'Class 1 to 5 (Primary Education)',
    slug: 'class-1-5-primary',
    description: 'Foundational numeracy, early science concepts, English reading, grammar, and environmental studies.',
    icon: 'BookOpen',
  },
  {
    name: 'Class 6 to 8 (Middle School)',
    slug: 'class-6-8-middle',
    description: 'Mathematics, General Science (Physics, Chemistry, Biology), Social Studies, English, and Early Coding.',
    icon: 'Book',
  },
  {
    name: 'Class 9 & 10 (Secondary Board Prep)',
    slug: 'class-9-10-boards',
    description: 'CBSE, ICSE, JAC, UP Board, BSEB & State Boards curriculum for Class 9 and 10 Mathematics, Science & Social Studies.',
    icon: 'GraduationCap',
  },
  {
    name: 'Class 11 & 12 (Science - PCM / PCB)',
    slug: 'class-11-12-science',
    description: 'Higher secondary Physics, Chemistry, Mathematics & Biology for CBSE, JAC, ICSE and State Boards.',
    icon: 'Atom',
  },
  {
    name: 'Class 11 & 12 (Commerce)',
    slug: 'class-11-12-commerce',
    description: 'Accountancy, Business Studies, Economics, Financial Markets and Applied Mathematics.',
    icon: 'TrendingUp',
  },
  {
    name: 'Class 11 & 12 (Arts & Humanities)',
    slug: 'class-11-12-arts',
    description: 'History, Political Science, Geography, Psychology, Sociology, and English Literature.',
    icon: 'Globe',
  },
  {
    name: 'Competitive Entrance (JEE, NEET & CUET)',
    slug: 'jee-neet-cuet',
    description: 'Rigorous test series, problem solving, mock exams and rank booster cohorts for JEE Main, JEE Advanced, NEET-UG & CUET.',
    icon: 'Award',
  },
  {
    name: 'Government Exams (UPSC, SSC, Banking, Railways)',
    slug: 'govt-exams-upsc-ssc',
    description: 'Preparation cohorts for UPSC CSE, State PSC, SSC CGL/CHSL, IBPS/SBI PO & Clerk, RRB, NDA, and CDS.',
    icon: 'Landmark',
  },
  {
    name: 'Undergraduate Tech (B.Tech / B.E / BCA)',
    slug: 'btech-engineering-bca',
    description: 'Core semester engineering courses in Computer Science, Mechanical, Civil, Electrical, Electronics & Information Technology.',
    icon: 'Cpu',
  },
  {
    name: 'Undergraduate Non-Tech (B.Sc / B.Com / B.A / BBA)',
    slug: 'bsc-bcom-ba-bba',
    description: 'University degree curricula in Physics, Chemistry, Pure Maths, Financial Accounting, Macroeconomics, Management & Arts.',
    icon: 'Layers',
  },
  {
    name: 'Postgraduate Programs (M.Tech / MCA / MBA / M.Sc / M.A)',
    slug: 'masters-mtech-mca-mba',
    description: 'Advanced postgraduate master’s specializations in Data Analytics, Systems Engineering, Management, and Pure Sciences.',
    icon: 'Library',
  },
  {
    name: 'Doctoral Studies & Research (PhD & Post-Doc)',
    slug: 'phd-doctoral-research',
    description: 'Research methodology, statistical hypothesis testing, academic publishing, peer review, and doctoral thesis formulation.',
    icon: 'Microscope',
  },
  {
    name: 'Full-Stack & Software Development',
    slug: 'full-stack-software-development',
    description: 'Industry-grade software engineering: React, Next.js, Node.js, Python, Go, Java, microservices, and system design.',
    icon: 'Code',
  },
  {
    name: 'AI, Machine Learning & Data Science',
    slug: 'ai-machine-learning-data-science',
    description: 'Deep learning, PyTorch, LLMs, computer vision, natural language processing, and big data engineering.',
    icon: 'Brain',
  },
  {
    name: 'Cloud Computing & DevOps Engineering',
    slug: 'cloud-devops-infrastructure',
    description: 'Docker, Kubernetes orchestration, AWS, Google Cloud, Terraform, CI/CD pipelines, and site reliability engineering.',
    icon: 'Cloud',
  },
  {
    name: 'Professional Skills, Finance & Languages',
    slug: 'professional-skills-finance',
    description: 'Communication mastery, public speaking, digital marketing, UI/UX design, financial modeling, and trading fundamentals.',
    icon: 'Sparkles',
  },
];

export async function getCategories(req: Request, res: Response): Promise<void> {
  try {
    const existingCount = await prisma.courseCategory.count();
    if (existingCount < 10) {
      for (const cat of DEFAULT_PLATFORM_CATEGORIES) {
        await prisma.courseCategory.upsert({
          where: { slug: cat.slug },
          update: { name: cat.name, description: cat.description, icon: cat.icon },
          create: { name: cat.name, slug: cat.slug, description: cat.description, icon: cat.icon },
        });
      }
    }

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
      orderBy: { createdAt: 'asc' },
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
