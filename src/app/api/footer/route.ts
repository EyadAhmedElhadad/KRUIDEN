import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { getFooterSettings } from "@/lib/site-content";
import { z } from "zod";

const schema = z.object({
  email: z.string().email().optional(),
  phone: z.string().min(3).optional(),
  address: z.string().min(2).optional(),
  instagramUrl: z.string().optional(),
  tiktokUrl: z.string().optional(),
  facebookUrl: z.string().optional(),
  copyright: z.string().optional(),
  shippingNote: z.string().optional(),
});

export async function GET() {
  const data = await getFooterSettings();
  return NextResponse.json({ footer: data });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  try {
    const updated = await prisma.footerSettings.upsert({
      where: { id: "footer" },
      update: parsed.data,
      create: { id: "footer", ...parsed.data } as any,
    });
    return NextResponse.json({ footer: updated });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
