import { prisma } from "./prisma";
import { FALLBACK_PRODUCT } from "./product";

/**
 * Returns the single launch product from the database, creating it from
 * the fallback content on first use if the table is empty. This lets
 * checkout work immediately after `prisma db push`, without requiring a
 * separate seed step.
 */
export async function getOrCreatePrimaryProductRecord() {
  const existing = await prisma.product.findFirst({ orderBy: { createdAt: "asc" } });
  if (existing) return existing;

  const { id, ...data } = FALLBACK_PRODUCT;
  return prisma.product.create({ data });
}
