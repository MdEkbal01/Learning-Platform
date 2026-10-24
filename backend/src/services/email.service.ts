// Ken Classes - Unified Multi-Provider Email Service
// Primary Provider: Brevo (Sendinblue) Transactional REST API v3
// Fallback: EmailJS Automated Dispatch

export const EMAIL_CONFIG = {
  brevoApiKey: process.env.BREVO_API_KEY || '',
  brevoSmtpKey: process.env.BREVO_SMTP_KEY || '',
  brevoSenderEmail: process.env.BREVO_SENDER_EMAIL || 'zainulabideen01telo@gmail.com',
  brevoSenderName: process.env.BREVO_SENDER_NAME || 'Ken Classes',
  companyName: process.env.COMPANY_NAME || 'Ken Classes',
  supportEmail: process.env.SUPPORT_EMAIL || 'kenclasses95@gmail.com',
  appOrigin: process.env.APP_ORIGIN || 'https://auralms-platform.pages.dev',
  // EmailJS Fallback
  emailjsServiceId: process.env.EMAILJS_SERVICE_ID || 'service_u2pq18q',
  emailjsTemplateOtp: process.env.EMAILJS_TEMPLATE_OTP || 'template_iils3yg',
  emailjsTemplateWelcome: process.env.EMAILJS_TEMPLATE_WELCOME || 'template_ytk9w6q',
  emailjsPublicKey: process.env.EMAILJS_PUBLIC_KEY || 'e8iQcLkwbSNDb6a5h',
  emailjsPrivateKey: process.env.EMAILJS_PRIVATE_KEY || '',
};

/**
 * Standard branded HTML email layout
 */
function renderEmailLayout(title: string, preheaderText: string, contentHtml: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
  <!-- Preheader preview text for inbox -->
  <div style="display: none; max-height: 0px; overflow: hidden;">
    ${preheaderText}
  </div>

  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 30px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #09090b 0%, #18181b 100%); padding: 32px 36px; text-align: left; border-bottom: 3px solid #2563eb;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td>
                    <div style="color: #ffffff; font-size: 24px; font-weight: 800; letter-spacing: -0.5px; line-height: 1.2;">
                      Ken Classes
                    </div>
                    <div style="color: #a1a1aa; font-size: 13px; font-weight: 500; margin-top: 4px;">
                      Class 1 to PhD Academic & Professional Learning Platform
                    </div>
                  </td>
                  <td align="right">
                    <span style="background: rgba(37, 99, 235, 0.2); border: 1px solid rgba(59, 130, 246, 0.4); color: #93c5fd; font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.5px;">
                      Official
                    </span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Main Email Body -->
          <tr>
            <td style="padding: 36px 36px 28px; color: #18181b; line-height: 1.6; font-size: 15px;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #fafafa; border-top: 1px solid #e4e4e7; padding: 24px 36px; text-align: center; color: #71717a; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0 0 6px; font-weight: 600; color: #3f3f46;">
                Ken Classes • Excellence in Primary, Secondary & Higher Education
              </p>
              <p style="margin: 0 0 10px;">
                Direct inquiries or support: <a href="mailto:${EMAIL_CONFIG.supportEmail}" style="color: #2563eb; text-decoration: none; font-weight: 600;">${EMAIL_CONFIG.supportEmail}</a>
              </p>
              <p style="margin: 0; color: #a1a1aa; font-size: 11px;">
                You received this transactional email because of an active account or requested action on <a href="${EMAIL_CONFIG.appOrigin}" style="color: #71717a;">${EMAIL_CONFIG.appOrigin}</a>.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Core Brevo Transactional Email Dispatcher with Fallback
 */
async function sendViaBrevo(
  toEmail: string,
  toName: string,
  subject: string,
  htmlContent: string,
  textContent?: string
): Promise<boolean> {
  if (!EMAIL_CONFIG.brevoApiKey) {
    console.warn('[Brevo Service] BREVO_API_KEY is not configured.');
    return false;
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': EMAIL_CONFIG.brevoApiKey,
        'accept': 'application/json',
      },
      body: JSON.stringify({
        sender: {
          name: EMAIL_CONFIG.brevoSenderName,
          email: EMAIL_CONFIG.brevoSenderEmail,
        },
        to: [
          {
            email: toEmail,
            name: toName || toEmail.split('@')[0],
          },
        ],
        replyTo: {
          name: `${EMAIL_CONFIG.companyName} Support`,
          email: EMAIL_CONFIG.supportEmail,
        },
        subject,
        htmlContent,
        ...(textContent ? { textContent } : {}),
      }),
    });

    if (response.ok) {
      const data: any = await response.json();
      console.log(`[Brevo Email Service] Success: "${subject}" delivered to ${toEmail} (ID: ${data.messageId})`);
      return true;
    } else {
      const errorText = await response.text();
      console.error(`[Brevo Email Service] HTTP ${response.status} Error:`, errorText);
      return false;
    }
  } catch (err) {
    console.error('[Brevo Email Service] Network/API Exception:', err);
    return false;
  }
}

/**
 * Fallback to EmailJS for OTP or Welcome emails
 */
async function sendViaEmailJs(
  templateId: string,
  params: Record<string, string>
): Promise<boolean> {
  try {
    const payload = {
      service_id: EMAIL_CONFIG.emailjsServiceId,
      template_id: templateId,
      user_id: EMAIL_CONFIG.emailjsPublicKey,
      accessToken: EMAIL_CONFIG.emailjsPrivateKey,
      template_params: params,
    };

    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': EMAIL_CONFIG.appOrigin,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.log(`[EmailJS Service] Fallback delivered successfully.`);
      return true;
    } else {
      const err = await res.text();
      console.error(`[EmailJS Service] Delivery failure:`, err);
      return false;
    }
  } catch (error) {
    console.error(`[EmailJS Service] Error:`, error);
    return false;
  }
}

/* ==========================================================================
   1. OTP & Security Verification Email
   ========================================================================== */
export async function sendOtpEmail(
  toEmail: string,
  otpCode: string,
  toName?: string,
  purpose: string = 'Verification'
): Promise<boolean> {
  const recipientName = toName || toEmail.split('@')[0];
  const subject = `${EMAIL_CONFIG.companyName} - Your ${purpose} Code: ${otpCode}`;
  const preheader = `Your security code is ${otpCode}. It expires in 15 minutes.`;

  const html = renderEmailLayout(
    subject,
    preheader,
    `
      <h2 style="margin: 0 0 12px; color: #09090b; font-size: 20px; font-weight: 700;">
        ${purpose} Request
      </h2>
      <p style="margin: 0 0 16px; color: #52525b; font-size: 15px;">
        Hello <strong>${recipientName}</strong>,
      </p>
      <p style="margin: 0 0 24px; color: #52525b; font-size: 15px;">
        We received a request for <strong>${purpose}</strong> on your Ken Classes account. Use the one-time security passkey below to proceed:
      </p>

      <div style="background-color: #f4f4f5; border: 2px dashed #d4d4d8; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
        <span style="font-family: 'Courier New', Courier, monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #09090b;">
          ${otpCode}
        </span>
        <div style="color: #71717a; font-size: 12px; font-weight: 500; margin-top: 6px;">
          Valid for 15 minutes • Single Use Only
        </div>
      </div>

      <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 14px 16px; border-radius: 6px; margin: 24px 0;">
        <p style="margin: 0; font-size: 13px; color: #1e40af;">
          <strong>Security Tip:</strong> Never share this code with anyone, including teachers or staff. Ken Classes representatives will never ask for your verification code.
        </p>
      </div>

      <p style="margin: 0; color: #71717a; font-size: 13px;">
        If you did not request this verification, you can safely disregard this email or report suspicious activity to our support desk.
      </p>
    `
  );

  // Try Brevo first
  const brevoSuccess = await sendViaBrevo(toEmail, recipientName, subject, html, `Your code is ${otpCode}`);
  if (brevoSuccess) return true;

  // Fallback to EmailJS
  return sendViaEmailJs(EMAIL_CONFIG.emailjsTemplateOtp, {
    to_name: recipientName,
    to_email: toEmail,
    email: toEmail,
    otp_code: otpCode,
    code: otpCode,
    passcode: otpCode,
    purpose,
    company_name: EMAIL_CONFIG.companyName,
    support_email: EMAIL_CONFIG.supportEmail,
    message: `Your Ken Classes security code is: ${otpCode}. It expires in 15 minutes.`,
  });
}

/* ==========================================================================
   2. Welcome & Account Onboarding Email
   ========================================================================== */
export async function sendWelcomeEmail(toEmail: string, toName: string): Promise<boolean> {
  const recipientName = toName || toEmail.split('@')[0];
  const subject = `Welcome to ${EMAIL_CONFIG.companyName}! Your Learning Journey Begins 🚀`;
  const preheader = `Welcome aboard! Access courses from Class 1 to PhD, live masterclasses, and mentor doubts.`;

  const html = renderEmailLayout(
    subject,
    preheader,
    `
      <h2 style="margin: 0 0 12px; color: #09090b; font-size: 20px; font-weight: 700;">
        Welcome to the Family, ${recipientName}! 🎉
      </h2>
      <p style="margin: 0 0 16px; color: #52525b; font-size: 15px;">
        Your Ken Classes account is now fully verified and activated. You have unlocked complete access to our comprehensive learning ecosystem spanning Primary school, Secondary boards, Competitive Entrance (JEE/NEET), University Tech & Non-Tech, all the way to Doctoral Research.
      </p>

      <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; padding: 20px; margin: 24px 0;">
        <h3 style="margin: 0 0 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px; color: #27272a;">
          What you can do right now:
        </h3>
        <table width="100%" border="0" cellspacing="0" cellpadding="6" style="font-size: 14px; color: #3f3f46;">
          <tr>
            <td width="28" valign="top">📚</td>
            <td><strong>Curriculum Spectrum:</strong> Browse courses across 16+ educational stages with structured video lectures and notes.</td>
          </tr>
          <tr>
            <td width="28" valign="top">🔴</td>
            <td><strong>Live Interactive Lectures:</strong> Attend real-time classroom sessions with experienced educators.</td>
          </tr>
          <tr>
            <td width="28" valign="top">💬</td>
            <td><strong>1-on-1 Doubt Clearing:</strong> Submit doubt tickets anytime and receive guided solutions directly from mentors.</td>
          </tr>
          <tr>
            <td width="28" valign="top">🏆</td>
            <td><strong>Verifiable Certificates:</strong> Complete course milestones and generate cryptographic completion certificates.</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${EMAIL_CONFIG.appOrigin}/student/dashboard" style="display: inline-block; background-color: #09090b; color: #ffffff; padding: 14px 32px; border-radius: 8px; font-size: 15px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          Open Student Workspace →
        </a>
      </div>

      <p style="margin: 0; color: #71717a; font-size: 13px;">
        If you have questions at any step, reply directly to this email or visit our Help Center. Happy learning!
      </p>
    `
  );

  const brevoSuccess = await sendViaBrevo(toEmail, recipientName, subject, html);
  if (brevoSuccess) return true;

  return sendViaEmailJs(EMAIL_CONFIG.emailjsTemplateWelcome, {
    to_name: recipientName,
    to_email: toEmail,
    email: toEmail,
    company_name: EMAIL_CONFIG.companyName,
    support_email: EMAIL_CONFIG.supportEmail,
    message: `Welcome to ${EMAIL_CONFIG.companyName}! Your account has been activated.`,
  });
}

/* ==========================================================================
   3. Password Reset Success Confirmation
   ========================================================================== */
export async function sendPasswordResetSuccessEmail(toEmail: string, toName?: string): Promise<boolean> {
  const recipientName = toName || toEmail.split('@')[0];
  const subject = `${EMAIL_CONFIG.companyName} - Security Alert: Password Updated`;
  const preheader = `Your account password was successfully updated.`;

  const html = renderEmailLayout(
    subject,
    preheader,
    `
      <h2 style="margin: 0 0 12px; color: #09090b; font-size: 20px; font-weight: 700;">
        Password Changed Successfully
      </h2>
      <p style="margin: 0 0 16px; color: #52525b; font-size: 15px;">
        Hello <strong>${recipientName}</strong>,
      </p>
      <p style="margin: 0 0 20px; color: #52525b; font-size: 15px;">
        This email confirms that the password for your Ken Classes account (${toEmail}) was successfully modified on <strong>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</strong>.
      </p>

      <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 14px 16px; border-radius: 6px; margin: 24px 0;">
        <p style="margin: 0; font-size: 13px; color: #991b1b;">
          <strong>Did not make this change?</strong> If you did not authorize this action, please reset your password immediately or contact our technical support at <a href="mailto:${EMAIL_CONFIG.supportEmail}" style="color: #991b1b; font-weight: bold;">${EMAIL_CONFIG.supportEmail}</a> to secure your account.
        </p>
      </div>

      <div style="text-align: center; margin: 26px 0;">
        <a href="${EMAIL_CONFIG.appOrigin}/login" style="display: inline-block; background-color: #09090b; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-size: 14px; font-weight: 700; text-decoration: none;">
          Sign In With New Password
        </a>
      </div>
    `
  );

  return sendViaBrevo(toEmail, recipientName, subject, html);
}

/* ==========================================================================
   4. Course Enrollment & Fee Receipt (Tax Invoice)
   ========================================================================== */
export async function sendEnrollmentReceiptEmail(
  toEmail: string,
  details: {
    studentName?: string;
    courseTitle: string;
    orderNumber: string;
    amount: number;
    paymentMethod?: string;
    courseId?: string;
  }
): Promise<boolean> {
  const recipientName = details.studentName || toEmail.split('@')[0];
  const isFree = Number(details.amount) === 0;
  const formattedAmount = isFree ? '100% Free Scholarship' : `₹${Number(details.amount).toLocaleString('en-IN')}`;
  const subject = `${EMAIL_CONFIG.companyName} - Enrolment Confirmation: ${details.courseTitle}`;
  const preheader = `You are enrolled in ${details.courseTitle}. Order: ${details.orderNumber}.`;

  const html = renderEmailLayout(
    subject,
    preheader,
    `
      <div style="display: flex; align-items: center; margin-bottom: 16px;">
        <span style="display: inline-block; background: #ecfdf5; color: #059669; border: 1px solid #a7f3d0; font-size: 12px; font-weight: 800; padding: 4px 10px; border-radius: 6px; text-transform: uppercase;">
          Enrolment Confirmed ✓
        </span>
      </div>

      <h2 style="margin: 0 0 12px; color: #09090b; font-size: 20px; font-weight: 700;">
        Congratulations, ${recipientName}!
      </h2>
      <p style="margin: 0 0 20px; color: #52525b; font-size: 15px;">
        Your enrolment in <strong>${details.courseTitle}</strong> is active. You have full lifetime access to all course modules, lecture recordings, quizzes, and mentor support.
      </p>

      <!-- Fee Receipt Card -->
      <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; margin: 24px 0; overflow: hidden;">
        <tr>
          <td style="padding: 16px 20px; background-color: #f4f4f5; border-bottom: 1px solid #e4e4e7; font-size: 13px; font-weight: 700; color: #3f3f46; text-transform: uppercase; letter-spacing: 0.5px;">
            Enrolment & Payment Receipt
          </td>
        </tr>
        <tr>
          <td style="padding: 20px;">
            <table width="100%" border="0" cellspacing="0" cellpadding="8" style="font-size: 14px; color: #52525b;">
              <tr>
                <td style="color: #71717a;">Order Reference:</td>
                <td align="right" style="font-weight: 700; color: #09090b;">${details.orderNumber}</td>
              </tr>
              <tr>
                <td style="color: #71717a;">Course:</td>
                <td align="right" style="font-weight: 600; color: #09090b;">${details.courseTitle}</td>
              </tr>
              <tr>
                <td style="color: #71717a;">Payment Method:</td>
                <td align="right" style="font-weight: 600; color: #09090b;">${details.paymentMethod || 'UPI / QR Gateway'}</td>
              </tr>
              <tr>
                <td style="color: #71717a;">Date & Time:</td>
                <td align="right" style="font-weight: 600; color: #09090b;">${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
              </tr>
              <tr style="border-top: 1px solid #e4e4e7;">
                <td style="color: #09090b; font-weight: 700; font-size: 15px; padding-top: 12px;">Total Amount:</td>
                <td align="right" style="color: #059669; font-weight: 800; font-size: 18px; padding-top: 12px;">${formattedAmount}</td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${EMAIL_CONFIG.appOrigin}${details.courseId ? `/classroom/${details.courseId}` : '/student/courses'}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 34px; border-radius: 8px; font-size: 15px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
          Enter Classroom Now →
        </a>
      </div>

      <p style="margin: 0; color: #71717a; font-size: 12px; text-align: center;">
        A copy of this digital receipt is permanently saved in your student profile under <strong>My Orders</strong>.
      </p>
    `
  );

  return sendViaBrevo(toEmail, recipientName, subject, html);
}

/* ==========================================================================
   5. Live Lecture Class Reminder
   ========================================================================== */
export async function sendLiveLectureReminderEmail(
  toEmail: string,
  details: {
    studentName?: string;
    lectureTitle: string;
    courseTitle: string;
    scheduledAt: string;
    durationMinutes?: number;
    meetingUrl: string;
    mentorName?: string;
  }
): Promise<boolean> {
  const recipientName = details.studentName || toEmail.split('@')[0];
  const subject = `🔴 Live Class Reminder: ${details.lectureTitle} (${details.courseTitle})`;
  const preheader = `Live session starting soon: ${details.lectureTitle}. Join with 1-click.`;

  const html = renderEmailLayout(
    subject,
    preheader,
    `
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <span style="display: inline-block; background: #fee2e2; color: #dc2626; border: 1px solid #fca5a5; font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 6px; text-transform: uppercase;">
          Live Session Alert 🔴
        </span>
      </div>

      <h2 style="margin: 0 0 12px; color: #09090b; font-size: 20px; font-weight: 700;">
        Your Live Masterclass Starts Soon!
      </h2>
      <p style="margin: 0 0 20px; color: #52525b; font-size: 15px;">
        Hello <strong>${recipientName}</strong>, a live interactive masterclass for your enrolled course is scheduled:
      </p>

      <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; padding: 22px; margin: 20px 0;">
        <table width="100%" border="0" cellspacing="0" cellpadding="6" style="font-size: 14px; color: #3f3f46;">
          <tr>
            <td width="120" style="color: #71717a;">Session:</td>
            <td style="font-weight: 700; color: #09090b;">${details.lectureTitle}</td>
          </tr>
          <tr>
            <td style="color: #71717a;">Course:</td>
            <td style="font-weight: 600; color: #09090b;">${details.courseTitle}</td>
          </tr>
          <tr>
            <td style="color: #71717a;">Educator / Mentor:</td>
            <td style="font-weight: 600; color: #09090b;">${details.mentorName || 'Senior Faculty'}</td>
          </tr>
          <tr>
            <td style="color: #71717a;">Start Time:</td>
            <td style="font-weight: 700; color: #2563eb;">${details.scheduledAt}</td>
          </tr>
          <tr>
            <td style="color: #71717a;">Duration:</td>
            <td style="font-weight: 600; color: #09090b;">${details.durationMinutes || 60} Minutes</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${details.meetingUrl}" style="display: inline-block; background-color: #dc2626; color: #ffffff; padding: 14px 34px; border-radius: 8px; font-size: 15px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 6px -1px rgba(220, 38, 38, 0.25);">
          Join Live Classroom Now →
        </a>
      </div>

      <p style="margin: 0; color: #71717a; font-size: 12px; text-align: center;">
        Note: If you are unable to attend live, the high-definition recording will be automatically published into your course curriculum within 24 hours.
      </p>
    `
  );

  return sendViaBrevo(toEmail, recipientName, subject, html);
}

/* ==========================================================================
   6. Doubt Resolution / Mentor Reply Notification
   ========================================================================== */
export async function sendDoubtResponseEmail(
  toEmail: string,
  details: {
    studentName?: string;
    ticketId: string;
    courseTitle: string;
    questionTitle: string;
    mentorName: string;
    answerSnippet: string;
  }
): Promise<boolean> {
  const recipientName = details.studentName || toEmail.split('@')[0];
  const subject = `💡 Doubt Resolved: ${details.questionTitle} (${details.courseTitle})`;
  const preheader = `${details.mentorName} replied to your doubt ticket.`;

  const html = renderEmailLayout(
    subject,
    preheader,
    `
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <span style="display: inline-block; background: #eff6ff; color: #2563eb; border: 1px solid #bfdbfe; font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 6px; text-transform: uppercase;">
          Doubt Desk Update 💡
        </span>
      </div>

      <h2 style="margin: 0 0 12px; color: #09090b; font-size: 20px; font-weight: 700;">
        Your Doubt Has Been Answered!
      </h2>
      <p style="margin: 0 0 20px; color: #52525b; font-size: 15px;">
        Hello <strong>${recipientName}</strong>, Mentor <strong>${details.mentorName}</strong> has posted a response to your query in <em>${details.courseTitle}</em>:
      </p>

      <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <div style="color: #71717a; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">
          Your Question:
        </div>
        <div style="color: #09090b; font-size: 14px; font-weight: 600; margin-bottom: 16px;">
          "${details.questionTitle}"
        </div>

        <div style="color: #71717a; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">
          Mentor Response:
        </div>
        <div style="color: #27272a; font-size: 14px; background: #ffffff; border: 1px solid #e4e4e7; padding: 14px; border-radius: 8px; font-style: italic;">
          "${details.answerSnippet.length > 280 ? details.answerSnippet.slice(0, 280) + '...' : details.answerSnippet}"
        </div>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${EMAIL_CONFIG.appOrigin}/student/doubts" style="display: inline-block; background-color: #09090b; color: #ffffff; padding: 12px 30px; border-radius: 8px; font-size: 14px; font-weight: 700; text-decoration: none;">
          View Full Discussion & Reply →
        </a>
      </div>
    `
  );

  return sendViaBrevo(toEmail, recipientName, subject, html);
}

/* ==========================================================================
   7. Certificate of Completion Email
   ========================================================================== */
export async function sendCertificateEmail(
  toEmail: string,
  details: {
    studentName: string;
    courseTitle: string;
    certificateCode: string;
    issueDate?: string;
  }
): Promise<boolean> {
  const subject = `🏆 Congratulations! Your Certificate for ${details.courseTitle} is Ready`;
  const preheader = `Verification Code: ${details.certificateCode}. Download and share your certificate.`;
  const verifyUrl = `${EMAIL_CONFIG.appOrigin}/verify-certificate?code=${details.certificateCode}`;

  const html = renderEmailLayout(
    subject,
    preheader,
    `
      <div style="text-align: center; margin-bottom: 24px;">
        <div style="display: inline-block; width: 64px; height: 64px; line-height: 64px; border-radius: 50%; background-color: #fef3c7; color: #d97706; font-size: 32px; margin-bottom: 12px;">
          🏆
        </div>
        <h2 style="margin: 0 0 8px; color: #09090b; font-size: 22px; font-weight: 800;">
          Certificate of Completion Awarded!
        </h2>
        <p style="margin: 0; color: #71717a; font-size: 14px;">
          Issued to <strong>${details.studentName}</strong> on ${details.issueDate || new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <p style="margin: 0 0 20px; color: #52525b; font-size: 15px; text-align: center;">
        Congratulations on your dedication and perseverance! You have successfully mastered all lessons, assignments, and curriculum criteria for <strong>${details.courseTitle}</strong>.
      </p>

      <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
        <div style="color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 700; letter-spacing: 1px; margin-bottom: 6px;">
          Cryptographic Certificate Code
        </div>
        <div style="font-family: 'Courier New', Courier, monospace; font-size: 20px; font-weight: 800; color: #0f172a; letter-spacing: 2px;">
          ${details.certificateCode}
        </div>
        <div style="color: #059669; font-size: 12px; font-weight: 600; margin-top: 6px;">
          ✓ Digitally Signed & Globally Verifiable
        </div>
      </div>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${verifyUrl}" style="display: inline-block; background-color: #09090b; color: #ffffff; padding: 14px 34px; border-radius: 8px; font-size: 15px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
          View & Download Certificate →
        </a>
      </div>

      <p style="margin: 0; color: #94a3b8; font-size: 12px; text-align: center;">
        Employers, universities, and institutions can independently verify the authenticity of your credential using the link above at any time.
      </p>
    `
  );

  return sendViaBrevo(toEmail, details.studentName, subject, html);
}
