import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const MAX_FILES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];

// User-supplied strings are interpolated into the email HTML
const escapeHtml = (value: string) =>
    value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');

export async function POST(req: Request) {
    const apiKey = process.env.RESEND_API_KEY;
    const toEmails = process.env.CONTACT_NOTIFY_TO;
    const fromEmail = process.env.CONTACT_NOTIFY_FROM;
    if (!apiKey || !toEmails || !fromEmail) {
        // Not configured yet — the message is still saved in the backend
        return NextResponse.json({ error: 'Email notifications are not configured' }, { status: 503 });
    }

    try {
        const form = await req.formData();
        const name = String(form.get('name') || '').trim();
        const email = String(form.get('email') || '').trim();
        const subject = String(form.get('subject') || '').trim();
        const message = String(form.get('message') || '').trim();
        if (!name || !email || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const files = form
            .getAll('attachments')
            .filter((f): f is File => f instanceof File)
            .slice(0, MAX_FILES);
        const attachments = [];
        for (const file of files) {
            const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
            if (!ALLOWED_EXTENSIONS.includes(ext) || file.size > MAX_FILE_SIZE) continue;
            attachments.push({
                filename: file.name,
                content: Buffer.from(await file.arrayBuffer()),
            });
        }

        const resend = new Resend(apiKey);
        const { error } = await resend.emails.send({
            from: `NFA Website <${fromEmail}>`,
            to: toEmails.split(',').map(s => s.trim()).filter(Boolean),
            replyTo: email,
            subject: `New Contact Enquiry: ${subject || 'General'}`,
            attachments,
            html: `
        <div style="font-family:sans-serif;max-width:620px;margin:0 auto;background:#fff;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden">
          <div style="background:#003366;padding:28px 32px">
            <h1 style="color:#fff;margin:0;font-size:1.3rem;font-weight:800">National Fortification Alliance</h1>
            <p style="color:rgba(255,255,255,.6);margin:4px 0 0;font-size:0.8rem;text-transform:uppercase;letter-spacing:0.1em">New Enquiry from Website</p>
          </div>

          <div style="padding:32px">
            <table style="width:100%;border-collapse:collapse;margin-bottom:28px">
              <tr>
                <td style="padding:10px 0;color:#888;font-size:0.85rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;width:120px;vertical-align:top;border-bottom:1px solid #f0f0f0">Name</td>
                <td style="padding:10px 0;font-weight:700;color:#111;border-bottom:1px solid #f0f0f0">${escapeHtml(name)}</td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#888;font-size:0.85rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;vertical-align:top;border-bottom:1px solid #f0f0f0">Email</td>
                <td style="padding:10px 0;border-bottom:1px solid #f0f0f0"><a href="mailto:${escapeHtml(email)}" style="color:#007DBC;font-weight:700">${escapeHtml(email)}</a></td>
              </tr>
              <tr>
                <td style="padding:10px 0;color:#888;font-size:0.85rem;font-weight:600;text-transform:uppercase;letter-spacing:0.05em;vertical-align:top">Subject</td>
                <td style="padding:10px 0;font-weight:600;color:#111">${escapeHtml(subject)}</td>
              </tr>
            </table>

            <div style="background:#f9f9f9;border-left:3px solid #007DBC;padding:20px 24px;border-radius:0 4px 4px 0">
              <p style="margin:0 0 8px;font-size:0.8rem;font-weight:900;text-transform:uppercase;letter-spacing:0.1em;color:#888">Message</p>
              <p style="margin:0;color:#333;line-height:1.75;white-space:pre-wrap">${escapeHtml(message)}</p>
            </div>

            ${attachments.length > 0 ? `<p style="margin:20px 0 0;font-size:0.85rem;color:#555"><strong>${attachments.length}</strong> supporting document(s) attached to this email.</p>` : ''}
          </div>

          <div style="background:#f5f5f5;padding:20px 32px;text-align:center;font-size:0.8rem;color:#999;border-top:1px solid #e5e5e5">
            National Fortification Alliance Nigeria<br/>
            <span style="font-size:0.75rem">Reply directly to this email to respond to ${escapeHtml(name)}</span>
          </div>
        </div>
      `,
        });

        if (error) {
            return NextResponse.json({ error: 'Failed to send email' }, { status: 502 });
        }
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}
