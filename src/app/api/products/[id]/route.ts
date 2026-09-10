import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminAuthenticated } from "@/lib/auth";

const updateSchema = z.object({
  name: z.string().min(1).optional(),
  tagline: z.string().optional(),
  description: z.string().min(1).optional(),
  price: z.number().int().positive().optional(),
  ingredients: z.array(z.string()).optional(),
  benefits: z.array(z.string()).optional(),
  usage: z.string().optional(),
  images: z.array(z.string()).optional(),
  inStock: z.boolean().optional(),
  discountPrice: z.number().int().positive().nullable().optional(),
  discountActive: z.boolean().optional(),
  discountLabel: z.string().max(24).nullable().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid product data" }, { status: 400 });
  }
  const product = await prisma.product.update({
    where: { id: params.id },
    data: parsed.data,
  });
  return NextResponse.json({ product });
}
