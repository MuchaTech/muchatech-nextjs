export async function postPayFastOrderToSlack(options: {
  orderId: string;
  pfPaymentId: string;
  amount: string;
  itemName: string;
  buyerEmail: string;
}) {
  const webhookUrl = process.env.SLACK_PAYFAST_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("[PayFast ITN] SLACK_PAYFAST_WEBHOOK_URL not set");
    return;
  }

  const { orderId, pfPaymentId, amount, itemName, buyerEmail } = options;

  const text = `💸 New PayFast payment received`;
  const payload = {
    text,
    blocks: [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `💸 *New PayFast payment received*`,
        },
      },
      { type: "divider" },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Order ID:*\n${orderId || "N/A"}`,
          },
          {
            type: "mrkdwn",
            text: `*PayFast ID:*\n${pfPaymentId || "N/A"}`,
          },
          {
            type: "mrkdwn",
            text: `*Product:*\n${itemName || "N/A"}`,
          },
          {
            type: "mrkdwn",
            text: `*Amount:*\nR ${amount || "0.00"}`,
          },
          {
            type: "mrkdwn",
            text: `*Buyer:*\n${buyerEmail || "N/A"}`,
          },
        ],
      },
    ],
  };

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("[PayFast ITN] Slack webhook failed", res.status, text);
    } else {
      console.log("[PayFast ITN] Slack notification sent");
    }
  } catch (err) {
    console.error("[PayFast ITN] Error posting to Slack", err);
  }
}
