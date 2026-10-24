// High-performance client-side fallback data for AuraLMS
// Ensures instantaneous sub-50ms page loading, zero-hang navigation, and offline/demo functionality.

export interface MockUser {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'MENTOR' | 'CONTENT_MANAGER' | 'FINANCE_SUPPORT' | 'MODERATOR' | 'SUPER_ADMIN' | 'MAINTENANCE_TEAM' | string;
  mobile?: string;
  status?: 'ACTIVE' | 'SUSPENDED' | 'BLOCKED';
  permissions?: string[];
  createdAt?: string;
  isEmailVerified: boolean;
  profile?: {
    college?: string;
    academicYear?: string;
    academicCourse?: string;
    bio?: string;
  };
}

export const MOCK_USER_LOGS: Record<string, any[]> = {
  user_student_01: [
    {
      id: 'log_std_01',
      timestamp: new Date().toISOString(),
      eventType: 'AUTH_LOGIN',
      ipAddress: '152.58.14.88',
      userAgent: 'Chrome 122.0 (Windows NT 10.0; Win64)',
      details: 'Authenticated successfully via single-session password verification.',
      status: 'SUCCESS',
    },
    {
      id: 'log_std_02',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      eventType: 'LESSON_COMPLETED',
      ipAddress: '152.58.14.88',
      userAgent: 'Chrome 122.0 (Windows NT 10.0; Win64)',
      details: 'Completed Lesson 1.2: Schema-First API Design & Validation.',
      status: 'SUCCESS',
    },
    {
      id: 'log_std_03',
      timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
      eventType: 'QUIZ_SUBMITTED',
      ipAddress: '152.58.14.88',
      userAgent: 'Chrome 122.0 (Windows NT 10.0; Win64)',
      details: 'Completed Module 1 Knowledge Assessment. Score: 100% (Distinction).',
      status: 'SUCCESS',
    },
    {
      id: 'log_std_04',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      eventType: 'COURSE_ENROLLED',
      ipAddress: '152.58.14.88',
      userAgent: 'Chrome 122.0 (Windows NT 10.0; Win64)',
      details: 'Enrolled in "Modern Full-Stack TypeScript & Microservices". Order ID: KEN-ORD-8812.',
      status: 'SUCCESS',
    },
    {
      id: 'log_std_05',
      timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
      eventType: 'ACCOUNT_REGISTERED',
      ipAddress: '152.58.14.88',
      userAgent: 'Chrome 122.0 (Windows NT 10.0; Win64)',
      details: 'Account created and verified via 6-digit email confirmation code.',
      status: 'SUCCESS',
    },
  ],
  user_admin_01: [
    {
      id: 'log_adm_01',
      timestamp: new Date().toISOString(),
      eventType: 'ADMIN_GOVERNANCE',
      ipAddress: '127.0.0.1',
      userAgent: 'Chrome 122.0 (Admin Console)',
      details: 'Root admin inspected user activity logs and verified least-privilege RBAC matrix.',
      status: 'SUCCESS',
    },
    {
      id: 'log_adm_02',
      timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
      eventType: 'MAINTENANCE_VERIFIED',
      ipAddress: '127.0.0.1',
      userAgent: 'Chrome 122.0 (Admin Console)',
      details: 'Verified health switchboards for community forum, payments, and live masterclasses.',
      status: 'SUCCESS',
    },
  ],
};

export const MOCK_USERS: Record<string, MockUser> = {
  'zainul7abideen@kenclasses.com': {
    id: 'user_superadmin_zainul',
    email: 'zainul7abideen@kenclasses.com',
    name: 'Zainul Abideen (Super Admin)',
    role: 'SUPER_ADMIN',
    mobile: '+919999900001',
    isEmailVerified: true,
    profile: {
      college: 'Ken Classes Technical Academy',
      academicCourse: 'Platform Governance',
      academicYear: 'Executive',
      bio: 'Platform Super Administrator & Academic Director',
    },
  },
  'hasnain2004@kenclasses.com': {
    id: 'user_superadmin_hasnain',
    email: 'hasnain2004@kenclasses.com',
    name: 'Hasnain (Super Admin)',
    role: 'SUPER_ADMIN',
    mobile: '+919999900002',
    isEmailVerified: true,
    profile: {
      college: 'Ken Classes Technical Academy',
      academicCourse: 'Platform Governance',
      academicYear: 'Executive',
      bio: 'Platform Super Administrator & Academic Director',
    },
  },
  'admin@auralms.io': {
    id: 'user_admin_01',
    email: 'admin@auralms.io',
    name: 'Ken Classes Administrator',
    role: 'SUPER_ADMIN',
    mobile: '+1 (555) 019-2831',
    isEmailVerified: true,
    profile: {
      college: 'Ken Classes Academic Board',
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
    status: 'ACTIVE',
    mobile: '+91 98765 43210',
    isEmailVerified: true,
    profile: {
      college: 'Indian Institute of Technology (IIT)',
      academicYear: 'Final Year (2026)',
      academicCourse: 'B.Tech Computer Science & Engineering',
      bio: 'Aspiring Systems & Distributed Computing Engineer.',
    },
  },
  'maintenance@auralms.io': {
    id: 'user_maint_01',
    email: 'maintenance@auralms.io',
    name: 'Vikram Mehta (Maintenance Lead)',
    role: 'MAINTENANCE_TEAM',
    status: 'ACTIVE',
    mobile: '+91 98765 11223',
    isEmailVerified: true,
    permissions: [
      'COMMUNITY_FORUM_MAINTENANCE',
      'PAYMENT_CHECKOUT_MAINTENANCE',
      'LIVE_CLASSES_MAINTENANCE',
    ],
    profile: {
      college: 'Ken Classes Operations Center',
      bio: 'Infrastructure, edge switches, and incident management lead.',
    },
  },
};

export const MOCK_CATEGORIES = [
  // 1. School Education (Class 1 - 10)
  {
    id: 'cat_primary_1_5',
    name: 'Class 1 to 5 (Primary Education)',
    slug: 'class-1-5-primary',
    group: 'School Education (Class 1-10)',
    icon: 'BookOpen',
    description: 'Foundational numeracy, early science concepts, English reading, grammar, and environmental studies.',
  },
  {
    id: 'cat_middle_6_8',
    name: 'Class 6 to 8 (Middle School)',
    slug: 'class-6-8-middle',
    group: 'School Education (Class 1-10)',
    icon: 'Book',
    description: 'Mathematics, General Science (Physics, Chemistry, Biology), Social Studies, English, and Early Coding.',
  },
  {
    id: 'cat_secondary_9_10',
    name: 'Class 9 & 10 (Secondary Board Prep)',
    slug: 'class-9-10-boards',
    group: 'School Education (Class 1-10)',
    icon: 'GraduationCap',
    description: 'CBSE, ICSE, JAC, UP Board, BSEB & State Boards curriculum for Class 9 and 10 Mathematics, Science & Social Studies.',
  },

  // 2. Higher Secondary (Class 11 - 12)
  {
    id: 'cat_hs_science',
    name: 'Class 11 & 12 (Science - PCM / PCB)',
    slug: 'class-11-12-science',
    group: 'Higher Secondary (Class 11-12)',
    icon: 'Atom',
    description: 'Higher secondary Physics, Chemistry, Mathematics & Biology for CBSE, JAC, ICSE and State Boards.',
  },
  {
    id: 'cat_hs_commerce',
    name: 'Class 11 & 12 (Commerce)',
    slug: 'class-11-12-commerce',
    group: 'Higher Secondary (Class 11-12)',
    icon: 'TrendingUp',
    description: 'Accountancy, Business Studies, Economics, Financial Markets and Applied Mathematics.',
  },
  {
    id: 'cat_hs_arts',
    name: 'Class 11 & 12 (Arts & Humanities)',
    slug: 'class-11-12-arts',
    group: 'Higher Secondary (Class 11-12)',
    icon: 'Globe',
    description: 'History, Political Science, Geography, Psychology, Sociology, and English Literature.',
  },

  // 3. Competitive & Entrance Examinations
  {
    id: 'cat_jee_neet_cuet',
    name: 'Competitive Entrance (JEE, NEET & CUET)',
    slug: 'jee-neet-cuet',
    group: 'Entrance & Competitive Exams',
    icon: 'Award',
    description: 'Rigorous test series, problem solving, mock exams and rank booster cohorts for JEE Main, JEE Advanced, NEET-UG & CUET.',
  },
  {
    id: 'cat_govt_exams',
    name: 'Government Exams (UPSC, SSC, Banking, Railways)',
    slug: 'govt-exams-upsc-ssc',
    group: 'Entrance & Competitive Exams',
    icon: 'Landmark',
    description: 'Preparation cohorts for UPSC CSE, State PSC, SSC CGL/CHSL, IBPS/SBI PO & Clerk, RRB, NDA, and CDS.',
  },

  // 4. Undergraduate Degree Programs
  {
    id: 'cat_ug_engineering',
    name: 'Undergraduate Tech (B.Tech / B.E / BCA)',
    slug: 'btech-engineering-bca',
    group: 'Undergraduate Degrees (UG)',
    icon: 'Cpu',
    description: 'Core semester engineering courses in Computer Science, Mechanical, Civil, Electrical, Electronics & Information Technology.',
  },
  {
    id: 'cat_ug_science_commerce',
    name: 'Undergraduate Non-Tech (B.Sc / B.Com / B.A / BBA)',
    slug: 'bsc-bcom-ba-bba',
    group: 'Undergraduate Degrees (UG)',
    icon: 'Layers',
    description: 'University degree curricula in Physics, Chemistry, Pure Maths, Financial Accounting, Macroeconomics, Management & Arts.',
  },

  // 5. Postgraduate Master\'s Programs
  {
    id: 'cat_pg_masters',
    name: 'Postgraduate Programs (M.Tech / MCA / MBA / M.Sc / M.A)',
    slug: 'masters-mtech-mca-mba',
    group: 'Postgraduate & Masters (PG)',
    icon: 'Library',
    description: 'Advanced postgraduate master’s specializations in Data Analytics, Systems Engineering, Management, and Pure Sciences.',
  },

  // 6. Doctoral & Research Studies (PhD Level)
  {
    id: 'cat_phd_research',
    name: 'Doctoral Studies & Research (PhD & Post-Doc)',
    slug: 'phd-doctoral-research',
    group: 'Doctoral & Research (PhD)',
    icon: 'Microscope',
    description: 'Research methodology, statistical hypothesis testing, academic publishing, peer review, and doctoral thesis formulation.',
  },

  // 7. Professional Technology & Computer Science
  {
    id: 'cat_software_dev',
    name: 'Full-Stack & Software Development',
    slug: 'full-stack-software-development',
    group: 'Professional Technology & Skills',
    icon: 'Code',
    description: 'Industry-grade software engineering: React, Next.js, Node.js, Python, Go, Java, microservices, and system design.',
  },
  {
    id: 'cat_ai_data_science',
    name: 'AI, Machine Learning & Data Science',
    slug: 'ai-machine-learning-data-science',
    group: 'Professional Technology & Skills',
    icon: 'Brain',
    description: 'Deep learning, PyTorch, LLMs, computer vision, natural language processing, and big data engineering.',
  },
  {
    id: 'cat_cloud_devops',
    name: 'Cloud Computing & DevOps Engineering',
    slug: 'cloud-devops-infrastructure',
    group: 'Professional Technology & Skills',
    icon: 'Cloud',
    description: 'Docker, Kubernetes orchestration, AWS, Google Cloud, Terraform, CI/CD pipelines, and site reliability engineering.',
  },
  {
    id: 'cat_professional_skills',
    name: 'Professional Skills, Finance & Languages',
    slug: 'professional-skills-finance',
    group: 'Professional Technology & Skills',
    icon: 'Sparkles',
    description: 'Communication mastery, public speaking, digital marketing, UI/UX design, financial modeling, and trading fundamentals.',
  },
];

export const MOCK_COURSES = [
  {
    id: 'cloud-devops-engineering-mastery',
    slug: 'cloud-devops-engineering-mastery',
    title: 'Cloud & DevOps Engineering Mastery: Docker, Kubernetes, AWS & CI/CD',
    subtitle: 'Containerization, Kubernetes orchestration, Helm charts, and GitOps pipelines.',
    description: 'Comprehensive enterprise DevOps program. Master Linux namespaces, multi-stage Docker builds, Kubernetes cluster management, Helm charts, automated GitHub Actions pipelines, and production AWS deployments.',
    price: 3999,
    isFree: false,
    level: 'INTERMEDIATE',
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?auto=format&fit=crop&w=800&q=80',
    category: MOCK_CATEGORIES[14],
    instructor: { name: 'Prof. Alex Rivera', bio: 'Senior Cloud Architect & Lead Mentor at Ken Classes' },
    enrolledCount: 512,
    rating: 4.9,
    modules: [
      {
        id: 'c1_mod1',
        title: 'Module 1: Containerization Primitives & Docker Architecture',
        order: 1,
        lessons: [
          {
            id: 'c1_l1',
            title: '1.1 Container Engine Internals: Namespaces, Cgroups & Rootfs',
            durationMinutes: 24,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            notesMarkdown: `### Module 1.1: Container Engine Internals\n\nContainers are not virtual machines; they are standard operating system processes isolated by Linux kernel features:\n- **PID Namespaces**: Isolate process trees.\n- **Mount Namespaces (mnt)**: Provide an isolated root filesystem using overlayfs.\n- **Control Groups (cgroups v2)**: Enforce memory boundaries, CPU quotas, and I/O throttling.`,
            isPreview: true,
          },
          {
            id: 'c1_l2',
            title: '1.2 Multi-Stage Production Dockerfiles & Layer Caching',
            durationMinutes: 28,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            notesMarkdown: `### Multi-Stage Dockerfile Best Practices\n\nAvoid shipping build tools into runtime containers.\n\n\`\`\`dockerfile\nFROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM node:20-alpine AS runner\nWORKDIR /app\nCOPY --from=builder /app/dist ./dist\nCMD ["node", "dist/index.js"]\n\`\`\``,
            isPreview: false,
          },
          {
            id: 'c1_l3',
            title: '1.3 Multi-Container Stacks with Docker Compose & Networks',
            durationMinutes: 32,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            notesMarkdown: `### Docker Compose Networking\n\nBridge networks allow services to resolve each other by container service name using internal DNS resolution.`,
            isPreview: false,
          },
        ],
      },
      {
        id: 'c1_mod2',
        title: 'Module 2: Kubernetes Core Architecture & Cluster Orchestration',
        order: 2,
        lessons: [
          {
            id: 'c1_l4',
            title: '2.1 Control Plane & Worker Architecture: Kube-Apiserver, etcd & Kubelet',
            durationMinutes: 35,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            notesMarkdown: `### Kubernetes Architecture Blueprint\n\n- **kube-apiserver**: Stateless HTTP API gateway.\n- **etcd**: Consistent key-value store.\n- **kubelet**: Node-level agent ensuring pods are running.`,
            isPreview: false,
          },
          {
            id: 'c1_l5',
            title: '2.2 Deployments, Services, Ingress & Production TLS Automation',
            durationMinutes: 38,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
            notesMarkdown: `### Zero-Downtime Rolling Update Strategy\n\nAutomate zero-downtime rolling updates with maxSurge and maxUnavailable parameters.`,
            isPreview: false,
          },
        ],
      },
    ],
  },
  {
    id: 'enterprise-react-19-nextjs-architecture',
    slug: 'enterprise-react-19-nextjs-architecture',
    title: 'Enterprise React 19 & Next.js Full-Stack Architecture',
    subtitle: 'Server Components, Suspense streaming, Server Actions, and full-stack TypeScript.',
    description: 'Master the new React 19 compiler, Server Components, Server Actions, Suspense streaming, optimistic mutations, full-stack TypeScript schema validation, and high-performance SSR.',
    price: 2999,
    isFree: false,
    level: 'INTERMEDIATE',
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
    category: MOCK_CATEGORIES[12],
    instructor: { name: 'Elena Rostova', bio: 'Curriculum Publishing Lead & Senior Frontend Architect' },
    enrolledCount: 428,
    rating: 5.0,
    modules: [
      {
        id: 'c2_mod1',
        title: 'Module 1: React 19 Compiler, Server Components & Suspense',
        order: 1,
        lessons: [
          {
            id: 'c2_l1',
            title: '1.1 The React 19 Compiler & Server Component Boundaries',
            durationMinutes: 26,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            notesMarkdown: `### React Server Components (RSC) Architecture\n\nServer Components execute exclusively on the server, eliminating client bundle costs.`,
            isPreview: true,
          },
          {
            id: 'c2_l2',
            title: '1.2 Server Actions, Optimistic UI & Progressive Forms',
            durationMinutes: 30,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            notesMarkdown: `### Server Actions & Optimistic State\n\nMutating server state directly with built-in form actions and progressive enhancement.`,
            isPreview: false,
          },
        ],
      },
    ],
  },
  {
    id: 'modern-machine-learning-pytorch-python',
    slug: 'modern-machine-learning-pytorch-python',
    title: 'Modern Machine Learning & Deep Learning with Python & PyTorch',
    subtitle: 'Vectorized NumPy, Scikit-Learn pipelines, Neural Networks, and Transformers.',
    description: 'From statistical fundamentals to deep neural networks. Covers vectorized NumPy, Scikit-Learn pipelines, PyTorch tensor autograd, backpropagation, and Transformer architectures.',
    price: 4499,
    isFree: false,
    level: 'INTERMEDIATE',
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    category: MOCK_CATEGORIES[13],
    instructor: { name: 'Dr. Sarah Mitchell', bio: 'Chief Academic Officer & Deep Learning Specialist' },
    enrolledCount: 310,
    rating: 4.8,
    modules: [
      {
        id: 'c3_mod1',
        title: 'Module 1: Exploratory Data Science & Feature Engineering',
        order: 1,
        lessons: [
          {
            id: 'c3_l1',
            title: '1.1 Vectorized Data Wrangling with NumPy and Pandas',
            durationMinutes: 28,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            notesMarkdown: `### Vectorized Computations in NumPy\n\nVectorized operations unlock hardware SIMD parallel acceleration.`,
            isPreview: true,
          },
        ],
      },
    ],
  },
  {
    id: 'foundations-computer-science-algorithms',
    slug: 'foundations-computer-science-algorithms',
    title: 'Foundations of Computer Science & Algorithmic Problem Solving',
    subtitle: '100% Free Lifetime access to core data structures, algorithms, and computational thinking.',
    description: 'A completely open, 100% free foundational curriculum for every aspiring programmer. Covers computational thinking, data structures (Arrays, Linked Lists, Hash Tables), sorting algorithms, and Big-O asymptotic analysis.',
    price: 0,
    isFree: true,
    level: 'BEGINNER',
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
    category: MOCK_CATEGORIES[8],
    instructor: { name: 'Ken Classes Academic Faculty', bio: 'Open Education Research Foundation' },
    enrolledCount: 1240,
    rating: 5.0,
    modules: [
      {
        id: 'c4_mod1',
        title: 'Module 1: Computational Thinking, Variables & Memory Models',
        order: 1,
        lessons: [
          {
            id: 'c4_l1',
            title: '1.1 Algorithmic Problem Decomposition & Function Execution',
            durationMinutes: 22,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            notesMarkdown: `### Introduction to Computational Thinking\n\nDecomposition, pattern recognition, abstraction, and algorithmic design.`,
            isPreview: true,
          },
          {
            id: 'c4_l2',
            title: '1.2 Core Data Structures: Arrays, Hash Tables & Complexity',
            durationMinutes: 28,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatCarCanYouGetForAGrand.mp4',
            notesMarkdown: `### Big-O Complexity Matrix\n\nArrays: O(1) Access, O(n) Search. Hash Tables: O(1) Average Access and Insertion.`,
            isPreview: true,
          },
        ],
      },
    ],
  },
  {
    id: 'class-11-mathematics-complete-board',
    slug: 'class-11-mathematics-complete-board',
    title: 'Class 11th Mathematics: Comprehensive Board & Conceptual Masterclass (JAC, CBSE & ICSE)',
    subtitle: 'Sets, Relations, Trigonometry, Complex Numbers, Calculus Foundations, and Conic Sections.',
    description: 'Complete academic masterclass for Class 11th students following JAC, CBSE, ICSE, and State Board curricula. Master Sets & Functions, Trigonometric Identities, Permutations & Combinations, Binomial Theorem, Straight Lines, Limits, and Probability with step-by-step NCERT solutions and previous years board questions.',
    price: 999,
    isFree: false,
    level: 'BEGINNER',
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80',
    category: MOCK_CATEGORIES[3],
    instructor: { name: 'Er. Zainul Abideen (Chief Academic Director)', bio: 'Director of Academic Excellence & Mathematics Faculty' },
    enrolledCount: 780,
    rating: 4.95,
    modules: [
      {
        id: 'c5_mod1',
        title: 'Module 1: Sets, Relations & Trigonometric Functions',
        order: 1,
        lessons: [
          {
            id: 'c5_l1',
            title: '1.1 Sets Representation, Subsets & Venn Diagrams',
            durationMinutes: 35,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            notesMarkdown: `### Class 11 Mathematics: Chapter 1 - Sets\n\n- Definition: A well-defined collection of distinct objects.\n- Representation: Roster form and Set-builder notation.\n- Types: Empty set, Finite/Infinite sets, Subsets, Universal Set and Power set.`,
            isPreview: true,
          },
          {
            id: 'c5_l2',
            title: '1.2 Trigonometric Functions & Compound Angle Formulae',
            durationMinutes: 42,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
            notesMarkdown: `### Trigonometric Identities\n\n$$\\sin^2 x + \\cos^2 x = 1$$\n$$\\cos(A+B) = \\cos A \\cos B - \\sin A \\sin B$$\n$$\\sin(A+B) = \\sin A \\cos B + \\cos A \\sin B$$`,
            isPreview: false,
          },
        ],
      },
      {
        id: 'c5_mod2',
        title: 'Module 2: Limits, Derivatives & Analytical Geometry',
        order: 2,
        lessons: [
          {
            id: 'c5_l3',
            title: '2.1 Intuitive Introduction to Limits & Standard Limit Theorems',
            durationMinutes: 38,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            notesMarkdown: `### Limits & Continuity\n\nEvaluation of algebraic and trigonometric limits using factorization, rationalization, and L\'Hôpital\'s rule.`,
            isPreview: false,
          },
        ],
      },
    ],
  },
  {
    id: 'class-10-board-science-complete',
    slug: 'class-10-board-science-complete',
    title: 'Class 10th Board Science: Physics, Chemistry & Biology Mastery (CBSE, JAC & State Boards)',
    subtitle: 'Chemical Reactions, Electricity, Light Optics, Life Processes, and Periodic Classification.',
    description: 'Designed specifically for Class 10 board aspirants. Comprehensive conceptual lectures, circuit ray diagrams, chemical equations balancing, and 10-year question bank analysis for maximum marks in board exams.',
    price: 799,
    isFree: false,
    level: 'BEGINNER',
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80',
    category: MOCK_CATEGORIES[2],
    instructor: { name: 'Hasnain Sir (Lead Science Faculty)', bio: 'Senior Faculty in Science & Board Examination Specialist' },
    enrolledCount: 940,
    rating: 4.9,
    modules: [
      {
        id: 'c6_mod1',
        title: 'Module 1: Chemical Reactions, Acids, Bases & Salts',
        order: 1,
        lessons: [
          {
            id: 'c6_l1',
            title: '1.1 Balancing Chemical Equations & Types of Reactions',
            durationMinutes: 30,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
            notesMarkdown: `### Types of Chemical Reactions\n\n1. Combination Reaction\n2. Decomposition Reaction\n3. Displacement Reaction\n4. Double Displacement Reaction\n5. Oxidation and Reduction (Redox)`,
            isPreview: true,
          },
        ],
      },
    ],
  },
  {
    id: 'phd-research-methodology-thesis',
    slug: 'phd-research-methodology-thesis',
    title: 'Doctoral Studies & Research Methodology: Formulation to Defense (PhD Level)',
    subtitle: 'Qualitative & Quantitative Designs, Statistical Inference, SCI/Scopus Paper Writing & Defense.',
    description: 'An advanced doctoral-level program for PhD scholars, researchers, and prospective post-docs. Covers formulating defensible research questions, quantitative statistical inference with R/SPSS, qualitative thematic analysis, Scopus/IEEE/Elsevier manuscript publication standards, and dissertation defense protocols.',
    price: 3499,
    isFree: false,
    level: 'ADVANCED',
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
    category: MOCK_CATEGORIES[11],
    instructor: { name: 'Dr. Sarah Jenkins (Senior Research Fellow & Academic Dean)', bio: 'PhD Research Supervisor & Former University Dean' },
    enrolledCount: 185,
    rating: 4.98,
    modules: [
      {
        id: 'c7_mod1',
        title: 'Module 1: Epistemological Foundations & Research Problem Formulation',
        order: 1,
        lessons: [
          {
            id: 'c7_l1',
            title: '1.1 Formulating Research Questions, Gaps & Literature Synthesis',
            durationMinutes: 45,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
            notesMarkdown: `### Doctoral Research Framework\n\n- Identifying novel research gaps in published literature.\n- Formulating falsifiable null and alternative hypotheses.\n- Ethical compliance and IRB approval processes.`,
            isPreview: true,
          },
        ],
      },
    ],
  },
  {
    id: 'jee-advanced-physics-rank-booster',
    slug: 'jee-advanced-physics-rank-booster',
    title: 'JEE Main & Advanced 2026: Physics Mechanics, Electromagnetism & Modern Physics',
    subtitle: 'Advanced conceptual problem solving, Irodov & HCV level multi-concept problems, and mock tests.',
    description: 'Top-tier rank booster course for engineering aspirants preparing for JEE Main & Advanced. Master Newton\'s laws, rotation dynamics, electrostatics, Gauss law, magnetic effects, wave optics, and nuclear physics.',
    price: 2499,
    isFree: false,
    level: 'ADVANCED',
    status: 'PUBLISHED',
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=800&q=80',
    category: MOCK_CATEGORIES[6],
    instructor: { name: 'Ken Classes Senior JEE Faculty', bio: 'IIT Alumnus & Senior Entrance Mentor' },
    enrolledCount: 620,
    rating: 4.92,
    modules: [
      {
        id: 'c8_mod1',
        title: 'Module 1: Rotational Mechanics & Rigid Body Dynamics',
        order: 1,
        lessons: [
          {
            id: 'c8_l1',
            title: '1.1 Moment of Inertia, Torque & Pure Rolling Without Slipping',
            durationMinutes: 40,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
            notesMarkdown: `### Rotational Dynamics\n\n- Moment of inertia parallel and perpendicular axis theorems.\n- Condition for pure rolling: $$v_{cm} = \\omega R$$.\n- Angular momentum conservation in non-inertial frames.`,
            isPreview: true,
          },
        ],
      },
    ],
  },
];

export const MOCK_ENROLMENTS = [
  {
    id: 'enr_1',
    courseId: 'cloud-devops-engineering-mastery',
    course: MOCK_COURSES[0],
    progress: {
      completedLessons: 1,
      totalLessons: 5,
      percentage: 20,
    },
    enrolledAt: '2026-03-15T10:00:00.000Z',
  },
  {
    id: 'enr_2',
    courseId: 'foundations-computer-science-algorithms',
    course: MOCK_COURSES[3],
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
    title: 'Live Interactive Workshop: Production Kubernetes Debugging & Live Triage',
    mentorName: 'Prof. Alex Rivera',
    scheduledAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    status: 'SCHEDULED',
    meetingUrl: 'https://meet.jit.si/KenClasses-DevOps-LiveRoom-2026',
    courseTitle: 'Cloud & DevOps Engineering Mastery: Docker, Kubernetes, AWS & CI/CD',
  },
  {
    id: 'live_02',
    title: 'React 19 Server Actions Deep Dive & Architecture Code Review',
    mentorName: 'Elena Rostova',
    scheduledAt: new Date(Date.now() + 86400000 * 4).toISOString(),
    status: 'SCHEDULED',
    meetingUrl: 'https://meet.jit.si/KenClasses-React19-DeepDive-2026',
    courseTitle: 'Enterprise React 19 & Next.js Full-Stack Architecture',
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

export const MOCK_STUDENT_ORDERS = [
  {
    id: 'ord_101',
    orderNumber: 'KEN-ORD-8812',
    amount: 3999,
    currency: 'INR',
    status: 'COMPLETED',
    createdAt: '2026-03-15T10:00:00Z',
    course: MOCK_COURSES[0],
  },
];

export const MOCK_DOUBTS = [
  {
    id: 'dbt_01',
    title: 'Understanding Idempotency Keys in Stripe Webhooks',
    question: 'How do we guarantee that retried webhook deliveries do not double-credit course access?',
    status: 'RESOLVED',
    createdAt: '2026-03-24T12:00:00Z',
    updatedAt: '2026-03-24T12:30:00Z',
    student: { name: 'Aarav Sharma' },
    course: { title: 'Modern Full-Stack TypeScript & Microservices' },
    messages: [
      {
        id: 'msg_01',
        authorRole: 'STUDENT',
        authorName: 'Aarav Sharma',
        message: 'How do we guarantee that retried webhook deliveries do not double-credit course access?',
        createdAt: '2026-03-24T12:00:00Z',
      },
      {
        id: 'msg_02',
        authorRole: 'MENTOR',
        authorName: 'Dr. Alex Vance',
        message: 'Store each incoming event ID inside a Redis set or DB unique table with a 24-hour TTL.',
        createdAt: '2026-03-24T12:30:00Z',
      },
    ],
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
];

export const MOCK_TICKETS = [
  {
    id: 'tkt_01',
    ticketNumber: 'TKT-2026-0041',
    subject: 'Question on Cloudflare Pages Deployment',
    category: 'TECHNICAL',
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
];

export const MOCK_MAINTENANCE_FLAGS = [
  {
    id: 'flag_forum',
    featureKey: 'COMMUNITY_FORUM',
    isEnabled: false,
    message: 'The community discussion forum is operating normally.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'flag_checkout',
    featureKey: 'PAYMENT_CHECKOUT',
    isEnabled: false,
    message: 'Payment rails and instant checkout are fully operational.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'flag_live',
    featureKey: 'LIVE_CLASSES',
    isEnabled: false,
    message: 'Live interactive masterclass streams are online.',
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'flag_global',
    featureKey: 'PLATFORM_GLOBAL',
    isEnabled: false,
    message: 'Platform systems operational. No scheduled maintenance active.',
    updatedAt: new Date().toISOString(),
  },
];

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
  if (clean === 'zainul7abideen' || clean === 'zainul' || clean === 'zainul7abideen@kenclasses.com') {
    return MOCK_USERS['zainul7abideen@kenclasses.com'];
  }
  if (clean === 'hasnain2004' || clean === 'hasnain' || clean === 'hasnain2004@kenclasses.com') {
    return MOCK_USERS['hasnain2004@kenclasses.com'];
  }
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

// Enterprise In-Memory Rate Limiting Tracker (Edge & Client Anti-Brute-Force Protection)
const EDGE_RATE_LIMITER = {
  loginAttempts: {} as Record<string, { count: number; lockedUntil: number }>,
  registrations: [] as number[],
  otpAttempts: {} as Record<string, { count: number; lockedUntil: number }>,
};

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

  // Authentication: Login with Strict Anti-Brute-Force Rate Limiting
  if (cleanUrl === '/auth/login') {
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }
    const identifier = (payload?.identifier || payload?.email || '').trim().toLowerCase();
    const now = Date.now();
    const clientKey = identifier || 'client_session';
    const loginRec = EDGE_RATE_LIMITER.loginAttempts[clientKey];

    // Check if client is locked out
    if (loginRec && loginRec.lockedUntil > now) {
      const waitSec = Math.ceil((loginRec.lockedUntil - now) / 1000);
      return {
        status: 429,
        data: {
          error: `Security Alert: Too many failed login attempts. Account access is temporarily locked to prevent unauthorized brute-force attacks. Please try again in ${Math.ceil(waitSec / 60)} minutes.`,
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfterSeconds: waitSec,
        },
      };
    }

    const user = findUserByIdentifier(identifier);
    return {
      status: 200,
      data: {
        token: 'auralms_demo_jwt_token_' + Date.now(),
        user,
      },
    };
  }

  // Authentication: Register with Anti-Bot & Spam Rate Limiting
  if (cleanUrl === '/auth/register') {
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }

    const now = Date.now();
    EDGE_RATE_LIMITER.registrations = EDGE_RATE_LIMITER.registrations.filter((t) => now - t < 3600000);
    if (EDGE_RATE_LIMITER.registrations.length >= 5) {
      return {
        status: 429,
        data: {
          error: 'Security Alert: Registration rate limit reached. To prevent automated bot spam, new registrations are temporarily throttled. Please try again in an hour.',
          code: 'REGISTRATION_RATE_LIMIT_EXCEEDED',
          retryAfterSeconds: 3600,
        },
      };
    }
    EDGE_RATE_LIMITER.registrations.push(now);

    const email = (payload?.email || 'newuser@auralms.io').toLowerCase();
    const newUser: MockUser = {
      id: 'user_reg_' + Date.now(),
      email,
      name: payload?.name || 'New Learner',
      role: 'STUDENT',
      mobile: payload?.mobile || '',
      status: 'ACTIVE',
      isEmailVerified: false,
      profile: {
        college: payload?.college || 'Ken Classes Student',
        academicYear: payload?.academicYear || '1st Year',
        academicCourse: payload?.academicCourse || 'Computer Science',
      },
      createdAt: new Date().toISOString(),
    };
    MOCK_USERS[email] = newUser;
    MOCK_USER_LOGS[newUser.id] = [
      {
        id: 'log_reg_' + Date.now(),
        timestamp: new Date().toISOString(),
        eventType: 'ACCOUNT_REGISTERED',
        ipAddress: '152.58.14.88',
        userAgent: 'Web Registration Client',
        details: `Account created for ${newUser.name}. Pending single-use email verification PIN.`,
        status: 'SUCCESS',
      },
    ];

    return {
      status: 201,
      data: {
        message: 'Account created successfully. A verification code has been dispatched to your email.',
        token: 'ken_classes_jwt_token_' + Date.now(),
        user: newUser,
      },
    };
  }

  // Authentication: Verify OTP
  if (cleanUrl === '/auth/verify-otp') {
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }
    const email = (payload?.identifier || payload?.email || 'student@auralms.io').toLowerCase();
    const existing = MOCK_USERS[email];
    const user: MockUser = {
      id: existing?.id || 'user_verified_' + Date.now(),
      email,
      name: existing?.name || payload?.name || email.split('@')[0] || 'Ken Classes Student',
      role: existing?.role || 'STUDENT',
      mobile: existing?.mobile || payload?.mobile || '',
      status: 'ACTIVE',
      isEmailVerified: true,
      profile: existing?.profile || {
        college: 'Ken Classes Academy',
        academicCourse: 'Software Engineering',
      },
      createdAt: existing?.createdAt || new Date().toISOString(),
    };
    MOCK_USERS[email] = user;

    if (!MOCK_USER_LOGS[user.id]) {
      MOCK_USER_LOGS[user.id] = [];
    }
    MOCK_USER_LOGS[user.id].unshift({
      id: 'log_ver_' + Date.now(),
      timestamp: new Date().toISOString(),
      eventType: 'AUTH_VERIFIED',
      ipAddress: '152.58.14.88',
      userAgent: 'Web Client',
      details: 'Email ownership cryptographically verified via single-use 6-digit OTP.',
      status: 'SUCCESS',
    });

    return {
      status: 200,
      data: {
        message: 'Account verified successfully!',
        token: 'ken_classes_jwt_token_' + Date.now(),
        user,
      },
    };
  }

  // Authentication: Forgot Password
  if (cleanUrl === '/auth/forgot-password') {
    return {
      status: 200,
      data: {
        message: 'If an account matches that contact, a confidential password reset code has been dispatched to your email.',
      },
    };
  }

  // Authentication: Reset Password
  if (cleanUrl === '/auth/reset-password') {
    return {
      status: 200,
      data: {
        message: 'Password reset successfully. You can now sign in with your new password.',
      },
    };
  }

  // Authentication: Logout
  if (cleanUrl === '/auth/logout') {
    return { status: 200, data: { message: 'Logged out successfully.' } };
  }

  // Maintenance Status (returns active feature notices if any)
  if (cleanUrl === '/maintenance/status') {
    return { status: 200, data: MOCK_MAINTENANCE_FLAGS.filter((f) => f.isEnabled) };
  }

  // Categories
  if (cleanUrl === '/categories' || cleanUrl === '/courses/categories') {
    return { status: 200, data: MOCK_CATEGORIES };
  }

  // Courses List with dynamic filtering
  if (cleanUrl === '/courses') {
    let list = [...MOCK_COURSES];
    try {
      const searchParams = new URL(url, 'http://localhost').searchParams;
      const cat = searchParams.get('category');
      if (cat && cat !== 'all') {
        list = list.filter((c) => c.category?.id === cat || c.category?.slug === cat);
      }
      const lvl = searchParams.get('level');
      if (lvl && lvl !== 'all') {
        list = list.filter((c) => c.level === lvl);
      }
      const pt = searchParams.get('priceType');
      if (pt === 'free') list = list.filter((c) => c.isFree);
      if (pt === 'paid') list = list.filter((c) => !c.isFree);
      const q = searchParams.get('search')?.toLowerCase().trim();
      if (q) {
        list = list.filter(
          (c) =>
            c.title.toLowerCase().includes(q) ||
            c.subtitle?.toLowerCase().includes(q) ||
            c.instructor?.name?.toLowerCase().includes(q)
        );
      }
    } catch {}
    return { status: 200, data: list };
  }

  // Course Details
  if (cleanUrl.startsWith('/courses/') && !cleanUrl.endsWith('/courses')) {
    const slugOrId = cleanUrl.replace('/courses/', '');
    const found = MOCK_COURSES.find((c) => c.id === slugOrId || c.slug === slugOrId) || MOCK_COURSES[0];
    return { status: 200, data: found };
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
    return { status: 200, data: MOCK_STUDENT_ORDERS };
  }

  // Student Personal Activity & Performance Logs
  if (cleanUrl === '/student/activity-logs') {
    return {
      status: 200,
      data: [
        {
          id: 'act_1',
          timestamp: new Date().toISOString(),
          title: 'Secure Session Login',
          category: 'SECURITY',
          description: 'Single-session token verified from Chrome 122 (Windows 11)',
          status: 'SUCCESS',
        },
        {
          id: 'act_2',
          timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
          title: 'Lesson Completed',
          category: 'LEARNING',
          description: 'Completed Lesson 1.2: Schema-First API Design & Validation',
          status: 'SUCCESS',
        },
        {
          id: 'act_3',
          timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
          title: 'Knowledge Assessment Passed',
          category: 'ASSESSMENT',
          description: 'Completed Module 1 Knowledge Assessment. Score: 100% (Distinction)',
          status: 'SUCCESS',
        },
        {
          id: 'act_4',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          title: 'Live Masterclass Attended',
          category: 'LIVE',
          description: 'Attended Microservices Fault Tolerance live cohort Q&A with Dr. Alex Vance',
          status: 'SUCCESS',
        },
        {
          id: 'act_5',
          timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
          title: 'Course Enrolment Activated',
          category: 'COMMERCE',
          description: 'Enrolled in Modern Full-Stack TypeScript & Microservices (Order KEN-ORD-8812)',
          status: 'SUCCESS',
        },
      ],
    };
  }

  // Checkout: Create Order
  if (cleanUrl === '/payment/create-order') {
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }
    const courseId = payload?.courseId;
    const found = MOCK_COURSES.find((c) => c.id === courseId || c.slug === courseId) || MOCK_COURSES[0];
    const orderId = 'KEN-ORD-' + Math.floor(1000 + Math.random() * 9000);
    return {
      status: 200,
      data: {
        orderId,
        id: orderId,
        amount: found.isFree ? 0 : found.price,
        currency: 'USD',
        isFree: Boolean(found.isFree),
        course: found,
      },
    };
  }

  // Checkout: Verify Payment
  if (cleanUrl === '/payment/verify') {
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }
    const orderId = payload?.orderId || 'KEN-ORD-' + Math.floor(1000 + Math.random() * 9000);
    const isSuccess = payload?.status !== 'FAILED';

    if (isSuccess) {
      // Auto-enrol user
      const course = MOCK_COURSES[0];
      const alreadyEnrolled = MOCK_ENROLMENTS.some((e) => e.courseId === course.id);
      if (!alreadyEnrolled) {
        MOCK_ENROLMENTS.unshift({
          id: 'enr_' + Date.now(),
          courseId: course.id,
          course,
          progress: { completedLessons: 0, totalLessons: 4, percentage: 0 },
          enrolledAt: new Date().toISOString(),
        });
      }
      // Add to student orders
      MOCK_STUDENT_ORDERS.unshift({
        id: orderId,
        orderNumber: orderId,
        amount: course.price,
        currency: 'INR',
        status: 'COMPLETED',
        createdAt: new Date().toISOString(),
        course,
      });
    }

    return {
      status: 200,
      data: {
        success: isSuccess,
        order: {
          id: orderId,
          orderNumber: orderId,
          status: isSuccess ? 'PAID' : 'FAILED',
          amount: payload?.amount || 3999,
          currency: 'INR',
          verifiedAt: new Date().toISOString(),
        },
      },
    };
  }

  // Doubts List & Submission
  if (cleanUrl === '/doubts') {
    if (m === 'POST') {
      let payload = body;
      if (typeof body === 'string') {
        try { payload = JSON.parse(body); } catch {}
      }
      const newDoubt = {
        id: 'dbt_' + Date.now(),
        title: payload?.title || 'Course Architecture Query',
        question: payload?.description || payload?.question || 'Detailed question submitted by student.',
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        student: { name: 'Aarav Sharma' },
        course: { title: 'Modern Full-Stack TypeScript & Microservices' },
        messages: [
          {
            id: 'msg_' + Date.now(),
            authorRole: 'STUDENT',
            authorName: 'Aarav Sharma',
            message: payload?.description || payload?.question || 'Doubt explanation',
            createdAt: new Date().toISOString(),
          },
        ],
        replies: [],
      };
      MOCK_DOUBTS.unshift(newDoubt);
      return { status: 201, data: newDoubt };
    }
    return { status: 200, data: MOCK_DOUBTS };
  }

  // Single Doubt Detail
  if (cleanUrl.startsWith('/doubts/') && !cleanUrl.includes('/messages') && !cleanUrl.includes('/status')) {
    const id = cleanUrl.replace('/doubts/', '');
    const found = MOCK_DOUBTS.find((d) => d.id === id) || MOCK_DOUBTS[0];
    return { status: 200, data: found };
  }

  // Doubt Reply
  if (cleanUrl.startsWith('/doubts/') && cleanUrl.endsWith('/messages')) {
    const doubtId = cleanUrl.split('/')[2];
    const target = MOCK_DOUBTS.find((d) => d.id === doubtId) || MOCK_DOUBTS[0];
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }
    const msgText = payload?.message || 'Thank you for your inquiry. The instructor has confirmed this pattern.';
    const newMsg = {
      id: 'rep_' + Date.now(),
      authorRole: 'MENTOR',
      authorName: 'Dr. Alex Vance',
      message: msgText,
      createdAt: new Date().toISOString(),
    };
    target.messages.push(newMsg);
    target.replies.push(newMsg);
    target.updatedAt = new Date().toISOString();
    return { status: 200, data: newMsg };
  }

  // Doubt Status Update
  if (cleanUrl.startsWith('/doubts/') && cleanUrl.endsWith('/status')) {
    const doubtId = cleanUrl.split('/')[2];
    const target = MOCK_DOUBTS.find((d) => d.id === doubtId) || MOCK_DOUBTS[0];
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }
    target.status = payload?.status || 'RESOLVED';
    target.updatedAt = new Date().toISOString();
    return { status: 200, data: { success: true, status: target.status } };
  }

  // Admin Analytics & Metrics
  if (cleanUrl === '/admin/analytics' || cleanUrl === '/admin/metrics' || cleanUrl === '/admin/overview') {
    return {
      status: 200,
      data: {
        metrics: {
          ...MOCK_ADMIN_METRICS,
          studentsCount: 1340,
          mentorsCount: 32,
          totalCourses: MOCK_COURSES.length,
          publishedCourses: MOCK_COURSES.filter((c) => c.status === 'PUBLISHED').length,
          pendingReports: 1,
        },
        recentAuditLogs: [
          {
            id: 'log_1',
            action: 'AUTH_LOGIN_SUCCESS',
            entityType: 'UserSession',
            entityId: 'usr_001',
            actorEmail: 'admin@auralms.io',
            ipAddress: '127.0.0.1',
            createdAt: new Date().toISOString(),
            actor: { name: 'Ken Classes Administrator', role: 'SUPER_ADMIN' },
          },
          {
            id: 'log_2',
            action: 'ROLE_POLICY_VERIFIED',
            entityType: 'RBACMatrix',
            entityId: 'rbac_002',
            actorEmail: 'SYSTEM',
            ipAddress: '127.0.0.1',
            createdAt: new Date(Date.now() - 3600000).toISOString(),
            actor: { name: 'Security Enforcer', role: 'SYSTEM' },
          },
          {
            id: 'log_3',
            action: 'COURSE_PUBLISHED',
            entityType: 'Course',
            entityId: 'course_fullstack_ts',
            actorEmail: 'admin@auralms.io',
            ipAddress: '127.0.0.1',
            createdAt: new Date(Date.now() - 7200000).toISOString(),
            actor: { name: 'Ken Classes Administrator', role: 'SUPER_ADMIN' },
          },
        ],
      },
    };
  }

  // Feature Maintenance Switches
  if (cleanUrl === '/admin/maintenance') {
    if (m === 'POST') {
      let payload = body;
      if (typeof body === 'string') {
        try { payload = JSON.parse(body); } catch {}
      }
      const targetFlag = MOCK_MAINTENANCE_FLAGS.find((f) => f.featureKey === payload?.featureKey);
      if (targetFlag) {
        targetFlag.isEnabled = payload?.isEnabled ?? !targetFlag.isEnabled;
        if (payload?.message) targetFlag.message = payload.message;
        targetFlag.updatedAt = new Date().toISOString();
      }
      return { status: 200, data: { success: true, flags: MOCK_MAINTENANCE_FLAGS } };
    }
    return { status: 200, data: MOCK_MAINTENANCE_FLAGS };
  }

  // Admin User Management
  if (cleanUrl === '/admin/users') {
    if (m === 'POST') {
      let payload = body;
      if (typeof body === 'string') {
        try { payload = JSON.parse(body); } catch {}
      }
      const newId = 'user_' + Date.now();
      const email = payload?.email || `user_${Date.now()}@kenclasses.com`;
      const newUser: MockUser = {
        id: newId,
        email,
        name: payload?.name || 'New Platform User',
        role: payload?.role || 'STUDENT',
        mobile: payload?.mobile || '',
        status: 'ACTIVE',
        isEmailVerified: true,
        permissions: payload?.permissions || [],
        createdAt: new Date().toISOString(),
      };
      MOCK_USERS[email] = newUser;
      MOCK_USER_LOGS[newId] = [
        {
          id: 'log_' + Date.now(),
          timestamp: new Date().toISOString(),
          eventType: 'USER_CREATED_BY_ADMIN',
          ipAddress: '127.0.0.1',
          userAgent: 'Admin Governance Console',
          details: `User account created with assigned role ${newUser.role}.`,
          status: 'SUCCESS',
        },
      ];
      return { status: 201, data: newUser };
    }
    return {
      status: 200,
      data: Object.values(MOCK_USERS).map((u) => ({
        ...u,
        createdAt: u.createdAt || '2026-01-15T00:00:00Z',
        status: u.status || 'ACTIVE',
        _count: { enrolments: 3 },
      })),
    };
  }

  // Delete User
  if (cleanUrl.startsWith('/admin/users/') && m === 'DELETE') {
    const userId = cleanUrl.replace('/admin/users/', '').split('/')[0];
    const emailKey = Object.keys(MOCK_USERS).find((k) => MOCK_USERS[k].id === userId);
    if (emailKey) {
      delete MOCK_USERS[emailKey];
    }
    delete MOCK_USER_LOGS[userId];
    return { status: 200, data: { success: true, message: 'User permanently removed from registry.' } };
  }

  // User-Specific Logs Dossier
  if (cleanUrl.startsWith('/admin/users/') && cleanUrl.endsWith('/logs')) {
    const userId = cleanUrl.split('/')[3];
    const targetUser = Object.values(MOCK_USERS).find((u) => u.id === userId);
    const logs = MOCK_USER_LOGS[userId] || [
      {
        id: 'log_gen_1',
        timestamp: new Date().toISOString(),
        eventType: 'AUTH_SESSION',
        ipAddress: '152.58.14.88',
        userAgent: 'Chrome 122.0 / Windows 11',
        details: 'User authenticated with verified session token.',
        status: 'SUCCESS',
      },
      {
        id: 'log_gen_2',
        timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
        eventType: 'LESSON_PROGRESS',
        ipAddress: '152.58.14.88',
        userAgent: 'Chrome 122.0 / Windows 11',
        details: 'Completed course module lesson successfully.',
        status: 'SUCCESS',
      },
      {
        id: 'log_gen_3',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        eventType: 'ACCOUNT_STATUS_VERIFIED',
        ipAddress: '127.0.0.1',
        userAgent: 'System Monitor',
        details: 'Account RBAC status verified under current security policy.',
        status: 'SUCCESS',
      },
    ];
    return {
      status: 200,
      data: {
        user: targetUser,
        logs,
        summary: {
          totalLogins: logs.filter((l: any) => l.eventType.includes('AUTH')).length || 1,
          lastActive: logs[0]?.timestamp || new Date().toISOString(),
          accountHealth: targetUser?.status === 'SUSPENDED' ? 'Suspended' : '100% Verified',
          securityViolations: targetUser?.status === 'SUSPENDED' ? 1 : 0,
        },
      },
    };
  }

  // User Permissions (for Maintenance Team Members)
  if (cleanUrl.startsWith('/admin/users/') && cleanUrl.endsWith('/permissions')) {
    const userId = cleanUrl.split('/')[3];
    const targetUser = Object.values(MOCK_USERS).find((u) => u.id === userId);
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }
    if (targetUser) {
      targetUser.permissions = payload?.permissions || [];
    }
    return { status: 200, data: { success: true, permissions: targetUser?.permissions || [] } };
  }

  if (cleanUrl.startsWith('/admin/users/') && cleanUrl.endsWith('/role')) {
    const userId = cleanUrl.split('/')[3];
    const targetUser = Object.values(MOCK_USERS).find((u) => u.id === userId);
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }
    if (targetUser) {
      targetUser.role = payload?.newRole || payload?.role || 'STUDENT';
    }
    return { status: 200, data: { success: true, role: payload?.newRole || payload?.role || 'STUDENT' } };
  }

  if (cleanUrl.startsWith('/admin/users/') && cleanUrl.endsWith('/status')) {
    const userId = cleanUrl.split('/')[3];
    const targetUser = Object.values(MOCK_USERS).find((u) => u.id === userId);
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }
    if (targetUser) {
      targetUser.status = payload?.status || 'ACTIVE';
    }
    return { status: 200, data: { success: true, status: payload?.status || 'ACTIVE' } };
  }

  if (cleanUrl === '/admin/enrolments/manual') {
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }
    const courseId = payload?.courseId;
    const course = MOCK_COURSES.find((c) => c.id === courseId) || MOCK_COURSES[0];
    if (payload?.action === 'GRANT') {
      const already = MOCK_ENROLMENTS.some((e) => e.courseId === course.id);
      if (!already) {
        MOCK_ENROLMENTS.unshift({
          id: 'enr_' + Date.now(),
          courseId: course.id,
          course,
          progress: { completedLessons: 0, totalLessons: 4, percentage: 0 },
          enrolledAt: new Date().toISOString(),
        });
      }
    }
    return { status: 200, data: { success: true, message: 'Enrolment operation executed successfully.' } };
  }

  // Admin Audit Logs
  if (cleanUrl === '/admin/audit-logs') {
    return {
      status: 200,
      data: [
        {
          id: 'log_1',
          action: 'USER_LOGIN',
          actorEmail: 'admin@auralms.io',
          entityType: 'Session',
          entityId: 'sess_admin_91',
          ipAddress: '127.0.0.1',
          createdAt: new Date().toISOString(),
          actor: { name: 'Ken Classes Administrator', role: 'SUPER_ADMIN' },
          detailsJson: JSON.stringify({ method: 'PASSWORD_HASH_VERIFIED', browser: 'Chrome' }),
        },
        {
          id: 'log_2',
          action: 'USER_ROLE_CHANGED',
          actorEmail: 'admin@auralms.io',
          entityType: 'User',
          entityId: 'user_aarav_01',
          ipAddress: '127.0.0.1',
          createdAt: new Date(Date.now() - 3600000).toISOString(),
          actor: { name: 'Ken Classes Administrator', role: 'SUPER_ADMIN' },
          detailsJson: JSON.stringify({ oldRole: 'STUDENT', newRole: 'STUDENT', reason: 'Verified enrolment' }),
        },
        {
          id: 'log_3',
          action: 'MAINTENANCE_FLAG_TOGGLED',
          actorEmail: 'admin@auralms.io',
          entityType: 'MaintenanceFlag',
          entityId: 'COMMUNITY_FORUM',
          ipAddress: '127.0.0.1',
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          actor: { name: 'Ken Classes Administrator', role: 'SUPER_ADMIN' },
          detailsJson: JSON.stringify({ isEnabled: false }),
        },
      ],
    };
  }

  // Curriculum Management (Content Manager & Admin)
  if (cleanUrl === '/content/courses') {
    if (m === 'POST') {
      let payload = body;
      if (typeof body === 'string') {
        try { payload = JSON.parse(body); } catch {}
      }
      const newCourse = {
        id: 'course_' + Date.now(),
        slug: (payload?.title || 'new-course').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        title: payload?.title || 'Untitled Course',
        subtitle: payload?.subtitle || 'Course overview',
        description: payload?.description || 'Curriculum details',
        price: Number(payload?.price) || 0,
        isFree: !payload?.price || Number(payload?.price) === 0,
        level: payload?.level || 'BEGINNER',
        status: 'DRAFT',
        thumbnail: payload?.thumbnail || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80',
        category: MOCK_CATEGORIES.find((cat) => cat.id === payload?.categoryId) || MOCK_CATEGORIES[0],
        instructor: { name: 'Ken Classes Faculty', bio: 'Senior Instructor' },
        enrolledCount: 0,
        rating: 5.0,
        modules: [],
      };
      MOCK_COURSES.push(newCourse);
      return { status: 201, data: newCourse };
    }
    return { status: 200, data: MOCK_COURSES };
  }

  if (cleanUrl.startsWith('/content/courses/') && cleanUrl.endsWith('/status')) {
    const courseId = cleanUrl.split('/')[3];
    const found = MOCK_COURSES.find((c) => c.id === courseId);
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }
    if (found) found.status = payload?.status || 'PUBLISHED';
    return { status: 200, data: { success: true, status: payload?.status || 'PUBLISHED' } };
  }

  if (cleanUrl.startsWith('/content/courses/') && cleanUrl.endsWith('/modules')) {
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }
    const newModule = {
      id: 'mod_' + Date.now(),
      title: payload?.title || 'New Module',
      order: payload?.orderIndex || 1,
      lessons: [],
    };
    return { status: 200, data: { success: true, module: newModule } };
  }

  if (cleanUrl.startsWith('/content/modules/') && cleanUrl.endsWith('/lessons')) {
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }
    const newLesson = {
      id: 'les_' + Date.now(),
      title: payload?.title || 'New Lesson',
      durationMinutes: Math.round((payload?.durationSeconds || 600) / 60),
      videoUrl: payload?.videoUrl || '',
      isPreview: Boolean(payload?.isPreview),
    };
    return { status: 200, data: { success: true, lesson: newLesson } };
  }

  if (cleanUrl.startsWith('/content/lessons/')) {
    return { status: 200, data: { success: true, message: 'Lesson deleted.' } };
  }

  if (cleanUrl.startsWith('/content/modules/') && cleanUrl.endsWith('/quiz')) {
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }
    return {
      status: 200,
      data: {
        success: true,
        quiz: {
          id: 'quiz_' + Date.now(),
          title: payload?.title || 'Module Assessment',
          passThresholdPercentage: payload?.passThresholdPercentage || 70,
          questions: payload?.questions || [],
        },
      },
    };
  }

  // Delete Course
  if (cleanUrl.startsWith('/content/courses/') && m === 'DELETE') {
    const id = cleanUrl.replace('/content/courses/', '').split('/')[0];
    const idx = MOCK_COURSES.findIndex((c) => c.id === id || c.slug === id);
    if (idx !== -1) {
      MOCK_COURSES.splice(idx, 1);
    }
    return { status: 200, data: { success: true, message: 'Course permanently removed.' } };
  }

  // Update Course Attributes
  if (cleanUrl.startsWith('/content/courses/') && (m === 'PUT' || m === 'PATCH') && !cleanUrl.endsWith('/status')) {
    const id = cleanUrl.replace('/content/courses/', '').split('/')[0];
    const found = MOCK_COURSES.find((c) => c.id === id || c.slug === id);
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }
    if (found && payload) {
      if (payload.title) found.title = payload.title;
      if (payload.subtitle) found.subtitle = payload.subtitle;
      if (payload.description) found.description = payload.description;
      if (payload.price !== undefined) {
        found.price = Number(payload.price);
        found.isFree = payload.isFree !== undefined ? Boolean(payload.isFree) : Number(payload.price) === 0;
      }
      if (payload.level) found.level = payload.level;
      if (payload.status) found.status = payload.status;
      if (payload.thumbnail) found.thumbnail = payload.thumbnail;
      if (payload.instructorName) found.instructor = { name: payload.instructorName, bio: found.instructor?.bio || 'Senior Faculty' };
      if (payload.categoryId) {
        const cat = MOCK_CATEGORIES.find((c) => c.id === payload.categoryId || c.slug === payload.categoryId);
        if (cat) found.category = cat;
      }
    }
    return { status: 200, data: { success: true, course: found } };
  }

  if (cleanUrl.startsWith('/content/courses/')) {
    const id = cleanUrl.replace('/content/courses/', '').split('/')[0];
    const found = MOCK_COURSES.find((c) => c.id === id || c.slug === id) || MOCK_COURSES[0];
    return { status: 200, data: found };
  }

  // Finance Orders & Overview
  if (cleanUrl === '/finance/orders' || cleanUrl.startsWith('/finance/orders')) {
    return {
      status: 200,
      data: [
        {
          id: 'ord_9921',
          orderNumber: 'KEN-ORD-9921',
          amount: 3999,
          currency: 'INR',
          status: 'PAID',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          user: { name: 'Aarav Sharma', email: 'aarav@kenclasses.com' },
          course: { title: 'Cloud & DevOps Engineering Mastery: Docker, Kubernetes, AWS & CI/CD' },
        },
        {
          id: 'ord_9918',
          orderNumber: 'KEN-ORD-9918',
          amount: 4499,
          currency: 'INR',
          status: 'PAID',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          user: { name: 'Maya Lin', email: 'maya@kenclasses.com' },
          course: { title: 'Modern Machine Learning & Deep Learning with Python & PyTorch' },
        },
        {
          id: 'ord_9915',
          orderNumber: 'KEN-ORD-9915',
          amount: 2999,
          currency: 'INR',
          status: 'PENDING',
          createdAt: new Date().toISOString(),
          user: { name: 'Dev Patel', email: 'dev@kenclasses.com' },
          course: { title: 'Enterprise React 19 & Next.js Full-Stack Architecture' },
        },
      ],
    };
  }

  if (cleanUrl === '/finance/refund') {
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }
    return {
      status: 200,
      data: {
        success: true,
        refundId: 'ref_' + Date.now(),
        orderId: payload?.orderId,
        message: 'Refund processed successfully. Funds will return in 3-5 banking days.',
      },
    };
  }

  // Finance Dashboard Overview
  if (cleanUrl.startsWith('/finance')) {
    return { status: 200, data: MOCK_FINANCE_DATA };
  }

  // Mentor Stats & Live Classes
  if (cleanUrl === '/mentor/live-classes' && m === 'POST') {
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }
    const newClass = {
      id: 'live_' + Date.now(),
      title: payload?.title || 'Live Masterclass Session',
      mentorName: 'Dr. Alex Vance',
      scheduledAt: payload?.scheduledAt || new Date(Date.now() + 86400000).toISOString(),
      status: 'SCHEDULED',
      meetingUrl: payload?.meetingUrl || 'https://meet.kenclasses.com/cohort',
      courseTitle: 'Modern Full-Stack TypeScript & Microservices',
    };
    MOCK_LIVE_CLASSES.unshift(newClass);
    return { status: 201, data: newClass };
  }

  // Publish Recording to Curriculum
  if (cleanUrl.includes('/publish-recording') && m === 'POST') {
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }
    return {
      status: 201,
      data: {
        message: 'Live lecture successfully published to course curriculum!',
        lesson: {
          id: 'lesson_live_' + Date.now(),
          title: payload?.lessonTitle || 'Recorded Live Masterclass',
          videoUrl: payload?.recordingVideoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          durationMinutes: 60,
        },
      },
    };
  }

  if (cleanUrl.startsWith('/mentor')) {
    return {
      status: 200,
      data: {
        activeStudents: 142,
        totalStudents: 142,
        assignedCourses: MOCK_COURSES,
        courses: MOCK_COURSES,
        assignedCoursesCount: MOCK_COURSES.length,
        pendingDoubts: 1,
        openDoubtsCount: 1,
        resolvedDoubts: 89,
        upcomingLiveClasses: MOCK_LIVE_CLASSES,
      },
    };
  }

  // Moderator Queue
  if (cleanUrl.startsWith('/moderator/reports/') && cleanUrl.endsWith('/action')) {
    return { status: 200, data: { success: true, message: 'Moderation action applied.' } };
  }

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

  // Support Tickets & FAQs
  if (cleanUrl === '/support/faqs') {
    return { status: 200, data: MOCK_FAQS };
  }

  if (cleanUrl === '/support/tickets') {
    if (m === 'POST') {
      let payload = body;
      if (typeof body === 'string') {
        try { payload = JSON.parse(body); } catch {}
      }
      const ticketNum = 'TKT-2026-00' + Math.floor(10 + Math.random() * 90);
      const newTicket = {
        id: 'tkt_' + Date.now(),
        ticketNumber: ticketNum,
        subject: payload?.subject || 'Platform Support Request',
        category: payload?.category || 'GENERAL',
        priority: payload?.priority || 'NORMAL',
        status: 'OPEN',
        createdAt: new Date().toISOString(),
        messages: [
          {
            id: 'msg_' + Date.now(),
            senderRole: 'USER',
            sender: { name: payload?.requesterName || 'Learner' },
            message: payload?.description || payload?.message || '',
            createdAt: new Date().toISOString(),
          },
        ],
      };
      MOCK_TICKETS.unshift(newTicket);
      return { status: 201, data: newTicket };
    }
    return { status: 200, data: MOCK_TICKETS };
  }

  if (cleanUrl.startsWith('/support/tickets/') && cleanUrl.endsWith('/messages')) {
    const tktId = cleanUrl.split('/')[3];
    const target = MOCK_TICKETS.find((t) => t.id === tktId) || MOCK_TICKETS[0];
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }
    const newMsg = {
      id: 'msg_' + Date.now(),
      senderRole: 'USER',
      sender: { name: 'You' },
      message: payload?.message || '',
      createdAt: new Date().toISOString(),
    };
    target.messages.push(newMsg);
    return { status: 200, data: newMsg };
  }

  if (cleanUrl.startsWith('/support/tickets/') && cleanUrl.endsWith('/feedback')) {
    return { status: 200, data: { success: true, message: 'Feedback recorded.' } };
  }

  if (cleanUrl.startsWith('/support/tickets/')) {
    const id = cleanUrl.replace('/support/tickets/', '');
    const found = MOCK_TICKETS.find((t) => t.id === id) || MOCK_TICKETS[0];
    return { status: 200, data: found };
  }

  if (cleanUrl === '/feedback') {
    return { status: 200, data: { success: true, message: 'Thank you for your feedback!' } };
  }

  // Active Sessions & Profile Preferences
  if (cleanUrl === '/auth/sessions') {
    return {
      status: 200,
      data: [
        {
          id: 'sess_1',
          browser: 'Chrome 122 (Current)',
          ipAddress: '127.0.0.1 (This Device)',
          isCurrent: true,
          createdAt: new Date().toISOString(),
        },
        {
          id: 'sess_2',
          browser: 'Mobile Safari / iOS',
          ipAddress: '192.168.1.14',
          isCurrent: false,
          createdAt: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
    };
  }

  if (cleanUrl.startsWith('/auth/sessions/')) {
    return { status: 200, data: { success: true, message: 'Session revoked.' } };
  }

  if (cleanUrl === '/preferences') {
    if (m === 'PUT') {
      return { status: 200, data: { success: true, message: 'Preferences updated.' } };
    }
    return {
      status: 200,
      data: {
        theme: localStorage.getItem('theme') || 'light',
        language: localStorage.getItem('language') || 'en',
      },
    };
  }

  if (cleanUrl === '/auth/profile') {
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }
    const saved = localStorage.getItem('user');
    let currentUser = saved ? JSON.parse(saved) : MOCK_USERS['student@auralms.io'];
    currentUser = {
      ...currentUser,
      name: payload?.name || currentUser.name,
      mobile: payload?.mobile || currentUser.mobile,
      profile: {
        ...currentUser.profile,
        ...payload?.profile,
        bio: payload?.bio || payload?.profile?.bio || currentUser.profile?.bio,
      },
    };
    localStorage.setItem('user', JSON.stringify(currentUser));
    return { status: 200, data: { success: true, user: currentUser } };
  }

  if (cleanUrl === '/auth/change-password') {
    return { status: 200, data: { success: true, message: 'Password updated successfully.' } };
  }

  // Certificate Verification
  if (cleanUrl.includes('/verify-certificate') || cleanUrl.includes('/certificate/verify')) {
    return {
      status: 200,
      data: {
        isValid: true,
        certificateCode: 'KEN-2026-REACT-8842',
        studentName: 'Aarav Sharma',
        courseTitle: 'Modern Full-Stack TypeScript & Microservices',
        issueDate: '2026-03-20',
        grade: 'Distinction (100% Mastery)',
        instructorName: 'Dr. Alex Vance',
        signatureHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
    };
  }

  // Student Classroom View
  if (cleanUrl.startsWith('/student/classroom/')) {
    const courseId = cleanUrl.replace('/student/classroom/', '');
    const found = MOCK_COURSES.find((c) => c.id === courseId || c.slug === courseId) || MOCK_COURSES[0];
    return {
      status: 200,
      data: {
        course: found,
        progressLookup: {
          c1_l1: { isCompleted: true, lastPlaybackPositionSeconds: 120 },
        },
        certificate: null,
      },
    };
  }

  // Lesson Progress
  if (cleanUrl.includes('/progress')) {
    let payload = body;
    if (typeof body === 'string') {
      try { payload = JSON.parse(body); } catch {}
    }
    return {
      status: 200,
      data: {
        success: true,
        progress: {
          isCompleted: Boolean(payload?.isCompleted),
          lastPlaybackPositionSeconds: payload?.playbackPositionSeconds || 0,
          updatedAt: new Date().toISOString(),
        },
      },
    };
  }

  // Course Forum Topics
  if (cleanUrl.includes('/forum/courses/')) {
    if (m === 'POST') {
      let payload = body;
      if (typeof body === 'string') {
        try { payload = JSON.parse(body); } catch {}
      }
      return {
        status: 201,
        data: {
          id: 'topic_' + Date.now(),
          title: payload?.title || 'New Discussion Thread',
          content: payload?.content || '',
          createdAt: new Date().toISOString(),
          user: { name: 'Aarav Sharma' },
          repliesCount: 0,
        },
      };
    }
    return {
      status: 200,
      data: [
        {
          id: 'topic_01',
          title: 'Best practices for multi-tenant isolation in Prisma?',
          content: 'When deploying shared-database schemas with row-level tenant keys, what are recommended indexing strategies?',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          user: { name: 'Aarav Sharma' },
          repliesCount: 3,
        },
        {
          id: 'topic_02',
          title: 'Setting up Cloudflare Pages Functions with custom domain',
          content: 'Here is how to configure DNS records with 0ms downtime during deployment transitions.',
          createdAt: new Date(Date.now() - 172800000).toISOString(),
          user: { name: 'Dr. Alex Vance' },
          repliesCount: 5,
        },
      ],
    };
  }

  // Quizzes & Submissions
  if (cleanUrl.includes('/quizzes') && cleanUrl.endsWith('/submit')) {
    return {
      status: 200,
      data: {
        isPassed: true,
        passed: true,
        score: 100,
        passThresholdPercentage: 70,
        message: 'Assessment completed with distinction!',
      },
    };
  }

  if (cleanUrl.startsWith('/student/quizzes/')) {
    const modId = cleanUrl.replace('/student/quizzes/', '');
    return {
      status: 200,
      data: {
        id: 'quiz_' + modId,
        moduleId: modId,
        title: 'Module Knowledge Assessment',
        passThresholdPercentage: 70,
        questions: [
          {
            id: 'q_01',
            questionText: 'Which property ensures idempotent webhook processing?',
            options: [
              'Timestamp only',
              'Unique Event ID / Idempotency Key',
              'Random nonce without persistence',
              'Client IP address',
            ],
            correctOptionIndex: 1,
          },
          {
            id: 'q_02',
            questionText: 'What HTTP status code represents unauthenticated requests?',
            options: ['400 Bad Request', '403 Forbidden', '401 Unauthorized', '405 Method Not Allowed'],
            correctOptionIndex: 2,
          },
        ],
      },
    };
  }

  // Claim Certificate
  if (cleanUrl.startsWith('/student/certificates/')) {
    const courseId = cleanUrl.replace('/student/certificates/', '');
    const found = MOCK_COURSES.find((c) => c.id === courseId || c.slug === courseId) || MOCK_COURSES[0];
    return {
      status: 200,
      data: {
        id: 'cert_' + Date.now(),
        certificateCode: 'KEN-2026-CERT-' + Math.floor(1000 + Math.random() * 9000),
        courseTitle: found.title,
        studentName: 'Aarav Sharma',
        issueDate: new Date().toISOString().split('T')[0],
        grade: 'Distinction (100% Mastery)',
        instructorName: found.instructor?.name || 'Dr. Alex Vance',
        signatureHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
      },
    };
  }

  // Webhook Simulator
  if (cleanUrl === '/payment/simulate-webhook') {
    return {
      status: 200,
      data: {
        received: true,
        event: body?.event || 'payment.captured',
        orderId: body?.orderId || 'ord_9921',
        idempotencyVerified: true,
        timestamp: new Date().toISOString(),
        status: 'SUCCESS',
        message: 'Webhook processed idempotently. Enrolment verified and activated.',
      },
    };
  }

  // Generic fallback: empty array for lists or success object
  if (cleanUrl.includes('list') || cleanUrl.includes('all')) {
    return { status: 200, data: [] };
  }
  return { status: 200, data: { success: true } };
}
