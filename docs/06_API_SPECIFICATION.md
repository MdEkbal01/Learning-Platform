# Comprehensive REST API Catalog
## AuraLMS — Endpoints, Schemas, Security & Response Contracts

**Base URL:** `http://localhost:5000/api`  
**Authentication Scheme:** `Bearer <JWT_TOKEN>` in `Authorization` header or HTTP-only `auth_token` cookie.  
**Inactivity Timeout:** 120 minutes (re-evaluates on each authenticated request).

---

## 1. Authentication & Session Endpoints (`/api/auth`)

| Method | Endpoint | Access | Summary | Request Body | Success Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Register student account | `{ name, email, password, mobile?, college?, academicYear?, academicCourse? }` | `201 Created` (`{ message, demoVerificationCode }`) |
| `POST` | `/auth/verify-otp` | Public | Verify 6-digit challenge | `{ identifier, code }` | `200 OK` (`{ token, user }`) |
| `POST` | `/auth/login` | Public | Authenticate user | `{ identifier, password }` | `200 OK` (`{ token, user }`) |
| `POST` | `/auth/forgot-password` | Public | Initiate password reset | `{ identifier }` | `200 OK` (`{ message, demoResetCode? }`) |
| `POST` | `/auth/reset-password` | Public | Complete password reset | `{ identifier, code, newPassword }` | `200 OK` (`{ message }`) |
| `GET` | `/auth/me` | Authenticated | Current profile & counts | None | `200 OK` (`{ user }`) |
| `PUT` | `/auth/profile` | Authenticated | Update academic metadata | `{ name?, college?, academicYear?, academicCourse?, bio? }` | `200 OK` (`{ message, user }`) |
| `POST` | `/auth/change-password` | Authenticated | Change active password | `{ currentPassword, newPassword }` | `200 OK` (`{ message }`) |
| `GET` | `/auth/sessions` | Authenticated | List active user devices | None | `200 OK` (`[ { id, ipAddress, userAgent, isCurrent } ]`) |
| `DELETE`| `/auth/sessions/:id` | Authenticated | Revoke specific session | None | `200 OK` (`{ message }`) |
| `POST` | `/auth/logout` | Authenticated | Invalidate current session | None | `200 OK` (`{ message }`) |

---

## 2. Public Discovery & Credentials

| Method | Endpoint | Access | Summary | Query / Params | Success Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/courses` | Public | Browse course catalogue | `?category=&level=&price=&search=` | `200 OK` (`[ Course ]`) |
| `GET` | `/courses/:idOrSlug`| Public | View course syllabus | `:idOrSlug` | `200 OK` (`{ ...course, modules }`) |
| `GET` | `/verify-certificate/:code`| Public | Real-time registry verification | `:code` (e.g. `CERT-2026-CS101-JOHN`) | `200 OK` (`{ certificateCode, studentName, courseTitle, issuedAt }`) |
| `GET` | `/health` | Public | System health & uptime check | None | `200 OK` (`{ status: "healthy", uptime }`) |
| `GET` | `/maintenance/status` | Public | Active maintenance flags | None | `200 OK` (`[ MaintenanceFlag ]`) |

---

## 3. Student Learning & Classroom (`/api/student`)

| Method | Endpoint | Access | Summary | Request Body | Success Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/student/my-courses`| Student | Enrolled courses & progress | None | `200 OK` (`[ { course, progress } ]`) |
| `GET` | `/student/classroom/:courseId` | Enrolled | Full lecture stream & syllabus | None | `200 OK` (`{ course, modules, progress }`) |
| `POST`| `/student/lessons/:id/progress` | Enrolled | Record timestamp & complete | `{ isCompleted: boolean, playbackPositionSeconds: number }` | `200 OK` (`{ completedLessons, completionPercentage }`) |
| `POST`| `/student/quizzes/:id/attempt` | Enrolled | Submit assessment quiz | `{ answers: [ { questionId, selectedOptionId } ] }` | `200 OK` (`{ scorePercent, passed, certificateCode? }`) |
| `POST`| `/student/certificates/:courseId/claim` | Enrolled | Issue accredited certificate | None | `201 Created` (`{ certificateCode }`) |
| `GET` | `/student/live-classes` | Student | Upcoming masterclasses | None | `200 OK` (`[ LiveClass ]`) |
| `GET` | `/student/orders` | Student | Order receipts & invoices | None | `200 OK` (`[ Order with transaction ]`) |

---

## 4. Anti-Tamper Payments & Enrolment (`/api/payment`)

| Method | Endpoint | Access | Summary | Request Body | Success Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/payment/create-order`| Authenticated | Server-side authoritative order | `{ courseId }` | `201 Created` (`{ orderId, amount, currency }`) |
| `POST` | `/payment/verify` | Authenticated | Verify transaction signature | `{ orderId, paymentSignature }` | `200 OK` (`{ status: "PAID", enrolmentId }`) |
| `POST` | `/payment/simulate-webhook`| Admin | Idempotency test harness | `{ eventType, orderId, paymentId }` | `200 OK` (`{ message: "Webhook acknowledged" }`) |

---

## 5. Doubt Resolution (`/api/doubts`)

| Method | Endpoint | Access | Summary | Request Body / Multipart | Success Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/doubts` | Enrolled Student | Raise doubt ticket | `multipart/form-data`: `courseId`, `lessonId`, `title`, `description`, `attachment?` | `201 Created` (`DoubtTicket`) |
| `GET` | `/doubts` | Student / Mentor | Query doubts list | `?status=&courseId=` | `200 OK` (`[ DoubtTicket ]`) |
| `GET` | `/doubts/:id` | Owner / Mentor | Thread details | None | `200 OK` (`{ ticket, messages }`) |
| `POST` | `/doubts/:id/messages`| Owner / Mentor | Reply to discussion | `multipart/form-data`: `message`, `attachment?` | `201 Created` (`DoubtMessage`) |
| `PATCH`| `/doubts/:id/status` | Mentor / Admin | Resolve doubt | `{ status: "RESOLVED" }` | `200 OK` (`DoubtTicket`) |

---

## 6. Faculty Mentor Console (`/api/mentor`)

| Method | Endpoint | Access | Summary | Request Body | Success Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/mentor/dashboard` | Mentor | Faculty KPI & doubt counts | None | `200 OK` (`{ assignedCoursesCount, totalStudents, openDoubtsCount }`) |
| `GET` | `/mentor/courses` | Mentor | Assigned curriculum roster | None | `200 OK` (`[ Course ]`) |
| `POST` | `/mentor/live-classes` | Mentor | Schedule live session | `{ courseId, title, description, scheduledAt, meetingUrl }` | `201 Created` (`LiveClass`) |

---

## 7. Curriculum Studio (`/api/content`)

| Method | Endpoint | Access | Summary | Request Body | Success Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/content/courses` | Content Manager | All courses & statuses | None | `200 OK` (`[ Course ]`) |
| `POST` | `/content/courses` | Content Manager | Create draft course | `{ title, slug, description, categoryId, level, price, isFree, thumbnail, durationHours }` | `201 Created` (`Course`) |
| `POST` | `/content/courses/:id/modules` | Content Manager | Add curriculum module | `{ title, description, orderIndex }` | `201 Created` (`CourseModule`) |
| `POST` | `/content/modules/:id/lessons` | Content Manager | Author video lesson | `{ title, videoUrl, durationSeconds, contentMarkdown, isPreview, orderIndex }` | `201 Created` (`Lesson`) |
| `PATCH`| `/content/courses/:id/status` | Content Manager / Admin | Update workflow status | `{ status: "IN_REVIEW" \| "PUBLISHED" }` | `200 OK` (`Course`) |

---

## 8. Finance & Refunds (`/api/finance`)

| Method | Endpoint | Access | Summary | Request Body | Success Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/finance/overview` | Finance Staff | Gross revenue & totals | None | `200 OK` (`{ totalRevenue, totalRefunded, paidCount, refundedCount }`) |
| `GET` | `/finance/orders` | Finance Staff | Gateway transactions list | `?status=&search=` | `200 OK` (`[ Order with user and course ]`) |
| `POST` | `/finance/refund` | Finance Staff | Authorized refund & access revoke | `{ orderId, reason }` | `200 OK` (`{ message: "Refund processed successfully" }`) |

---

## 9. Community Moderation (`/api/moderator`)

| Method | Endpoint | Access | Summary | Request Body | Success Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/moderator/queue` | Moderator | Pending reported items | `?status=PENDING` | `200 OK` (`[ ModerationReport ]`) |
| `POST` | `/moderator/reports/:id/action` | Moderator | Apply action | `{ action: "DISMISS" \| "HIDE_CONTENT" \| "REMOVE_CONTENT", resolutionNotes }` | `200 OK` (`{ message: "Action recorded" }`) |

---

## 10. Super Administration (`/api/admin`)

| Method | Endpoint | Access | Summary | Request Body | Success Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/admin/analytics` | Super Admin | Global KPI overview | None | `200 OK` (`{ metrics, recentAuditLogs }`) |
| `GET` | `/admin/users` | Super Admin | Registered user roster | None | `200 OK` (`[ User with enrolments ]`) |
| `PATCH`| `/admin/users/:id/role`| Super Admin | Reassign RBAC role | `{ role: "MENTOR" \| "STUDENT" ... }` | `200 OK` (`User`) |
| `PATCH`| `/admin/users/:id/status`| Super Admin | Suspend / reinstate user | `{ status: "SUSPENDED", reason: string }` | `200 OK` (`User`) |
| `POST` | `/admin/enrolments/manual`| Super Admin | Manual grant/revoke access | `{ userId, courseId, action: "GRANT" \| "REVOKE", reason }` | `200 OK` (`Enrolment`) |
| `GET` | `/admin/audit-logs` | Super Admin | Immutable security trail | None | `200 OK` (`[ AuditEvent ]`) |
| `POST` | `/admin/maintenance/flags`| Super Admin | Toggle feature banner | `{ featureKey, isEnabled, message }` | `200 OK` (`MaintenanceFlag`) |

---

## 11. Preferences, Feedback & Support (Section 15)

| Method | Endpoint | Access | Summary | Request Body | Success Response |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/preferences` | Authenticated | Read theme & language | None | `200 OK` (`{ theme: "light" \| "dark", language: "en" \| "hi", notificationPrefs }`) |
| `PUT` | `/preferences` | Authenticated | Strictly update theme & lang | `{ theme?: "light" \| "dark", language?: "en" \| "hi", notificationPrefs? }` | `200 OK` (`{ message: "Preferences updated successfully." }`) *(Rejects invalid values with 400)* |
| `POST` | `/feedback` | Public / Auth | Submit platform feedback | `{ category, rating, title, description, courseId? }` | `201 Created` (`{ referenceNumber: "FDBK-2026-XXXX" }`) |
| `GET` | `/feedback` | Staff / Student | Triage list | None | `200 OK` (`[ Feedback ]`) *(Internal notes hidden from student)* |
| `PATCH`| `/feedback/:id/status`| Staff | Update triage status | `{ status, internalNotes }` | `200 OK` (`Feedback`) |
| `GET` | `/support/faqs` | Public | Search bilingual FAQs | `?category=&search=` | `200 OK` (`[ FaqArticle ]`) *(Contains both EN and HI fields)* |
| `POST` | `/support/tickets` | Public / Auth | Open support ticket | `{ category, priority, subject, description, requesterEmail?, requesterName? }` | `201 Created` (`{ ticketNumber: "SUP-2026-XXXX", id }`) |
| `GET` | `/support/tickets` | Authenticated | List tickets | None | `200 OK` (`[ SupportTicket ]`) |
| `GET` | `/support/tickets/:id`| Owner / Staff | View ticket thread | None | `200 OK` (`SupportTicket with messages`) |
| `POST` | `/support/tickets/:id/messages`| Owner / Staff | Reply to ticket | `{ message, isInternal?: boolean }` | `201 Created` (`SupportTicketMessage`) |
| `PATCH`| `/support/tickets/:id/status`| Staff | Resolve support ticket | `{ status: "RESOLVED" }` | `200 OK` (`SupportTicket`) |
| `POST` | `/support/tickets/:id/feedback`| Owner | Post-resolution rating | `{ rating: 1..5, comment? }` | `200 OK` (`{ message: "Feedback submitted successfully." }`) |
