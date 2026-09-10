import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.product.upsert({
    where: { slug: "restorative-hair-oil" },
    update: {},
    create: {
      slug: "restorative-hair-oil",
      name: "Restorative Hair Oil",
      tagline: "Cold-pressed. Botanical. Undiluted.",
      description:
        "A cold-pressed blend of olive, castor, and rosemary oils, formulated to nourish the scalp and strengthen hair from root to end. Hand-crafted in small batches with no synthetic additives, no fillers — just concentrated botanical nutrition for a healthier hair ritual.",
      price: 89000, // 890.00 EGP, stored in piastres
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
    },
  });
  console.log("Seeded product.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
