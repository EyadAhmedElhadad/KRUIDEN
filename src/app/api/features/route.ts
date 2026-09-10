import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";
import { getFeatures, getAllFeaturesAdmin } from "@/lib/site-content";
import { z } from "zod";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const all = url.searchParams.get("all") === "1";
  // public: only active; admin: all=1 needs auth
  if (all) {
    if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const data = await getAllFeaturesAdmin();
    return NextResponse.json({ features: data });
  }
  const data = await getFeatures();
  return NextResponse.json({ features: data });
}

const createSchema = z.object({
  label: z.string().min(2),
  icon: z.string().default("leaf"),
  order: z.number().int().optional(),
  active: z.boolean().optional(),
});

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid" }, { status: 400 });
  const created = await prisma.feature.create({ data: parsed.data });
  return NextResponse.json({ feature: created });
}
