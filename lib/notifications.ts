import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function notifyTeamOfPayFastOrder(options: {
  orderId: string;
  pfPaymentId: string;
  amount: string;
  itemName: string;
  buyerEmail: string;
  rawParams: Record<string, string>;
}) {
  const to = process.env.TEAM_NOTIFICATIONS_TO;
  const from = process.env.TEAM_NOTIFICATIONS_FROM;

  if (!process.env.RESEND_API_KEY || !to || !from) {
    console.error(
      "[PayFast ITN] Email not configured: missing RESEND_API_KEY/TEAM_NOTIFICATIONS_* env vars",
    );
    return;
  }

  const { orderId, pfPaymentId, amount, itemName, buyerEmail, rawParams } =
    options;

  const subject = `New PayFast payment: ${orderId} (${amount})`;

  const html = `
    <div style="font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif; padding: 20px; color: #0f172a;">
      <h2 style="margin-bottom: 12px;">New payment received</h2>
      <p style="margin: 0 0 4px;"><strong>Order ID:</strong> ${orderId}</p>
      <p style="margin: 0 0 4px;"><strong>PayFast ID:</strong> ${pfPaymentId}</p>
      <p style="margin: 0 0 4px;"><strong>Product:</strong> ${itemName}</p>
      <p style="margin: 0 0 4px;"><strong>Amount:</strong> R ${amount}</p>
      <p style="margin: 0 0 12px;"><strong>Buyer email:</strong> ${buyerEmail}</p>

      <h3 style="margin: 16px 0 8px;">Raw PayFast params</h3>
      <pre style="background: #0b1220; color: #e5e7eb; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto;">
${JSON.stringify(rawParams, null, 2)}
      </pre>
    </div>
  `;

  try {
    const { error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    });

    if (error) {
      console.error("[PayFast ITN] Failed to send team email", error);
    } else {
      console.log("[PayFast ITN] Team notification email sent");
    }
  } catch (err) {
    console.error("[PayFast ITN] Unexpected error sending team email", err);
  }
}
