const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const BREVO_API_KEY = process.env.BREVO_API_KEY;
const MAILJET_API_KEY = process.env.MAILJET_API_KEY;
const MAILJET_SECRET_KEY = process.env.MAILJET_SECRET_KEY;
const MAILGUN_API_KEY = process.env.MAILGUN_API_KEY;
const MAILGUN_DOMAIN = process.env.MAILGUN_DOMAIN || 'sandbox751939baa6a646dc97fe91e78993a6d7.mailgun.org';

const LOGO_URL = 'https://auralms-platform.pages.dev/logo.png';
const SUPPORT_EMAIL = 'kenclasses95@gmail.com';
const APP_ORIGIN = 'https://auralms-platform.pages.dev';

function renderLayout(title, preheader, bodyHtml) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f1f5f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <div style="display: none; max-height: 0px; overflow: hidden;">${preheader}</div>
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f1f5f9; padding: 32px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.06); border: 1px solid #e2e8f0;">
          <tr>
            <td style="background: linear-gradient(135deg, #091a2d 0%, #0e2238 100%); padding: 26px 36px; border-bottom: 3px solid #d4af37;">
              <table width="100%" border="0" cellspacing="0" cellpadding="0">
                <tr>
                  <td width="64" valign="middle">
                    <img src="${LOGO_URL}" alt="Ken Classes" width="54" height="54" style="display: block; border-radius: 50%; border: 2px solid #d4af37; object-fit: cover;" />
                  </td>
                  <td style="padding-left: 16px;" valign="middle">
                    <div style="color: #ffffff; font-size: 22px; font-weight: 800; line-height: 1.2;">Ken Classes</div>
                    <div style="color: #e2b342; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; margin-top: 3px;">Learning Without Limits • Class 1 to PhD</div>
                  </td>
                  <td align="right" valign="middle">
                    <span style="background: rgba(212, 175, 55, 0.15); border: 1px solid rgba(212, 175, 55, 0.4); color: #fde047; font-size: 10px; font-weight: 800; padding: 4px 10px; border-radius: 9999px; text-transform: uppercase;">Official</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 36px 28px; color: #18181b; line-height: 1.6; font-size: 15px;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="background-color: #fafafa; border-top: 1px solid #e4e4e7; padding: 24px 36px; text-align: center; color: #71717a; font-size: 12px; line-height: 1.5;">
              <p style="margin: 0 0 6px; font-weight: 700; color: #18181b;">Ken Classes • Class 1 to PhD Academic & Professional Platform</p>
              <p style="margin: 0 0 10px;">Official Support Desk: <a href="mailto:${SUPPORT_EMAIL}" style="color: #2563eb; text-decoration: none; font-weight: 700;">${SUPPORT_EMAIL}</a></p>
              <p style="margin: 0; color: #a1a1aa; font-size: 11px;">Visit platform: <a href="${APP_ORIGIN}" style="color: #71717a;">${APP_ORIGIN}</a></p>
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

const TEMPLATES = [
  {
    key: 'otp_verification',
    name: 'Ken Classes - OTP & Security Verification',
    subject: 'Ken Classes - Your Security Code',
    preheader: 'Your single-use verification code is valid for 15 minutes.',
    body: (varSyntax) => `
      <h2 style="margin: 0 0 12px; color: #09090b; font-size: 20px; font-weight: 700;">Security Verification Request</h2>
      <p style="margin: 0 0 16px; color: #52525b;">Hello <strong>${varSyntax('name', 'Student')}</strong>,</p>
      <p style="margin: 0 0 20px; color: #52525b;">Use the one-time security passkey below to verify your Ken Classes account action:</p>
      <div style="background-color: #f4f4f5; border: 2px dashed #d4d4d8; border-radius: 12px; padding: 20px; text-align: center; margin: 24px 0;">
        <span style="font-family: 'Courier New', monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #09090b;">${varSyntax('code', '------')}</span>
        <div style="color: #71717a; font-size: 12px; margin-top: 6px;">Valid for 15 minutes • Single Use Only</div>
      </div>
      <div style="background-color: #eff6ff; border-left: 4px solid #2563eb; padding: 12px 16px; border-radius: 6px; margin: 20px 0; font-size: 13px; color: #1e40af;">
        <strong>Security Tip:</strong> Never share your verification code with anyone. Ken Classes staff will never ask for your code.
      </div>
    `
  },
  {
    key: 'welcome_onboarding',
    name: 'Ken Classes - Student Welcome & Onboarding',
    subject: 'Welcome to Ken Classes! Your Learning Journey Begins 🚀',
    preheader: 'Welcome aboard! Access courses from Class 1 to PhD.',
    body: (varSyntax) => `
      <h2 style="margin: 0 0 12px; color: #09090b; font-size: 20px; font-weight: 700;">Welcome to the Family, ${varSyntax('name', 'Learner')}! 🎉</h2>
      <p style="margin: 0 0 16px; color: #52525b;">Your Ken Classes account is fully activated. You now have complete access to our academic ecosystem covering Primary school, Secondary boards, JEE/NEET entrance, University degrees, and Doctoral research.</p>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${APP_ORIGIN}/student/dashboard" style="display: inline-block; background-color: #09090b; color: #ffffff; padding: 14px 32px; border-radius: 8px; font-weight: 700; text-decoration: none;">Open Student Workspace →</a>
      </div>
    `
  },
  {
    key: 'password_reset_success',
    name: 'Ken Classes - Password Changed Notification',
    subject: 'Ken Classes - Security Alert: Password Updated',
    preheader: 'Your account password was successfully updated.',
    body: (varSyntax) => `
      <h2 style="margin: 0 0 12px; color: #09090b; font-size: 20px; font-weight: 700;">Password Changed Successfully</h2>
      <p style="margin: 0 0 16px; color: #52525b;">Hello <strong>${varSyntax('name', 'User')}</strong>,</p>
      <p style="margin: 0 0 20px; color: #52525b;">This email confirms that the password for your Ken Classes account was successfully updated.</p>
      <div style="background-color: #fef2f2; border-left: 4px solid #ef4444; padding: 14px; border-radius: 6px; color: #991b1b; font-size: 13px;">
        <strong>Did not make this change?</strong> Contact our support immediately at <a href="mailto:${SUPPORT_EMAIL}" style="color: #991b1b; font-weight: bold;">${SUPPORT_EMAIL}</a>.
      </div>
    `
  },
  {
    key: 'enrollment_receipt',
    name: 'Ken Classes - Course Enrollment & Tax Receipt',
    subject: 'Ken Classes - Course Enrolment Confirmation',
    preheader: 'Your course enrollment is active. Tax invoice attached.',
    body: (varSyntax) => `
      <h2 style="margin: 0 0 12px; color: #09090b; font-size: 20px; font-weight: 700;">Congratulations on Your Enrolment!</h2>
      <p style="margin: 0 0 20px; color: #52525b;">Your access to <strong>${varSyntax('course_title', 'Course')}</strong> is active with lifetime access to all lectures, notes, and mentor doubts.</p>
      <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <div style="font-weight: 700; color: #09090b; margin-bottom: 8px;">Order Reference: ${varSyntax('order_number', 'KC-ORD-XXXX')}</div>
        <div style="color: #059669; font-size: 18px; font-weight: 800;">Amount Paid: ${varSyntax('amount_formatted', '₹0')}</div>
      </div>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${APP_ORIGIN}/student/courses" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 34px; border-radius: 8px; font-weight: 700; text-decoration: none;">Enter Classroom Now →</a>
      </div>
    `
  },
  {
    key: 'live_lecture_reminder',
    name: 'Ken Classes - Live Masterclass Reminder',
    subject: '🔴 Live Class Alert: Starting Soon',
    preheader: 'Your live interactive class starts soon. 1-click join inside.',
    body: (varSyntax) => `
      <h2 style="margin: 0 0 12px; color: #09090b; font-size: 20px; font-weight: 700;">Your Live Class Starts Soon! 🔴</h2>
      <p style="margin: 0 0 16px; color: #52525b;">A live masterclass for <strong>${varSyntax('course_title', 'Your Course')}</strong> is scheduled:</p>
      <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <div style="font-weight: 700; font-size: 16px; color: #09090b;">${varSyntax('lecture_title', 'Live Session')}</div>
        <div style="color: #2563eb; font-weight: 700; margin-top: 6px;">Scheduled Time: ${varSyntax('scheduled_time', 'Soon')}</div>
      </div>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${varSyntax('join_url', APP_ORIGIN)}" style="display: inline-block; background-color: #dc2626; color: #ffffff; padding: 14px 34px; border-radius: 8px; font-weight: 700; text-decoration: none;">Join Live Classroom →</a>
      </div>
    `
  },
  {
    key: 'doubt_resolved',
    name: 'Ken Classes - Doubt Desk Mentor Response',
    subject: '💡 Doubt Resolved: Your Query Was Answered',
    preheader: 'A mentor has replied to your doubt query.',
    body: (varSyntax) => `
      <h2 style="margin: 0 0 12px; color: #09090b; font-size: 20px; font-weight: 700;">Your Doubt Has Been Answered! 💡</h2>
      <p style="margin: 0 0 16px; color: #52525b;">Mentor <strong>${varSyntax('mentor_name', 'Senior Mentor')}</strong> has answered your question in <em>${varSyntax('course_title', 'Course')}</em>:</p>
      <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; padding: 18px; margin: 20px 0; font-style: italic;">
        "${varSyntax('answer_excerpt', 'Response details...')}"
      </div>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${APP_ORIGIN}/student/doubts" style="display: inline-block; background-color: #09090b; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-weight: 700; text-decoration: none;">View Discussion & Reply →</a>
      </div>
    `
  },
  {
    key: 'certificate_awarded',
    name: 'Ken Classes - Certificate of Completion',
    subject: '🏆 Congratulations! Your Certificate is Ready',
    preheader: 'Your cryptographic certificate of completion has been issued.',
    body: (varSyntax) => `
      <div style="text-align: center; margin-bottom: 20px;">
        <div style="display: inline-block; width: 56px; height: 56px; line-height: 56px; border-radius: 50%; background-color: #fef3c7; color: #d97706; font-size: 28px; margin-bottom: 8px;">🏆</div>
        <h2 style="margin: 0; color: #09090b; font-size: 22px; font-weight: 800;">Certificate of Completion Awarded!</h2>
      </div>
      <p style="text-align: center; color: #52525b;">You have successfully mastered all curriculum criteria for <strong>${varSyntax('course_title', 'Course')}</strong>.</p>
      <div style="background-color: #f8fafc; border: 2px solid #e2e8f0; border-radius: 12px; padding: 18px; text-align: center; margin: 22px 0;">
        <div style="color: #64748b; font-size: 11px; text-transform: uppercase; font-weight: 700;">Certificate Verification Code</div>
        <div style="font-family: monospace; font-size: 20px; font-weight: 800; color: #0f172a; margin-top: 4px;">${varSyntax('certificate_code', 'KC-CERT-XXXX')}</div>
      </div>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${APP_ORIGIN}/verify-certificate" style="display: inline-block; background-color: #09090b; color: #ffffff; padding: 14px 34px; border-radius: 8px; font-weight: 700; text-decoration: none;">View & Download Certificate →</a>
      </div>
    `
  },
  {
    key: 'assignment_graded',
    name: 'Ken Classes - Assignment Graded Notification',
    subject: '📝 Assignment Graded: Evaluation Complete',
    preheader: 'Your homework submission has been evaluated by mentors.',
    body: (varSyntax) => `
      <h2 style="margin: 0 0 12px; color: #09090b; font-size: 20px; font-weight: 700;">Your Assignment Has Been Evaluated! 📝</h2>
      <p style="margin: 0 0 16px; color: #52525b;">Your submission for <strong>${varSyntax('assignment_title', 'Assignment')}</strong> has been reviewed:</p>
      <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <div style="font-weight: 800; color: #059669; font-size: 18px;">Score: ${varSyntax('score', '100/100')}</div>
        <div style="color: #71717a; margin-top: 8px;">Feedback: "${varSyntax('feedback', 'Great work!')}"</div>
      </div>
      <div style="text-align: center; margin: 26px 0;">
        <a href="${APP_ORIGIN}/student/assignments" style="display: inline-block; background-color: #09090b; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-weight: 700; text-decoration: none;">Review Graded Assignment →</a>
      </div>
    `
  },
  {
    key: 'course_launch',
    name: 'Ken Classes - New Course Launch Announcement',
    subject: '🚀 New Course Launch: Explore New Curriculums',
    preheader: 'Now available on Ken Classes. Enroll today!',
    body: (varSyntax) => `
      <h2 style="margin: 0 0 12px; color: #09090b; font-size: 20px; font-weight: 700;">Brand New Curriculum Available! 🚀</h2>
      <p style="margin: 0 0 16px; color: #52525b;">Discover our latest course in <strong>${varSyntax('category', 'Academics')}</strong>:</p>
      <div style="background-color: #fafafa; border: 1px solid #e4e4e7; border-radius: 12px; padding: 20px; margin: 20px 0;">
        <h3 style="margin: 0 0 8px; font-size: 17px;">${varSyntax('course_title', 'New Course')}</h3>
        <p style="margin: 0; color: #52525b;">${varSyntax('description', 'Comprehensive syllabus from Class 1 to PhD.')}</p>
      </div>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${APP_ORIGIN}/courses" style="display: inline-block; background-color: #2563eb; color: #ffffff; padding: 14px 34px; border-radius: 8px; font-weight: 700; text-decoration: none;">View Course & Enroll →</a>
      </div>
    `
  },
  {
    key: 'role_changed',
    name: 'Ken Classes - Account Role Permission Update',
    subject: '🛡️ Security Notice: Account Role Updated',
    preheader: 'Your account privileges have changed.',
    body: (varSyntax) => `
      <h2 style="margin: 0 0 12px; color: #09090b; font-size: 20px; font-weight: 700;">Account Permission Updated 🛡️</h2>
      <p style="margin: 0 0 16px; color: #52525b;">Your Ken Classes account privileges have been updated to <strong>${varSyntax('new_role', 'UPDATED')}</strong>.</p>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${APP_ORIGIN}/login" style="display: inline-block; background-color: #09090b; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-weight: 700; text-decoration: none;">Sign In to Dashboard →</a>
      </div>
    `
  }
];

async function syncBrevoTemplates() {
  console.log('\n--- Syncing Brevo Transactional Templates ---');
  if (!BREVO_API_KEY) {
    console.warn('Brevo API key not found, skipping Brevo template sync.');
    return;
  }

  // Get existing templates
  const existingRes = await fetch('https://api.brevo.com/v3/smtp/templates', {
    headers: { 'api-key': BREVO_API_KEY, accept: 'application/json' }
  });
  const existingData = await existingRes.json();
  const existingNames = new Set((existingData.templates || []).map(t => t.name));

  for (const t of TEMPLATES) {
    if (existingNames.has(t.name)) {
      console.log(`[Brevo] Template already exists: "${t.name}" (Skipping)`);
      continue;
    }

    const html = renderLayout(t.subject, t.preheader, t.body((key, def) => `{{ params.${key} }}`));
    const createRes = await fetch('https://api.brevo.com/v3/smtp/templates', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
        accept: 'application/json'
      },
      body: JSON.stringify({
        templateName: t.name,
        subject: t.subject,
        sender: {
          name: 'Ken Classes',
          email: 'zainulabideen01telo@gmail.com'
        },
        replyTo: SUPPORT_EMAIL,
        htmlContent: html,
        isActive: true
      })
    });

    const createData = await createRes.json();
    if (createRes.ok) {
      console.log(`[Brevo] Created template "${t.name}" -> ID: ${createData.id}`);
    } else {
      console.warn(`[Brevo] Error creating "${t.name}":`, createData);
    }
  }
}

async function syncMailjetTemplates() {
  console.log('\n--- Syncing Mailjet Transactional Templates ---');
  if (!MAILJET_API_KEY || !MAILJET_SECRET_KEY) {
    console.warn('Mailjet keys not found, skipping Mailjet template sync.');
    return;
  }

  const auth = 'Basic ' + Buffer.from(`${MAILJET_API_KEY}:${MAILJET_SECRET_KEY}`).toString('base64');
  const existingRes = await fetch('https://api.mailjet.com/v3/REST/template', {
    headers: { Authorization: auth }
  });
  const existingData = await existingRes.json();
  const existingNames = new Set((existingData.Data || []).map(t => t.Name));

  for (const t of TEMPLATES) {
    if (existingNames.has(t.name)) {
      console.log(`[Mailjet] Template already exists: "${t.name}" (Skipping)`);
      continue;
    }

    const html = renderLayout(t.subject, t.preheader, t.body((key, def) => `{{var:${key}:"${def}"}}`));
    const createRes = await fetch('https://api.mailjet.com/v3/REST/template', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: auth },
      body: JSON.stringify({
        Name: t.name,
        Author: 'Ken Classes',
        Description: t.name,
        Purposes: ['transactional']
      })
    });

    const createData = await createRes.json();
    if (createRes.ok && createData.Data && createData.Data[0]) {
      const templateId = createData.Data[0].ID;
      await fetch(`https://api.mailjet.com/v3/REST/template/${templateId}/detailcontent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: auth },
        body: JSON.stringify({
          'Html-part': html,
          'Text-part': `${t.subject}\n\nVisit: ${APP_ORIGIN}`
        })
      });
      console.log(`[Mailjet] Created template "${t.name}" -> ID: ${templateId}`);
    } else {
      console.warn(`[Mailjet] Error creating "${t.name}":`, createData);
    }
  }
}

async function syncMailgunTemplates() {
  console.log('\n--- Syncing Mailgun Transactional Templates ---');
  if (!MAILGUN_API_KEY || !MAILGUN_DOMAIN) {
    console.warn('Mailgun credentials not found, skipping Mailgun template sync.');
    return;
  }

  const auth = 'Basic ' + Buffer.from(`api:${MAILGUN_API_KEY}`).toString('base64');
  const existingRes = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/templates`, {
    headers: { Authorization: auth }
  });
  const existingData = await existingRes.json();
  const existingNames = new Set((existingData.items || []).map(t => t.name));

  for (const t of TEMPLATES) {
    if (existingNames.has(t.key)) {
      console.log(`[Mailgun] Template already exists: "${t.key}" (Skipping)`);
      continue;
    }

    const html = renderLayout(t.subject, t.preheader, t.body((key, def) => `{{${key}}}`));
    const params = new URLSearchParams();
    params.append('name', t.key);
    params.append('description', t.name);
    params.append('template', html);

    const createRes = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/templates`, {
      method: 'POST',
      headers: {
        Authorization: auth,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: params.toString()
    });

    const createData = await createRes.json();
    if (createRes.ok) {
      console.log(`[Mailgun] Created template "${t.key}" -> Status: ${createData.message}`);
    } else {
      console.warn(`[Mailgun] Error creating "${t.key}":`, createData);
    }
  }
}

async function run() {
  console.log('=== Ken Classes: Automating Email Provider Dashboard Templates & Internal Setup ===');
  await syncBrevoTemplates();
  await syncMailjetTemplates();
  await syncMailgunTemplates();
  console.log('\n=== All Email Provider Platform Templates Synced Successfully! ===');
}

run().catch(console.error);
