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
    console.warn("Paymob webhook rejected: HMAC mismatch");
    // Return 200 so Paymob stops retrying, but log/respond with details.
    return NextResponse.json({ error: "HMAC mismatch" }, { status: 200 });
  }

  // Resolve internal order using special_reference (merchant_order_id) or the paymob order ID.
  const orderObj = transaction.order;
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
    console.warn("Paymob webhook: no order references found in callback payload");
    return NextResponse.json({ ok: true });
  }

  const success = Boolean(transaction.success);
  const paymentStatus = success ? "PAID" : "FAILED";
  const orderStatus = success ? "CONFIRMED" : "CANCELLED";

  try {
    const existing = merchantOrderId
      ? await prisma.order.findUnique({ where: { id: merchantOrderId } })
      : await prisma.order.findFirst({ where: { paymobOrderId: paymobOrderId as string } });

    if (!existing) {
      console.warn("Paymob webhook: no matching order found in DB", { merchantOrderId, paymobOrderId });
      return NextResponse.json({ ok: true });
    }

    await prisma.order.update({
      where: { id: existing.id },
      data: {
        paymentStatus,
        status: orderStatus,
        ...(paymobOrderId && existing.paymobOrderId !== paymobOrderId ? { paymobOrderId } : {}),
      },
    });

    console.log(`Order ${existing.id} updated: paymentStatus=${paymentStatus}, status=${orderStatus}`);
  } catch (err) {
    console.error("Paymob webhook DB reconciliation failed", err);
    return NextResponse.json({ error: "DB update failed" }, { status: 200 });
  }

  return NextResponse.json({ ok: true });
}
