/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * OHDrug.com — A product of MuneerDataAI
 * Automated Email Dispatch Service
 * Handles notification dispatch to ohdrug01@gmail.com upon lead form submission
 */

export interface LeadSubmissionPayload {
  name: string;
  email: string;
  company?: string;
  serviceNeeded: string;
  message: string;
  leadId?: string;
}

export interface EmailDispatchResult {
  success: boolean;
  message: string;
  method: 'resend_api' | 'supabase_edge' | 'api_proxy' | 'simulated_dispatch';
  timestamp: string;
  recipient: string;
}

const OFFICIAL_RECIPIENT = 'ohdrug01@gmail.com';

/**
 * Builds HTML template for the email notification
 */
export function buildLeadEmailHtml(lead: LeadSubmissionPayload): string {
  const timestamp = new Date().toUTCString();
  const companyText = lead.company?.trim() ? lead.company.trim() : 'Not provided';
  const leadId = lead.leadId || `lead-${Date.now().toString(36)}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>New Lead Inquiry - OHDrug.com</title>
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #090d16; color: #f1f5f9; padding: 24px; margin: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; background-color: #111827; border: 1px solid #1f2937; border-radius: 8px; overflow: hidden;">
    <tr>
      <td style="padding: 24px 32px; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); border-bottom: 1px solid #1f2937;">
        <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff;">OHDrug<span style="color: #3b82f6;">.com</span></h1>
        <p style="margin: 4px 0 0 0; font-size: 12px; color: #10b981; font-weight: 600;">A product of MuneerDataAI &middot; Inbound Lead Dispatch</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 32px;">
        <h2 style="margin: 0 0 16px 0; font-size: 16px; color: #93c5fd; text-transform: uppercase; letter-spacing: 0.05em;">New Client Inquiry Received</h2>
        
        <table width="100%" cellpadding="8" cellspacing="0" style="border-collapse: collapse; margin-bottom: 24px; font-size: 14px;">
          <tr style="border-bottom: 1px solid #1f2937;">
            <td width="35%" style="color: #94a3b8; font-weight: 500;">Client Name:</td>
            <td style="color: #ffffff; font-weight: 600;">${lead.name}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1f2937;">
            <td style="color: #94a3b8; font-weight: 500;">Email Address:</td>
            <td style="color: #38bdf8; font-weight: 600;"><a href="mailto:${lead.email}" style="color: #38bdf8; text-decoration: none;">${lead.email}</a></td>
          </tr>
          <tr style="border-bottom: 1px solid #1f2937;">
            <td style="color: #94a3b8; font-weight: 500;">Company / Org:</td>
            <td style="color: #ffffff;">${companyText}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1f2937;">
            <td style="color: #94a3b8; font-weight: 500;">Service Required:</td>
            <td style="color: #34d399; font-weight: 600;">${lead.serviceNeeded}</td>
          </tr>
          <tr style="border-bottom: 1px solid #1f2937;">
            <td style="color: #94a3b8; font-weight: 500;">Lead Reference ID:</td>
            <td style="color: #94a3b8; font-family: monospace; font-size: 12px;">${leadId}</td>
          </tr>
          <tr>
            <td style="color: #94a3b8; font-weight: 500;">Timestamp (UTC):</td>
            <td style="color: #94a3b8; font-size: 12px;">${timestamp}</td>
          </tr>
        </table>

        <div style="background-color: #0b1120; border-left: 3px solid #3b82f6; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px 0; font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase;">Message & Technical Scope:</p>
          <p style="margin: 0; font-size: 14px; line-height: 1.6; color: #e2e8f0; white-space: pre-wrap;">${lead.message}</p>
        </div>

        <div style="text-align: center; margin-top: 32px;">
          <a href="mailto:${lead.email}?subject=Re:%20OHDrug.com%20Consultation%20-%20${encodeURIComponent(lead.serviceNeeded)}" 
             style="display: inline-block; background-color: #2563eb; color: #ffffff; text-decoration: none; font-weight: 600; font-size: 14px; padding: 12px 24px; border-radius: 6px;">
            Reply Directly to ${lead.name}
          </a>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 20px 32px; background-color: #090d16; border-top: 1px solid #1f2937; text-align: center; font-size: 11px; color: #64748b;">
        <p style="margin: 0;">OHDrug.com &middot; A product of MuneerDataAI &middot; Official Contact: <a href="mailto:${OFFICIAL_RECIPIENT}" style="color: #10b981;">${OFFICIAL_RECIPIENT}</a></p>
        <p style="margin: 4px 0 0 0;">Architect & Pharmacist: <a href="https://muneerdev.com" style="color: #38bdf8;">muneerdev.com</a></p>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Triggers an automated email notification via Next.js server API endpoint (/api/consultation)
 */
export async function sendLeadNotificationEmail(lead: LeadSubmissionPayload): Promise<EmailDispatchResult> {
  const timestamp = new Date().toISOString();

  try {
    const response = await fetch('/api/consultation', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lead),
    });

    if (response.ok) {
      return {
        success: true,
        message: `Email dispatched to ${OFFICIAL_RECIPIENT} via Resend API Proxy`,
        method: 'api_proxy',
        timestamp,
        recipient: OFFICIAL_RECIPIENT,
      };
    }
    
    const errorData = await response.json().catch(() => ({}));
    console.warn('Backend API proxy returned non-OK status:', errorData);
  } catch (apiError) {
    console.warn('Backend API proxy fetch failed, proceeding with fallback logging:', apiError);
  }

  // Fallback logging if API call fails
  console.info(`[Email Dispatcher] Automated lead notification routed to ${OFFICIAL_RECIPIENT}:`, {
    to: OFFICIAL_RECIPIENT,
    fromClient: lead.email,
    clientName: lead.name,
    service: lead.serviceNeeded,
    leadId: lead.leadId,
    timestamp,
  });

  return {
    success: false,
    message: `Automated notification queued for ${OFFICIAL_RECIPIENT}`,
    method: 'simulated_dispatch',
    timestamp,
    recipient: OFFICIAL_RECIPIENT,
  };
}

/**
 * Generates a pre-filled mailto URL for direct client transmission to ohdrug01@gmail.com
 */
export function generateDirectMailtoUrl(lead: LeadSubmissionPayload): string {
  const subject = encodeURIComponent(`OHDrug.com Consultation Request: ${lead.serviceNeeded} - ${lead.name}`);
  const body = encodeURIComponent(
    `Hello Muneer,\n\n` +
    `I would like to request technical consultation regarding ${lead.serviceNeeded}.\n\n` +
    `Client Name: ${lead.name}\n` +
    `Company: ${lead.company || 'N/A'}\n` +
    `Email: ${lead.email}\n` +
    `Lead ID: ${lead.leadId || 'pending'}\n\n` +
    `Message Scope:\n${lead.message}\n\n` +
    `Best regards,\n${lead.name}`
  );

  return `mailto:${OFFICIAL_RECIPIENT}?subject=${subject}&body=${body}`;
}