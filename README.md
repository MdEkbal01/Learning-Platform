# AuraLMS — Enterprise Online Learning & Course Management Platform

> **Production-Grade Implementation of the Product Requirements Document (PRD v1.0 — 20 October 2026)**  
> Built with **Node.js, Express, TypeScript, Prisma ORM (SQLite zero-config), React 19, Vite, and Tailwind CSS**.

---

## 🌟 Quick Start Guide

### Prerequisites
- **Node.js**: v18+ (verified on v24.19)
- **npm**: v9+ (verified on v11.17)
- **Zero database setup required**: Uses embedded SQLite with Prisma ORM.

### 1. Install & Seed
From the project root (`D:\Projects\LMS`):
```bash
# Seed database with courses, modules, lessons, quizzes, and demo accounts
npm run seed
```

### 2. Run Entire Platform (Backend + Frontend)
```bash
npm run dev
```
- **Web Application**: [http://localhost:3000](http://localhost:3000)
- **Backend REST API**: [http://localhost:5000/api](http://localhost:5000/api)
- **Health Check**: [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 👥 Demo Accounts & Role Matrix

The platform includes a built-in **Quick Role Switcher banner** in the top navigation bar allowing instant 1-click persona switching without retyping credentials.

| Role | Demo Email | Password | Primary Capabilities |
| :--- | :--- | :--- | :--- |
| **👑 Super Admin** | `admin@lms.local` | `Password123!` | System KPI analytics, user governance, RBAC role updates, account suspension with reason, manual course entitlement grant/revoke, feature maintenance switches, audit logs. |
| **👨‍🏫 Mentor / Lecturer** | `mentor@lms.local` | `Password123!` | Assigned courses roster, student doubt resolution queue, reply with PDF/image attachments, schedule/host live classes. |
| **✍️ Content Manager** | `content@lms.local` | `Password123!` | Curriculum Studio, course creation, module builder, lesson authoring (video, markdown, preview flags), module quiz builder, Draft → Review → Published workflow. |
| **💳 Finance & Support** | `finance@lms.local` | `Password123!` | Financial summary, gross revenue tracking, order reconciliation, authorized refund processing with automatic access revocation (PRD PAY-06). |
| **🛡️ Community Moderator** | `moderator@lms.local` | `Password123!` | Flagged forum and chat moderation queue, review report reasons, dismiss or hide/remove inappropriate content, moderation audit logs. |
| **🎓 Enrolled Student** | `student@lms.local` | `Password123!` | Course catalogue, continue learning, video player with playback resume, module quiz assessments, doubt submissions with attachments, course discussions, verifiable certificates, tax invoices. |
| **🎓 Student Learner 2** | `jane.student@lms.local` | `Password123!` | Secondary learner account for testing collaborative forums, multi-student doubt queues, and peer discussions. |

---

## 🏗️ System Architecture

```mermaid
flowchart TD
    Client["Vite + React 19 Frontend (Port 3000)"]
    API["Express 5 + TypeScript API Gateway (Port 5000)"]
    DB[(SQLite + Prisma ORM)]
    Storage["Secure Uploads (/uploads/secure)"]

    Client -->|REST & Cookies| API
    API -->|Auth / Session (2h Timeout)| DB
    API -->|RBAC & Entitlement Checks| DB
    API -->|Server-Side Anti-Tamper Checkout| DB
    API -->|Audit Trail Events| DB
    API -->|Protected Asset Streaming| Storage
```

### Key Technical Highlights
- **Least-Privilege RBAC**: Middleware strictly validates `req.user.role` on every protected route.
- **2-Hour Inactivity Auto-Timeout (PRD AUTH-07)**: Sessions track `lastActiveAt`; inactive sessions beyond 120 minutes are revoked automatically.
- **Anti-Tamper Order Creation (PRD PAY-01 & PAY-02)**: Orders are generated server-side using authoritative course database prices. Webhooks and verification endpoints are idempotent.
- **Secure File Storage (PRD Section 8)**: PDFs and images are stored outside web roots with strict MIME whitelist validation (`image/png`, `image/jpeg`, `application/pdf`) and max 10MB limits.
- **Feature-Level Maintenance Switches (PRD ADM-04)**: Global or feature-specific switches (`PLATFORM_GLOBAL`, `PAYMENT_CHECKOUT`, `COMMUNITY_FORUM`, `LIVE_CLASSES`) display user-friendly notices without shutting down the entire platform.
- **Accredited Certificate Registry (PRD LRN-05)**: Unlocks upon 100% lesson completion and passing module quizzes, verifiable by any employer at `/verify-certificate/:code`.

---

## 📋 PRD Requirements Compliance Matrix

### 1. Authentication & Account Security
| Requirement ID | Specification | Status | Implementation Details |
| :--- | :--- | :---: | :--- |
| **AUTH-01** | Registration with name, mobile, email, password, and academic fields (college, year, degree). | ✅ **Met** | `POST /api/auth/register` validates and stores academic profile fields. |
| **AUTH-02** | Contact verification with single-use expiring OTP. | ✅ **Met** | `VerificationChallenge` table with 15-minute expiration and single-use invalidation (`POST /api/auth/verify-otp`). |
| **AUTH-03** | Password length & strength checking, bcrypt hashing. | ✅ **Met** | Enforced 8+ character rule, bcrypt 10 salt rounds. Plaintext is never stored. |
| **AUTH-04** | Login with verified email, mobile, or username. | ✅ **Met** | `POST /api/auth/login` supports lookup by email, mobile, or username. |
| **AUTH-05** | Direct navigation to role dashboard upon sign-in. | ✅ **Met** | `Login.tsx` navigates directly to role-specific dashboard. |
| **AUTH-06** | Forgot-password flow with anti-enumeration. | ✅ **Met** | `POST /api/auth/forgot-password` and `POST /api/auth/reset-password` invalidate existing sessions upon reset. |
| **AUTH-07** | Expire sessions after 2 hours of inactivity. | ✅ **Met** | `auth.middleware.ts` enforces 120-minute inactivity limit based on `lastActiveAt`. |
| **AUTH-08** | Brute-force & rate-limiting protection. | ✅ **Met** | `express-rate-limit` protects auth endpoints (100 req / 15 min). |
| **AUTH-09** | Profile updates & academic metadata editing. | ✅ **Met** | `PUT /api/auth/profile` updates name, college, year, course, and bio. |
| **AUTH-10** | Account status & suspension controls. | ✅ **Met** | Super Admin can suspend accounts with mandatory reason code (`PATCH /api/admin/users/:id/status`). |

### 2. Student Dashboard & Course Catalogue
| Requirement ID | Specification | Status | Implementation Details |
| :--- | :--- | :---: | :--- |
| **STU-01** | Searchable, filterable course catalogue. | ✅ **Met** | Filter by Category, Level (Beginner/Intermediate/Advanced), Price (Free/Paid), and text search. |
| **STU-02** | Public vs account-only resource protection. | ✅ **Met** | Non-enrolled users receive sanitized previews; protected lecture URLs and attachments are redacted on server. |
| **STU-03** | Enrolled courses & continue-learning entry point. | ✅ **Met** | Student Dashboard displays completion %, completed vs total lessons, and continue learning action. |
| **STU-04** | Classroom player with recorded lectures and notes. | ✅ **Met** | `Classroom.tsx` includes responsive video player, markdown notes, and resource downloads. |
| **STU-05** | Playback position tracking & resume capability. | ✅ **Met** | Periodically persists `lastPlaybackPositionSeconds` to database and resumes video timestamp. |
| **STU-06** | Announcements, class notifications & doubt alerts. | ✅ **Met** | `Notification` entity generates in-app notifications for payments, doubts, and live classes. |

### 3. Course & Content Management
| Requirement ID | Specification | Status | Implementation Details |
| :--- | :--- | :---: | :--- |
| **CRS-01** | Create, edit, publish, unpublish, archive courses. | ✅ **Met** | Content Studio supports full course lifecycle: `DRAFT` → `IN_REVIEW` → `PUBLISHED` → `ARCHIVED`. |
| **CRS-02** | Pricing, syllabus, modules, access duration. | ✅ **Met** | Configurable lifetime vs. expiry duration, price in USD or 100% Free toggle. |
| **CRS-03** | Upload and organize lectures, notes, and PDFs. | ✅ **Met** | Secure upload middleware with file type and 10MB size validation. |
| **CRS-04** | Draft/Review/Publish workflow. | ✅ **Met** | Students only see `PUBLISHED` courses; Content Managers and Admins manage draft and review states. |
| **CRS-05** | Manual course access grants with reason. | ✅ **Met** | `POST /api/admin/enrolments/manual` grants/revokes access with mandatory audit reason. |

### 4. Doubts, Messaging & Community
| Requirement ID | Specification | Status | Implementation Details |
| :--- | :--- | :---: | :--- |
| **COM-01** | Doubt ticket submission to assigned mentor. | ✅ **Met** | Students submit doubts linked to specific course and lesson. |
| **COM-02** | PDF and image attachments support. | ✅ **Met** | Multer disk storage handles PNG, JPEG, and PDF attachments. |
| **COM-03** | Multi-message conversation thread & status tracking. | ✅ **Met** | Threaded replies, status transitions (`OPEN` → `IN_PROGRESS` → `RESOLVED`). |
| **COM-04** | Discussion forum scoped to course. | ✅ **Met** | Enrolled community forum topics, replies, and pinned announcements. |
| **COM-06** | Moderation queue and content reporting. | ✅ **Met** | Students can report forum posts; Moderators inspect queue and dismiss or hide/delete content. |

### 5. Payments, Orders & Enrolments
| Requirement ID | Specification | Status | Implementation Details |
| :--- | :--- | :---: | :--- |
| **PAY-01** | Server-side order creation with trusted pricing. | ✅ **Met** | `POST /api/payment/create-order` creates order from authoritative course pricing. |
| **PAY-02** | Server-side signature & transaction verification. | ✅ **Met** | Client redirect alone never grants access; `POST /api/payment/verify` requires server confirmation. |
| **PAY-03** | Order state machine (`PENDING`, `PAID`, `FAILED`, `REFUNDED`). | ✅ **Met** | Complete state machine enforced in `Order` and `PaymentTransaction`. |
| **PAY-04** | Idempotent course access activation. | ✅ **Met** | Duplicate callbacks or repeated verifications do not create duplicate enrolments. |
| **PAY-05** | Student transaction history and receipt/invoice. | ✅ **Met** | Student Orders page includes printable official tax receipts with order ID and payment details. |
| **PAY-06** | Authorized refund processing & access revocation. | ✅ **Met** | Finance portal processes refunds with mandatory reason, automatically revoking enrolment. |
| **PAY-07** | Webhook simulator & idempotency test harness. | ✅ **Met** | `/admin/simulator` allows testing `payment.captured`, duplicate callbacks, and declined charges. |

### 6. Admin, Operations & Audit
| Requirement ID | Specification | Status | Implementation Details |
| :--- | :--- | :---: | :--- |
| **ADM-01** | Admin dashboard analytics & KPI overview. | ✅ **Met** | Gross revenue, student counts, published courses, pending doubts, and reports. |
| **ADM-02** | Granular user roles & permissions management. | ✅ **Met** | Super Admin can reassign any user between all 6 platform roles. |
| **ADM-03** | Account suspension with mandatory reason code. | ✅ **Met** | Suspended users are locked out and their active sessions are revoked immediately. |
| **ADM-04** | Feature-level maintenance mode switches. | ✅ **Met** | Toggle maintenance for checkout, forums, live classes, or global platform with custom banners. |
| **ADM-05** | Protected audit event trail. | ✅ **Met** | `AuditEvent` table captures actor, action, entity, details JSON, IP address, and timestamp. |

### 7. Progress, Assessments & Live Classes
| Requirement ID | Specification | Status | Implementation Details |
| :--- | :--- | :---: | :--- |
| **LRN-01** | Lesson completion tracking & position saving. | ✅ **Met** | `LessonProgress` records completion status and last playback position. |
| **LRN-02** | Course completion percentage calculation. | ✅ **Met** | Real-time computation displayed on dashboard and classroom header. |
| **LRN-03** | Interactive module quizzes with instant scoring. | ✅ **Met** | Multiple choice assessment, automatic grading, passing score validation (70%), and explanations. |
| **LRN-04** | Live-class schedules & authenticated join links. | ✅ **Met** | Mentors schedule live classes; enrolled students access room links. |
| **LRN-05** | Verifiable completion certificates. | ✅ **Met** | Issued upon 100% lesson and quiz completion, publicly verifiable via `/verify-certificate/:code`. |

---

## 🛠️ Testing Verification Checklist

- [x] Run `npm run seed` to verify all tables and demo accounts populate successfully.
- [x] Run `npm run build` in both `backend` and `frontend` to verify 0 compilation errors.
- [x] Test `student@lms.local` login, browse catalogue, view course details, and open classroom.
- [x] Test video playback and toggle "Mark Lesson Complete" to verify progress updates.
- [x] Test taking a module quiz and verifying automatic scoring and feedback.
- [x] Test submitting a doubt ticket with an attached file.
- [x] Test `mentor@lms.local` login, open assigned doubts queue, reply to student, and resolve doubt.
- [x] Test `content@lms.local` login, navigate to Curriculum Studio, add a module and lesson.
- [x] Test `finance@lms.local` login, view order revenue, and process an authorized refund with reason.
- [x] Test `moderator@lms.local` login, inspect flagged discussion in queue, and apply moderation action.
- [x] Test `admin@lms.local` login, view KPI analytics, audit logs, and toggle maintenance mode.
- [x] Test `/verify-certificate` public validation endpoint.
- [x] Test 2-hour inactivity session invalidation logic.
