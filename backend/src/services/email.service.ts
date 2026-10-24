// Ken Classes - Multi-Provider Prioritized Email Dispatch Engine
// Priority Queue (Ranked by Daily Quota Volume & Template Capabilities):
// Tier 1: Brevo (Sendinblue) Transactional REST API v3 (300 emails/day - Primary Queue Leader)
// Tier 2: Mailjet Send API v3.1 (200 emails/day - Secondary Queue Provider)
// Tier 3: Resend Messages API (100 emails/day - Tertiary Queue Provider)
// Tier 4: Mailgun Messages API (Domain/Sandbox Fallback)
// Tier 5 / Final Option: EmailJS Automated Dispatch (Activated ONLY when all upstream providers exceed limits)

export const EMAIL_CONFIG = {
  // Tier 1: Brevo (300 emails/day - Primary Queue Leader)
  brevoApiKey: process.env.BREVO_API_KEY || '',
  brevoSmtpKey: process.env.BREVO_SMTP_KEY || '',
  brevoSenderEmail: process.env.BREVO_SENDER_EMAIL || 'zainulabideen01telo@gmail.com',
  brevoSenderName: process.env.BREVO_SENDER_NAME || 'Ken Classes',

  // Tier 2: Mailjet (200 emails/day - Secondary Queue Provider)
  mailjetApiKey: process.env.MAILJET_API_KEY || '',
  mailjetSecretKey: process.env.MAILJET_SECRET_KEY || '',
  mailjetSenderEmail: process.env.MAILJET_SENDER_EMAIL || 'zainul7abideen@gmail.com',
  mailjetSenderName: process.env.MAILJET_SENDER_NAME || 'Ken Classes',

  // Tier 3: Resend (100 emails/day - Tertiary Queue Provider)
  resendApiKey: process.env.RESEND_API_KEY || '',
  resendSenderEmail: process.env.RESEND_SENDER_EMAIL || 'onboarding@resend.dev',
  resendSenderName: process.env.RESEND_SENDER_NAME || 'Ken Classes',

  // Tier 4: Mailgun (Domain / Sandbox Provider)
  mailgunApiKey: process.env.MAILGUN_API_KEY || '',
  mailgunDomain: process.env.MAILGUN_DOMAIN || 'sandbox751939baa6a646dc97fe91e78993a6d7.mailgun.org',
  mailgunBaseUrl: process.env.MAILGUN_BASE_URL || 'https://api.mailgun.net',
  mailgunSenderEmail: process.env.MAILGUN_SENDER_EMAIL || 'postmaster@sandbox751939baa6a646dc97fe91e78993a6d7.mailgun.org',
  mailgunSenderName: process.env.MAILGUN_SENDER_NAME || 'Ken Classes',

  // Tier 5 / Final Option: EmailJS (Final Failover - Activated strictly when upstream limits are exceeded)
  emailjsServiceId: process.env.EMAILJS_SERVICE_ID || 'service_u2pq18q',
  emailjsTemplateOtp: process.env.EMAILJS_TEMPLATE_OTP || 'template_iils3yg',
  emailjsTemplateWelcome: process.env.EMAILJS_TEMPLATE_WELCOME || 'template_ytk9w6q',
  emailjsPublicKey: process.env.EMAILJS_PUBLIC_KEY || 'e8iQcLkwbSNDb6a5h',
  emailjsPrivateKey: process.env.EMAILJS_PRIVATE_KEY || '',

  // Platform & Official Contact Metadata
  companyName: process.env.COMPANY_NAME || 'Ken Classes',
  supportEmail: process.env.SUPPORT_EMAIL || 'kenclasses95@gmail.com',
  appOrigin: process.env.APP_ORIGIN || 'https://auralms-platform.pages.dev',
};

/**
 * Standard branded HTML email layout with official Ken Classes circular emblem logo
 */
function renderEmailLayout(title: string, preheaderText: string, contentHtml: string): string {
  const logoUrl = `${EMAIL_CONFIG.appOrigin}/logo.png`;

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

  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 32px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.06), 0 8px 10px -6px rgba(0, 0, 0, 0.02); border: 1px solid #e2e8f0;">
          
          <!-- Header Banner with Official Ken Classes Logo -->
          <tr>
            <td style="background: linear-gradient(135deg, #091a2d 0%, #0e2238 100%); padding: 26px 36px; text-align: left; border-bottom: 3px solid #d4af37;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="64" valign="middle">
                    <img
                      src="${logoUrl}"
                      alt="Ken Classes"
                      width="54"
                      height="54"
                      style="display: block; border-radius: 50%; border: 2px solid #d4af37; object-fit: cover;"
                    />
                  </td>
                  <td style="padding-left: 16px;" valign="middle">
                    <div style="color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; line-height: 1.2;">
                      ${EMAIL_CONFIG.companyName}
                    </div>
                    <div style="color: #e2b342; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 3px;">
                      Learning Without Limits • Class 1 to PhD
                    </div>
                  </td>
                  <td align="right" valign="middle">
                    <span style="background: rgba(212, 175, 55, 0.15); border: 1px solid rgba(212, 175, 55, 0.4); color: #fde047; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase; letter-spacing: 0.8px;">
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

          <!-- Footer with Official Contact Info -->
          <tr>
            <td style="background-color: #fafafa; border-top: 1px solid #e4e4e7; padding: 24px 36px; text-align: center; color: #71717a; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0 0 6px; font-weight: 700; color: #18181b;">
                ${EMAIL_CONFIG.companyName} • Class 1 to PhD Academic & Professional Learning Platform
              </p>
              <p style="margin: 0 0 10px;">
                Official Contact & Support: <a href="mailto:${EMAIL_CONFIG.supportEmail}" style="color: #2563eb; text-decoration: none; font-weight: 700;">${EMAIL_CONFIG.supportEmail}</a>
              </p>
              <p style="margin: 0; color: #a1a1aa; font-size: 11px;">
                You received this transactional notice because of an account action on <a href="${EMAIL_CONFIG.appOrigin}" style="color: #71717a; text-decoration: underline;">${EMAIL_CONFIG.appOrigin}</a>.
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
 * Tier 1: Send via Brevo REST API v3 (300 emails/day capacity - Primary Queue Leader)
 */
async function sendViaBrevo(
  toEmail: string,
  toName: string,
  subject: string,
  htmlContent: string,
  textContent?: string
): Promise<boolean> {
  if (!EMAIL_CONFIG.brevoApiKey) {
    return false;
  }

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': EMAIL_CONFIG.brevoApiKey,
        accept: 'application/json',
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
      console.log(`[Tier 1: Brevo] Delivered "${subject}" to ${toEmail} (ID: ${data.messageId})`);
      return true;
    }

    const errorText = await response.text();
    console.warn(`[Tier 1: Brevo Quota/Notice] HTTP ${response.status}: ${errorText}. Advancing to Tier 2 (Mailjet)...`);
    return false;
  } catch (err) {
    console.warn('[Tier 1: Brevo Network/Exception]', err);
    return false;
  }
}

/**
 * Tier 2: Send via Mailjet Send API v3.1 (200 emails/day capacity - Secondary Queue Provider)
 */
async function sendViaMailjet(
  toEmail: string,
  toName: string,
  subject: string,
  htmlContent: string,
  textContent?: string
): Promise<boolean> {
  if (!EMAIL_CONFIG.mailjetApiKey || !EMAIL_CONFIG.mailjetSecretKey) {
    return false;
  }

  try {
    const authHeader =
      'Basic ' +
      Buffer.from(`${EMAIL_CONFIG.mailjetApiKey}:${EMAIL_CONFIG.mailjetSecretKey}`).toString('base64');

    const response = await fetch('https://api.mailjet.com/v3.1/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({
        Messages: [
          {
            From: {
              Email: EMAIL_CONFIG.mailjetSenderEmail,
              Name: EMAIL_CONFIG.mailjetSenderName,
            },
            To: [
              {
                Email: toEmail,
                Name: toName || toEmail.split('@')[0],
              },
            ],
            Subject: subject,
            HTMLPart: htmlContent,
            TextPart: textContent || subject,
          },
        ],
      }),
    });

    if (response.ok) {
      const data: any = await response.json();
      const status = data?.Messages?.[0]?.Status;
      if (status === 'success') {
        console.log(`[Tier 2: Mailjet] Delivered "${subject}" to ${toEmail}`);
        return true;
      }
    }

    const errText = await response.text();
    console.warn(`[Tier 2: Mailjet Limit/Notice] ${errText}. Advancing to Tier 3 (Resend)...`);
    return false;
  } catch (err) {
    console.warn('[Tier 2: Mailjet Network/Exception]', err);
    return false;
  }
}

/**
 * Tier 3: Send via Resend REST API (100 emails/day capacity - Tertiary Queue Provider)
 */
async function sendViaResend(
  toEmail: string,
  toName: string,
  subject: string,
  htmlContent: string,
  textContent?: string
): Promise<boolean> {
  if (!EMAIL_CONFIG.resendApiKey) {
    return false;
  }

  try {
    const fromAddress = EMAIL_CONFIG.resendSenderEmail.includes('<')
      ? EMAIL_CONFIG.resendSenderEmail
      : `${EMAIL_CONFIG.resendSenderName} <${EMAIL_CONFIG.resendSenderEmail}>`;

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${EMAIL_CONFIG.resendApiKey}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [toEmail],
        subject,
        html: htmlContent,
        text: textContent || subject,
        reply_to: EMAIL_CONFIG.supportEmail,
      }),
    });

    if (response.ok) {
      const data: any = await response.json();
      console.log(`[Tier 3: Resend] Delivered "${subject}" to ${toEmail} (ID: ${data.id})`);
      return true;
    }

    const errText = await response.text();
    console.warn(`[Tier 3: Resend Limit/Notice] HTTP ${response.status}: ${errText}. Advancing to Tier 4 (Mailgun)...`);
    return false;
  } catch (err) {
    console.warn('[Tier 3: Resend Network/Exception]', err);
    return false;
  }
}

/**
 * Tier 4: Send via Mailgun Messages API (Domain / Sandbox Provider)
 */
async function sendViaMailgun(
  toEmail: string,
  toName: string,
  subject: string,
  htmlContent: string,
  textContent?: string
): Promise<boolean> {
  if (!EMAIL_CONFIG.mailgunApiKey || !EMAIL_CONFIG.mailgunDomain) {
    return false;
  }

  try {
    const authHeader =
      'Basic ' +
      Buffer.from(`api:${EMAIL_CONFIG.mailgunApiKey}`).toString('base64');

    const params = new URLSearchParams();
    params.append('from', `${EMAIL_CONFIG.companyName} <${EMAIL_CONFIG.mailgunSenderEmail}>`);
    params.append('to', toEmail);
    params.append('subject', subject);
    params.append('html', htmlContent);
    params.append('text', textContent || subject);
    params.append('h:Reply-To', EMAIL_CONFIG.supportEmail);

    const baseUrl = (EMAIL_CONFIG.mailgunBaseUrl || 'https://api.mailgun.net').replace(/\/+$/, '');
    const url = `${baseUrl}/v3/${EMAIL_CONFIG.mailgunDomain}/messages`;

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    if (response.ok) {
      const data: any = await response.json();
      console.log(`[Tier 4: Mailgun] Delivered "${subject}" to ${toEmail} (ID: ${data.id})`);
      return true;
    }

    const errText = await response.text();
    console.warn(`[Tier 4: Mailgun Limit/Notice] HTTP ${response.status}: ${errText}. Advancing to Final Option (EmailJS)...`);
    return false;
  } catch (err) {
    console.warn('[Tier 4: Mailgun Network/Exception]', err);
    return false;
  }
}

/**
 * Tier 5 / Final Option: Send via EmailJS (Activated ONLY when all upstream providers exceed limits)
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
        Origin: EMAIL_CONFIG.appOrigin,
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.log(`[Tier 5: EmailJS] Final failover delivered successfully.`);
      return true;
    } else {
      const err = await res.text();
      console.error(`[Tier 5: EmailJS Service] Delivery failure:`, err);
      return false;
    }
  } catch (error) {
    console.error(`[Tier 5: EmailJS Service Error]`, error);
    return false;
  }
}

/**
 * Prioritized Cascade Dispatcher:
 * Tier 1: Brevo (300/day) ➔ Tier 2: Mailjet (200/day) ➔ Tier 3: Resend (100/day) ➔ Tier 4: Mailgun ➔ Tier 5 / Final Option: EmailJS
 */
async function dispatchTieredEmail(
  toEmail: string,
  toName: string,
  subject: string,
  htmlContent: string,
  textContent: string,
  emailJsTemplateId: string,
  emailJsParams: Record<string, string>
): Promise<boolean> {
  // 1. Tier 1: Brevo (300 emails/day - Highest Capacity)
  const brevoSuccess = await sendViaBrevo(toEmail, toName, subject, htmlContent, textContent);
  if (brevoSuccess) return true;

  // 2. Tier 2: Mailjet (200 emails/day)
  const mailjetSuccess = await sendViaMailjet(toEmail, toName, subject, htmlContent, textContent);
  if (mailjetSuccess) return true;

  // 3. Tier 3: Resend (100 emails/day)
  const resendSuccess = await sendViaResend(toEmail, toName, subject, htmlContent, textContent);
  if (resendSuccess) return true;

  // 4. Tier 4: Mailgun (Sandbox / Domain Fallback)
  const mailgunSuccess = await sendViaMailgun(toEmail, toName, subject, htmlContent, textContent);
  if (mailgunSuccess) return true;

  // 5. Tier 5 / Final Option: EmailJS (Activated when all upstream free providers are exhausted)
  console.log(`[Final Option: EmailJS] Activating EmailJS fallback for ${toEmail}...`);
  return sendViaEmailJs(emailJsTemplateId, emailJsParams);
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
          <strong>Security Tip:</strong> Never share this code with anyone, including mentors or staff. Ken Classes representatives will never ask for your verification code.
        </p>
      </div>

      <p style="margin: 0; color: #71717a; font-size: 13px;">
        If you did not request this verification, you can safely disregard this email or report suspicious activity to our official desk at <a href="mailto:${EMAIL_CONFIG.supportEmail}" style="color: #2563eb; font-weight: bold;">${EMAIL_CONFIG.supportEmail}</a>.
      </p>
    `
  );

  return dispatchTieredEmail(
    toEmail,
    recipientName,
    subject,
    html,
    `Your Ken Classes ${purpose} code is: ${otpCode}. It expires in 15 minutes.`,
    EMAIL_CONFIG.emailjsTemplateOtp,
    {
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
    }
  );
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
        If you have questions at any step, reply directly to this email or contact us at <a href="mailto:${EMAIL_CONFIG.supportEmail}" style="color: #2563eb; font-weight: bold;">${EMAIL_CONFIG.supportEmail}</a>. Happy learning!
      </p>
    `
  );

  return dispatchTieredEmail(
    toEmail,
    recipientName,
    subject,
    html,
    `Welcome to Ken Classes! Your account is active. Access your workspace at: ${EMAIL_CONFIG.appOrigin}/student/dashboard`,
    EMAIL_CONFIG.emailjsTemplateWelcome,
    {
      to_name: recipientName,
      to_email: toEmail,
      email: toEmail,
      company_name: EMAIL_CONFIG.companyName,
      support_email: EMAIL_CONFIG.supportEmail,
      message: `Welcome to ${EMAIL_CONFIG.companyName}! Your account has been activated.`,
    }
  );
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

  return dispatchTieredEmail(
    toEmail,
    recipientName,
    subject,
    html,
    `Security Alert: The password for your Ken Classes account was successfully updated. If you did not make this change, please contact support at ${EMAIL_CONFIG.supportEmail}`,
    EMAIL_CONFIG.emailjsTemplateWelcome,
    {
      to_name: recipientName,
      to_email: toEmail,
      email: toEmail,
      company_name: EMAIL_CONFIG.companyName,
      support_email: EMAIL_CONFIG.supportEmail,
      message: `Security Notice: The password for your Ken Classes account was successfully changed. If you did not make this change, please contact support immediately at ${EMAIL_CONFIG.supportEmail}`,
    }
  );
}

/* ==========================================================================
   4. Course Enrollment & Fee Receipt (Tax Invoice in ₹ INR)
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
        A copy of this digital receipt is permanently saved in your student profile under <strong>My Orders</strong>. Questions? Contact <a href="mailto:${EMAIL_CONFIG.supportEmail}" style="color: #2563eb;">${EMAIL_CONFIG.supportEmail}</a>.
      </p>
    `
  );

  return dispatchTieredEmail(
    toEmail,
    recipientName,
    subject,
    html,
    `Enrollment Confirmed: "${details.courseTitle}". Order #: ${details.orderNumber}. Amount: ${formattedAmount}. Classroom access: ${EMAIL_CONFIG.appOrigin}${details.courseId ? `/classroom/${details.courseId}` : '/student/courses'}`,
    EMAIL_CONFIG.emailjsTemplateWelcome,
    {
      to_name: recipientName,
      to_email: toEmail,
      email: toEmail,
      company_name: EMAIL_CONFIG.companyName,
      support_email: EMAIL_CONFIG.supportEmail,
      message: `Enrollment Confirmed! You are actively enrolled in "${details.courseTitle}". Receipt #: ${details.orderNumber}. Amount: ${formattedAmount}. Enter classroom: ${EMAIL_CONFIG.appOrigin}${details.courseId ? `/classroom/${details.courseId}` : '/student/courses'}`,
    }
  );
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
        Note: If you are unable to attend live, the high-definition recording will be automatically published into your course curriculum within 24 hours. Contact: <a href="mailto:${EMAIL_CONFIG.supportEmail}" style="color: #2563eb;">${EMAIL_CONFIG.supportEmail}</a>
      </p>
    `
  );

  return dispatchTieredEmail(
    toEmail,
    recipientName,
    subject,
    html,
    `Live Class Alert: "${details.lectureTitle}" starts at ${details.scheduledAt}. Join here: ${details.meetingUrl}`,
    EMAIL_CONFIG.emailjsTemplateWelcome,
    {
      to_name: recipientName,
      to_email: toEmail,
      email: toEmail,
      company_name: EMAIL_CONFIG.companyName,
      support_email: EMAIL_CONFIG.supportEmail,
      message: `Live Lecture Alert: "${details.lectureTitle}" for course "${details.courseTitle}" starts at ${details.scheduledAt}. Join link: ${details.meetingUrl}`,
    }
  );
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

      <p style="margin: 0; color: #71717a; font-size: 12px; text-align: center;">
        Need more assistance? Reach our student support team anytime at <a href="mailto:${EMAIL_CONFIG.supportEmail}" style="color: #2563eb;">${EMAIL_CONFIG.supportEmail}</a>.
      </p>
    `
  );

  return dispatchTieredEmail(
    toEmail,
    recipientName,
    subject,
    html,
    `Doubt Answered: Mentor ${details.mentorName} replied to your question "${details.questionTitle}" in course ${details.courseTitle}. View details at: ${EMAIL_CONFIG.appOrigin}/student/doubts`,
    EMAIL_CONFIG.emailjsTemplateWelcome,
    {
      to_name: recipientName,
      to_email: toEmail,
      email: toEmail,
      company_name: EMAIL_CONFIG.companyName,
      support_email: EMAIL_CONFIG.supportEmail,
      message: `Doubt Resolved: Mentor ${details.mentorName} replied to "${details.questionTitle}" in course "${details.courseTitle}". Response excerpt: "${details.answerSnippet.slice(0, 150)}...". Open conversation: ${EMAIL_CONFIG.appOrigin}/student/doubts`,
    }
  );
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
        Employers, universities, and institutions can independently verify the authenticity of your credential using the link above at any time. Inquiries: <a href="mailto:${EMAIL_CONFIG.supportEmail}" style="color: #2563eb;">${EMAIL_CONFIG.supportEmail}</a>
      </p>
    `
  );

  return dispatchTieredEmail(
    toEmail,
    details.studentName,
    subject,
    html,
    `Congratulations! You completed ${details.courseTitle}. Certificate code: ${details.certificateCode}. View certificate: ${verifyUrl}`,
    EMAIL_CONFIG.emailjsTemplateWelcome,
    {
      to_name: details.studentName,
      to_email: toEmail,
      email: toEmail,
      company_name: EMAIL_CONFIG.companyName,
      support_email: EMAIL_CONFIG.supportEmail,
      message: `Congratulations! Your certificate of completion for "${details.courseTitle}" is ready. Certificate Code: ${details.certificateCode}. Verify & view: ${verifyUrl}`,
    }
  );
}

/* ==========================================================================
   8. Assignment / Assessment Graded Email
   ========================================================================== */
export async function sendAssignmentGradedEmail(
  toEmail: string,
  details: {
    studentName?: string;
    courseTitle: string;
    assignmentTitle: string;
    marksObtained: number;
    totalMarks: number;
    feedback?: string;
    reviewUrl?: string;
  }
): Promise<boolean> {
  const recipientName = details.studentName || toEmail.split('@')[0];
  const percentage = Math.round((details.marksObtained / (details.totalMarks || 100)) * 100);
  const subject = `📝 Assignment Graded: ${details.assignmentTitle} (${details.courseTitle})`;
  const preheader = `Your score: ${details.marksObtained}/${details.totalMarks} (${percentage}%). Feedback available.`;
  const reviewLink = details.reviewUrl || `${EMAIL_CONFIG.appOrigin}/student/assignments`;

  const html = renderEmailLayout(
    subject,
    preheader,
    `
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <span style="display: inline-block; background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 6px; text-transform: uppercase;">
          Grading Complete 📝
        </span>
      </div>

      <h2 style="margin: 0 0 12px; color: #09090b; font-size: 20px; font-weight: 700;">
        Your Assignment Has Been Evaluated!
      </h2>
      <p style="margin: 0 0 20px; color: #52525b; font-size: 15px;">
        Hello <strong>${recipientName}</strong>, your mentor has reviewed and graded your submission for <strong>${details.assignmentTitle}</strong> in <em>${details.courseTitle}</em>.
      </p>

      <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; padding: 22px; margin: 20px 0;">
        <table width="100%" border="0" cellspacing="0" cellpadding="8" style="font-size: 14px; color: #3f3f46;">
          <tr>
            <td style="color: #71717a;">Assignment:</td>
            <td align="right" style="font-weight: 700; color: #09090b;">${details.assignmentTitle}</td>
          </tr>
          <tr>
            <td style="color: #71717a;">Score Achieved:</td>
            <td align="right" style="font-weight: 800; color: #059669; font-size: 16px;">
              ${details.marksObtained} / ${details.totalMarks} (${percentage}%)
            </td>
          </tr>
          ${
            details.feedback
              ? `
          <tr style="border-top: 1px solid #e4e4e7;">
            <td colspan="2" style="padding-top: 12px;">
              <div style="color: #71717a; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">
                Mentor Feedback & Notes:
              </div>
              <div style="background: #ffffff; border: 1px solid #e4e4e7; border-radius: 8px; padding: 12px; font-style: italic; color: #27272a;">
                "${details.feedback}"
              </div>
            </td>
          </tr>
          `
              : ''
          }
        </table>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${reviewLink}" style="display: inline-block; background-color: #09090b; color: #ffffff; padding: 13px 32px; border-radius: 8px; font-size: 14px; font-weight: 700; text-decoration: none;">
          Review Graded Submission →
        </a>
      </div>

      <p style="margin: 0; color: #71717a; font-size: 12px; text-align: center;">
        Have questions regarding your score? You can open a doubt ticket or contact support at <a href="mailto:${EMAIL_CONFIG.supportEmail}" style="color: #2563eb;">${EMAIL_CONFIG.supportEmail}</a>.
      </p>
    `
  );

  return dispatchTieredEmail(
    toEmail,
    recipientName,
    subject,
    html,
    `Assignment Graded: "${details.assignmentTitle}" - Score: ${details.marksObtained}/${details.totalMarks} (${percentage}%). Review at: ${reviewLink}`,
    EMAIL_CONFIG.emailjsTemplateWelcome,
    {
      to_name: recipientName,
      to_email: toEmail,
      email: toEmail,
      company_name: EMAIL_CONFIG.companyName,
      support_email: EMAIL_CONFIG.supportEmail,
      message: `Your assignment "${details.assignmentTitle}" in course "${details.courseTitle}" was evaluated with score ${details.marksObtained}/${details.totalMarks}. Check results: ${reviewLink}`,
    }
  );
}

/* ==========================================================================
   9. New Course / Workshop Launch Announcement Email
   ========================================================================== */
export async function sendNewCourseAnnouncementEmail(
  toEmail: string,
  details: {
    studentName?: string;
    courseTitle: string;
    categoryName: string;
    description: string;
    priceFormatted: string;
    courseUrl?: string;
  }
): Promise<boolean> {
  const recipientName = details.studentName || toEmail.split('@')[0];
  const subject = `🚀 New Course Launch: ${details.courseTitle} [${details.categoryName}]`;
  const preheader = `Now available on Ken Classes: ${details.courseTitle}. Enroll today!`;
  const viewUrl = details.courseUrl || `${EMAIL_CONFIG.appOrigin}/courses`;

  const html = renderEmailLayout(
    subject,
    preheader,
    `
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <span style="display: inline-block; background: #fef3c7; color: #92400e; border: 1px solid #fde68a; font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 6px; text-transform: uppercase;">
          New Curriculum Launch 🚀
        </span>
      </div>

      <h2 style="margin: 0 0 12px; color: #09090b; font-size: 20px; font-weight: 700;">
        Explore Our Newest Course Offering!
      </h2>
      <p style="margin: 0 0 20px; color: #52525b; font-size: 15px;">
        Hello <strong>${recipientName}</strong>, we have just published a brand new curriculum in <strong>${details.categoryName}</strong> designed to take your skills to the next academic level:
      </p>

      <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; padding: 22px; margin: 20px 0;">
        <h3 style="margin: 0 0 8px; font-size: 17px; color: #09090b;">
          ${details.courseTitle}
        </h3>
        <p style="margin: 0 0 14px; font-size: 14px; color: #52525b; line-height: 1.5;">
          ${details.description.length > 250 ? details.description.slice(0, 250) + '...' : details.description}
        </p>
        <div style="font-size: 15px; font-weight: 800; color: #059669;">
          Enrollment Fee: ${details.priceFormatted}
        </div>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${viewUrl}" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 34px; border-radius: 8px; font-size: 15px; font-weight: 700; text-decoration: none; box-shadow: 0 4px 6px -1px rgba(37, 99, 235, 0.2);">
          View Syllabus & Enroll →
        </a>
      </div>

      <p style="margin: 0; color: #71717a; font-size: 12px; text-align: center;">
        Browse our full spectrum of courses spanning Class 1 to PhD at <a href="${EMAIL_CONFIG.appOrigin}/courses" style="color: #2563eb;">${EMAIL_CONFIG.appOrigin}</a>.
      </p>
    `
  );

  return dispatchTieredEmail(
    toEmail,
    recipientName,
    subject,
    html,
    `New Course Launch: ${details.courseTitle} (${details.categoryName}). Fee: ${details.priceFormatted}. Explore syllabus: ${viewUrl}`,
    EMAIL_CONFIG.emailjsTemplateWelcome,
    {
      to_name: recipientName,
      to_email: toEmail,
      email: toEmail,
      company_name: EMAIL_CONFIG.companyName,
      support_email: EMAIL_CONFIG.supportEmail,
      message: `Exciting Announcement: "${details.courseTitle}" is now live on Ken Classes! Discover more at: ${viewUrl}`,
    }
  );
}

/* ==========================================================================
   10. Account Role Upgrade / Elevation Notice
   ========================================================================== */
export async function sendAccountRoleChangeEmail(
  toEmail: string,
  details: {
    userName?: string;
    oldRole: string;
    newRole: string;
  }
): Promise<boolean> {
  const recipientName = details.userName || toEmail.split('@')[0];
  const subject = `🛡️ Security Notice: Ken Classes Account Role Updated`;
  const preheader = `Your account privileges have changed to ${details.newRole.toUpperCase()}.`;

  const html = renderEmailLayout(
    subject,
    preheader,
    `
      <div style="display: flex; align-items: center; margin-bottom: 12px;">
        <span style="display: inline-block; background: #e0e7ff; color: #3730a3; border: 1px solid #c7d2fe; font-size: 11px; font-weight: 800; padding: 4px 8px; border-radius: 6px; text-transform: uppercase;">
          Role Permission Update 🛡️
        </span>
      </div>

      <h2 style="margin: 0 0 12px; color: #09090b; font-size: 20px; font-weight: 700;">
        Your Account Role Has Changed
      </h2>
      <p style="margin: 0 0 20px; color: #52525b; font-size: 15px;">
        Hello <strong>${recipientName}</strong>, an authorized Super Administrator has updated your platform permission level on Ken Classes:
      </p>

      <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <table width="100%" border="0" cellspacing="0" cellpadding="8" style="font-size: 14px;">
          <tr>
            <td style="color: #71717a;">Previous Role:</td>
            <td align="right" style="font-weight: 600; color: #71717a;">${details.oldRole.toUpperCase()}</td>
          </tr>
          <tr>
            <td style="color: #71717a;">New Assigned Role:</td>
            <td align="right" style="font-weight: 800; color: #2563eb; font-size: 15px;">${details.newRole.toUpperCase()}</td>
          </tr>
          <tr>
            <td style="color: #71717a;">Effective As Of:</td>
            <td align="right" style="font-weight: 600; color: #09090b;">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</td>
          </tr>
        </table>
      </div>

      <div style="text-align: center; margin: 28px 0;">
        <a href="${EMAIL_CONFIG.appOrigin}/login" style="display: inline-block; background-color: #09090b; color: #ffffff; padding: 13px 30px; border-radius: 8px; font-size: 14px; font-weight: 700; text-decoration: none;">
          Sign In to Access New Privileges →
        </a>
      </div>

      <p style="margin: 0; color: #71717a; font-size: 12px; text-align: center;">
        If you did not anticipate this change, please report immediately to our security desk at <a href="mailto:${EMAIL_CONFIG.supportEmail}" style="color: #2563eb;">${EMAIL_CONFIG.supportEmail}</a>.
      </p>
    `
  );

  return dispatchTieredEmail(
    toEmail,
    recipientName,
    subject,
    html,
    `Account Role Updated: Your role has been changed from ${details.oldRole} to ${details.newRole}. Sign in at ${EMAIL_CONFIG.appOrigin}/login`,
    EMAIL_CONFIG.emailjsTemplateWelcome,
    {
      to_name: recipientName,
      to_email: toEmail,
      email: toEmail,
      company_name: EMAIL_CONFIG.companyName,
      support_email: EMAIL_CONFIG.supportEmail,
      message: `Your Ken Classes permission level has been changed from ${details.oldRole} to ${details.newRole}. Access dashboard: ${EMAIL_CONFIG.appOrigin}/login`,
    }
  );
}
