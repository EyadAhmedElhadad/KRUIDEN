import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { getSiteSettings } from "@/lib/site-content";
import { z } from "zod";

const schema = z.object({
  siteName: z.string().min(1).max(32).optional(),
  description: z.string().min(10).optional(),
});

export async function GET() {
  const data = await getSiteSettings();
  return NextResponse.json({ site: data });
}

export async function PATCH(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  try {
    const updated = await prisma.siteSettings.upsert({
      where: { id: "site" },
      update: parsed.data,
      create: { id: "site", ...parsed.data } as any,
    });
    return NextResponse.json({ site: updated });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
