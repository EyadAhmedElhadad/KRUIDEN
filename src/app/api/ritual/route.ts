import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { getRitualSection } from "@/lib/site-content";
import { z } from "zod";

const schema = z.object({
  eyebrow: z.string().optional(),
  headline: z.string().optional(),
  description: z.string().optional(),
  bullets: z.array(z.string()).optional(),
  imageUrl: z.string().nullable().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
});

export async function GET() {
  const data = await getRitualSection();
  return NextResponse.json({ ritual: data });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  try {
    const updated = await prisma.ritualSection.upsert({
      where: { id: "ritual" },
      update: parsed.data as any,
      create: { id: "ritual", ...parsed.data } as any,
    });
    return NextResponse.json({ ritual: updated });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
