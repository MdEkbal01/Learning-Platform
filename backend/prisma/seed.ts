import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding LMS platform data...');

  // Clean existing tables in correct order if any
  await prisma.supportTicketMessage.deleteMany();
  await prisma.supportTicket.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.faqArticle.deleteMany();
  await prisma.auditEvent.deleteMany();
  await prisma.maintenanceFlag.deleteMany();
  await prisma.moderationReport.deleteMany();
  await prisma.courseForumPost.deleteMany();
  await prisma.courseForumTopic.deleteMany();
  await prisma.doubtMessage.deleteMany();
  await prisma.doubtTicket.deleteMany();
  await prisma.paymentTransaction.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.enrolment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.quizOption.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.moduleQuiz.deleteMany();
  await prisma.lessonProgress.deleteMany();
  await prisma.courseResource.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.courseModule.deleteMany();
  await prisma.liveClass.deleteMany();
  await prisma.course.deleteMany();
  await prisma.courseCategory.deleteMany();
  await prisma.session.deleteMany();
  await prisma.verificationChallenge.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('Password123!', 10);

  // 1. Create Core Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@lms.local',
      mobile: '+10000000001',
      username: 'admin',
      name: 'Dr. Sarah Mitchell (Super Admin)',
      role: 'SUPER_ADMIN',
      passwordHash,
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
      name: 'Prof. Alex Rivera (Lead Mentor)',
      role: 'MENTOR',
      passwordHash,
      isEmailVerified: true,
      isMobileVerified: true,
      status: 'ACTIVE',
      profile: {
        create: {
          bio: 'Senior Software Engineer & Lead Instructor in Full-Stack Technologies',
          college: 'MIT School of Engineering',
          academicYear: 'Faculty',
          academicCourse: 'Computer Science Department',
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
      passwordHash,
      isEmailVerified: true,
      isMobileVerified: true,
      status: 'ACTIVE',
      profile: {
        create: {
          bio: 'Instructional Designer and Curriculum Publishing Manager',
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
      passwordHash,
      isEmailVerified: true,
      isMobileVerified: true,
      status: 'ACTIVE',
      profile: {
        create: {
          bio: 'Finance Officer handling billing, payment reconciliation and refund approvals',
          college: 'London School of Economics',
          academicYear: 'Staff',
          academicCourse: 'Finance & Student Accounts',
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
      passwordHash,
      isEmailVerified: true,
      isMobileVerified: true,
      status: 'ACTIVE',
      profile: {
        create: {
          bio: 'Community Trust, Safety & Discussion Moderator',
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
      name: 'John Doe (Enrolled Student)',
      role: 'STUDENT',
      passwordHash,
      isEmailVerified: true,
      isMobileVerified: true,
      status: 'ACTIVE',
      profile: {
        create: {
          bio: 'Junior Software Engineer eager to master modern web architecture',
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
      name: 'Jane Smith (Student Learner)',
      role: 'STUDENT',
      passwordHash,
      isEmailVerified: true,
      isMobileVerified: true,
      status: 'ACTIVE',
      profile: {
        create: {
          bio: 'Data enthusiast and aspiring machine learning practitioner',
          college: 'UC Berkeley',
          academicYear: '4th Year (Senior)',
          academicCourse: 'B.S. Data Science',
        },
      },
    },
  });

  // 2. Categories
  const catWeb = await prisma.courseCategory.create({
    data: {
      name: 'Web Development',
      slug: 'web-development',
      description: 'Front-end, Back-end, APIs, databases and modern web architectures.',
      icon: 'Globe',
    },
  });

  const catData = await prisma.courseCategory.create({
    data: {
      name: 'Data Science & AI',
      slug: 'data-science-ai',
      description: 'Machine learning, statistical analysis, Python data stack and deep neural models.',
      icon: 'Cpu',
    },
  });

  const catCloud = await prisma.courseCategory.create({
    data: {
      name: 'Cloud & DevOps',
      slug: 'cloud-devops',
      description: 'Docker, Kubernetes, CI/CD pipelines, AWS and production infrastructure.',
      icon: 'Cloud',
    },
  });

  const catCS = await prisma.courseCategory.create({
    data: {
      name: 'CS Fundamentals',
      slug: 'cs-fundamentals',
      description: 'Data structures, algorithms, system design and programming fundamentals.',
      icon: 'Code',
    },
  });

  // 3. Courses
  // Course 1: Full-Stack Web Development (Paid - $49.99)
  const course1 = await prisma.course.create({
    data: {
      title: 'Full-Stack Web Development Mastery (React, Node.js & TypeScript)',
      slug: 'full-stack-web-development-mastery',
      description: 'Master complete full-stack web development from scratch. Build end-to-end web apps with TypeScript, React 19, Express, Prisma ORM, JWT security, and automated cloud deployments.',
      shortDescription: 'From frontend to backend: build production-grade web platforms with React and Node.js.',
      categoryId: catWeb.id,
      level: 'INTERMEDIATE',
      language: 'English',
      durationHours: 36.5,
      price: 49.99,
      isFree: false,
      status: 'PUBLISHED',
      thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      instructorName: 'Prof. Alex Rivera',
      mentorId: mentor.id,
      accessDurationDays: 365,
      publishedAt: new Date(),
    },
  });

  // Course 1 Modules and Lessons
  const mod1 = await prisma.courseModule.create({
    data: {
      courseId: course1.id,
      title: 'Module 1: Modern Full-Stack Architecture & TypeScript Essentials',
      description: 'Understanding multi-tier architectures, client-server models, and type safety.',
      orderIndex: 1,
    },
  });

  const lesson1_1 = await prisma.lesson.create({
    data: {
      moduleId: mod1.id,
      title: '1.1 System Architecture: Decoupling Frontend, Backend & Database',
      description: 'Explore the separation of concerns, RESTful APIs vs GraphQL, and state management.',
      orderIndex: 1,
      durationMinutes: 22,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      notesMarkdown: `### Module 1.1 Architecture Notes\n\nModern web architectures separate the client-side presentation layer from backend business logic.\n\n- **Client Layer**: SPA or SSR with React & Tailwind CSS\n- **API Gateway / Backend**: Express & TypeScript with RBAC\n- **Persistence Layer**: Relational database with Prisma ORM\n\n#### Key Best Practices\n1. Always validate inputs on the server.\n2. Store secrets in environment variables.\n3. Implement idempotency on transactional operations.`,
      isPreview: true, // Free preview!
    },
  });

  const lesson1_2 = await prisma.lesson.create({
    data: {
      moduleId: mod1.id,
      title: '1.2 Advanced TypeScript Types, Interfaces & Generic Constraints',
      description: 'Master conditional types, utility types, and building robust API schemas.',
      orderIndex: 2,
      durationMinutes: 28,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      notesMarkdown: `### Advanced TypeScript Summary\n\nLearn how generics enforce contract boundaries between endpoints and database entities.\n\n\`\`\`typescript\ntype ApiResponse<T> = {\n  success: boolean;\n  data: T;\n  error?: string;\n};\n\`\`\``,
      isPreview: false,
    },
  });

  const mod2 = await prisma.courseModule.create({
    data: {
      courseId: course1.id,
      title: 'Module 2: Secure Authentication, RBAC & Session Management',
      description: 'Deep dive into password hashing, JWTs, refresh tokens, and role-based policies.',
      orderIndex: 2,
    },
  });

  const lesson2_1 = await prisma.lesson.create({
    data: {
      moduleId: mod2.id,
      title: '2.1 Least Privilege Access & Cryptographic Password Hashing',
      description: 'Implement bcrypt salt rounds, secure session invalidation, and credential protections.',
      orderIndex: 1,
      durationMinutes: 35,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
      notesMarkdown: `### Authentication & RBAC Core Concepts\n\nSecurity begins with zero-trust boundaries.\n\n- Passwords must be hashed using bcrypt or argon2 (min 10 salt rounds).\n- Sessions expire after 2 hours of inactivity.\n- Sensitive operations require re-authentication.`,
      isPreview: false,
    },
  });

  // Resources for Course 1
  await prisma.courseResource.create({
    data: {
      courseId: course1.id,
      lessonId: lesson1_1.id,
      title: 'Full-Stack Architecture Reference Diagram (PDF)',
      fileName: 'fullstack-architecture-2026.pdf',
      fileUrl: '/uploads/sample-architecture.pdf',
      fileType: 'application/pdf',
      fileSize: 1048576,
      isPublic: true, // Publicly available preview resource!
    },
  });

  await prisma.courseResource.create({
    data: {
      courseId: course1.id,
      lessonId: lesson2_1.id,
      title: 'Security & RBAC Implementation Checklist (PDF)',
      fileName: 'security-checklist-rbac.pdf',
      fileUrl: '/uploads/security-checklist.pdf',
      fileType: 'application/pdf',
      fileSize: 524288,
      isPublic: false, // Enrolled only!
    },
  });

  // Quiz for Module 1
  const quiz1 = await prisma.moduleQuiz.create({
    data: {
      moduleId: mod1.id,
      title: 'Module 1 Assessment: Architecture & TypeScript',
      passPercentage: 70,
    },
  });

  const q1 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz1.id,
      question: 'Which of the following is true regarding server-side security in modern web applications?',
      explanation: 'Clients can be manipulated; authorization, validation, and payment verification must ALWAYS occur authoritatively on the server.',
      orderIndex: 1,
      options: {
        create: [
          { optionText: 'Client-side verification is sufficient if using HTTPS', isCorrect: false },
          { optionText: 'All business logic, entitlement checks, and payment verifications must be enforced on the server', isCorrect: true },
          { optionText: 'Passwords should be encrypted symmetrically and decrypted on login', isCorrect: false },
          { optionText: 'Secrets may be embedded in public client bundles if obfuscated', isCorrect: false },
        ],
      },
    },
  });

  const q2 = await prisma.quizQuestion.create({
    data: {
      quizId: quiz1.id,
      question: 'What does the principle of Least Privilege dictate in an LMS role matrix?',
      explanation: 'Least privilege ensures users only have access to resources and operations strictly required for their specific role.',
      orderIndex: 2,
      options: {
        create: [
          { optionText: 'Mentors should be able to view all financial orders and refund payments', isCorrect: false },
          { optionText: 'Every authenticated user should have read access to all forum threads and doubts', isCorrect: false },
          { optionText: 'Users and staff are granted only the minimal permissions required to perform their specific role', isCorrect: true },
          { optionText: 'Super admins should share a single root account without individual audit logs', isCorrect: false },
        ],
      },
    },
  });

  // Course 2: Data Science & Machine Learning (Paid - $59.99)
  const course2 = await prisma.course.create({
    data: {
      title: 'Modern Data Science & Machine Learning with Python',
      slug: 'modern-data-science-machine-learning-python',
      description: 'Practical data science from raw data to deployed predictive models. Covers Pandas, NumPy, Scikit-Learn, PyTorch basics, and end-to-end data pipelines.',
      shortDescription: 'Master statistical analysis, predictive modelling, and machine learning workflows in Python.',
      categoryId: catData.id,
      level: 'INTERMEDIATE',
      language: 'English',
      durationHours: 42.0,
      price: 59.99,
      isFree: false,
      status: 'PUBLISHED',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
      previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
      instructorName: 'Prof. Alex Rivera',
      mentorId: mentor.id,
      accessDurationDays: 365,
      publishedAt: new Date(),
    },
  });

  const mod2_1 = await prisma.courseModule.create({
    data: {
      courseId: course2.id,
      title: 'Module 1: Exploratory Data Analysis & Feature Engineering',
      description: 'Techniques for cleaning messy real-world datasets and uncovering distribution insights.',
      orderIndex: 1,
    },
  });

  await prisma.lesson.create({
    data: {
      moduleId: mod2_1.id,
      title: '1.1 Data Wrangling with Pandas and NumPy',
      description: 'Vectorized computations, handling nulls, and aggregating large time series.',
      orderIndex: 1,
      durationMinutes: 30,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
      notesMarkdown: `### Data Wrangling Essentials\n\nAlways inspect dataset shape, missingness, and data types before proceeding to modeling.`,
      isPreview: true,
    },
  });

  // Course 3: Foundations of Computer Science (Free - $0.00)
  const course3 = await prisma.course.create({
    data: {
      title: 'Foundations of Computer Science & Python Programming',
      slug: 'foundations-computer-science-python',
      description: 'An open-access introduction to computational thinking, problem solving, algorithms, and core programming paradigms in Python. 100% free for all registered students.',
      shortDescription: 'A completely free foundational course for new and aspiring programmers.',
      categoryId: catCS.id,
      level: 'BEGINNER',
      language: 'English',
      durationHours: 18.0,
      price: 0.0,
      isFree: true,
      status: 'PUBLISHED',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
      previewVideoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      instructorName: 'Prof. Alex Rivera',
      mentorId: mentor.id,
      accessDurationDays: 0, // Lifetime access
      publishedAt: new Date(),
    },
  });

  const mod3_1 = await prisma.courseModule.create({
    data: {
      courseId: course3.id,
      title: 'Module 1: Computational Thinking & Syntax',
      description: 'Variables, loops, conditionals, and functions.',
      orderIndex: 1,
    },
  });

  await prisma.lesson.create({
    data: {
      moduleId: mod3_1.id,
      title: '1.1 Getting Started with Python: Environment & First Scripts',
      description: 'Installing Python, working with virtual environments, and understanding execution flow.',
      orderIndex: 1,
      durationMinutes: 20,
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      notesMarkdown: `### Introduction to Python\n\nWelcome to your journey into computer science! Write clean, readable code and practice daily.`,
      isPreview: true,
    },
  });

  // Course 4: In-Review Course (For Content Manager & Admin Review Workflow)
  const course4 = await prisma.course.create({
    data: {
      title: 'Production Kubernetes & Cloud Architecture Masterclass',
      slug: 'production-kubernetes-cloud-architecture',
      description: 'Enterprise container orchestration, Helm charts, ingress controllers, service meshes, and GitOps workflows with ArgoCD.',
      shortDescription: 'Advanced Kubernetes deployments and cloud infrastructure.',
      categoryId: catCloud.id,
      level: 'ADVANCED',
      language: 'English',
      durationHours: 25.0,
      price: 79.99,
      isFree: false,
      status: 'IN_REVIEW', // In review workflow test!
      thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80',
      instructorName: 'Elena Rostova & Guest Specialists',
      accessDurationDays: 365,
    },
  });

  // 4. Enrolment and Order for John Doe in Course 1
  const order1 = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2026-8910',
      userId: student.id,
      courseId: course1.id,
      amount: 49.99,
      currency: 'USD',
      status: 'PAID',
      paymentGateway: 'SIMULATED_GATEWAY',
      gatewayOrderId: 'sim_ord_abc12345',
      transactions: {
        create: {
          gatewayPaymentId: 'sim_pay_xyz98765',
          gatewaySignature: 'sig_mock_verified_hmac_sha256',
          amount: 49.99,
          currency: 'USD',
          status: 'SUCCESS',
          rawResponseJson: JSON.stringify({
            status: 'captured',
            method: 'card',
            card_last4: '4242',
            brand: 'Visa',
          }),
        },
      },
    },
  });

  const enrolment1 = await prisma.enrolment.create({
    data: {
      userId: student.id,
      courseId: course1.id,
      orderId: order1.id,
      accessType: 'PURCHASE',
      status: 'ACTIVE',
      startDate: new Date(),
    },
  });

  // Also enroll John Doe in the free Course 3
  await prisma.enrolment.create({
    data: {
      userId: student.id,
      courseId: course3.id,
      accessType: 'FREE',
      status: 'ACTIVE',
      startDate: new Date(),
    },
  });

  // Seed an official verifiable certificate for John Doe on Course 3
  await prisma.certificate.create({
    data: {
      certificateCode: 'CERT-2026-CS101-JOHN',
      userId: student.id,
      courseId: course3.id,
      studentName: student.name,
      courseTitle: course3.title,
      issuedAt: new Date(),
    },
  });

  // John has completed Lesson 1.1 and has progress on Lesson 1.2
  await prisma.lessonProgress.create({
    data: {
      userId: student.id,
      lessonId: lesson1_1.id,
      isCompleted: true,
      completedAt: new Date(),
      lastPlaybackPositionSeconds: 1320,
    },
  });

  await prisma.lessonProgress.create({
    data: {
      userId: student.id,
      lessonId: lesson1_2.id,
      isCompleted: false,
      lastPlaybackPositionSeconds: 450, // Resuming at 7.5 mins
    },
  });

  // 5. Doubt Ticket with Mentor Discussion Thread
  const doubt1 = await prisma.doubtTicket.create({
    data: {
      studentId: student.id,
      mentorId: mentor.id,
      courseId: course1.id,
      lessonId: lesson1_2.id,
      title: 'Question on TypeScript Discriminated Unions with Generic Handlers',
      description: 'When defining a discriminated union with a generic payload, the compiler fails to narrow the type inside the switch block. Is there a recommended pattern for this?',
      status: 'OPEN',
      messages: {
        create: [
          {
            senderId: student.id,
            message: 'Hi Prof. Alex, here is the snippet where the union narrowing seems ambiguous. I checked lesson 1.2 at timestamp 14:20.',
            attachmentName: 'typescript_union_error.png',
            attachmentUrl: '/uploads/sample-error.png',
            attachmentType: 'image/png',
          },
          {
            senderId: mentor.id,
            message: 'Hello John! Great observation. In TypeScript, if the discriminant property is generic, you need to assert the constraint or use a custom type predicate function. Check the updated code example attached in lesson notes!',
          },
        ],
      },
    },
  });

  // 6. Community Forum Discussion and Flagged Moderation Topic
  const forumTopic1 = await prisma.courseForumTopic.create({
    data: {
      courseId: course1.id,
      authorId: student.id,
      title: 'Tips for setting up local Docker PostgreSQL environment',
      content: 'Hey everyone, I put together a quick docker-compose template for local development that matches our course settings. Hope it helps anyone starting Module 2!',
      isPinned: true,
      posts: {
        create: [
          {
            authorId: mentor.id,
            content: 'Excellent initiative, John! I have reviewed the compose file; remember to also set POSTGRES_INITDB_ARGS for UTF8 support.',
          },
        ],
      },
    },
  });

  // An inappropriate/spam topic to test the Moderator role queue!
  const spamTopic = await prisma.courseForumTopic.create({
    data: {
      courseId: course1.id,
      authorId: student2.id,
      title: 'FREE CRYPTO AIRDROP CLICK HERE UNCLAIMED TOKENS',
      content: 'Claim your free 5000 crypto coins now before the presale ends at bit.ly/suspicious-link-test!',
      isHidden: false,
    },
  });

  await prisma.moderationReport.create({
    data: {
      reporterId: student.id,
      targetType: 'FORUM_TOPIC',
      targetId: spamTopic.id,
      reason: 'Spam / Commercial solicitation completely unrelated to course content.',
      status: 'PENDING',
    },
  });

  // 7. Scheduled Live Class
  const liveDate = new Date();
  liveDate.setDate(liveDate.getDate() + 2); // 2 days from now
  liveDate.setHours(18, 0, 0, 0);

  await prisma.liveClass.create({
    data: {
      courseId: course1.id,
      mentorId: mentor.id,
      title: 'Live Q&A & Code Review: Module 1 & 2 Architectural Patterns',
      description: 'Join Prof. Alex Rivera for a live interactive coding walkthrough, live doubt resolution, and real-time architectural critiques.',
      scheduledAt: liveDate,
      durationMinutes: 75,
      meetingUrl: 'https://meet.jit.si/LMS-FullStack-Mastery-LiveRoom',
      status: 'SCHEDULED',
    },
  });

  // 8. Maintenance Mode Flags
  const maintenanceFlags = [
    { featureKey: 'PLATFORM_GLOBAL', isEnabled: false, message: 'Platform undergoing scheduled routine maintenance. Back online shortly.' },
    { featureKey: 'PAYMENT_CHECKOUT', isEnabled: false, message: 'Payment gateway processor is under scheduled bank reconciliation maintenance.' },
    { featureKey: 'COMMUNITY_FORUM', isEnabled: false, message: 'Community forums are currently read-only for scheduled indexing.' },
    { featureKey: 'LIVE_CLASSES', isEnabled: false, message: 'Live streaming servers are being upgraded.' },
  ];

  for (const flag of maintenanceFlags) {
    await prisma.maintenanceFlag.create({ data: flag });
  }

  // 9. Initial Audit Log
  await prisma.auditEvent.create({
    data: {
      actorId: admin.id,
      actorEmail: admin.email,
      action: 'PLATFORM_INITIALIZATION',
      entityType: 'SYSTEM',
      entityId: 'SYSTEM_BOOTSTRAP',
      detailsJson: JSON.stringify({ version: '1.0.0', initializedRoles: 6, defaultCourses: 4 }),
      ipAddress: '127.0.0.1',
      userAgent: 'BootstrapSeed/1.0',
    },
  });

  // 10. Sample Notification
  await prisma.notification.create({
    data: {
      userId: student.id,
      title: 'Welcome to Full-Stack Web Development Mastery!',
      message: 'Your enrolment is active. Start with Module 1.1 Architecture Notes.',
      link: `/student/classroom/${course1.id}`,
      type: 'ENROLMENT',
    },
  });

  // 11. PRD Section 15.4 FAQs in English and Hindi
  const faqs = [
    {
      category: 'REGISTRATION',
      questionEn: 'How do I register and verify my account?',
      answerEn: 'Sign up with your legal name, verified email, and academic details. You will receive a 6-digit one-time code to activate your learning credentials.',
      questionHi: 'मैं अपना खाता कैसे पंजीकृत और सत्यापित करूं?',
      answerHi: 'अपने नाम, ईमेल और शैक्षणिक विवरण के साथ साइन अप करें। अपना खाता सक्रिय करने के लिए आपको 6-अंकीय सत्यापन कोड प्राप्त होगा।',
      orderIndex: 1,
    },
    {
      category: 'PAYMENTS_REFUNDS',
      questionEn: 'What is your course refund policy?',
      answerEn: 'Paid courses include a 7-day refund guarantee if less than 25% of lessons have been completed. Authorized refunds automatically revoke course enrolment.',
      questionHi: 'आपकी पाठ्यक्रम धनवापसी नीति क्या है?',
      answerHi: 'सशुल्क पाठ्यक्रमों में 7-दिवसीय धनवापसी गारंटी शामिल है यदि 25% से कम पाठ पूरे किए गए हों। स्वीकृत धनवापसी से पाठ्यक्रम का एक्सेस स्वतः रद्द हो जाता है।',
      orderIndex: 2,
    },
    {
      category: 'COURSE_ACCESS',
      questionEn: 'Do enrolled courses expire?',
      answerEn: 'Courses grant 365 days of active access or lifetime access depending on the syllabus tier. Free foundational courses provide indefinite lifetime access.',
      questionHi: 'क्या नामांकित पाठ्यक्रमों की वैधता समाप्त होती है?',
      answerHi: 'पाठ्यक्रम 365 दिनों की सक्रिय पहुंच या आजीवन पहुंच प्रदान करते हैं। निःशुल्क बुनियादी पाठ्यक्रम असीमित आजीवन पहुंच प्रदान करते हैं।',
      orderIndex: 3,
    },
    {
      category: 'LIVE_CLASSES',
      questionEn: 'How do I join live masterclasses?',
      answerEn: 'Go to your Student Dashboard or Live Classes tab. Active meeting links are visible to enrolled learners 15 minutes before the scheduled session.',
      questionHi: 'मैं लाइव मास्टरक्लास में कैसे शामिल हो सकता हूं?',
      answerHi: 'अपने छात्र डैशबोर्ड या लाइव क्लास टैब पर जाएं। सक्रिय मीटिंग लिंक निर्धारित समय से 15 मिनट पहले नामांकित शिक्षार्थियों के लिए दिखाई देंगे।',
      orderIndex: 4,
    },
    {
      category: 'CERTIFICATES',
      questionEn: 'How do I claim and verify my certificate of completion?',
      answerEn: 'Complete 100% of the lessons in a course and achieve at least 70% in all module quizzes. Your verifiable certificate code can be verified publicly at /verify-certificate.',
      questionHi: 'मैं अपना पूर्णता प्रमाणपत्र कैसे प्राप्त और सत्यापित कर सकता हूं?',
      answerHi: 'पाठ्यक्रम के 100% पाठ पूरे करें और सभी मॉड्यूल क्विज़ में कम से कम 70% अंक प्राप्त करें। आपका प्रमाणपत्र कोड /verify-certificate पर सार्वजनिक रूप से सत्यापित किया जा सकता है।',
      orderIndex: 5,
    },
    {
      category: 'ACCOUNT_SECURITY',
      questionEn: 'Why was I signed out automatically?',
      answerEn: 'For your security, our platform automatically invalidates sessions after 2 hours of inactivity. Simply sign back in to continue where you left off.',
      questionHi: 'मुझे स्वचालित रूप से साइन आउट क्यों किया गया?',
      answerHi: 'आपकी सुरक्षा के लिए, हमारा प्लेटफ़ॉर्म 2 घंटे की निष्क्रियता के बाद सत्रों को स्वचालित रूप से अमान्य कर देता है। फिर से साइन इन करके जारी रखें।',
      orderIndex: 6,
    },
  ];

  for (const faq of faqs) {
    await prisma.faqArticle.create({ data: faq });
  }

  // 12. PRD Section 15.3 Feedback Sample
  await prisma.feedback.create({
    data: {
      referenceNumber: 'FDBK-2026-1001',
      userId: student.id,
      courseId: course1.id,
      category: 'COURSE_FEEDBACK',
      title: 'Outstanding TypeScript Architecture Curriculum',
      description: 'The real-world focus on TypeScript types and system architecture in Module 1 was phenomenal.',
      rating: 5,
      status: 'RESOLVED',
      internalNotes: 'Positive learner review. Featured in student testimonials.',
    },
  });

  // 13. PRD Section 15.4 Support Ticket Sample
  const sampleTicket = await prisma.supportTicket.create({
    data: {
      ticketNumber: 'SUP-2026-5001',
      userId: student.id,
      requesterEmail: student.email,
      requesterName: student.name,
      category: 'COURSE_CONTENT',
      subject: 'Clarification regarding Docker Compose resource files',
      description: 'Is the Docker Compose template in Lesson 1.2 compatible with Apple Silicon M-series chips?',
      status: 'IN_PROGRESS',
      priority: 'MEDIUM',
      assignedToUserId: mentor.id,
      messages: {
        create: [
          {
            senderId: student.id,
            senderRole: 'USER',
            message: 'Hello Support team, I have a quick question on the local PostgreSQL docker configuration for Apple Silicon.',
          },
          {
            senderId: mentor.id,
            senderRole: 'STAFF',
            message: 'Hi John! Yes, the compose file uses the official arm64 multi-arch PostgreSQL image and works seamlessly on Apple Silicon.',
          },
        ],
      },
    },
  });

  console.log('Database seeded successfully with realistic test data for all 6 roles and preferences/support!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
