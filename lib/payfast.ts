/**
 * PayFast Integration Utility
 * Docs: https://developers.payfast.co.za/docs
 *
 * Set these env vars in .env.local:
 *   NEXT_PUBLIC_PAYFAST_MERCHANT_ID=10000100      (sandbox) / your live ID
 *   NEXT_PUBLIC_PAYFAST_MERCHANT_KEY=46f0cd694581a (sandbox) / your live key
 *   PAYFAST_PASSPHRASE=                           (set in PayFast dashboard if used)
 *   NEXT_PUBLIC_PAYFAST_SANDBOX=true              (set false in production)
 *   NEXT_PUBLIC_SITE_URL=http://localhost:3000    (your deployed URL)
 */

export const PAYFAST_SANDBOX_URL = "https://sandbox.payfast.co.za/eng/process";
export const PAYFAST_LIVE_URL = "https://www.payfast.co.za/eng/process";

const isSandbox = process.env.NEXT_PUBLIC_PAYFAST_SANDBOX !== "false";
export const PAYFAST_URL = isSandbox ? PAYFAST_SANDBOX_URL : PAYFAST_LIVE_URL;

export const MERCHANT_ID =
  process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_ID ?? "10000100";
export const MERCHANT_KEY =
  process.env.NEXT_PUBLIC_PAYFAST_MERCHANT_KEY ?? "46f0cd694581a";
const PASSPHRASE = process.env.NEXT_PUBLIC_PAYFAST_PASSPHRASE ?? "";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PayFastParams {
  // Merchant
  merchant_id: string;
  merchant_key: string;
  // Return URLs
  return_url: string;
  cancel_url: string;
  notify_url: string;
  // Buyer (optional but good UX)
  name_first?: string;
  name_last?: string;
  email_address?: string;
  // Transaction
  m_payment_id: string; // your internal order ID
  amount: string; // e.g. "299.00"
  item_name: string;
  item_description?: string;
  // Recurring (optional)
  subscription_type?: "1"; // 1 = subscription
  billing_date?: string; // YYYY-MM-DD
  recurring_amount?: string;
  frequency?: "3"; // 3 = monthly
  cycles?: string; // 0 = indefinite
  // Signature
  signature?: string;
}

// ─── MD5 (browser-safe via SubtleCrypto isn't available for MD5, use string) ─

function md5(input: string): string {
  // Lightweight pure-JS MD5 — no dependency needed
  function rotateLeft(n: number, s: number) {
    return (n << s) | (n >>> (32 - s));
  }
  function addUnsigned(X: number, Y: number) {
    const X8 = X & 0x80000000,
      Y8 = Y & 0x80000000;
    const X4 = X & 0x40000000,
      Y4 = Y & 0x40000000;
    const result = (X & 0x3fffffff) + (Y & 0x3fffffff);
    if (X4 & Y4) return result ^ 0x80000000 ^ X8 ^ Y8;
    if (X4 | Y4)
      return result & 0x40000000
        ? result ^ 0xc0000000 ^ X8 ^ Y8
        : result ^ 0x40000000 ^ X8 ^ Y8;
    return result ^ X8 ^ Y8;
  }
  const F = (x: number, y: number, z: number) => (x & y) | (~x & z);
  const G = (x: number, y: number, z: number) => (x & z) | (y & ~z);
  const H = (x: number, y: number, z: number) => x ^ y ^ z;
  const I = (x: number, y: number, z: number) => y ^ (x | ~z);
  const FF = (
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number,
  ) =>
    addUnsigned(
      rotateLeft(
        addUnsigned(addUnsigned(a, F(b, c, d)), addUnsigned(x, ac)),
        s,
      ),
      b,
    );
  const GG = (
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number,
  ) =>
    addUnsigned(
      rotateLeft(
        addUnsigned(addUnsigned(a, G(b, c, d)), addUnsigned(x, ac)),
        s,
      ),
      b,
    );
  const HH = (
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number,
  ) =>
    addUnsigned(
      rotateLeft(
        addUnsigned(addUnsigned(a, H(b, c, d)), addUnsigned(x, ac)),
        s,
      ),
      b,
    );
  const II = (
    a: number,
    b: number,
    c: number,
    d: number,
    x: number,
    s: number,
    ac: number,
  ) =>
    addUnsigned(
      rotateLeft(
        addUnsigned(addUnsigned(a, I(b, c, d)), addUnsigned(x, ac)),
        s,
      ),
      b,
    );

  function convertToWordArray(str: string) {
    const lWordCount: number[] = [];
    const lMessageLength = str.length;
    const lNumberOfWords_temp1 = lMessageLength + 8;
    const lNumberOfWords_temp2 =
      (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    const lWordArray = Array(lNumberOfWords - 1).fill(0);
    let lBytePosition = 0,
      lByteCount = 0;
    while (lByteCount < lMessageLength) {
      const lWordCount2 = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount2] =
        lWordArray[lWordCount2] | (str.charCodeAt(lByteCount) << lBytePosition);
      lByteCount++;
    }
    const lWordCount3 = (lByteCount - (lByteCount % 4)) / 4;
    lWordArray[lWordCount3] =
      lWordArray[lWordCount3] | (0x80 << ((lByteCount % 4) * 8));
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }
  function wordToHex(lValue: number) {
    let r = "";
    for (let i = 0; i <= 3; i++) {
      const lByte = (lValue >>> (i * 8)) & 255;
      r += ("0" + lByte.toString(16)).slice(-2);
    }
    return r;
  }

  let a = 0x67452301,
    b = 0xefcdab89,
    c = 0x98badcfe,
    d = 0x10325476;
  const x = convertToWordArray(input);
  for (let k = 0; k < x.length; k += 16) {
    const AA = a,
      BB = b,
      CC = c,
      DD = d;
    a = FF(a, b, c, d, x[k + 0], 7, -680876936);
    d = FF(d, a, b, c, x[k + 1], 12, -389564586);
    c = FF(c, d, a, b, x[k + 2], 17, 606105819);
    b = FF(b, c, d, a, x[k + 3], 22, -1044525330);
    a = FF(a, b, c, d, x[k + 4], 7, -176418897);
    d = FF(d, a, b, c, x[k + 5], 12, 1200080426);
    c = FF(c, d, a, b, x[k + 6], 17, -1473231341);
    b = FF(b, c, d, a, x[k + 7], 22, -45705983);
    a = FF(a, b, c, d, x[k + 8], 7, 1770035416);
    d = FF(d, a, b, c, x[k + 9], 12, -1958414417);
    c = FF(c, d, a, b, x[k + 10], 17, -42063);
    b = FF(b, c, d, a, x[k + 11], 22, -1990404162);
    a = FF(a, b, c, d, x[k + 12], 7, 1804603682);
    d = FF(d, a, b, c, x[k + 13], 12, -40341101);
    c = FF(c, d, a, b, x[k + 14], 17, -1502002290);
    b = FF(b, c, d, a, x[k + 15], 22, 1236535329);
    a = GG(a, b, c, d, x[k + 1], 5, -165796510);
    d = GG(d, a, b, c, x[k + 6], 9, -1069501632);
    c = GG(c, d, a, b, x[k + 11], 14, 643717713);
    b = GG(b, c, d, a, x[k + 0], 20, -373897302);
    a = GG(a, b, c, d, x[k + 5], 5, -701558691);
    d = GG(d, a, b, c, x[k + 10], 9, 38016083);
    c = GG(c, d, a, b, x[k + 15], 14, -660478335);
    b = GG(b, c, d, a, x[k + 4], 20, -405537848);
    a = GG(a, b, c, d, x[k + 9], 5, 568446438);
    d = GG(d, a, b, c, x[k + 14], 9, -1019803690);
    c = GG(c, d, a, b, x[k + 3], 14, -187363961);
    b = GG(b, c, d, a, x[k + 8], 20, 1163531501);
    a = GG(a, b, c, d, x[k + 13], 5, -1444681467);
    d = GG(d, a, b, c, x[k + 2], 9, -51403784);
    c = GG(c, d, a, b, x[k + 7], 14, 1735328473);
    b = GG(b, c, d, a, x[k + 12], 20, -1926607734);
    a = HH(a, b, c, d, x[k + 5], 4, -378558);
    d = HH(d, a, b, c, x[k + 8], 11, -2022574463);
    c = HH(c, d, a, b, x[k + 11], 16, 1839030562);
    b = HH(b, c, d, a, x[k + 14], 23, -35309556);
    a = HH(a, b, c, d, x[k + 1], 4, -1530992060);
    d = HH(d, a, b, c, x[k + 4], 11, 1272893353);
    c = HH(c, d, a, b, x[k + 7], 16, -155497632);
    b = HH(b, c, d, a, x[k + 10], 23, -1094730640);
    a = HH(a, b, c, d, x[k + 13], 4, 681279174);
    d = HH(d, a, b, c, x[k + 0], 11, -358537222);
    c = HH(c, d, a, b, x[k + 3], 16, -722521979);
    b = HH(b, c, d, a, x[k + 6], 23, 76029189);
    a = HH(a, b, c, d, x[k + 9], 4, -640364487);
    d = HH(d, a, b, c, x[k + 12], 11, -421815835);
    c = HH(c, d, a, b, x[k + 15], 16, 530742520);
    b = HH(b, c, d, a, x[k + 2], 23, -995338651);
    a = II(a, b, c, d, x[k + 0], 6, -198630844);
    d = II(d, a, b, c, x[k + 7], 10, 1126891415);
    c = II(c, d, a, b, x[k + 14], 15, -1416354905);
    b = II(b, c, d, a, x[k + 5], 21, -57434055);
    a = II(a, b, c, d, x[k + 12], 6, 1700485571);
    d = II(d, a, b, c, x[k + 3], 10, -1894986606);
    c = II(c, d, a, b, x[k + 10], 15, -1051523);
    b = II(b, c, d, a, x[k + 1], 21, -2054922799);
    a = II(a, b, c, d, x[k + 8], 6, 1873313359);
    d = II(d, a, b, c, x[k + 15], 10, -30611744);
    c = II(c, d, a, b, x[k + 6], 15, -1560198380);
    b = II(b, c, d, a, x[k + 13], 21, 1309151649);
    a = II(a, b, c, d, x[k + 4], 6, -145523070);
    d = II(d, a, b, c, x[k + 11], 10, -1120210379);
    c = II(c, d, a, b, x[k + 2], 15, 718787259);
    b = II(b, c, d, a, x[k + 9], 21, -343485551);
    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }
  return (
    wordToHex(a) +
    wordToHex(b) +
    wordToHex(c) +
    wordToHex(d)
  ).toLowerCase();
}

// ─── Generate PayFast signature ───────────────────────────────────────────────

export function generateSignature(
  params: Omit<PayFastParams, "signature">,
  passphrase = PASSPHRASE,
): string {
  // Build query string from params (exclude empty values, sort not required but helps)
  const parts = Object.entries(params)
    .filter(([, v]) => v !== "" && v !== undefined && v !== null)
    .map(
      ([k, v]) => `${k}=${encodeURIComponent(String(v)).replace(/%20/g, "+")}`,
    )
    .join("&");

  const str = passphrase
    ? `${parts}&passphrase=${encodeURIComponent(passphrase).replace(/%20/g, "+")}`
    : parts;
  return md5(str);
}

// ─── Build complete PayFast payload ──────────────────────────────────────────

export interface BuildPaymentOptions {
  toolId: string;
  toolName: string;
  toolDesc: string;
  amount: number; // ZAR, integer e.g. 3600
  license: "one-time" | "monthly" | "annual";
  buyerFirstName?: string;
  buyerLastName?: string;
  buyerEmail?: string;
}

export function buildPayFastPayload(
  opts: BuildPaymentOptions,
): Record<string, string> {
  const orderId = `MT-${opts.toolId.toUpperCase()}-${Date.now()}`;
  const amountStr = opts.amount.toFixed(2);

  const params: Omit<PayFastParams, "signature"> = {
    merchant_id: MERCHANT_ID,
    merchant_key: MERCHANT_KEY,
    return_url: `${SITE_URL}/tools/success?order=${orderId}`,
    cancel_url: `${SITE_URL}/tools?cancelled=1`,
    notify_url: `${SITE_URL}/api/payfast/notify`,
    name_first: opts.buyerFirstName ?? "",
    name_last: opts.buyerLastName ?? "",
    email_address: opts.buyerEmail ?? "",
    m_payment_id: orderId,
    amount: amountStr,
    item_name: opts.toolName.slice(0, 100),
    item_description: opts.toolDesc.slice(0, 255),
    ...(opts.license === "monthly" && {
      subscription_type: "1",
      billing_date: new Date().toISOString().split("T")[0],
      recurring_amount: amountStr,
      frequency: "3",
      cycles: "0",
    }),
  };

  // Strip undefined/empty
  const clean = Object.fromEntries(
    Object.entries(params).filter(([, v]) => v !== "" && v !== undefined),
  ) as Omit<PayFastParams, "signature">;

  const signature = generateSignature(clean);

  return { ...clean, signature } as Record<string, string>;
}
