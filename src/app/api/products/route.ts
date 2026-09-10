import { NextResponse } from "next/server";
import { getPrimaryProduct } from "@/lib/product";

export async function GET() {
  const product = await getPrimaryProduct();
  return NextResponse.json({ product });
}
