import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const lead = await req.json();

    const data = await resend.emails.send({
      from: 'OHDrug Inquiries <onboarding@resend.dev>',
      to: ['ohdrug01@gmail.com'],
      replyTo: lead.email,
      subject: `[OHDrug.com Lead] ${lead.name} - ${lead.serviceNeeded}`,
      html: `
        <h2>New Client Inquiry Received</h2>
        <p><strong>Client Name:</strong> ${lead.name}</p>
        <p><strong>Email:</strong> ${lead.email}</p>
        <p><strong>Company:</strong> ${lead.company || 'Not provided'}</p>
        <p><strong>Service Required:</strong> ${lead.serviceNeeded}</p>
        <p><strong>Lead Ref ID:</strong> ${lead.leadId || 'N/A'}</p>
        <hr />
        <h3>Message Scope:</h3>
        <p style="white-space: pre-wrap;">${lead.message}</p>
      `,
    });

    return Response.json({ success: true, data });
  } catch (error) {
    console.error('Resend Server Dispatch Error:', error);
    return Response.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}