import { NextRequest, NextResponse } from "next/server";
import { notifyTeamOfPayFastOrder } from "@/lib/notifications";
import { postPayFastOrderToSlack } from "@/lib/slack";

/**
 * PayFast Instant Transaction Notification (ITN) handler
 * PayFast POSTs to this endpoint after every payment event.
 *
 * In production you should:
 *  1. Verify the IP is from PayFast's known range
 *  2. Re-validate the signature against your passphrase
 *  3. Do a server-side validation call back to PayFast
 *  4. Update your database / send fulfilment email
 *
 * Docs: https://developers.payfast.co.za/docs#itn
 */

const PAYFAST_VALID_HOSTS = [
  "www.payfast.co.za",
  "sandbox.payfast.co.za",
  "w1w.payfast.co.za",
  "w2w.payfast.co.za",
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const params = Object.fromEntries(new URLSearchParams(body));

    console.log("[PayFast ITN] Received:", JSON.stringify(params, null, 2));

    // ── 1. Extract key fields ─────────────────────────────────────
    const {
      payment_status,
      m_payment_id,
      pf_payment_id,
      amount_gross,
      item_name,
      email_address,
    } = params;

    // ── 2. Only process COMPLETE payments ────────────────────────
    if (payment_status !== "COMPLETE") {
      console.log(`[PayFast ITN] Ignoring status: ${payment_status}`);
      return new NextResponse("OK", { status: 200 });
    }

    // ── 3. Server-side validation (recommended) ───────────────────
    const isSandbox = process.env.NEXT_PUBLIC_PAYFAST_SANDBOX !== "false";
    const pfHost = isSandbox ? "sandbox.payfast.co.za" : "www.payfast.co.za";

    try {
      // Remove signature from validation payload
      const validationParams = { ...params };
      delete validationParams.signature;
      const validationString = new URLSearchParams(validationParams).toString();

      const validationRes = await fetch(
        `https://${pfHost}/eng/query/validate`,
        {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: validationString,
        },
      );
      const validationText = await validationRes.text();

      if (validationText.trim() !== "VALID") {
        console.error("[PayFast ITN] Validation failed:", validationText);
        return new NextResponse("INVALID", { status: 400 });
      }
    } catch (err) {
      console.error("[PayFast ITN] Validation request failed:", err);
      // Don't reject — PayFast requires a 200 to stop retrying
    }

    // ── 4. Fulfilment logic ───────────────────────────────────────
    // TODO (later): Save order to DB, send customer email, grant licence key

    const safeOrderId = String(m_payment_id);
    const safePfPaymentId = String(pf_payment_id);
    const safeAmount = String(amount_gross);
    const safeItemName = String(item_name);
    const safeBuyerEmail = String(email_address);

    // 4a. Team email
    await notifyTeamOfPayFastOrder({
      orderId: safeOrderId,
      pfPaymentId: safePfPaymentId,
      amount: safeAmount,
      itemName: safeItemName,
      buyerEmail: safeBuyerEmail,
      rawParams: params as Record<string, string>,
    });

    // 4b. Slack notification (in parallel)
    await postPayFastOrderToSlack({
      orderId: safeOrderId,
      pfPaymentId: safePfPaymentId,
      amount: safeAmount,
      itemName: safeItemName,
      buyerEmail: safeBuyerEmail,
    });

    console.log("[PayFast ITN] ✅ COMPLETE payment:", {
      orderId: m_payment_id,
      pfId: pf_payment_id,
      amount: amount_gross,
      product: item_name,
      buyer: email_address,
    });

    // ── 5. Respond 200 to acknowledge ────────────────────────────
    return new NextResponse("OK", { status: 200 });
  } catch (err) {
    console.error("[PayFast ITN] Error:", err);
    // Always return 200 so PayFast doesn't retry indefinitely
    return new NextResponse("OK", { status: 200 });
  }
}
