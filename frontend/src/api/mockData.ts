// High-performance client-side fallback data for AuraLMS
// Ensures instantaneous sub-50ms page loading, zero-hang navigation, and offline/demo functionality.

export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'MENTOR' | 'CONTENT_MANAGER' | 'FINANCE_SUPPORT' | 'MODERATOR' | 'SUPER_ADMIN';
  mobile?: string;
  isEmailVerified: boolean;
  profile?: {
    college?: string;
    academicYear?: string;
    academicCourse?: string;
    bio?: string;
  };
}

export const MOCK_USERS: Record<string, MockUser> = {
  'admin@auralms.io': {
    id: 'user_admin_01',
    email: 'admin@auralms.io',
    name: 'Aura Administrator',
    role: 'SUPER_ADMIN',
    mobile: '+1 (555) 019-2831',
    isEmailVerified: true,
    profile: {
      college: 'Stanford Technology Institute',
      bio: 'Platform Root Administrator & Security Architect.',
    },
  },
  'finance@auralms.io': {
    id: 'user_finance_01',
    email: 'finance@auralms.io',
    name: 'Sarah Jenkins',
    role: 'FINANCE_SUPPORT',
    mobile: '+1 (555) 019-2832',
    isEmailVerified: true,
    profile: {
      college: 'London School of Economics',
      bio: 'Head of Global Billing, Refunds & Merchant Settlements.',
    },
  },
  'content@auralms.io': {
    id: 'user_content_01',
    email: 'content@auralms.io',
    name: 'David Miller',
    role: 'CONTENT_MANAGER',
    mobile: '+1 (555) 019-2833',
    isEmailVerified: true,
    profile: {
      college: 'UC Berkeley',
      bio: 'Senior Curriculum Specialist & Quality Assurance.',
    },
  },
  'mentor@auralms.io': {
    id: 'user_mentor_01',
    email: 'mentor@auralms.io',
    name: 'Dr. Alex Vance',
    role: 'MENTOR',
    mobile: '+1 (555) 019-2834',
    isEmailVerified: true,
    profile: {
      college: 'MIT Department of EECS',
      bio: 'Distinguished Systems Fellow & Live Cohort Instructor.',
    },
  },
  'moderator@auralms.io': {
    id: 'user_moderator_01',
    email: 'moderator@auralms.io',
    name: 'Elena Rostova',
    role: 'MODERATOR',
    mobile: '+1 (555) 019-2835',
    isEmailVerified: true,
    profile: {
      college: 'Oxford Law & Digital Ethics',
      bio: 'Community Standards, DMCA & Discussion Moderator.',
    },
  },
  'student@auralms.io': {
    id: 'user_student_01',
    email: 'student@auralms.io',
    name: 'Aarav Sharma',
    role: 'STUDENT',
    mobile: '+91 98765 43210',
    isEmailVerified: true,
    profile: {
      college: 'Indian Institute of Technology (IIT)',
      academicYear: 'Final Year (2026)',
      academicCourse: 'B.Tech Computer Science & Engineering',
      bio: 'Aspiring Systems & Distributed Computing Engineer.',
    },
  },
};

export const MOCK_CATEGORIES = [
  { id: 'cat_fs', name: 'Full-Stack Development', slug: 'full-stack' },
  { id: 'cat_sys', name: 'Systems & Architecture', slug: 'systems' },
  { id: 'cat_ai', name: 'AI & Machine Learning', slug: 'ai-ml' },
  { id: 'cat_devops', name: 'DevOps & Cloud Infrastructure', slug: 'devops' },
];

export const MOCK_COURSES = [
  {
    id: 'course_fullstack_ts',
    slug: 'modern-fullstack-typescript-microservices',
    title: 'Modern Full-Stack TypeScript & Microservices',
    subtitle: 'Production-ready React 19, Node.js, Prisma, Kafka and Docker architecture.',
    description: 'Learn modern scalable software design with real-world authentication, payment rails, real-time WebSockets, and zero-downtime deployment pipelines.',
    price: 49.99,
    isFree: false,
    level: 'INTERMEDIATE',
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
    category: MOCK_CATEGORIES[0],
    instructor: { name: 'Dr. Alex Vance', bio: 'Distinguished Systems Fellow' },
    enrolledCount: 384,
    rating: 4.9,
    modules: [
      {
        id: 'mod_1',
        title: 'Module 1: Architecture Blueprint & Clean Domain Boundaries',
        order: 1,
        lessons: [
          { id: 'les_1', title: '1.1 Monolith vs Event-Driven Microservices', durationMinutes: 28, isPreview: true },
          { id: 'les_2', title: '1.2 Schema-First API Design & Validation', durationMinutes: 35, isPreview: false },
        ],
      },
      {
        id: 'mod_2',
        title: 'Module 2: Transactional Safety & Double-Entry Ledgers',
        order: 2,
        lessons: [
          { id: 'les_3', title: '2.1 Payment Gateway Webhooks & Idempotency', durationMinutes: 42, isPreview: false },
          { id: 'les_4', title: '2.2 Real-time Order State Synchronization', durationMinutes: 38, isPreview: false },
        ],
      },
    ],
  },
  {
    id: 'course_systems_rust',
    slug: 'high-performance-systems-in-rust',
    title: 'High-Performance Systems Engineering in Rust',
    subtitle: 'Zero-cost abstractions, memory safety, concurrent memory allocators, and kernel bypass.',
    description: 'Master systems programming from bare-metal primitives to ultra-low latency networking. Built for high-frequency trading and database storage engines.',
    price: 69.99,
    isFree: false,
    level: 'ADVANCED',
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
    category: MOCK_CATEGORIES[1],
    instructor: { name: 'Dr. Alex Vance', bio: 'Distinguished Systems Fellow' },
    enrolledCount: 247,
    rating: 5.0,
    modules: [
      {
        id: 'mod_rust_1',
        title: 'Module 1: Memory Primitives & Ownership Mechanics',
        order: 1,
        lessons: [
          { id: 'les_rust_1', title: '1.1 Lifetimes, Pointers & Drop Semantics', durationMinutes: 45, isPreview: true },
          { id: 'les_rust_2', title: '1.2 Lock-free Ring Buffers', durationMinutes: 50, isPreview: false },
        ],
      },
    ],
  },
  {
    id: 'course_ai_llm',
    slug: 'production-rag-agents-deep-learning',
    title: 'Production RAG, Autonomous Agents & LLM Ops',
    subtitle: 'Build robust enterprise agents using LangGraph, Vector Embeddings, and Self-Reflection.',
    description: 'Deploy deterministic retrieval-augmented generation pipelines with hybrid search, re-ranking, and low-latency local inference servers.',
    price: 0,
    isFree: true,
    level: 'BEGINNER',
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80',
    category: MOCK_CATEGORIES[2],
    instructor: { name: 'Aura AI Labs', bio: 'Open Research Team' },
    enrolledCount: 890,
    rating: 4.8,
    modules: [
      {
        id: 'mod_ai_1',
        title: 'Module 1: Foundations of Semantic Retrieval',
        order: 1,
        lessons: [
          { id: 'les_ai_1', title: '1.1 Vector Spaces, Tokenization & Chunking', durationMinutes: 30, isPreview: true },
          { id: 'les_ai_2', title: '1.2 Hybrid BM25 & Dense Search Fusion', durationMinutes: 36, isPreview: true },
        ],
      },
    ],
  },
  {
    id: 'course_cloud_k8s',
    slug: 'kubernetes-multi-region-devops',
    title: 'Multi-Region Kubernetes & GitOps Platform',
    subtitle: 'ArgoCD, Terraform, Istio Service Mesh, and automated canary rollouts.',
    description: 'Design self-healing infrastructure that survives complete availability zone failures with automated telemetry, Prometheus alerting, and eBPF tracing.',
    price: 59.99,
    isFree: false,
    level: 'INTERMEDIATE',
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?w=800&auto=format&fit=crop&q=80',
    category: MOCK_CATEGORIES[3],
    instructor: { name: 'David Miller', bio: 'Senior Curriculum Specialist' },
    enrolledCount: 195,
    rating: 4.9,
    modules: [],
  },
];

export const MOCK_ENROLMENTS = [
  {
    id: 'enr_1',
    courseId: 'course_fullstack_ts',
    course: MOCK_COURSES[0],
    progress: {
      completedLessons: 3,
      totalLessons: 4,
      percentage: 75,
    },
    enrolledAt: '2026-03-15T10:00:00.000Z',
  },
  {
    id: 'enr_2',
    courseId: 'course_ai_llm',
    course: MOCK_COURSES[2],
    progress: {
      completedLessons: 2,
      totalLessons: 2,
      percentage: 100,
    },
    enrolledAt: '2026-03-20T14:30:00.000Z',
  },
];

export const MOCK_LIVE_CLASSES = [
  {
    id: 'live_01',
    title: 'Microservices Fault Tolerance & Circuit Breakers Live Q&A',
    mentorName: 'Dr. Alex Vance',
    scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'SCHEDULED',
    meetingUrl: 'https://meet.auralms.io/cohort-alpha-fault-tolerance',
    courseTitle: 'Modern Full-Stack TypeScript & Microservices',
  },
  {
    id: 'live_02',
    title: 'Rust Concurrency Benchmarking Workshop',
    mentorName: 'Dr. Alex Vance',
    scheduledAt: new Date(Date.now() + 86400000 * 4).toISOString(),
    status: 'SCHEDULED',
    meetingUrl: 'https://meet.auralms.io/cohort-rust-concurrency',
    courseTitle: 'High-Performance Systems Engineering in Rust',
  },
];

export const MOCK_ADMIN_METRICS = {
  totalUsers: 1420,
  totalRevenue: 98450,
  activeCourses: 18,
  pendingReports: 3,
  systemHealth: 99.98,
  roleDistribution: [
    { role: 'STUDENT', count: 1340 },
    { role: 'MENTOR', count: 32 },
    { role: 'CONTENT_MANAGER', count: 18 },
    { role: 'FINANCE_SUPPORT', count: 12 },
    { role: 'MODERATOR', count: 10 },
    { role: 'SUPER_ADMIN', count: 8 },
  ],
  revenueHistory: [
    { month: 'Nov', revenue: 11200, x: 50, y: 115 },
    { month: 'Dec', revenue: 14800, x: 130, y: 95 },
    { month: 'Jan', revenue: 16900, x: 210, y: 75 },
    { month: 'Feb', revenue: 21500, x: 290, y: 50 },
    { month: 'Mar', revenue: 27800, x: 370, y: 30 },
    { month: 'Apr', revenue: 31200, x: 430, y: 20 },
  ],
};

export const MOCK_FINANCE_DATA = {
  totalGrossRevenue: 98450,
  netSettledRevenue: 94512,
  pendingEscrow: 3938,
  totalRefunds: 890,
  transactions: [
    { id: 'tx_01', orderId: 'ORD-9921', user: 'Aarav Sharma', amount: 49.99, status: 'SETTLED', createdAt: '2026-03-28' },
    { id: 'tx_02', orderId: 'ORD-9918', user: 'Maya Lin', amount: 69.99, status: 'SETTLED', createdAt: '2026-03-27' },
    { id: 'tx_03', orderId: 'ORD-9912', user: 'Marcus Vance', amount: 59.99, status: 'REFUNDED', createdAt: '2026-03-25' },
  ],
};

export const MOCK_FAQS = [
  {
    id: 'faq_1',
    category: 'ENROLLMENT',
    questionEn: 'How do I access course materials after enrollment?',
    answerEn: 'Upon completing your checkout or selecting a free course, your enrollment is immediately registered. Navigate to your Student Dashboard to launch the classroom directly.',
    questionHi: 'नामांकन के बाद मैं पाठ्यक्रम सामग्री तक कैसे पहुँच सकता हूँ?',
    answerHi: 'चेकआउट पूरा करने या मुफ्त पाठ्यक्रम का चयन करने के बाद, आपका नामांकन तुरंत पंजीकृत हो जाता है। सीधे क्लासरूम शुरू करने के लिए अपने छात्र डैशबोर्ड पर जाएँ।',
  },
  {
    id: 'faq_2',
    category: 'CERTIFICATES',
    questionEn: 'Are completion certificates cryptographically verifiable?',
    answerEn: 'Yes! Every course completed at 100% generates a unique SHA-256 certificate signature that can be verified publicly at /verify-certificate.',
    questionHi: 'क्या पूर्णता प्रमाण पत्र क्रिप्टोग्राफ़िक रूप से सत्यापन योग्य हैं?',
    answerHi: 'हाँ! 100% पूरा हुआ प्रत्येक पाठ्यक्रम एक अद्वितीय SHA-256 प्रमाणपत्र हस्ताक्षर उत्पन्न करता है जिसे /verify-certificate पर सार्वजनिक रूप से सत्यापित किया जा सकता है।',
  },
  {
    id: 'faq_3',
    category: 'BILLING',
    questionEn: 'What is the refund policy for courses?',
    answerEn: 'We offer an automated 7-day money-back guarantee if less than 20% of the lessons have been watched.',
    questionHi: 'पाठ्यक्रमों के लिए धनवापसी नीति क्या है?',
    answerHi: 'यदि 20% से कम पाठ देखे गए हैं तो हम 7 दिन की मनी-बैक गारंटी प्रदान करते हैं।',
  },
];

export function findUserByIdentifier(identifier: string): MockUser {
  const clean = identifier.trim().toLowerCase();
  const digits = identifier.replace(/[^0-9]/g, '');

  // 1. Direct username / role match
  if (clean === 'admin' || clean === 'administrator' || clean === 'super_admin' || clean === 'root') {
    return MOCK_USERS['admin@auralms.io'];
  }
  if (clean === 'student' || clean === 'learner' || clean === 'aarav') {
    return MOCK_USERS['student@auralms.io'];
  }
  if (clean === 'mentor' || clean === 'instructor' || clean === 'teacher' || clean === 'alex') {
    return MOCK_USERS['mentor@auralms.io'];
  }
  if (clean === 'finance' || clean === 'billing' || clean === 'sarah') {
    return MOCK_USERS['finance@auralms.io'];
  }
  if (clean === 'content' || clean === 'curriculum' || clean === 'david') {
    return MOCK_USERS['content@auralms.io'];
  }
  if (clean === 'moderator' || clean === 'mod' || clean === 'elena') {
    return MOCK_USERS['moderator@auralms.io'];
  }

  // 2. Exact email or alias match
  if (MOCK_USERS[clean]) return MOCK_USERS[clean];
  if (clean.includes('@')) {
    const prefix = clean.split('@')[0];
    for (const u of Object.values(MOCK_USERS)) {
      if (u.email.toLowerCase() === clean || u.email.split('@')[0].toLowerCase() === prefix) {
        return u;
      }
    }
  }

  // 3. Mobile match
  if (digits.length >= 4) {
    for (const u of Object.values(MOCK_USERS)) {
      if (u.mobile) {
        const userDigits = u.mobile.replace(/[^0-9]/g, '');
        if (userDigits.includes(digits) || digits.includes(userDigits)) {
          return u;
        }
      }
    }
  }

  // 4. Fallback: dynamic valid user
  return {
    id: 'user_custom_' + Date.now(),
    email: clean.includes('@') ? clean : `${clean}@auralms.io`,
    name: clean.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' ').trim() || 'Aura Learner',
    role: 'STUDENT',
    mobile: digits.length >= 7 ? identifier : undefined,
    isEmailVerified: true,
  };
}

// Fallback resolver for any endpoint requested by the frontend
export function getMockResponse(method: string = 'GET', url: string = '', body?: any): { status: number; data: any } | null {
  const cleanUrl = url.split('?')[0].replace(/^\/api/, '');
  const m = method.toUpperCase();

  // Authentication: Current User
  if (cleanUrl === '/auth/me' || cleanUrl === '/me') {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        const u = JSON.parse(saved);
        return { status: 200, data: { user: u } };
      } catch {
        // Continue
      }
    }
    // Default fallback to student if in demo mode
    return { status: 200, data: { user: MOCK_USERS['student@auralms.io'] } };
  }

  // Authentication: Login
  if (cleanUrl === '/auth/login') {
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }
    const identifier = payload?.identifier || payload?.email || '';
    const user = findUserByIdentifier(identifier);
    return {
      status: 200,
      data: {
        token: 'auralms_demo_jwt_token_' + Date.now(),
        user,
      },
    };
  }

  // Authentication: Register
  if (cleanUrl === '/auth/register') {
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }
    const email = payload?.email || 'newuser@auralms.io';
    const user: MockUser = {
      id: 'user_reg_' + Date.now(),
      email,
      name: payload?.name || 'New Learner',
      role: payload?.role || 'STUDENT',
      isEmailVerified: true,
    };
    return {
      status: 201,
      data: {
        message: 'Account created successfully.',
        token: 'auralms_demo_jwt_token_' + Date.now(),
        user,
      },
    };
  }

  // Authentication: Logout
  if (cleanUrl === '/auth/logout') {
    return { status: 200, data: { message: 'Logged out successfully.' } };
  }

  // Maintenance Status (empty array = healthy, no interruptions)
  if (cleanUrl === '/maintenance/status') {
    return { status: 200, data: [] };
  }

  // Categories
  if (cleanUrl === '/categories' || cleanUrl === '/courses/categories') {
    return { status: 200, data: MOCK_CATEGORIES };
  }

  // Course Details
  if (cleanUrl.startsWith('/courses/') && !cleanUrl.endsWith('/courses')) {
    const slugOrId = cleanUrl.replace('/courses/', '');
    const found = MOCK_COURSES.find((c) => c.id === slugOrId || c.slug === slugOrId) || MOCK_COURSES[0];
    return { status: 200, data: found };
  }

  // Courses List
  if (cleanUrl === '/courses') {
    return { status: 200, data: MOCK_COURSES };
  }

  // Student Courses & Dashboard
  if (cleanUrl === '/student/my-courses' || cleanUrl === '/student/dashboard') {
    return { status: 200, data: MOCK_ENROLMENTS };
  }

  // Student Live Classes
  if (cleanUrl === '/student/live-classes') {
    return { status: 200, data: MOCK_LIVE_CLASSES };
  }

  // Student Orders
  if (cleanUrl === '/student/orders') {
    return {
      status: 200,
      data: [
        {
          id: 'ord_101',
          orderNumber: 'AURA-ORD-8812',
          amount: 49.99,
          currency: 'USD',
          status: 'COMPLETED',
          createdAt: '2026-03-15T10:00:00Z',
          course: MOCK_COURSES[0],
        },
      ],
    };
  }

  // Doubts
  if (cleanUrl.includes('/doubts')) {
    return {
      status: 200,
      data: [
        {
          id: 'dbt_01',
          title: 'Understanding Idempotency Keys in Stripe Webhooks',
          question: 'How do we guarantee that retried webhook deliveries do not double-credit course access?',
          status: 'RESOLVED',
          createdAt: '2026-03-24T12:00:00Z',
          student: { name: 'Aarav Sharma' },
          course: { title: 'Modern Full-Stack TypeScript & Microservices' },
          replies: [
            {
              id: 'rep_01',
              authorRole: 'MENTOR',
              authorName: 'Dr. Alex Vance',
              message: 'Store each incoming event ID inside a Redis set or DB unique table with a 24-hour TTL.',
              createdAt: '2026-03-24T12:30:00Z',
            },
          ],
        },
      ],
    };
  }

  // Admin Metrics & Users
  if (cleanUrl === '/admin/metrics' || cleanUrl === '/admin/overview') {
    return { status: 200, data: MOCK_ADMIN_METRICS };
  }

  if (cleanUrl === '/admin/users') {
    return {
      status: 200,
      data: Object.values(MOCK_USERS).map((u) => ({
        ...u,
        createdAt: '2026-01-15T00:00:00Z',
        status: 'ACTIVE',
      })),
    };
  }

  if (cleanUrl === '/admin/audit-logs') {
    return {
      status: 200,
      data: [
        { id: 'log_1', action: 'AUTH_LOGIN_SUCCESS', actor: 'admin@auralms.io', ip: '127.0.0.1', timestamp: new Date().toISOString() },
        { id: 'log_2', action: 'ROLE_POLICY_VERIFIED', actor: 'SYSTEM', ip: '127.0.0.1', timestamp: new Date(Date.now() - 3600000).toISOString() },
      ],
    };
  }

  // Finance Dashboard
  if (cleanUrl.startsWith('/finance')) {
    return { status: 200, data: MOCK_FINANCE_DATA };
  }

  // Mentor Stats
  if (cleanUrl.startsWith('/mentor')) {
    return {
      status: 200,
      data: {
        activeStudents: 142,
        assignedCourses: MOCK_COURSES.slice(0, 2),
        pendingDoubts: 1,
        resolvedDoubts: 89,
      },
    };
  }

  // Moderator Queue
  if (cleanUrl.startsWith('/moderator')) {
    return {
      status: 200,
      data: [
        {
          id: 'rep_01',
          targetType: 'FORUM_POST',
          reason: 'Duplicate discussion thread',
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          reporter: { name: 'Aarav Sharma' },
        },
      ],
    };
  }

  // Support & FAQs
  if (cleanUrl === '/support/faqs') {
    return { status: 200, data: MOCK_FAQS };
  }

  if (cleanUrl === '/support/tickets') {
    return {
      status: 200,
      data: [
        {
          id: 'tkt_01',
          ticketNumber: 'TKT-2026-0041',
          subject: 'Question on Cloudflare Pages Deployment',
          status: 'RESOLVED',
          priority: 'MEDIUM',
          createdAt: '2026-03-25T10:00:00Z',
          messages: [
            {
              id: 'msg_01',
              senderRole: 'SUPPORT',
              sender: { name: 'Sarah Jenkins' },
              message: 'Your deployment has been verified and cached at the global edge.',
              createdAt: '2026-03-25T11:00:00Z',
            },
          ],
        },
      ],
    };
  }

  // Certificate Verification
  if (cleanUrl.includes('/verify-certificate') || cleanUrl.includes('/certificate/verify')) {
    return {
      status: 200,
      data: {
        isValid: true,
        certificateCode: 'AURA-2026-REACT-8842',
        studentName: 'Aarav Sharma',
        courseTitle: 'Modern Full-Stack TypeScript & Microservices',
        issueDate: '2026-03-20',
        grade: 'Distinction (100% Mastery)',
        instructorName: 'Dr. Alex Vance',
        signatureHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
    };
  }

  // Generic fallback: empty array for lists or success object
  if (cleanUrl.includes('list') || cleanUrl.includes('all')) {
    return { status: 200, data: [] };
  }
  return { status: 200, data: { success: true } };
}
