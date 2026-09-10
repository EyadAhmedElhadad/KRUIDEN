// Paymob integration — Intention API + Unified Checkout (redirection).
//
// Flow (https://developers.paymob.com):
//   1. POST /v1/intention/  (Authorization: Token <SECRET_KEY>) with the
//      amount, payment_methods (integration IDs) and billing data.
//   2. Paymob returns a client_secret; redirect the customer to
//      https://accept.paymob.com/unifiedcheckout/?publicKey=<PK>&clientSecret=<CS>
//   3. Paymob POSTs the transaction result to notification_url
//      (/api/paymob/callback), HMAC-verified there before any state change.
//
// The client_secret is single-use — a new intention is created per attempt.

import crypto from "crypto";

const PAYMOB_BASE_URL = "https://accept.paymob.com";

export function isPaymobConfigured() {
  return Boolean(
    process.env.PAYMOB_API_KEY &&
      process.env.PAYMOB_INTEGRATION_ID &&
      process.env.PAYMOB_HMAC_SECRET
  );
}

type CustomerInfo = {
  customerName: string;
  phone: string;
  address: string;
  city: string;
};

function splitName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { firstName: parts[0], lastName: "N/A" };
  const lastName = parts.pop() as string;
  return { firstName: parts.join(" "), lastName };
}

function billingData(info: CustomerInfo) {
  const { firstName, lastName } = splitName(info.customerName);
  return {
    first_name: firstName,
    last_name: lastName,
    // Paymob requires an email on billing data; we don't collect one at
    // checkout, so a stable placeholder keeps validation happy.
    email: "orders@olive-essence.example",
    phone_number: info.phone,
    street: info.address,
    building: "NA",
    floor: "NA",
    apartment: "NA",
    city: info.city,
    country: "EGY",
    state: info.city,
  };
}

export async function createPaymobPayment(params: {
  amountCents: number;
  merchantOrderId: string;
  productName: string;
  origin: string;
} & CustomerInfo) {
  if (!isPaymobConfigured()) {
    throw new Error("Paymob is not configured");
  }

  const apiKey = process.env.PAYMOB_API_KEY;
  const integrationId = Number(process.env.PAYMOB_INTEGRATION_ID);
  const iframeId = process.env.PAYMOB_IFRAME_ID || "1072502";

  // Step 1: POST to auth
  const authRes = await fetch("https://accept.paymob.com/api/auth/tokens", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: apiKey }),
  });
  if (!authRes.ok) {
    const detail = await authRes.text().catch(() => "");
    console.error("Paymob auth tokens request failed", authRes.status, detail);
    throw new Error("Paymob authentication failed");
  }
  const authData = (await authRes.json()) as { token: string };
  const authToken = authData.token;

  // Step 2: POST to order registration
  const orderRes = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: params.amountCents,
      currency: "EGP",
      merchant_order_id: params.merchantOrderId,
      items: [
        {
          name: params.productName,
          amount_cents: params.amountCents,
          quantity: 1,
        },
      ],
    }),
  });
  if (!orderRes.ok) {
    const detail = await orderRes.text().catch(() => "");
    console.error("Paymob order registration failed", orderRes.status, detail);
    throw new Error("Paymob order registration failed");
  }
  const orderData = (await orderRes.json()) as { id: number | string };
  const paymobOrderId = String(orderData.id);

  // Step 3: POST to payment key
  const { firstName, lastName } = splitName(params.customerName);
  const paymentKeyRes = await fetch("https://accept.paymob.com/api/acceptance/payment_keys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: authToken,
      amount_cents: params.amountCents,
      expiration: 3600,
      order_id: paymobOrderId,
      billing_data: {
        apartment: "NA",
        email: "orders@olive-essence.example",
        floor: "NA",
        first_name: firstName,
        street: params.address,
        building: "NA",
        phone_number: params.phone,
        shipping_method: "NA",
        postal_code: "NA",
        city: params.city,
        country: "EGY",
        last_name: lastName,
        state: params.city,
      },
      currency: "EGP",
      integration_id: integrationId,
      lock_order_to_card: false,
    }),
  });
  if (!paymentKeyRes.ok) {
    const detail = await paymentKeyRes.text().catch(() => "");
    console.error("Paymob payment key request failed", paymentKeyRes.status, detail);
    throw new Error("Paymob payment key request failed");
  }
  const paymentKeyData = (await paymentKeyRes.json()) as { token: string };
  const paymentKeyToken = paymentKeyData.token;

  // Step 4: redirect URL to iframe
  const checkoutUrl = `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKeyToken}`;

  return { checkoutUrl, paymobOrderId };
}

// ── Webhook HMAC verification ───────────────────────────────────────────
// Paymob signs the Transaction Processed callback with HMAC-SHA512 over a
// fixed, ordered set of fields. For Intention-API transactions `order` and
// `source_data` are nested objects; legacy callbacks sent them flat — both
// shapes are accepted here.

function hmacValue(obj: Record<string, unknown>, path: string): string {
  const parts = path.split(".");
  // Nested resolution (Intention API shape): obj.order.id, obj.source_data.pan …
  let cur: unknown = obj;
  let nestedOk = true;
  for (const seg of parts) {
    if (cur === null || typeof cur !== "object") {
      nestedOk = false;
      break;
    }
    cur = (cur as Record<string, unknown>)[seg];
  }
  if (nestedOk && cur !== undefined && cur !== null) return String(cur);
  // Legacy flat shape: "order.id" -> obj.order (a bare id),
  // "source_data.pan" -> obj.source_data_pan, etc.
  const flatCompound = obj[parts.join("_")];
  if (flatCompound !== undefined && flatCompound !== null) return String(flatCompound);
  const root = obj[parts[0]];
  if (root === null || root === undefined || typeof root === "object") return "";
  return String(root);
}

const HMAC_FIELDS = [
  "amount_cents",
  "created_at",
  "currency",
  "error_occured",
  "has_parent_transaction",
  "id",
  "integration_id",
  "is_3d_secure",
  "is_auth",
  "is_capture",
  "is_refunded",
  "is_standalone_payment",
  "is_voided",
  "order.id",
  "owner",
  "pending",
  "source_data.pan",
  "source_data.sub_type",
  "source_data.type",
  "success",
];

export function verifyPaymobHmac(transaction: Record<string, unknown>, hmac: string | null) {
  const secret = process.env.PAYMOB_HMAC_SECRET;
  if (!secret || !hmac) return false;
  const concatenated = HMAC_FIELDS.map((f) => hmacValue(transaction, f)).join("");
  const computed = crypto.createHmac("sha512", secret).update(concatenated).digest("hex");
  const a = Buffer.from(computed);
  const b = Buffer.from(hmac.toLowerCase());
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
