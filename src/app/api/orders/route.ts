import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getOrCreatePrimaryProductRecord } from "@/lib/get-or-create-product";
import { FALLBACK_PRODUCT } from "@/lib/product";
import { isPaymobConfigured, createPaymobPayment } from "@/lib/paymob";
import { isAdminAuthenticated } from "@/lib/auth";
import { EGYPT_GOVERNORATES } from "@/lib/governorates";

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Enter your full name"),
  phone: z.string().regex(/^[0-9+\s-]{8,20}$/, "Enter a valid phone number"),
  governorate: z.enum(EGYPT_GOVERNORATES as unknown as [string, ...string[]]),
  address: z.string().min(5, "Enter your full address"),
  notes: z.string().optional(),
  paymentMethod: z.enum(["CASH_ON_DELIVERY", "PAYMOB"]),
  items: z
    .array(z.object({ productId: z.string(), quantity: z.number().int().positive() }))
    .min(1, "Your cart is empty"),
});

const SHIPPING_FEE = 0; // flat/free for v1; adjust per governorate if needed

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid order" },
      { status: 400 }
    );
  }
  const data = parsed.data;

  if (data.paymentMethod === "PAYMOB" && !isPaymobConfigured()) {
    return NextResponse.json(
      { error: "Online payment isn't available right now. Please choose Cash on Delivery." },
      { status: 400 }
    );
  }

  try {
    // v1 is single-product, so resolve every line item to the one
    // canonical DB record regardless of the client-sent productId. This
    // keeps checkout resilient even if the client's cached id is stale.
    const rawProduct = await getOrCreatePrimaryProductRecord();
    const product = (rawProduct as unknown as typeof FALLBACK_PRODUCT & { id: string }) || FALLBACK_PRODUCT;
    const quantity = data.items.reduce((sum, i) => sum + i.quantity, 0);
    const subtotal = product.price * quantity;
    const total = subtotal + SHIPPING_FEE;

    const order = await prisma.order.create({
      data: {
        customerName: data.customerName,
        phone: data.phone,
        governorate: data.governorate,
        address: data.address,
        notes: data.notes,
        paymentMethod: data.paymentMethod,
        subtotal,
        shippingFee: SHIPPING_FEE,
        total,
        items: {
          create: [{ productId: product.id, quantity, unitPrice: product.price }],
        },
      },
    });

    if (data.paymentMethod === "PAYMOB") {
      const origin = new URL(req.url).origin;
      const forwardedHost = req.headers.get("x-forwarded-host");
      const forwardedProto = req.headers.get("x-forwarded-proto");
      // Behind tunnels/proxies, prefer the forwarded host so Paymob's
      // notification/redirection URLs resolve publicly.
      const publicOrigin = forwardedHost
        ? `${forwardedProto ?? "https"}://${forwardedHost}`
        : origin;

      const payment = await createPaymobPayment({
        amountCents: total,
        merchantOrderId: order.id,
        productName: product.name,
        origin: publicOrigin,
        customerName: data.customerName,
        phone: data.phone,
        address: data.address,
        city: data.governorate,
      });
      await prisma.order.update({
        where: { id: order.id },
        data: { paymobOrderId: payment.paymobOrderId },
      });
      return NextResponse.json({ orderId: order.id, redirectUrl: payment.checkoutUrl });
    }

    return NextResponse.json({ orderId: order.id, redirectUrl: `/checkout/success?order=${order.id}` });
  } catch (err) {
    console.error("Order creation failed", err);
    const message =
      err instanceof Error
        ? err.message
        : "We couldn't place your order. Please try again in a moment.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });
  return NextResponse.json({ orders });
}
