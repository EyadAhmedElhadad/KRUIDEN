import { prisma } from "./prisma";
import { FALLBACK_PRODUCT } from "./product";

/**
 * Returns the single launch product from the database, creating it from
 * the fallback content on first use if the table is empty. This lets
 * checkout work immediately after `prisma db push`, without requiring a
 * separate seed step.
 */
export async function getOrCreatePrimaryProductRecord() {
  try {
    const existing = await prisma.product.findFirst({ orderBy: { createdAt: "asc" } });
    if (existing) return existing;
    const { id, ...data } = FALLBACK_PRODUCT;
    return await prisma.product.create({ data });
  } catch {
    // DB unreachable — return fallback shaped like a Product record
    return {
      ...FALLBACK_PRODUCT,
      createdAt: new Date(),
      updatedAt: new Date(),
      orderItems: [],
    } as unknown as Awaited<ReturnType<typeof prisma.product.findFirst>>;
  }
}
