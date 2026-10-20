# Product Requirements Document (PRD v2.0)
## AuraLMS — Enterprise Online Learning & Course Management Platform

**Document Version:** 2.0 (Production Blueprint Edition)  
**Date:** October 2026  
**System Classification:** Commercial Course Commerce, Multi-Role Learning Delivery & Academic Governance  

---

## 1. Executive Summary & Vision

AuraLMS is a production-grade, enterprise-scale Online Learning & Course Management Platform engineered with a **strictly decoupled full-stack architecture** (Node.js + Express 5 + TypeScript backend, Prisma ORM with SQLite zero-config persistence, and React 19 + Vite + Tailwind CSS frontend).

The platform addresses the full lifecycle of modern digital education:
1. **Public Discovery & E-Commerce:** High-performance course catalogue with instant search, discipline filters, server-side tamper-proof order generation, and idempotent payment reconciliation.
2. **Pedagogical Delivery:** Modular video and text curriculum, persistent timestamp resume, modular assessments with automated grading, and cryptographically verifiable digital certificates.
3. **Multi-Role RBAC Governance:** Strict least-privilege security model separating six distinct operational personas (`STUDENT`, `MENTOR`, `CONTENT_MANAGER`, `FINANCE_SUPPORT`, `MODERATOR`, `SUPER_ADMIN`).
4. **Community & Mentorship:** One-on-one mentor doubt resolution with attachments, scheduled live masterclasses, and student discussion forums with automated report triage.
5. **System Resiliency & Compliance:** 2-hour session inactivity timeout, immutable audit logging, feature-level maintenance banners, strict dual-theme accessibility (`Light` / `Dark`), and full bilingual internationalization (`English` / `Hindi`).

---

## 2. Multi-Role RBAC Matrix

The platform enforces Role-Based Access Control on every API route via the `authenticate` and `requireRoles(...)` middleware pipeline.

| Functional Domain | Student | Mentor | Content Manager | Finance Support | Community Moderator | Super Admin |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Browse Catalogue & Free Previews** | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Purchase & Enrol in Courses** | ✅ | — | — | — | — | Manual Grant |
| **Classroom Video & Lesson Access** | Enrolled Only | Assigned Only | Studio View | — | — | Universal |
| **Lesson Completion & Progress Tracking** | Self | — | — | — | — | Read-Only |
| **Submit Assessments & Quizzes** | Enrolled Only | Preview | Authoring | — | — | Universal |
| **Claim & Verify Digital Certificates** | Enrolled Only | — | — | — | — | Public Registry |
| **Submit Mentor Doubts** | Enrolled Only | — | — | — | — | — |
| **Resolve & Reply to Doubts** | — | Assigned Only | — | — | — | Universal |
| **Schedule & Host Live Classes** | View / Join | Schedule / Host | — | — | — | Universal |
| **Course Lifecycle (Draft/Review/Publish)**| — | — | Author & Edit | — | — | Publish & Archive |
| **Financial Summary & Revenue Tracking** | Self Orders | — | — | Full Access | — | Full Analytics |
| **Issue Authorized Refunds** | — | — | — | Process & Revoke| — | Process & Revoke |
| **Forum Flagged Content Triage** | Report Post | — | — | — | Moderate / Remove| Full Access |
| **User Role & Suspension Governance** | — | — | — | — | — | Full Control |
| **Feature Maintenance Switches** | — | — | — | — | — | Full Control |
| **Immutable Security Audit Log** | — | — | — | — | Mod Actions | Universal Trail |

---

## 3. Product Specifications by Section

### Section 1: Authentication & Account Security
- **AUTH-01 (Registration):** Requires Full Name, Email, Password (8+ characters, bcrypt 10 rounds), and optional academic metadata (College/University, Academic Year, Degree Course).
- **AUTH-02 (Contact Verification):** Generates single-use 6-digit numeric verification code (`VerificationChallenge` table) with 15-minute expiration.
- **AUTH-03 (Login Identification):** Allows authentication via verified email, phone number, or username.
- **AUTH-04 (Role-Based Redirection):** Routes user directly to designated role dashboard upon successful login (`/student/dashboard`, `/mentor/dashboard`, `/content/courses`, `/finance/dashboard`, `/moderator/queue`, `/admin/dashboard`).
- **AUTH-05 (Session Inactivity Timeout):** Sessions record `lastActiveAt`. Requests where elapsed time exceeds 120 minutes are rejected with `401 Unauthorized` and session is revoked (`isRevoked: true`).
- **AUTH-06 (Brute-Force Rate Limiting):** IP-based rate limiting (100 requests per 15 minutes) applied to `/api/auth/login`, `/api/auth/register`, and `/api/auth/forgot-password`.
- **AUTH-07 (Account Suspension):** Super Admin can suspend accounts with mandatory reason code (`SUSPENDED`). Suspended users are immediately denied access and active sessions are revoked.

### Section 2: Student Dashboard & Discovery
- **STU-01 (Course Discovery):** Public catalogue with instant search, Category filtering (`Web Development`, `Data Science`, `Cloud Computing`, etc.), Difficulty level (`Beginner`, `Intermediate`, `Advanced`), and Pricing (`Free`, `Paid`).
- **STU-02 (Preview Protection):** Non-enrolled learners see public syllabus and lessons flagged with `isPreview: true`. Unenrolled requests for protected lesson video streams return `403 Forbidden`.
- **STU-03 (Continue Learning Hub):** Student dashboard displays overall completion percentage, lessons mastered count, and 1-click continuation into last active lesson.
- **STU-04 (Progress Persist):** Video player automatically reports and resumes `lastPlaybackPositionSeconds`.

### Section 3: Course & Curriculum Management
- **CRS-01 (Authoring Studio):** Content Managers create courses with title, slug, description, category, level, price (USD or Free), duration hours, and thumbnail.
- **CRS-02 (Modular Hierarchy):** 3-tier structure: Course ➔ Course Modules (ordered) ➔ Lessons (video URL, duration, markdown notes, preview flag).
- **CRS-03 (Assessment Builder):** Multiple-choice quizzes attached to modules with pass threshold (default 70%), question weights, and instant grading feedback.
- **CRS-04 (Publishing Workflow):** States: `DRAFT` ➔ `IN_REVIEW` ➔ `PUBLISHED` ➔ `ARCHIVED`. Only `PUBLISHED` courses appear in public catalogue.

### Section 4: Doubt Resolution & Live Classes
- **COM-01 (Targeted Doubt Tickets):** Learners open doubts linked to specific course and lesson.
- **COM-02 (Attachment Handling):** Supports file uploads (PDF, PNG, JPG) up to 10MB stored securely.
- **COM-03 (Conversation Threading):** Real-time message exchange between student and assigned mentor with status updates (`OPEN` ➔ `IN_PROGRESS` ➔ `RESOLVED`).
- **COM-04 (Live Masterclasses):** Mentors schedule live streaming rooms (Jitsi / Meet / Zoom); enrolled students receive authenticated join links on their dashboard.

### Section 5: Payments, Orders & Financial Reconciliation
- **PAY-01 (Server-Side Anti-Tamper Checkout):** Course prices are resolved strictly from authoritative database records. Client-side price payloads are rejected.
- **PAY-02 (Order State Machine):** `PENDING` ➔ `PAID` / `FAILED` / `REFUNDED`. Enrolment activation requires server-confirmed payment transaction signature.
- **PAY-03 (Idempotent Activation):** Duplicate webhook notifications or replay attempts do not generate duplicate enrolments or transactions.
- **PAY-04 (Authorized Refund Processing):** Finance staff process refunds with mandatory reason; system automatically revokes course access and updates financial ledgers.

### Section 6: Operations, Moderation & Audit
- **ADM-01 (Operational Analytics):** Real-time analytics tracking Gross Revenue, Active Students, Published Courses, and Pending Moderation Reports.
- **ADM-02 (Maintenance Switches):** Dynamic flags (`PLATFORM_GLOBAL`, `PAYMENT_CHECKOUT`, `COMMUNITY_FORUM`, `LIVE_CLASSES`) display friendly user alerts without bringing down the server.
- **ADM-03 (Immutable Audit Trail):** Every administrative role change, suspension, refund, manual enrolment, or maintenance toggle records actor ID, action, target entity, JSON details, IP address, and timestamp.
- **ADM-04 (Content Moderation Queue):** Flagged discussions are held for moderator review with actions to `DISMISS`, `HIDE_CONTENT`, or `REMOVE_CONTENT`.

### Section 7: Preferences, Feedback & Support (Section 15)
- **PREF-01 to 04 (Strict 2-Theme Design):** Exactly two supported themes: `light` and `dark`. No automatic or system mode. Default is Light. Persists to `localStorage` and account profile. Changes apply instantly without page reload.
- **LANG-01 to 06 (Strict 2-Language Design):** Exactly two supported languages: English (`en`) and Hindi (`hi` / हिन्दी). Persists to `localStorage` and account profile. Updates `document.documentElement.lang` attribute for screen readers. Changes apply immediately without losing form progress.
- **FDBK-01 to 05 (Platform Feedback):** Categories (`GENERAL`, `SUGGESTION`, `BUG_REPORT`, `COURSE_FEEDBACK`), 1-5 star ratings, mandatory consent, generating reference ID `FDBK-2026-XXXX`. Staff triage workflow with internal notes hidden from students.
- **SUP-01 to 06 (Help & Support Centre):** Publicly accessible `/help` page. Searchable bilingual FAQs in English and Hindi. Support ticket generation (`SUP-2026-XXXX`). Threaded conversation replies. Post-resolution satisfaction ratings (1-5 stars). Dedicated account recovery guidance for locked-out users.

---

## 4. UI/UX Visual Specification & Signature Designs

The visual identity follows modern web standards and incorporates signature interactive patterns inspired by **CodeByGaurav's "Secure Vault Access"**:
1. **Ambient Pointer Light (`PointerLight`):** A soft, blurred radial gradient light tracking user cursor interactions across auth, dashboard, and registry screens.
2. **Glassmorphic Card Elevation:** Frosted background translucency (`backdrop-blur-xl`, `border-white/10` or `border-slate-200/80`), rounded-3xl corners, and subtle inset shadows.
3. **Circular Verification Progress Spinner (`VerificationSpinner`):** Radial SVG countdown ring with dynamic numeric percentage counter (`0%` ➔ `96%` ➔ `100%`) displaying *"Verifying... Securely checking your credentials"*.
4. **Boxed 6-Digit PIN Inputs (`OtpInputBoxes`):** Auto-advancing individual digit boxes with clipboard paste detection and backspace traversal.
5. **Interactive Dashboard Charts:** SVG-rendered area curves for revenue velocity, radial mastery gauges for courses, and weekly activity bar meters.
