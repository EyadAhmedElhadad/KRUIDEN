import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { getCartSettings } from "@/lib/site-content";
import { z } from "zod";

const schema = z.object({
  codEnabled: z.boolean().optional(),
  shippingFee: z.number().int().min(0).optional(),
  freeShippingThreshold: z.number().int().min(0).nullable().optional(),
  currency: z.string().min(2).max(4).optional(),
});

export async function GET() {
  const data = await getCartSettings();
  return NextResponse.json({ cart: data });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data", details: parsed.error.issues }, { status: 400 });
  try {
    const updated = await prisma.cartSettings.upsert({
      where: { id: "cart" },
      update: parsed.data,
      create: { id: "cart", ...parsed.data } as any,
    });
    return NextResponse.json({ cart: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
