import { prisma } from "./prisma";
import type { ProductDTO } from "./types";

// Used so the site still renders (for local `npm run dev` before a
// DATABASE_URL is configured) and as the seed content for the launch SKU.
export const FALLBACK_PRODUCT: ProductDTO = {
  id: "fallback-restorative-hair-oil",
  slug: "restorative-hair-oil",
  name: "Restorative Hair Oil",
  tagline: "Cold-pressed. Botanical. Undiluted.",
  description:
    "A cold-pressed blend of olive, castor, and rosemary oils, formulated to nourish the scalp and strengthen hair from root to end. Hand-crafted in small batches with no synthetic additives, no fillers — just concentrated botanical nutrition for a healthier hair ritual.",
  price: 89000,
  currency: "EGP",
  ingredients: [
    "Cold-Pressed Olive Oil",
    "Castor Oil",
    "Rosemary Extract",
    "Vitamin E",
    "Argan Oil",
  ],
  benefits: [
    "Nourishes the scalp",
    "Helps strengthen hair",
    "Adds natural shine",
    "Supports a healthy hair routine",
  ],
  usage:
    "Warm a few drops between your palms. Massage gently into the scalp and work through mid-lengths to ends. Use 2–3 times per week, ideally on damp hair or as an overnight treatment.",
  images: [
    "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?q=80&w=1600",
    "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=1600",
    "https://images.unsplash.com/photo-1585232004423-244e0e6904e3?q=80&w=1600",
  ],
  rating: 4.9,
  reviewCount: 214,
  inStock: true,
  discountPrice: null,
  discountActive: false,
  discountLabel: null,
};

export function getEffectivePrice(product: ProductDTO): number {
  if (product.discountActive && typeof product.discountPrice === "number" && product.discountPrice > 0) {
    return product.discountPrice;
  }
  return product.price;
}

export function isDiscountActive(product: ProductDTO): boolean {
  return Boolean(product.discountActive && product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price);
}

export async function getPrimaryProduct(): Promise<ProductDTO> {
  try {
    const product = await prisma.product.findFirst({
      orderBy: { createdAt: "asc" },
    });
    if (!product) return FALLBACK_PRODUCT;
    return product;
  } catch {
    // No DATABASE_URL configured yet, or DB unreachable — fall back so the
    // storefront still renders during local development / first boot.
    return FALLBACK_PRODUCT;
  }
}
