// Ken Classes - Unified Multi-Provider Email Service
// Supports Brevo (Sendinblue 300 free/day), Resend (3,000 free/month), or EmailJS (default fallback)

export const EMAIL_CONFIG = {
  brevoApiKey: process.env.BREVO_API_KEY || '',
  resendApiKey: process.env.RESEND_API_KEY || '',
  companyName: process.env.COMPANY_NAME || 'Ken Classes',
  supportEmail: process.env.SUPPORT_EMAIL || 'kenclasses95@gmail.com',
  // EmailJS Fallback Keys
  emailjsServiceId: process.env.EMAILJS_SERVICE_ID || 'service_u2pq18q',
  emailjsTemplateOtp: process.env.EMAILJS_TEMPLATE_OTP || 'template_iils3yg',
  emailjsTemplateWelcome: process.env.EMAILJS_TEMPLATE_WELCOME || 'template_ytk9w6q',
  emailjsPublicKey: process.env.EMAILJS_PUBLIC_KEY || 'e8iQcLkwbSNDb6a5h',
  emailjsPrivateKey: process.env.EMAILJS_PRIVATE_KEY || '',
};

/**
 * Send OTP Code using the best available free provider (Brevo -> Resend -> EmailJS)
 */
export async function sendOtpEmail(
  toEmail: string,
  otpCode: string,
  toName?: string,
  purpose: string = 'Verification'
): Promise<boolean> {
  const recipientName = toName || toEmail.split('@')[0];

  // 1. Check Brevo (Sendinblue) - 300 free emails/day
  if (EMAIL_CONFIG.brevoApiKey) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': EMAIL_CONFIG.brevoApiKey,
        },
        body: JSON.stringify({
          sender: { name: EMAIL_CONFIG.companyName, email: EMAIL_CONFIG.supportEmail },
          to: [{ email: toEmail, name: recipientName }],
          subject: `${EMAIL_CONFIG.companyName} - Your ${purpose} Code: ${otpCode}`,
          htmlContent: `
            <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px;">
              <h2 style="color: #111827; margin-bottom: 8px;">${EMAIL_CONFIG.companyName}</h2>
              <p style="color: #4b5563; font-size: 14px;">Hello ${recipientName},</p>
              <p style="color: #4b5563; font-size: 14px;">Use the verification code below for ${purpose}:</p>
              <div style="background: #f3f4f6; padding: 16px; border-radius: 12px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 4px; color: #111827; margin: 20px 0;">
                ${otpCode}
              </div>
              <p style="color: #6b7280; font-size: 12px;">This code will expire in 15 minutes. If you did not request this code, please ignore this email.</p>
            </div>
          `,
        }),
      });

      if (res.ok) {
        console.log(`[Brevo Email Service] OTP delivered successfully to ${toEmail}`);
        return true;
      }
    } catch (err) {
      console.error('[Brevo Email Service] Error, falling back to EmailJS:', err);
    }
  }

  // 2. Check Resend - 3,000 free emails/month
  if (EMAIL_CONFIG.resendApiKey) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${EMAIL_CONFIG.resendApiKey}`,
        },
        body: JSON.stringify({
          from: `${EMAIL_CONFIG.companyName} <onboarding@resend.dev>`,
          to: [toEmail],
          subject: `${EMAIL_CONFIG.companyName} Security Code: ${otpCode}`,
          html: `
            <div style="font-family: sans-serif; padding: 20px;">
              <h2>${EMAIL_CONFIG.companyName}</h2>
              <p>Your one-time security code is: <strong>${otpCode}</strong></p>
              <p>Expires in 15 minutes.</p>
            </div>
          `,
        }),
      });

      if (res.ok) {
        console.log(`[Resend Email Service] OTP delivered successfully to ${toEmail}`);
        return true;
      }
    } catch (err) {
      console.error('[Resend Email Service] Error, falling back to EmailJS:', err);
    }
  }

  // 3. Fallback: EmailJS (Ready & Working)
  try {
    const payload = {
      service_id: EMAIL_CONFIG.emailjsServiceId,
      template_id: EMAIL_CONFIG.emailjsTemplateOtp,
      user_id: EMAIL_CONFIG.emailjsPublicKey,
      accessToken: EMAIL_CONFIG.emailjsPrivateKey,
      template_params: {
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
      },
    };

    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': process.env.APP_ORIGIN || 'https://auralms-platform.pages.dev',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.log(`[EmailJS Service] OTP delivered successfully to ${toEmail}`);
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

/**
 * Send Welcome Email to newly registered student
 */
export async function sendWelcomeEmail(toEmail: string, toName: string): Promise<boolean> {
  const recipientName = toName || toEmail.split('@')[0];

  // 1. Brevo
  if (EMAIL_CONFIG.brevoApiKey) {
    try {
      const res = await fetch('https://api.brevo.com/v3/smtp/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': EMAIL_CONFIG.brevoApiKey,
        },
        body: JSON.stringify({
          sender: { name: EMAIL_CONFIG.companyName, email: EMAIL_CONFIG.supportEmail },
          to: [{ email: toEmail, name: recipientName }],
          subject: `Welcome to ${EMAIL_CONFIG.companyName}! Your enrollment is active`,
          htmlContent: `
            <div style="font-family: sans-serif; max-width: 500px; margin: auto; padding: 24px; border: 1px solid #e5e7eb; border-radius: 16px;">
              <h2 style="color: #111827;">Welcome to ${EMAIL_CONFIG.companyName}!</h2>
              <p style="color: #4b5563;">Hello ${recipientName}, your account has been verified and your workspace is ready.</p>
              <a href="https://auralms-platform.pages.dev/student/dashboard" style="display: inline-block; background: #000; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; margin-top: 16px;">Go to Learning Hub</a>
            </div>
          `,
        }),
      });
      if (res.ok) return true;
    } catch (err) {
      console.error('[Brevo Welcome] Fallback to EmailJS:', err);
    }
  }

  // 2. EmailJS Fallback
  try {
    const payload = {
      service_id: EMAIL_CONFIG.emailjsServiceId,
      template_id: EMAIL_CONFIG.emailjsTemplateWelcome,
      user_id: EMAIL_CONFIG.emailjsPublicKey,
      accessToken: EMAIL_CONFIG.emailjsPrivateKey,
      template_params: {
        to_name: recipientName,
        to_email: toEmail,
        email: toEmail,
        company_name: EMAIL_CONFIG.companyName,
        support_email: EMAIL_CONFIG.supportEmail,
        message: `Welcome to ${EMAIL_CONFIG.companyName}! Your account has been activated.`,
      },
    };

    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': process.env.APP_ORIGIN || 'https://auralms-platform.pages.dev',
      },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (error) {
    console.error(`[EmailJS Welcome Error]`, error);
    return false;
  }
}
