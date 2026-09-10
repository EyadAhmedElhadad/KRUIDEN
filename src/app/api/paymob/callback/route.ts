import { NextRequest, NextResponse } from "next/server";
import { verifyPaymobHmac } from "@/lib/paymob";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const hmac = url.searchParams.get("hmac");
  const body = await req.json().catch(() => null);
  const transaction = body?.obj;

  if (!transaction || typeof transaction !== "object") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (!verifyPaymobHmac(transaction, hmac)) {
    console.warn("Paymob callback rejected: HMAC mismatch");
    // 200 so Paymob doesn't retry; we simply ignore unauthenticated calls.
    return NextResponse.json({ ok: true });
  }

  // Correlation keys: special_reference (our order id, echoed back as
  // merchant_order_id) or the Paymob order id stored on the order.
  const orderObj = transaction.order as Record<string, unknown> | number | undefined;
  const merchantOrderId =
    typeof orderObj === "object" && orderObj !== null
      ? ((orderObj.merchant_order_id as string | undefined) ??
        (orderObj.special_reference as string | undefined))
      : undefined;
  const paymobOrderId =
    typeof orderObj === "object" && orderObj !== null
      ? orderObj.id != null
        ? String(orderObj.id)
        : undefined
      : orderObj != null
        ? String(orderObj)
        : undefined;

  if (!merchantOrderId && !paymobOrderId) {
    return NextResponse.json({ ok: true }); // nothing to reconcile
  }

  const paymentStatus = transaction.success ? "PAID" : "FAILED";

  try {
    const existing = merchantOrderId
      ? await prisma.order.findUnique({ where: { id: merchantOrderId } })
      : await prisma.order.findFirst({ where: { paymobOrderId: paymobOrderId as string } });
    if (!existing) {
      console.warn("Paymob callback: no matching order", { merchantOrderId, paymobOrderId });
      return NextResponse.json({ ok: true });
    }
    await prisma.order.update({
      where: { id: existing.id },
      data: {
        paymentStatus,
        ...(paymobOrderId && existing.paymobOrderId !== paymobOrderId ? { paymobOrderId } : {}),
      },
    });
  } catch (err) {
    // Unknown order / DB hiccup — log but always 2xx so Paymob doesn't retry forever.
    console.error("Paymob callback reconciliation failed", err);
  }

  return NextResponse.json({ ok: true });
}
