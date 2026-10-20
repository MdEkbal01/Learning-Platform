# AuraLMS — Visual Page Views & UI Design Blueprint
**Version:** 2.0  
**Resolution / Aspect:** 1200 × 800 (Vector Scalable SVG)  
**Style Signature:** Dark Modern SaaS with CodeByGaurav Interactive Radial Accents  

This directory contains standalone, vector-sharp SVG wireframes and page view mockups for all **27 pages** of the AuraLMS platform. Every SVG is self-contained with embedded fonts, CSS gradients, layout containers, and UI widgets, allowing developers and designers to inspect and recreate the visual experience without external design tools.

---

## Visual Gallery Index

### 1. Public & Discovery Module
| File | Page Name | Primary User | Key UI Signatures & Widgets |
| :--- | :--- | :--- | :--- |
| [`01_Home.svg`](./01_Home.svg) | **Landing / Home** | Guest / Student | Ambient mouse spotlight glow, hero headline, daily live class ticker, metrics bar, career path cards. |
| [`02_Catalogue.svg`](./02_Catalogue.svg) | **Course Catalogue** | Guest / Student | Category filter tabs, keyword search bar, popular sort filter, 2-column responsive course cards with pricing pills. |
| [`03_CourseDetail.svg`](./03_CourseDetail.svg) | **Course Syllabus & Overview** | Student | Syllabus accordion, lesson runtime markers, bilingual EN/HI pill, sticky enrollment card with video preview thumbnail. |
| [`04_Checkout.svg`](./04_Checkout.svg) | **Anti-Tamper Checkout** | Student | Server-signed order summary, gateway selector (Razorpay/Stripe), HMAC cryptographic tamper notice, lock badge. |
| [`05_VerifyCertificate.svg`](./05_VerifyCertificate.svg) | **Certificate Verification** | Public / Employer | Real-time credential ID search input, circular animated `VerificationSpinner` gauge, verified green ribbon, honors grade. |

---

### 2. Authentication & Identity Module
| File | Page Name | Primary User | Key UI Signatures & Widgets |
| :--- | :--- | :--- | :--- |
| [`06_Login_SecureVault.svg`](./06_Login_SecureVault.svg) | **Login & Vault** | All Roles | Glassmorphic auth card, ambient cursor spotlight, email/password fields, Quick Role Switcher grid for demo testing. |
| [`07_Register_VerificationRing.svg`](./07_Register_VerificationRing.svg) | **Registration & Segmented OTP** | New User | Circular `VerificationSpinner` (step completion gauge), 6-digit segmented `OtpInputBoxes` with auto-focus ring, resend countdown. |
| [`08_ForgotPassword.svg`](./08_ForgotPassword.svg) | **Password Recovery** | User | Clean recovery card, email/phone lookup, automated recovery code dispatch button. |

---

### 3. Student Experience Module
| File | Page Name | Primary User | Key UI Signatures & Widgets |
| :--- | :--- | :--- | :--- |
| [`09_StudentDashboard.svg`](./09_StudentDashboard.svg) | **Student Dashboard** | Student | Enrolled courses with visual progress bars, "Resume Lesson" quick action, live session alerts, certificate shelf. |
| [`10_ClassroomPlayer.svg`](./10_ClassroomPlayer.svg) | **Classroom Player & Quiz** | Student | 16:9 video player with custom scrubber, lesson syllabus sidebar, integrated inline module quiz drawer, doubt panel. |
| [`11_StudentDoubts.svg`](./11_StudentDoubts.svg) | **Student Doubts** | Student | Active & resolved ticket list, SLA response indicators, mentor response preview, "Ask a New Doubt" modal trigger. |
| [`12_StudentOrders.svg`](./12_StudentOrders.svg) | **Orders & Tax Invoices** | Student | Order ledger, payment status badges (COMPLETED/PENDING), printable tax receipt PDF download buttons. |
| [`13_StudentLiveClasses.svg`](./13_StudentLiveClasses.svg) | **Live Mentorship Calendar**| Student | Scheduled workshops, countdown timer, pulsing live indicator dot, 1-click Zoom/Meet room launch button. |
| [`14_StudentProfile.svg`](./14_StudentProfile.svg) | **Student Profile & Badges** | Student | Avatar initials, verified student badge, total learning hours, issued cryptographic certificate shelf with share links. |

---

### 4. Faculty & Mentor Console
| File | Page Name | Primary User | Key UI Signatures & Widgets |
| :--- | :--- | :--- | :--- |
| [`15_MentorDashboard.svg`](./15_MentorDashboard.svg) | **Mentor Console** | Mentor | Pending doubts counter (&lt;15 min SLA target), resolution rate, active students count, high-priority doubt queue. |
| [`16_MentorDoubts.svg`](./16_MentorDoubts.svg) | **Doubt Responder** | Mentor | Side-by-side student query with code attachment viewer, rich markdown/code response box, "Resolve Ticket" button. |

---

### 5. Content Authoring & Publishing
| File | Page Name | Primary User | Key UI Signatures & Widgets |
| :--- | :--- | :--- | :--- |
| [`17_ContentCourseList.svg`](./17_ContentCourseList.svg) | **Course Portfolio** | Content Manager | All course listings, module counts, pricing, publication status pill (PUBLISHED/DRAFT), edit action menu. |
| [`18_ContentCourseEditor.svg`](./18_ContentCourseEditor.svg) | **Curriculum & Quiz Builder**| Content Manager | Drag-and-drop module/lesson hierarchy, bilingual question editor (English &amp; हिन्दी), multiple-choice answer selector. |

---

### 6. Financial Ledger & Gateway Reconciliations
| File | Page Name | Primary User | Key UI Signatures & Widgets |
| :--- | :--- | :--- | :--- |
| [`19_FinanceDashboard.svg`](./19_FinanceDashboard.svg) | **Finance Ledger** | Finance Support | Gross transaction volume, successful order counts, transaction status table, manual refund execution drawer. |

---

### 7. Moderation & Community Safety
| File | Page Name | Primary User | Key UI Signatures & Widgets |
| :--- | :--- | :--- | :--- |
| [`20_ModeratorQueue.svg`](./20_ModeratorQueue.svg) | **Moderation Queue** | Moderator | Reported spam & commercial solicitation posts, flagged doubt inquiries, strike system, 1-click "Delete &amp; Ban" actions. |

---

### 8. Super Admin Platform Telemetry
| File | Page Name | Primary User | Key UI Signatures & Widgets |
| :--- | :--- | :--- | :--- |
| [`21_AdminDashboard.svg`](./21_AdminDashboard.svg) | **Admin Telemetry Center** | Super Admin | 100% operational telemetry cards, total registered user metrics, quick shortcut grid to all admin submodules. |
| [`22_AdminUserManagement.svg`](./22_AdminUserManagement.svg) | **User & RBAC Management** | Super Admin | User table with phone and email, instant role selector (STUDENT to SUPER_ADMIN), account freeze/activate switches. |
| [`23_AdminAuditLogs.svg`](./23_AdminAuditLogs.svg) | **Security Audit Trail** | Super Admin | Immutable audit log table with timestamps, actor IDs, actions (e.g. `MAINTENANCE_TOGGLE`), resource targets, client IPs. |
| [`24_AdminMaintenance.svg`](./24_AdminMaintenance.svg) | **Maintenance & Kill-Switch**| Super Admin | Global maintenance toggle switch, bilingual banner broadcast text fields, emergency bypass token manager. |
| [`25_AdminWebhookSimulator.svg`](./25_AdminWebhookSimulator.svg) | **Payment Webhook Simulator**| Super Admin | Razorpay/Stripe payload editor, live event trigger button, server JSON response console with HMAC validation checks. |

---

### 9. Shared Preferences & Support
| File | Page Name | Primary User | Key UI Signatures & Widgets |
| :--- | :--- | :--- | :--- |
| [`26_Settings.svg`](./26_Settings.svg) | **Preferences & Language** | All Users | Theme switcher (Dark / Light Mode), language selector (English / हिन्दी), granular notification push checkboxes. |
| [`27_HelpCenter.svg`](./27_HelpCenter.svg) | **Help Center & FAQs** | All Users | Bilingual searchable FAQ accordions (English &amp; Hindi), support ticket creation form with category picker. |

---

## Technical Specifications of Page Views

- **Format**: Scalable Vector Graphics (SVG 1.1 compliant).
- **Embedded Fonts**: Inter (`400`, `500`, `600`, `700`, `800`) with system fallback stack (`sans-serif`, `monospace`).
- **Standard Dimensions**: `1200px` width by `800px` height (with extended `850px` height for catalog and editor views).
- **Rendering**: Compatible with GitHub Markdown previews, standard web browsers, Adobe Illustrator, Figma import, and Inkscape.
- **Theme Palette**: Pre-configured using the AuraLMS Dark SaaS tokens (`#0A0F1D` canvas, `#0F172A` navbar, `#1E293B` cards, `#4F46E5` primary brand).
