import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, phone, businessArea, requestType, message } =
      await req.json();

    // Basic server-side validation
    if (!name || !email || !businessArea || !requestType || !message) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    const { error } = await resend.emails.send({
      from: "MuchaTech Contact <noreply@muchatech.com>", // must be a verified Resend domain
      to: ["support@muchatech.com"],
      replyTo: email,
      subject: `[${requestType}] New enquiry from ${name}`,
      html: `
        <div style="font-family:monospace;max-width:600px;margin:0 auto;background:#0d0d0d;color:#e5e5e5;padding:32px;border-radius:12px;border:1px solid #222">
          <h2 style="color:#2BE9F0;margin-top:0">New Contact Form Submission</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr><td style="color:#888;padding:6px 0;width:140px">Name</td><td style="color:#fff">${name}</td></tr>
            <tr><td style="color:#888;padding:6px 0">Email</td><td><a href="mailto:${email}" style="color:#2BE9F0">${email}</a></td></tr>
            <tr><td style="color:#888;padding:6px 0">Phone</td><td style="color:#fff">${phone || "—"}</td></tr>
            <tr><td style="color:#888;padding:6px 0">Business Area</td><td style="color:#FC21D1">${businessArea}</td></tr>
            <tr><td style="color:#888;padding:6px 0">Request Type</td><td style="color:#FC21D1">${requestType}</td></tr>
          </table>
          <hr style="border-color:#222;margin:20px 0"/>
          <p style="color:#888;margin:0 0 8px">Message</p>
          <p style="color:#e5e5e5;white-space:pre-wrap;margin:0">${message}</p>
          <hr style="border-color:#222;margin:20px 0"/>
          <p style="color:#555;font-size:11px;margin:0">Sent via muchatech.com contact form</p>
        </div>
      `,
    });

    if (error) {
      console.error("[Resend error]", error);
      return NextResponse.json(
        { error: "Failed to send email." },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[Contact route error]", err);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
