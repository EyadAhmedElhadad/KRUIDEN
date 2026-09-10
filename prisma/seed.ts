import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ── Admin user (JWT auth) ──────────────────────────────────────────
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@kruiden.local").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "Verdant2026!";
  const passwordHash = await bcrypt.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { passwordHash },
    create: { email: adminEmail, passwordHash, name: "Botanist", role: "ADMIN" },
  });
  console.log(`Seeded admin user ${adminEmail}`);

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

  // ── Site content defaults ─────────────────────────────────────────
  await prisma.siteSettings.upsert({ where: { id: "site" }, update: {}, create: { id: "site", siteName: "Kruiden", description: "A single, cold-pressed botanical hair oil — formulated without fillers, tested for one purpose: healthier hair, naturally." } });
  await prisma.footerSettings.upsert({ where: { id: "footer" }, update: {}, create: { id: "footer" } });
  await prisma.cartSettings.upsert({ where: { id: "cart" }, update: {}, create: { id: "cart" } });
  await prisma.heroSection.upsert({ where: { id: "hero" }, update: {}, create: { id: "hero" } });
  await prisma.ritualSection.upsert({ where: { id: "ritual" }, update: {}, create: { id: "ritual" } });
  // Features
  const featureCount = await prisma.feature.count();
  if (featureCount === 0) {
    await prisma.feature.createMany({
      data: [
        { label: "100% Natural Ingredients", icon: "leaf", order: 0, active: true },
        { label: "Cold-Pressed", icon: "drop", order: 1, active: true },
        { label: "Cruelty-Free", icon: "heart", order: 2, active: true },
        { label: "Fast Delivery", icon: "truck", order: 3, active: true },
      ],
    });
    console.log("Seeded features");
  }
  console.log("Seeded site content");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
