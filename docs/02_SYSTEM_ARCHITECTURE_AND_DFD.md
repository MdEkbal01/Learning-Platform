# System Architecture & Data Flow Diagrams (DFD)
## AuraLMS — Architecture Blueprint & Process Decompositions

---

## 1. System Architecture Overview

AuraLMS employs a **modern, decoupled full-stack architecture** with a strict separation between client presentation, API gateway governance, persistent relational storage, and secure disk asset storage.

```mermaid
flowchart TD
    subgraph ClientLayer ["Client Layer (Port 3000)"]
        Browser["React 19 + Vite SPA"]
        Contexts["Auth Context & ThemeLanguage Context"]
        Browser --- Contexts
    end

    subgraph APILayer ["API Gateway & Controller Pipeline (Port 5000)"]
        Router["Express 5 Router Gateway"]
        AuthMW["Auth & 120-min Inactivity Middleware"]
        RbacMW["Least-Privilege RBAC Middleware"]
        MaintMW["Feature-Level Maintenance Middleware"]
        Controllers["Controllers (13 Domains)"]
        
        Router --> AuthMW --> RbacMW --> MaintMW --> Controllers
    end

    subgraph StorageLayer ["Persistence & Storage Layer"]
        Prisma["Prisma ORM v6.19.3"]
        DB[(Embedded SQLite: dev.db)]
        Uploads["Secure Disk Storage (/uploads/secure)"]
        
        Controllers --> Prisma --> DB
        Controllers --> Uploads
    end

    Browser <-->|JSON REST over HTTP & JWT Cookies| Router
```

---

## 2. DFD Level 0 — Context Diagram

The Level 0 context diagram models AuraLMS as a single central system interacting with external entities (Users across 6 roles, Payment Webhook Gateways, and Employer Certificate Verifiers).

```mermaid
flowchart LR
    Student(["Student Learner"])
    Mentor(["Faculty Mentor"])
    ContentMgr(["Content Manager"])
    Finance(["Finance Staff"])
    Moderator(["Community Moderator"])
    Admin(["Super Administrator"])
    Verifier(["Employer / Credential Verifier"])
    Gateway(["Payment Gateway / Webhook"])

    LMS[["AuraLMS Core Platform"]]

    Student <-->|Enrolments, Lessons, Quizzes, Doubts, Receipts| LMS
    Mentor <-->|Curriculum Roster, Doubt Resolution, Live Classes| LMS
    ContentMgr <-->|Course Studio, Modules, Video Lessons, Quizzes| LMS
    Finance <-->|Reconciliation, Refunds, Revenue Analytics| LMS
    Moderator <-->|Flagged Discussions, Triage Actions| LMS
    Admin <-->|User Roles, Suspensions, Maintenance, Audit Trail| LMS
    Verifier <-->|Credential Code & Verification Status| LMS
    Gateway <-->|Checkout Orders, Idempotent Webhook Callbacks| LMS
```

---

## 3. DFD Level 1 — System Functional Decomposition

Level 1 decomposes AuraLMS into its primary functional subsystems:

```mermaid
flowchart TD
    User(["Client / User"])

    subgraph CorePlatform ["AuraLMS Functional Subsystems"]
        P1["1.0 Authentication & Session Governance"]
        P2["2.0 Catalogue & Curriculum Delivery"]
        P3["3.0 Commercial Orders & Enrolments"]
        P4["4.0 Doubt Resolution & Moderation"]
        P5["5.0 Administration, Maintenance & Audit"]
        P6["6.0 Preferences, Feedback & Support"]
    end

    subgraph DataStores ["Data Stores"]
        DS_User[("D1: Users & Profiles")]
        DS_Courses[("D2: Courses & Modules")]
        DS_Orders[("D3: Orders & Enrolments")]
        DS_Doubts[("D4: Doubts & Forums")]
        DS_Audit[("D5: Audit Events")]
        DS_Support[("D6: FAQs, Tickets & Feedback")]
    end

    User -->|Credentials, OTP| P1
    P1 <--> DS_User
    P1 -->|Audit Log| DS_Audit

    User -->|Curriculum Request, Video Progress, Quiz| P2
    P2 <--> DS_Courses
    P2 <--> DS_Orders

    User -->|Checkout, Payment Signature, Refund| P3
    P3 <--> DS_Orders
    P3 <--> DS_Courses
    P3 -->|Commercial Audit| DS_Audit

    User -->|Doubt Ticket, Message, Report| P4
    P4 <--> DS_Doubts
    P4 -->|Moderation Audit| DS_Audit

    User -->|Role Change, Maintenance Toggle| P5
    P5 <--> DS_User
    P5 <--> DS_Audit

    User -->|Theme, Language, Ticket, Feedback| P6
    P6 <--> DS_User
    P6 <--> DS_Support
```

---

## 4. DFD Level 2 — Detailed Subsystem Process Flows

### 4.1 Process 1.0: Registration & Expiring OTP Verification

```mermaid
sequenceDiagram
    autonumber
    actor Learner as Student Learner
    participant Client as React 19 Frontend
    participant AuthAPI as Auth Controller (/api/auth)
    participant DB as SQLite Database

    Learner->>Client: Enters Name, Email, Password, Academic Affiliation
    Client->>AuthAPI: POST /api/auth/register (payload)
    AuthAPI->>DB: Check uniqueness (email, mobile, username)
    AuthAPI->>DB: Hash password (bcrypt 10 rounds)
    AuthAPI->>DB: Insert User (isEmailVerified: false)
    AuthAPI->>DB: Generate 6-digit OTP (expires in 15 mins)
    AuthAPI-->>Client: 201 Created (demoVerificationCode for testing)
    Client->>Learner: Renders OtpInputBoxes & Verification Challenge
    Learner->>Client: Enters 6-digit PIN code
    Client->>Client: Displays VerificationSpinner ("Verifying...")
    Client->>AuthAPI: POST /api/auth/verify-otp (email, code)
    AuthAPI->>DB: Lookup Challenge (usedAt: null, expiresAt > now)
    AuthAPI->>DB: Mark Challenge used, set isEmailVerified: true
    AuthAPI->>DB: Create active Session record
    AuthAPI-->>Client: 200 OK (JWT Token + User Profile)
    Client->>Learner: Redirects to /student/dashboard
```

---

### 4.2 Process 3.0: Anti-Tamper Checkout & Entitlement Activation

```mermaid
sequenceDiagram
    autonumber
    actor Learner as Student Learner
    participant Client as React 19 Checkout Page
    participant PayAPI as Payment Controller (/api/payment)
    participant DB as SQLite Database

    Learner->>Client: Clicks "Enrol / Purchase" on Course
    Client->>PayAPI: POST /api/payment/create-order (courseId)
    PayAPI->>DB: Authoritative price lookup (Course table)
    Note over PayAPI: Client price is NEVER trusted
    PayAPI->>DB: Insert Order (status: PENDING, trusted amount)
    PayAPI-->>Client: 201 Order Created (orderId, amount, currency)
    Client->>Learner: Renders Payment Simulator Card
    Learner->>Client: Confirms payment method
    Client->>PayAPI: POST /api/payment/verify (orderId, paymentSignature)
    PayAPI->>DB: Verify signature & idempotency
    PayAPI->>DB: Update Order status: PAID
    PayAPI->>DB: Insert PaymentTransaction record
    PayAPI->>DB: Upsert Enrolment (status: ACTIVE)
    PayAPI->>DB: Insert AuditEvent (COURSE_ENROLLED)
    PayAPI-->>Client: 200 OK (Enrolment activated, receipt generated)
    Client->>Learner: Redirects to /student/classroom/:courseId
```

---

### 4.3 Process 2.0: Classroom Playback, Quiz Grading & Certificate Verification

```mermaid
sequenceDiagram
    autonumber
    actor Learner as Student Learner
    participant Client as Classroom Player
    participant LearnAPI as Student Controller (/api/student)
    participant DB as SQLite Database
    actor Verifier as Employer / Public Verifier

    Learner->>Client: Plays lecture video stream
    Client->>LearnAPI: POST /api/student/lessons/:id/progress (position, isCompleted)
    LearnAPI->>DB: Upsert LessonProgress record
    LearnAPI-->>Client: 200 OK (updated course completion %)
    Learner->>Client: Submits Module Assessment Quiz
    Client->>LearnAPI: POST /api/student/quizzes/:id/attempt (selectedAnswers)
    LearnAPI->>DB: Compute automated score (weight * correctOptions)
    alt Score >= 70% (Pass)
        LearnAPI->>DB: Record QuizAttempt (passed: true)
        alt 100% Lessons Complete & All Quizzes Passed
            LearnAPI->>DB: Generate Unique Certificate (e.g. CERT-2026-CS101-JOHN)
        end
        LearnAPI-->>Client: 200 OK (score, pass: true, certificateCode)
    else Score < 70% (Fail)
        LearnAPI->>DB: Record QuizAttempt (passed: false)
        LearnAPI-->>Client: 200 OK (score, pass: false, retakeAllowed)
    end

    Verifier->>Client: Visits /verify-certificate/:code
    Client->>LearnAPI: GET /api/verify-certificate/:code
    LearnAPI->>DB: Query Certificate by certificateCode
    LearnAPI-->>Client: 200 OK (Student Name, Course Title, Issue Date, SHA-256 seal)
    Client->>Verifier: Displays accredited Certificate card with verified badge
```

---

### 4.4 Process 4.0: Doubts & Moderation Triage

```mermaid
sequenceDiagram
    autonumber
    actor Learner as Student Learner
    actor Mentor as Course Mentor
    participant DoubtAPI as Doubt Controller (/api/doubts)
    participant DB as SQLite Database

    Learner->>DoubtAPI: POST /api/doubts (courseId, lessonId, title, message, attachment)
    DoubtAPI->>DB: Verify enrolment
    DoubtAPI->>DB: Insert DoubtTicket (status: OPEN) + DoubtMessage
    DoubtAPI-->>Learner: 201 Created (ticketId)

    Mentor->>DoubtAPI: GET /api/mentor/doubts
    DoubtAPI->>DB: Query open doubts for mentor's courses
    DoubtAPI-->>Mentor: 200 OK (list of pending doubts)

    Mentor->>DoubtAPI: POST /api/doubts/:id/messages (message, attachment)
    DoubtAPI->>DB: Insert DoubtMessage (sender: Mentor)
    DoubtAPI->>DB: Update DoubtTicket (status: IN_PROGRESS)
    DoubtAPI-->>Mentor: 201 Created

    Mentor->>DoubtAPI: PATCH /api/doubts/:id/status (status: RESOLVED)
    DoubtAPI->>DB: Update DoubtTicket (status: RESOLVED)
    DoubtAPI-->>Mentor: 200 OK (status updated)
```

---

### 4.5 Process 6.0: Support Tickets & Platform Feedback (Section 15)

```mermaid
sequenceDiagram
    autonumber
    actor User as Platform User / Student
    actor Staff as Academic Support Staff
    participant SuppAPI as Support Controller (/api/support)
    participant FdbkAPI as Feedback Controller (/api/feedback)
    participant DB as SQLite Database

    User->>SuppAPI: POST /api/support/tickets (subject, description, category, priority)
    SuppAPI->>DB: Generate reference ID (SUP-2026-XXXX)
    SuppAPI->>DB: Insert SupportTicket (status: OPEN)
    SuppAPI-->>User: 201 Created (ticketNumber: SUP-2026-XXXX)

    Staff->>SuppAPI: GET /api/support/tickets
    SuppAPI->>DB: Query tickets with filters
    SuppAPI-->>Staff: 200 OK (ticket roster including internal notes)

    Staff->>SuppAPI: POST /api/support/tickets/:id/messages (message, isInternal: false)
    SuppAPI->>DB: Insert SupportTicketMessage
    SuppAPI->>DB: Update status to IN_PROGRESS
    SuppAPI-->>Staff: 201 Created

    Staff->>SuppAPI: PATCH /api/support/tickets/:id/status (status: RESOLVED)
    SuppAPI->>DB: Update status to RESOLVED
    SuppAPI-->>Staff: 200 OK

    User->>SuppAPI: POST /api/support/tickets/:id/feedback (rating: 5, comment)
    SuppAPI->>DB: Record satisfactionRating and satisfactionComment
    SuppAPI-->>User: 200 OK (Satisfaction recorded)

    User->>FdbkAPI: POST /api/feedback (category, rating, title, description, consent)
    FdbkAPI->>DB: Generate reference ID (FDBK-2026-XXXX)
    FdbkAPI->>DB: Insert Feedback record (status: NEW)
    FdbkAPI-->>User: 201 Created (referenceNumber: FDBK-2026-XXXX)
```
