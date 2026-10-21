// Ken Classes - EmailJS Integration Service
// Configured with Gmail service (kenclasses95@gmail.com) and Ken Classes templates.

export const EMAILJS_CONFIG = {
  serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_u2pq18q',
  templateOtp: import.meta.env.VITE_EMAILJS_TEMPLATE_OTP || 'template_iils3yg',
  templateWelcome: import.meta.env.VITE_EMAILJS_TEMPLATE_WELCOME || 'template_ytk9w6q',
  companyName: 'Ken Classes',
  supportEmail: 'kenclasses95@gmail.com',
  publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || localStorage.getItem('emailjs_public_key') || 'e8iQcLkwbSNDb6a5h',
  privateKey: import.meta.env.VITE_EMAILJS_PRIVATE_KEY || '',
};

export interface SendOtpParams {
  toEmail: string;
  toName?: string;
  otpCode: string;
  purpose?: 'REGISTRATION' | 'PASSWORD_RESET' | 'VERIFICATION';
}

export interface SendWelcomeParams {
  toEmail: string;
  toName: string;
  loginUrl?: string;
}

/**
 * Send 6-digit One-Time Password via EmailJS
 */
export async function sendOtpEmail(params: SendOtpParams): Promise<{ success: boolean; message: string }> {
  const publicKey = EMAILJS_CONFIG.publicKey;
  const privateKey = EMAILJS_CONFIG.privateKey;

  const templateParams = {
    to_name: params.toName || params.toEmail.split('@')[0],
    to_email: params.toEmail,
    email: params.toEmail,
    otp_code: params.otpCode,
    code: params.otpCode,
    passcode: params.otpCode,
    purpose: params.purpose === 'PASSWORD_RESET' ? 'Password Reset' : 'Account Verification',
    company_name: EMAILJS_CONFIG.companyName,
    support_email: EMAILJS_CONFIG.supportEmail,
    message: `Your Ken Classes verification code is: ${params.otpCode}. It expires in 15 minutes.`,
  };

  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_CONFIG.serviceId,
        template_id: EMAILJS_CONFIG.templateOtp,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: templateParams,
      }),
    });

    if (res.ok) {
      console.log(`[Ken Classes EmailJS] OTP successfully sent to ${params.toEmail}`);
      return { success: true, message: `Verification code sent to ${params.toEmail}` };
    } else {
      const errText = await res.text();
      console.error(`[Ken Classes EmailJS] Delivery failed:`, errText);
      return { success: false, message: `Failed to deliver email: ${errText}` };
    }
  } catch (error: any) {
    console.error(`[Ken Classes EmailJS] Network exception:`, error);
    return { success: false, message: error.message || 'Network error sending email' };
  }
}

/**
 * Send Welcome Email to newly registered student via EmailJS
 */
export async function sendWelcomeEmail(params: SendWelcomeParams): Promise<{ success: boolean; message: string }> {
  const publicKey = EMAILJS_CONFIG.publicKey;
  const privateKey = EMAILJS_CONFIG.privateKey;

  const templateParams = {
    to_name: params.toName,
    to_email: params.toEmail,
    email: params.toEmail,
    company_name: EMAILJS_CONFIG.companyName,
    support_email: EMAILJS_CONFIG.supportEmail,
    login_url: params.loginUrl || window.location.origin + '/login',
    message: `Welcome to ${EMAILJS_CONFIG.companyName}! Your account has been verified successfully.`,
  };

  try {
    const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        service_id: EMAILJS_CONFIG.serviceId,
        template_id: EMAILJS_CONFIG.templateWelcome,
        user_id: publicKey,
        accessToken: privateKey,
        template_params: templateParams,
      }),
    });

    if (res.ok) {
      console.log(`[Ken Classes EmailJS] Welcome email sent to ${params.toEmail}`);
      return { success: true, message: `Welcome email sent to ${params.toEmail}` };
    } else {
      const errText = await res.text();
      console.error(`[Ken Classes EmailJS] Welcome email delivery failed:`, errText);
      return { success: false, message: errText };
    }
  } catch (error: any) {
    console.error(`[Ken Classes EmailJS] Error:`, error);
    return { success: false, message: error.message };
  }
}
