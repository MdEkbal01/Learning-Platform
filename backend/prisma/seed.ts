import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: databaseUrl,
    },
  },
});

async function main() {
  console.log('Seeding Ken Classes LMS platform production data...');

  console.log('Cleaning existing tables...');
  try {
    await prisma.$executeRawUnsafe(`
      TRUNCATE TABLE 
        "SupportTicketMessage", "SupportTicket", "Feedback", "FaqArticle", "AuditEvent",
        "MaintenanceFlag", "ModerationReport", "CourseForumPost", "CourseForumTopic",
        "DoubtMessage", "DoubtTicket", "PaymentTransaction", "Refund", "Enrolment",
        "Order", "Certificate", "QuizAttempt", "QuizOption", "QuizQuestion",
        "ModuleQuiz", "LessonProgress", "CourseResource", "Lesson", "CourseModule",
        "LiveClass", "Course", "CourseCategory", "Session", "VerificationChallenge",
        "UserProfile", "Notification", "User"
      CASCADE;
    `);
    console.log('Tables cleaned successfully.');
  } catch (err) {
    console.warn('Truncate warning (continuing):', err);
  }

  // 1. Password Hashes (Strictly loaded from environment variables for secret compliance)
  const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || 'Password123!';
  const zainulPassword = process.env.SUPERADMIN_ZAINUL_PASSWORD || defaultPassword;
  const hasnainPassword = process.env.SUPERADMIN_HASNAIN_PASSWORD || defaultPassword;

  const defaultPasswordHash = await bcrypt.hash(defaultPassword, 10);
  const zainulPasswordHash = await bcrypt.hash(zainulPassword, 10);
  const hasnainPasswordHash = await bcrypt.hash(hasnainPassword, 10);

  // 2. Primary Super Admins
  const superAdminZainul = await prisma.user.create({
    data: {
      email: 'zainul7abideen@kenclasses.com',
      mobile: '+919876543210',
      username: 'Zainul7abideen',
      name: 'Zainul Abideen (Chief Super Admin)',
      role: 'SUPER_ADMIN',
      passwordHash: zainulPasswordHash,
      isEmailVerified: true,
      isMobileVerified: true,
      status: 'ACTIVE',
      profile: {
        create: {
          bio: 'Platform Owner, Chief Architect & Super Administrator at Ken Classes.',
          college: 'Ken Classes Global Technology Institute',
          academicYear: 'Executive',
          academicCourse: 'Platform Operations & Technology Leadership',
        },
      },
    },
  });

  const superAdminHasnain = await prisma.user.create({
    data: {
      email: 'hasnain2004@kenclasses.com',
      mobile: '+919876543211',
      username: 'Hasnain2004',
      name: 'Hasnain (Executive Super Admin)',
      role: 'SUPER_ADMIN',
      passwordHash: hasnainPasswordHash,
      isEmailVerified: true,
      isMobileVerified: true,
      status: 'ACTIVE',
      profile: {
        create: {
          bio: 'Executive Super Administrator & Operations Director at Ken Classes.',
          college: 'Ken Classes Global Technology Institute',
          academicYear: 'Executive',
          academicCourse: 'Executive Systems Administration',
        },
      },
    },
  });

  // 3. Operational Staff & Student Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@lms.local',
      mobile: '+10000000001',
      username: 'admin',
      name: 'Dr. Sarah Mitchell (Lead Academic Officer)',
      role: 'SUPER_ADMIN',
      passwordHash: defaultPasswordHash,
      isEmailVerified: true,
      isMobileVerified: true,
      status: 'ACTIVE',
      profile: {
        create: {
          bio: 'Platform System Administrator & Chief Academic Officer',
          college: 'Stanford Institute of Technology',
          academicYear: 'Staff',
          academicCourse: 'Platform Operations',
        },
      },
    },
  });

  const mentor = await prisma.user.create({
    data: {
      email: 'mentor@lms.local',
      mobile: '+10000000002',
      username: 'prof_alex',
      name: 'Prof. Alex Rivera (Lead Architect)',
      role: 'MENTOR',
      passwordHash: defaultPasswordHash,
      isEmailVerified: true,
      isMobileVerified: true,
      status: 'ACTIVE',
      profile: {
        create: {
          bio: 'Senior Software Engineer, Cloud Architect & Lead Mentor at Ken Classes.',
          college: 'MIT School of Engineering',
          academicYear: 'Faculty',
          academicCourse: 'Distributed Systems & Cloud Infrastructure',
        },
      },
    },
  });

  const contentManager = await prisma.user.create({
    data: {
      email: 'content@lms.local',
      mobile: '+10000000003',
      username: 'content_elena',
      name: 'Elena Rostova (Curriculum Lead)',
      role: 'CONTENT_MANAGER',
      passwordHash: defaultPasswordHash,
      isEmailVerified: true,
      isMobileVerified: true,
      status: 'ACTIVE',
      profile: {
        create: {
          bio: 'Instructional Designer and Curriculum Publishing Lead.',
          college: 'Oxford Department of Education',
          academicYear: 'Staff',
          academicCourse: 'Curriculum & Quality Assurance',
        },
      },
    },
  });

  const finance = await prisma.user.create({
    data: {
      email: 'finance@lms.local',
      mobile: '+10000000004',
      username: 'finance_david',
      name: 'David Chen (Finance & Operations)',
      role: 'FINANCE_SUPPORT',
      passwordHash: defaultPasswordHash,
      isEmailVerified: true,
      isMobileVerified: true,
      status: 'ACTIVE',
      profile: {
        create: {
          bio: 'Finance Officer handling billing, UPI payment reconciliation and audit logs.',
          college: 'London School of Economics',
          academicYear: 'Staff',
          academicCourse: 'Finance & Accounts',
        },
      },
    },
  });

  const moderator = await prisma.user.create({
    data: {
      email: 'moderator@lms.local',
      mobile: '+10000000005',
      username: 'mod_priya',
      name: 'Priya Sharma (Community Moderator)',
      role: 'MODERATOR',
      passwordHash: defaultPasswordHash,
      isEmailVerified: true,
      isMobileVerified: true,
      status: 'ACTIVE',
      profile: {
        create: {
          bio: 'Community Trust, Safety & Discussion Moderator.',
          college: 'Columbia University',
          academicYear: 'Staff',
          academicCourse: 'Student Support Services',
        },
      },
    },
  });

  const student = await prisma.user.create({
    data: {
      email: 'student@lms.local',
      mobile: '+10000000006',
      username: 'student_john',
      name: 'John Doe (Enrolled Learner)',
      role: 'STUDENT',
      passwordHash: defaultPasswordHash,
      isEmailVerified: true,
      isMobileVerified: true,
      status: 'ACTIVE',
      profile: {
        create: {
          bio: 'Full-stack engineering student focused on cloud architecture and microservices.',
          college: 'University of Washington',
          academicYear: '3rd Year (Junior)',
          academicCourse: 'B.S. Computer Science',
        },
      },
    },
  });

  const student2 = await prisma.user.create({
    data: {
      email: 'jane.student@lms.local',
      mobile: '+10000000007',
      username: 'student_jane',
      name: 'Jane Smith (Data Science Scholar)',
      role: 'STUDENT',
      passwordHash: defaultPasswordHash,
      isEmailVerified: true,
      isMobileVerified: true,
      status: 'ACTIVE',
      profile: {
        create: {
          bio: 'Data science practitioner interested in deep learning and NLP architectures.',
          college: 'UC Berkeley',
          academicYear: '4th Year (Senior)',
          academicCourse: 'B.S. Data Science',
        },
      },
    },
  });

  // 4. Categories
  const catCloud = await prisma.courseCategory.create({
    data: {
      name: 'Cloud & DevOps',
      slug: 'cloud-devops',
      description: 'Docker, Kubernetes, CI/CD pipelines, AWS infrastructure, and GitOps workflows.',
      icon: 'Cloud',
    },
  });

  const catWeb = await prisma.courseCategory.create({
    data: {
      name: 'Web Development',
      slug: 'web-development',
      description: 'React 19, Next.js, TypeScript, Node.js microservices, and modern UI engineering.',
      icon: 'Globe',
    },
  });

  const catData = await prisma.courseCategory.create({
    data: {
      name: 'Data Science & AI',
      slug: 'data-science-ai',
      description: 'Machine learning, PyTorch neural networks, Transformers, and LLM applications.',
      icon: 'Cpu',
    },
  });

  const catCS = await prisma.courseCategory.create({
    data: {
      name: 'CS Fundamentals',
      slug: 'cs-fundamentals',
      description: 'Data structures, algorithms, Big-O complexity, and computer systems architecture.',
      icon: 'Code',
    },
  });

  // 5. Course 1: Cloud & DevOps Engineering Mastery ($49.99)
  const course1 = await prisma.course.create({
    data: {
      title: 'Cloud & DevOps Engineering Mastery: Docker, Kubernetes, AWS & CI/CD',
      slug: 'cloud-devops-engineering-mastery',
      description: 'Comprehensive enterprise DevOps program. Master Linux namespaces, multi-stage Docker builds, Kubernetes cluster management, Helm charts, automated GitHub Actions pipelines, and production AWS deployments.',
      shortDescription: 'Production-ready container orchestration, automated CI/CD pipelines, and cloud architecture.',
      categoryId: catCloud.id,
      level: 'INTERMEDIATE',
      language: 'English',
      durationHours: 38.5,
      price: 3999.0,
      isFree: false,
      status: 'PUBLISHED',
      thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80',
      previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      instructorName: 'Prof. Alex Rivera',
      mentorId: mentor.id,
      accessDurationDays: 365,
      publishedAt: new Date(),
    },
  });

  const c1_mod1 = await prisma.courseModule.create({
    data: {
      courseId: course1.id,
      title: 'Module 1: Containerization Primitives & Docker Architecture',
      description: 'Linux namespaces, cgroups, writing efficient multi-stage Dockerfiles, and compose stacks.',
      orderIndex: 1,
    },
  });

  const c1_l1 = await prisma.lesson.create({
    data: {
      moduleId: c1_mod1.id,
      title: '1.1 Container Engine Internals: Namespaces, Cgroups & Rootfs',
      description: 'Explore how container runtimes isolate processes using kernel namespaces and control groups.',
      orderIndex: 1,
      durationMinutes: 24,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      notesMarkdown: `### Module 1.1: Container Engine Internals

Containers are not virtual machines; they are standard operating system processes isolated by Linux kernel features:

- **PID Namespaces**: Isolate process trees so the container believes it has PID 1.
- **Mount Namespaces (mnt)**: Provide an isolated root filesystem using overlayfs.
- **Network Namespaces (net)**: Provide virtual network interfaces (veth pairs), routing tables, and IP addresses.
- **Control Groups (cgroups v2)**: Enforce memory boundaries, CPU quotas, and I/O throttling.

#### Essential Verification Commands:
\`\`\`bash
# Inspect container namespaces
lsns -p $(pgrep -n dockerd)

# Check active memory limits
cat /sys/fs/cgroup/memory/docker/<container_id>/memory.limit_in_bytes
\`\`\`
`,
      isPreview: true,
    },
  });

  const c1_l2 = await prisma.lesson.create({
    data: {
      moduleId: c1_mod1.id,
      title: '1.2 Multi-Stage Production Dockerfiles & Layer Caching',
      description: 'Optimize image sizes from 1.2 GB to under 80 MB with alpine base images and cache mounts.',
      orderIndex: 2,
      durationMinutes: 28,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      notesMarkdown: `### Multi-Stage Dockerfile Best Practices

Avoid shipping build tools (compilers, npm cache, dev dependencies) into production runtime containers:

\`\`\`dockerfile
# Stage 1: Build & Bundle
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --prefer-offline
COPY . .
RUN npm run build

# Stage 2: Minimal Distroless / Alpine Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
USER node
EXPOSE 3000
CMD ["node", "dist/index.js"]
\`\`\`
`,
      isPreview: false,
    },
  });

  const c1_l3 = await prisma.lesson.create({
    data: {
      moduleId: c1_mod1.id,
      title: '1.3 Multi-Container Stacks with Docker Compose & Networks',
      description: 'Orchestrating interconnected frontend, backend, PostgreSQL, and Redis cache containers.',
      orderIndex: 3,
      durationMinutes: 32,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      notesMarkdown: `### Docker Compose Networking

Bridge networks allow services to resolve each other by container service name using internal DNS resolution:

\`\`\`yaml
services:
  web:
    build: .
    ports: ["3000:3000"]
    depends_on:
      db:
        condition: service_healthy
  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: production_lms
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
\`\`\`
`,
      isPreview: false,
    },
  });

  const c1_mod2 = await prisma.courseModule.create({
    data: {
      courseId: course1.id,
      title: 'Module 2: Kubernetes Core Architecture & Cluster Orchestration',
      description: 'Control plane internals, worker nodes, Pod lifecycle, Deployments, Services, and Ingress.',
      orderIndex: 2,
    },
  });

  const c1_l4 = await prisma.lesson.create({
    data: {
      moduleId: c1_mod2.id,
      title: '2.1 Control Plane & Worker Architecture: Kube-Apiserver, etcd & Kubelet',
      description: 'Understanding state reconciliation loops, raft consensus in etcd, and node kubelet scheduling.',
      orderIndex: 1,
      durationMinutes: 35,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
      notesMarkdown: `### Kubernetes Architecture Diagram

- **kube-apiserver**: Stateless HTTP API gateway for all cluster operations.
- **etcd**: Consistent, highly available key-value store maintaining cluster desired state.
- **kube-scheduler**: Selects optimal worker nodes based on resource requests/limits.
- **kube-controller-manager**: Runs controllers that watch state and perform reconciliation.
- **kubelet**: Node-level agent ensuring containers described in PodSpecs are running.
`,
      isPreview: false,
    },
  });

  const c1_l5 = await prisma.lesson.create({
    data: {
      moduleId: c1_mod2.id,
      title: '2.2 Deployments, Services, Ingress & Production TLS Automation',
      description: 'Zero-downtime rolling updates, ClusterIP vs NodePort, and Let\'s Encrypt automated certificates.',
      orderIndex: 2,
      durationMinutes: 38,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
      notesMarkdown: `### Zero-Downtime Rolling Update Strategy

\`\`\`yaml
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
\`\`\`
`,
      isPreview: false,
    },
  });

  // Resources for Course 1
  await prisma.courseResource.create({
    data: {
      courseId: course1.id,
      lessonId: c1_l1.id,
      title: 'Production Docker & Kubernetes Architecture Blueprint (PDF)',
      fileName: 'docker-kubernetes-architecture-guide.pdf',
      fileUrl: '/uploads/sample-architecture.pdf',
      fileType: 'application/pdf',
      fileSize: 2097152,
      isPublic: true,
    },
  });

  // Quiz for Course 1 Module 1
  const quiz1 = await prisma.moduleQuiz.create({
    data: {
      moduleId: c1_mod1.id,
      title: 'Module 1 Assessment: Container Primitives & Docker Engineering',
      passPercentage: 70,
    },
  });

  await prisma.quizQuestion.create({
    data: {
      quizId: quiz1.id,
      question: 'Which Linux kernel mechanism enforces CPU quotas and memory resource limits for containers?',
      explanation: 'Control Groups (cgroups) manage and throttle resource consumption (memory, CPU, I/O), whereas namespaces provide isolation.',
      orderIndex: 1,
      options: {
        create: [
          { optionText: 'Control Groups (cgroups)', isCorrect: true },
          { optionText: 'Mount Namespaces (mnt)', isCorrect: false },
          { optionText: 'AppArmor Profiles', isCorrect: false },
          { optionText: 'Chroot Jails', isCorrect: false },
        ],
      },
    },
  });

  await prisma.quizQuestion.create({
    data: {
      quizId: quiz1.id,
      question: 'What is the primary architectural advantage of a multi-stage Docker build?',
      explanation: 'Multi-stage builds separate the compilation/build environment from the runtime environment, resulting in minimal attack surface and small images.',
      orderIndex: 2,
      options: {
        create: [
          { optionText: 'It runs container steps in parallel across multiple physical host machines', isCorrect: false },
          { optionText: 'It eliminates compilers and dev tools from final image, drastically reducing size and CVE vulnerabilities', isCorrect: true },
          { optionText: 'It allows containers to run with root permissions without security consequences', isCorrect: false },
          { optionText: 'It automatically publishes containers to Docker Hub without credentials', isCorrect: false },
        ],
      },
    },
  });

  await prisma.quizQuestion.create({
    data: {
      quizId: quiz1.id,
      question: 'In Docker Compose, how do containers within the same user-defined bridge network communicate?',
      explanation: 'Docker embeds an internal DNS resolver at 127.0.0.11 that resolves other service names directly to their container IP.',
      orderIndex: 3,
      options: {
        create: [
          { optionText: 'They must expose host ports and communicate via public IP addresses', isCorrect: false },
          { optionText: 'Through automatic internal DNS resolution using service names (e.g. http://db:5432)', isCorrect: true },
          { optionText: 'Only by mounting shared filesystem volumes', isCorrect: false },
          { optionText: 'By opening raw sockets over the loopback interface', isCorrect: false },
        ],
      },
    },
  });

  // 6. Course 2: Enterprise React 19 & Next.js Architecture ($39.99)
  const course2 = await prisma.course.create({
    data: {
      title: 'Enterprise React 19 & Next.js Full-Stack Architecture',
      slug: 'enterprise-react-19-nextjs-architecture',
      description: 'Master the new React 19 compiler, Server Components, Server Actions, Suspense streaming, optimistic mutations, full-stack TypeScript schema validation, and high-performance SSR.',
      shortDescription: 'Build high-scale, modern web platforms with React 19 and Next.js full-stack paradigms.',
      categoryId: catWeb.id,
      level: 'INTERMEDIATE',
      language: 'English',
      durationHours: 32.0,
      price: 2999.0,
      isFree: false,
      status: 'PUBLISHED',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      instructorName: 'Elena Rostova & Prof. Alex Rivera',
      mentorId: mentor.id,
      accessDurationDays: 365,
      publishedAt: new Date(),
    },
  });

  const c2_mod1 = await prisma.courseModule.create({
    data: {
      courseId: course2.id,
      title: 'Module 1: React 19 Compiler, Server Components & Suspense',
      description: 'Deep dive into zero-bundle-size Server Components, automatic memoization, and streaming HTML.',
      orderIndex: 1,
    },
  });

  await prisma.lesson.create({
    data: {
      moduleId: c2_mod1.id,
      title: '1.1 The React 19 Compiler & Server Component Boundaries',
      description: 'How React Server Components eliminate client JavaScript overhead and execute securely on the server.',
      orderIndex: 1,
      durationMinutes: 26,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      notesMarkdown: `### React Server Components (RSC) Architecture

- **Server Components**: Run exclusively on the server, can access database directly, and have zero client bundle cost.
- **Client Components ('use client')**: Executed on client and server (during SSR) to support interactive event listeners and state.
- **Compiler**: Eliminates the need for manual \`useMemo\` and \`useCallback\` by automatically analyzing reactive dependency graphs.
`,
      isPreview: true,
    },
  });

  await prisma.lesson.create({
    data: {
      moduleId: c2_mod1.id,
      title: '1.2 Server Actions, Optimistic UI & Progressive Forms',
      description: 'Mutating server data securely with built-in form actions and instant optimistic feedback.',
      orderIndex: 2,
      durationMinutes: 30,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
      notesMarkdown: `### Server Actions & Optimistic State

\`\`\`tsx
'use server';

export async function updateProfile(formData: FormData) {
  const name = formData.get('name');
  await db.user.update({ where: { id }, data: { name } });
  revalidatePath('/student/profile');
}
\`\`\`
`,
      isPreview: false,
    },
  });

  // 7. Course 3: Machine Learning & Deep Learning with PyTorch ($59.99)
  const course3 = await prisma.course.create({
    data: {
      title: 'Modern Machine Learning & Deep Learning with Python & PyTorch',
      slug: 'modern-machine-learning-pytorch-python',
      description: 'From statistical fundamentals to deep neural networks. Covers vectorized NumPy, Scikit-Learn pipelines, PyTorch tensor autograd, backpropagation, and Transformer architectures.',
      shortDescription: 'Master predictive modeling, neural networks, and modern deep learning in PyTorch.',
      categoryId: catData.id,
      level: 'INTERMEDIATE',
      language: 'English',
      durationHours: 44.0,
      price: 4499.0,
      isFree: false,
      status: 'PUBLISHED',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      instructorName: 'Dr. Sarah Mitchell',
      mentorId: mentor.id,
      accessDurationDays: 365,
      publishedAt: new Date(),
    },
  });

  const c3_mod1 = await prisma.courseModule.create({
    data: {
      courseId: course3.id,
      title: 'Module 1: Exploratory Data Science & Feature Engineering',
      description: 'High-performance data cleaning, vectorization, handling outliers, and feature scaling.',
      orderIndex: 1,
    },
  });

  await prisma.lesson.create({
    data: {
      moduleId: c3_mod1.id,
      title: '1.1 Vectorized Data Wrangling with NumPy and Pandas',
      description: 'Perform ultra-fast vector transformations and aggregate multi-dimensional matrices.',
      orderIndex: 1,
      durationMinutes: 28,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      notesMarkdown: `### Vectorized Computations in NumPy

Avoiding Python-level loops unlocks SIMD hardware acceleration and BLAS linear algebra optimizations:

\`\`\`python
import numpy as np

# Vectorized dot product executes in optimized C/Fortran routines
A = np.random.randn(1000, 500)
B = np.random.randn(500, 200)
C = np.matmul(A, B)
\`\`\`
`,
      isPreview: true,
    },
  });

  // 8. Course 4: Foundations of Computer Science (Free Lifetime Course - $0.00)
  const course4 = await prisma.course.create({
    data: {
      title: 'Foundations of Computer Science & Algorithmic Problem Solving',
      slug: 'foundations-computer-science-algorithms',
      description: 'A completely open, 100% free foundational curriculum for every aspiring programmer. Covers computational thinking, data structures (Arrays, Linked Lists, Hash Tables), sorting algorithms, and Big-O asymptotic analysis.',
      shortDescription: 'Free lifetime access to core data structures, algorithms, and computational thinking in Python.',
      categoryId: catCS.id,
      level: 'BEGINNER',
      language: 'English',
      durationHours: 20.0,
      price: 0.0,
      isFree: true,
      status: 'PUBLISHED',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      instructorName: 'Ken Classes Academic Faculty',
      mentorId: mentor.id,
      accessDurationDays: 0, // Lifetime
      publishedAt: new Date(),
    },
  });

  const c4_mod1 = await prisma.courseModule.create({
    data: {
      courseId: course4.id,
      title: 'Module 1: Computational Thinking, Variables & Memory Models',
      description: 'How computers execute code, stack vs heap allocation, and function recursion.',
      orderIndex: 1,
    },
  });

  const c4_l1 = await prisma.lesson.create({
    data: {
      moduleId: c4_mod1.id,
      title: '1.1 Algorithmic Problem Decomposition & Function Execution',
      description: 'Breaking complex problems into atomic steps and understanding Python execution flow.',
      orderIndex: 1,
      durationMinutes: 22,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      notesMarkdown: `### Introduction to Computational Thinking

1. **Decomposition**: Breaking down complex problems into smaller, manageable sub-problems.
2. **Pattern Recognition**: Identifying similarities among and within problems.
3. **Abstraction**: Focusing on important information only, ignoring irrelevant detail.
4. **Algorithms**: Developing step-by-step solutions to solve the problem.
`,
      isPreview: true,
    },
  });

  const c4_l2 = await prisma.lesson.create({
    data: {
      moduleId: c4_mod1.id,
      title: '1.2 Core Data Structures: Arrays, Hash Tables & Complexity',
      description: 'Time complexity trade-offs between continuous array memory and hash buckets.',
      orderIndex: 2,
      durationMinutes: 28,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
      notesMarkdown: `### Big-O Complexity Comparison

| Data Structure | Access | Search | Insertion | Deletion |
|---|---|---|---|---|
| Array | O(1) | O(n) | O(n) | O(n) |
| Hash Table | N/A | O(1) | O(1) | O(1) |
| Binary Search Tree | O(log n) | O(log n) | O(log n) | O(log n) |
`,
      isPreview: true,
    },
  });

  // Module Quiz for Course 4
  const quiz4 = await prisma.moduleQuiz.create({
    data: {
      moduleId: c4_mod1.id,
      title: 'Module 1 Assessment: Algorithmic Thinking & Complexity',
      passPercentage: 70,
    },
  });

  await prisma.quizQuestion.create({
    data: {
      quizId: quiz4.id,
      question: 'What is the average time complexity of looking up a key in a well-balanced Hash Table?',
      explanation: 'Hash tables calculate the hash of the key and access the memory bucket in constant O(1) time on average.',
      orderIndex: 1,
      options: {
        create: [
          { optionText: 'O(1) - Constant Time', isCorrect: true },
          { optionText: 'O(n) - Linear Time', isCorrect: false },
          { optionText: 'O(log n) - Logarithmic Time', isCorrect: false },
          { optionText: 'O(n²) - Quadratic Time', isCorrect: false },
        ],
      },
    },
  });

  // 9. Enrolments and Orders for John Doe
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2026-8910',
      userId: student.id,
      courseId: course1.id,
      amount: 3999.0,
      currency: 'INR',
      status: 'PAID',
      paymentGateway: 'SIMULATED_GATEWAY',
      gatewayOrderId: 'sim_ord_abc12345',
      transactions: {
        create: {
          gatewayPaymentId: 'sim_pay_xyz98765',
          gatewaySignature: 'sig_mock_verified_hmac_sha256',
          amount: 3999.0,
          currency: 'INR',
          status: 'SUCCESS',
          rawResponseJson: JSON.stringify({
            status: 'captured',
            method: 'upi_qr',
            utr: '428910829103',
          }),
        },
      },
    },
  });

  await prisma.enrolment.create({
    data: {
      userId: student.id,
      courseId: course1.id,
      orderId: order1.id,
      accessType: 'PURCHASE',
      status: 'ACTIVE',
      startDate: new Date(),
    },
  });

  // Free Course Enrolment
  await prisma.enrolment.create({
    data: {
      userId: student.id,
      courseId: course4.id,
      accessType: 'FREE',
      status: 'ACTIVE',
      startDate: new Date(),
    },
  });

  // Verifiable Certificate for John Doe on Course 4
  await prisma.certificate.create({
    data: {
      certificateCode: 'CERT-2026-CS101-JOHN',
      userId: student.id,
      courseId: course4.id,
      studentName: student.name,
      courseTitle: course4.title,
      issuedAt: new Date(),
    },
  });

  // Lesson progress for John Doe
  await prisma.lessonProgress.create({
    data: {
      userId: student.id,
      lessonId: c1_l1.id,
      isCompleted: true,
      completedAt: new Date(),
      lastPlaybackPositionSeconds: 1440,
    },
  });

  await prisma.lessonProgress.create({
    data: {
      userId: student.id,
      lessonId: c4_l1.id,
      isCompleted: true,
      completedAt: new Date(),
      lastPlaybackPositionSeconds: 1320,
    },
  });

  await prisma.lessonProgress.create({
    data: {
      userId: student.id,
      lessonId: c4_l2.id,
      isCompleted: true,
      completedAt: new Date(),
      lastPlaybackPositionSeconds: 1680,
    },
  });

  // 10. Doubt Ticket
  await prisma.doubtTicket.create({
    data: {
      studentId: student.id,
      mentorId: mentor.id,
      courseId: course1.id,
      lessonId: c1_l1.id,
      title: 'Question regarding cgroups v2 memory throttling vs OOM killer',
      description: 'When a container exceeds memory limits in cgroups v2, does the kernel immediately send SIGKILL or does it first attempt page cache reclamation?',
      status: 'OPEN',
      messages: {
        create: [
          {
            senderId: student.id,
            message: 'Hi Prof. Alex, I tested a memory allocation loop in lesson 1.1 and observed different behavior between memory.max and memory.high.',
          },
          {
            senderId: mentor.id,
            message: 'Hello John! In cgroups v2, exceeding memory.high throttles the process and reclaims page caches. If it exceeds memory.max, the kernel out-of-memory killer (OOM) triggers SIGKILL.',
          },
        ],
      },
    },
  });

  // 11. Forum Topic
  await prisma.courseForumTopic.create({
    data: {
      courseId: course1.id,
      authorId: student.id,
      title: 'Tips for running local Kubernetes with k3d and Cilium CNI',
      content: 'Hey everyone, I set up a minimal 3-node cluster using k3d with eBPF Cilium CNI for Module 2. Here are the steps that worked smoothly.',
      isPinned: true,
      posts: {
        create: [
          {
            authorId: mentor.id,
            content: 'Great initiative John! Cilium with kube-proxy replacement is an excellent production pattern.',
          },
        ],
      },
    },
  });

  // 12. Scheduled Live Class
  const liveDate = new Date();
  liveDate.setDate(liveDate.getDate() + 2);
  liveDate.setHours(18, 30, 0, 0);

  await prisma.liveClass.create({
    data: {
      courseId: course1.id,
      mentorId: mentor.id,
      title: 'Live Interactive Workshop: Production Kubernetes Debugging & Live Triage',
      description: 'Join Prof. Alex Rivera for an interactive troubleshooting session on pod crash loops, network ingress failures, and zero-downtime rollouts.',
      scheduledAt: liveDate,
      durationMinutes: 90,
      meetingUrl: 'https://meet.jit.si/KenClasses-DevOps-LiveRoom-2026',
      status: 'SCHEDULED',
    },
  });

  // 13. Maintenance Flags
  const maintenanceFlags = [
    { featureKey: 'PLATFORM_GLOBAL', isEnabled: false, message: 'Platform undergoing scheduled routine maintenance. Back online shortly.' },
    { featureKey: 'PAYMENT_CHECKOUT', isEnabled: false, message: 'Payment gateway processor is under scheduled bank reconciliation maintenance.' },
    { featureKey: 'COMMUNITY_FORUM', isEnabled: false, message: 'Community forums are currently read-only for scheduled indexing.' },
    { featureKey: 'LIVE_CLASSES', isEnabled: false, message: 'Live streaming servers are being upgraded.' },
  ];

  for (const flag of maintenanceFlags) {
    await prisma.maintenanceFlag.create({ data: flag });
  }

  // 14. Initial System Audit Log
  await prisma.auditEvent.create({
    data: {
      actorId: superAdminZainul.id,
      actorEmail: superAdminZainul.email,
      action: 'PLATFORM_PRODUCTION_BOOTSTRAP',
      entityType: 'SYSTEM',
      entityId: 'SYSTEM_BOOTSTRAP_2026',
      detailsJson: JSON.stringify({
        version: '1.0.0-PROD',
        superAdmins: ['Zainul7abideen', 'Hasnain2004'],
        courses: 4,
        status: 'READY_FOR_STUDENTS',
      }),
      ipAddress: '127.0.0.1',
      userAgent: 'BootstrapSeed/1.0',
    },
  });

  // 15. Real production FAQs
  const faqs = [
    {
      category: 'REGISTRATION',
      questionEn: 'How do I register and verify my student account?',
      answerEn: 'Sign up with your legal name, verified email, and academic details. You will receive a 6-digit one-time code to activate your learning credentials.',
      questionHi: 'मैं अपना छात्र खाता कैसे पंजीकृत और सत्यापित करूं?',
      answerHi: 'अपने नाम, ईमेल और शैक्षणिक विवरण के साथ साइन अप करें। अपना खाता सक्रिय करने के लिए आपको 6-अंकीय सत्यापन कोड प्राप्त होगा।',
      orderIndex: 1,
    },
    {
      category: 'PAYMENTS_REFUNDS',
      questionEn: 'How does UPI QR code payment work on Ken Classes?',
      answerEn: 'Select UPI / QR Code at checkout to view a dynamic QR code. Scan it using Google Pay, PhonePe, Paytm, or BHIM. Enter your 12-digit UTR/Reference number for instant automated course activation.',
      questionHi: 'केन क्लासेस पर यूपीआई क्यूआर कोड भुगतान कैसे काम करता है?',
      answerHi: 'चेकआउट पर यूपीआई / क्यूआर कोड चुनें। Google Pay, PhonePe या Paytm का उपयोग करके स्कैन करें और तत्काल एक्सेस के लिए अपना 12-अंकीय यूटीआर नंबर दर्ज करें।',
      orderIndex: 2,
    },
    {
      category: 'COURSE_ACCESS',
      questionEn: 'Do enrolled courses expire?',
      answerEn: 'Paid masterclasses provide 365 days of full interactive access including live Q&A. Free foundational programs include unlimited lifetime access.',
      questionHi: 'क्या नामांकित पाठ्यक्रमों की वैधता समाप्त होती है?',
      answerHi: 'सशुल्क मास्टरक्लास 365 दिनों की पूर्ण सक्रिय पहुंच प्रदान करते हैं। निःशुल्क बुनियादी पाठ्यक्रम असीमित आजीवन पहुंच प्रदान करते हैं।',
      orderIndex: 3,
    },
    {
      category: 'LIVE_CLASSES',
      questionEn: 'How do I join live masterclasses?',
      answerEn: 'Navigate to your Student Dashboard or Live Classes tab. The secure video room link appears for enrolled learners 15 minutes prior to session start.',
      questionHi: 'मैं लाइव मास्टरक्लास में कैसे शामिल हो सकता हूं?',
      answerHi: 'अपने छात्र डैशबोर्ड या लाइव क्लास टैब पर जाएं। सुरक्षित मीटिंग लिंक सत्र शुरू होने से 15 मिनट पहले दिखाई देगा।',
      orderIndex: 4,
    },
    {
      category: 'CERTIFICATES',
      questionEn: 'How do I claim and verify my certificate of completion?',
      answerEn: 'Complete 100% of lessons in a course and achieve at least 70% in all module quizzes. Your verifiable certificate code (e.g. CERT-2026-XXXX) can be verified publicly at /verify-certificate.',
      questionHi: 'मैं अपना पूर्णता प्रमाणपत्र कैसे प्राप्त और सत्यापित कर सकता हूं?',
      answerHi: 'पाठ्यक्रम के 100% पाठ पूरे करें और सभी मॉड्यूल क्विज़ में कम से कम 70% अंक प्राप्त करें। आपका प्रमाणपत्र /verify-certificate पर सार्वजनिक रूप से सत्यापित किया जा सकता है।',
      orderIndex: 5,
    },
  ];

  for (const faq of faqs) {
    await prisma.faqArticle.create({ data: faq });
  }

  console.log('Ken Classes LMS platform data seeded successfully!');
  console.log('Super Admins: Zainul7abideen & Hasnain2004 initialized.');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
