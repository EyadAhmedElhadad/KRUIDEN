import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { getHeroSection } from "@/lib/site-content";
import { z } from "zod";

const schema = z.object({
  eyebrow: z.string().optional(),
  headline1: z.string().optional(),
  headline2: z.string().optional(),
  description: z.string().optional(),
  primaryCtaLabel: z.string().optional(),
  primaryCtaHref: z.string().optional(),
  secondaryCtaLabel: z.string().optional(),
  secondaryCtaHref: z.string().optional(),
  imageUrl: z.string().nullable().optional(),
  trustBadges: z.array(z.object({ icon: z.string(), label: z.string() })).nullable().optional(),
});

export async function GET() {
  const data = await getHeroSection();
  return NextResponse.json({ hero: data });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  try {
    const updated = await prisma.heroSection.upsert({
      where: { id: "hero" },
      update: parsed.data as any,
      create: { id: "hero", ...parsed.data } as any,
    });
    return NextResponse.json({ hero: updated });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
