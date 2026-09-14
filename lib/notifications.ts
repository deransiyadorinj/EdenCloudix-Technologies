// PRIVATE SERVER-SIDE NOTIFICATION UTILITY
// All credentials stored in server environment variables only.
// NEVER expose OWNER_WHATSAPP_NUMBER or API keys to the client.

interface NotificationResult {
  success: boolean;
  error?: string;
}

interface BookingData {
  requestId: string;
  domain: string;
  name: string;
  email: string;
  phone?: string | null;
  company?: string | null;
  projectTitle?: string | null;
  projectDescription: string;
  budget?: string | null;
  timeline?: string | null;
  createdAt: Date;
}

function formatDomain(domain: string): string {
  switch (domain) {
    case 'AI': return 'AI Solutions';
    case 'FULL_STACK': return 'Full-Stack Development';
    case 'CLOUD': return 'Cloud Engineering';
    default: return domain;
  }
}

function buildWhatsAppMessage(booking: BookingData): string {
  const date = booking.createdAt.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
  });
  const time = booking.createdAt.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  return `*EDENCLOUDIX TECHNOLOGIES*
*NEW PROJECT REQUEST* 🚀

━━━━━━━━━━━━━━━━━━━━━━━━
*Request ID:* ${booking.requestId}
*Service:* ${formatDomain(booking.domain)}
━━━━━━━━━━━━━━━━━━━━━━━━

*Customer Name:* ${booking.name}
*Email:* ${booking.email}
*Phone:* ${booking.phone || 'Not provided'}
*Company:* ${booking.company || 'Not provided'}

*Project Title:* ${booking.projectTitle || 'Not specified'}
*Budget:* ${booking.budget || 'Not specified'}
*Timeline:* ${booking.timeline || 'Not specified'}

*Project Description:*
${booking.projectDescription}

━━━━━━━━━━━━━━━━━━━━━━━━
*Submitted:* ${date} at ${time}
━━━━━━━━━━━━━━━━━━━━━━━━

_Please review and respond at the earliest._`;
}

export async function sendWhatsAppNotification(booking: BookingData): Promise<NotificationResult> {
  // PRIVATE: WhatsApp destination is loaded from server environment only
  const ownerNumber = process.env.OWNER_WHATSAPP_NUMBER;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (!ownerNumber || !accessToken || !phoneNumberId) {
    return {
      success: false,
      error: 'WhatsApp configuration not set. Add OWNER_WHATSAPP_NUMBER, WHATSAPP_ACCESS_TOKEN, WHATSAPP_PHONE_NUMBER_ID to environment.',
    };
  }

  const message = buildWhatsAppMessage(booking);
  const rawNumber = ownerNumber.replace(/[^\d]/g, '');
  const destinationNumber = rawNumber.length === 10 ? `91${rawNumber}` : rawNumber;

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: destinationNumber,
          type: 'text',
          text: { body: message },
        }),
      }
    );

    if (!response.ok) {
      let err = await response.text();
      if (ownerNumber) err = err.replaceAll(ownerNumber, '[REDACTED]');
      if (rawNumber) err = err.replaceAll(rawNumber, '[REDACTED]');
      if (accessToken) err = err.replaceAll(accessToken, '[REDACTED]');
      return { success: false, error: `WhatsApp API error: ${response.status} — ${err.slice(0, 300)}` };
    }

    return { success: true };
  } catch (error) {
    let msg = error instanceof Error ? error.message : 'Unknown WhatsApp error';
    if (ownerNumber) msg = msg.replaceAll(ownerNumber, '[REDACTED]');
    if (accessToken) msg = msg.replaceAll(accessToken, '[REDACTED]');
    return {
      success: false,
      error: msg,
    };
  }
}

export async function sendEmailNotification(booking: BookingData): Promise<NotificationResult> {
  const adminEmail = process.env.ADMIN_EMAIL;
  const emailApiKey = process.env.EMAIL_API_KEY;
  const emailFrom = process.env.EMAIL_FROM || 'noreply@edencloudix.tech';

  if (!adminEmail || !emailApiKey) {
    return {
      success: false,
      error: 'Email configuration not set. Add ADMIN_EMAIL and EMAIL_API_KEY to environment.',
    };
  }

  const date = booking.createdAt.toLocaleDateString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
  const time = booking.createdAt.toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit', hour12: true,
  });

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Inter, Arial, sans-serif; background: #010204; color: #f0f4ff; margin: 0; padding: 0; }
  .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
  .header { background: linear-gradient(135deg, #1a3a7c, #1e8af0); padding: 32px; border-radius: 16px 16px 0 0; text-align: center; }
  .header h1 { margin: 0; font-size: 20px; color: white; font-weight: 700; letter-spacing: 0.05em; }
  .header p { margin: 8px 0 0; color: rgba(255,255,255,0.8); font-size: 13px; letter-spacing: 0.1em; }
  .body { background: #070e1a; padding: 32px; border: 1px solid rgba(30,138,240,0.2); }
  .field { margin-bottom: 20px; }
  .label { font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; color: #8b9dc0; margin-bottom: 4px; }
  .value { font-size: 15px; color: #f0f4ff; font-weight: 500; }
  .request-id { background: #040810; border: 1px solid rgba(0,212,255,0.25); border-radius: 8px; padding: 16px; text-align: center; font-size: 20px; color: #00d4ff; font-family: monospace; font-weight: 700; letter-spacing: 0.1em; margin-bottom: 24px; }
  .divider { border: none; border-top: 1px solid rgba(255,255,255,0.06); margin: 24px 0; }
  .footer { background: #03060c; padding: 20px 32px; border-radius: 0 0 16px 16px; border: 1px solid rgba(30,138,240,0.1); border-top: none; text-align: center; font-size: 12px; color: #4a5a7a; }
  .badge { display: inline-block; padding: 4px 12px; border-radius: 99px; font-size: 12px; font-weight: 600; letter-spacing: 0.05em; }
  .badge-ai { background: rgba(30,138,240,0.2); color: #2ab8ff; }
  .badge-fs { background: rgba(31,95,200,0.25); color: #7cb3ff; }
  .badge-cloud { background: rgba(0,212,255,0.15); color: #00d4ff; }
  .desc-box { background: #040810; border-radius: 8px; padding: 16px; font-size: 14px; color: #e8edf5; line-height: 1.7; white-space: pre-wrap; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <h1>🚀 NEW PROJECT REQUEST</h1>
    <p>EDENCLOUDIX TECHNOLOGIES</p>
  </div>
  <div class="body">
    <div class="request-id">${booking.requestId}</div>
    <div class="field">
      <div class="label">Service Domain</div>
      <div class="value">
        <span class="badge badge-${booking.domain === 'AI' ? 'ai' : booking.domain === 'FULL_STACK' ? 'fs' : 'cloud'}">${formatDomain(booking.domain)}</span>
      </div>
    </div>
    <hr class="divider">
    <div class="field"><div class="label">Customer Name</div><div class="value">${booking.name}</div></div>
    <div class="field"><div class="label">Email</div><div class="value">${booking.email}</div></div>
    <div class="field"><div class="label">Phone</div><div class="value">${booking.phone || 'Not provided'}</div></div>
    <div class="field"><div class="label">Company / Organization</div><div class="value">${booking.company || 'Not provided'}</div></div>
    <hr class="divider">
    <div class="field"><div class="label">Project Title</div><div class="value">${booking.projectTitle || 'Not specified'}</div></div>
    <div class="field"><div class="label">Budget</div><div class="value">${booking.budget || 'Not specified'}</div></div>
    <div class="field"><div class="label">Timeline</div><div class="value">${booking.timeline || 'Not specified'}</div></div>
    <div class="field">
      <div class="label">Project Description</div>
      <div class="desc-box">${booking.projectDescription}</div>
    </div>
    <hr class="divider">
    <div class="field"><div class="label">Submitted</div><div class="value">${date} at ${time}</div></div>
  </div>
  <div class="footer">
    EdenCloudix Technologies Admin System • Auto-generated notification<br>
    Please respond to the customer at your earliest convenience.
  </div>
</div>
</body>
</html>`;

  // Using Resend API (simple REST-based email provider)
  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${emailApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: emailFrom,
        to: [adminEmail],
        subject: `[ECX] New Project Request — ${booking.requestId} (${formatDomain(booking.domain)})`,
        html: htmlBody,
      }),
    });

    if (!response.ok) {
      let err = await response.text();
      if (emailApiKey) err = err.replaceAll(emailApiKey, '[REDACTED]');
      return { success: false, error: `Email API error: ${response.status} — ${err.slice(0, 300)}` };
    }

    return { success: true };
  } catch (error) {
    let msg = error instanceof Error ? error.message : 'Unknown email error';
    if (emailApiKey) msg = msg.replaceAll(emailApiKey, '[REDACTED]');
    return {
      success: false,
      error: msg,
    };
  }
}
