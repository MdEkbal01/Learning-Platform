// Ken Classes - Backend EmailJS Dispatcher Service
// Integrates with Gmail Personal Service (kenclasses95@gmail.com) via EmailJS API

export const EMAILJS_CONFIG = {
  serviceId: process.env.EMAILJS_SERVICE_ID || 'service_u2pq18q',
  templateOtp: process.env.EMAILJS_TEMPLATE_OTP || 'template_iils3yg',
  templateWelcome: process.env.EMAILJS_TEMPLATE_WELCOME || 'template_ytk9w6q',
  companyName: 'Ken Classes',
  supportEmail: 'kenclasses95@gmail.com',
  publicKey: process.env.EMAILJS_PUBLIC_KEY || '',
};

export async function sendOtpEmail(toEmail: string, otpCode: string, toName?: string, purpose: string = 'Verification'): Promise<boolean> {
  const publicKey = EMAILJS_CONFIG.publicKey;

  const payload = {
    service_id: EMAILJS_CONFIG.serviceId,
    template_id: EMAILJS_CONFIG.templateOtp,
    user_id: publicKey,
    template_params: {
      to_name: toName || toEmail.split('@')[0],
      to_email: toEmail,
      email: toEmail,
      otp_code: otpCode,
      code: otpCode,
      passcode: otpCode,
      purpose,
      company_name: EMAILJS_CONFIG.companyName,
      support_email: EMAILJS_CONFIG.supportEmail,
      message: `Your Ken Classes security code is: ${otpCode}. It expires in 15 minutes.`,
    },
  };

  if (!publicKey) {
    console.log(`[Ken Classes] Simulated OTP ${otpCode} for ${toEmail}. Set EMAILJS_PUBLIC_KEY in .env for live Gmail sending.`);
    return true;
  }

  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      console.log(`[Ken Classes EmailJS] OTP successfully delivered to ${toEmail}`);
      return true;
    } else {
      const err = await res.text();
      console.error(`[Ken Classes EmailJS] Delivery failure:`, err);
      return false;
    }
  } catch (error) {
    console.error(`[Ken Classes EmailJS] Error sending email:`, error);
    return false;
  }
}

export async function sendWelcomeEmail(toEmail: string, toName: string): Promise<boolean> {
  const publicKey = EMAILJS_CONFIG.publicKey;

  const payload = {
    service_id: EMAILJS_CONFIG.serviceId,
    template_id: EMAILJS_CONFIG.templateWelcome,
    user_id: publicKey,
    template_params: {
      to_name: toName,
      to_email: toEmail,
      email: toEmail,
      company_name: EMAILJS_CONFIG.companyName,
      support_email: EMAILJS_CONFIG.supportEmail,
      message: `Welcome to ${EMAILJS_CONFIG.companyName}! Your enrollment and account have been activated.`,
    },
  };

  if (!publicKey) {
    console.log(`[Ken Classes] Welcome email simulated for ${toEmail}.`);
    return true;
  }

  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    return res.ok;
  } catch (error) {
    console.error(`[Ken Classes EmailJS] Error sending welcome email:`, error);
    return false;
  }
}
