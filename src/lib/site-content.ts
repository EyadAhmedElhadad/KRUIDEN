import { prisma } from "./prisma";

// ── Fallbacks (match hardcoded JSX before DB) ───────────────────────
export const FALLBACK_FOOTER = {
  email: "hello@kruiden.com",
  phone: "+20 100 000 0000",
  address: "Cairo, Egypt",
  instagramUrl: "#",
  tiktokUrl: "#",
  facebookUrl: "#",
  copyright: `© ${new Date().getFullYear()} Kruiden. All rights reserved.`,
  shippingNote: "Secure Checkout · Cash on Delivery · Nationwide Shipping",
  description: "A single, cold-pressed botanical hair oil — formulated without fillers, tested for one purpose: healthier hair, naturally.",
};

export const FALLBACK_CART = {
  codEnabled: true,
  shippingFee: 0,
  freeShippingThreshold: null as number | null,
  currency: "EGP",
};

export const FALLBACK_SITE = {
  siteName: "Kruiden",
  description: "A single, cold-pressed botanical hair oil — formulated without fillers, tested for one purpose: healthier hair, naturally.",
};

export const FALLBACK_HERO = {
  eyebrow: "Botanical Hair Ritual",
  headline1: "Naturally better",
  headline2: "hair days.",
  description: "A cold-pressed hair oil made from a short, transparent list of botanicals — crafted to nourish the scalp and strengthen every strand.",
  primaryCtaLabel: "Shop the Oil",
  primaryCtaHref: "/product",
  secondaryCtaLabel: "Discover the Ritual",
  secondaryCtaHref: "#ritual",
  imageUrl: null as string | null,
  trustBadges: [
    { icon: "leaf", label: "100% Botanical" },
    { icon: "shield", label: "No Fillers" },
    { icon: "spark", label: "Cruelty-Free" },
  ] as { icon: string; label: string }[],
};

export const FALLBACK_FEATURES = [
  { id: "1", label: "100% Natural Ingredients", icon: "leaf", order: 0, active: true },
  { id: "2", label: "Cold-Pressed", icon: "drop", order: 1, active: true },
  { id: "3", label: "Cruelty-Free", icon: "heart", order: 2, active: true },
  { id: "4", label: "Fast Delivery", icon: "truck", order: 3, active: true },
];

export const FALLBACK_RITUAL = {
  eyebrow: "The Ritual",
  headline: "Simple ingredients.\nBetter hair days.",
  description:
    "We started with one question: what would this oil look like with nothing to hide? The answer is a short list of cold-pressed botanicals, blended in small batches and bottled without dilution — so every drop does the work.",
  bullets: ["No synthetic fillers, ever", "Cold-pressed to preserve nutrients", "Formulated for daily scalp care"],
  imageUrl: null as string | null,
  ctaLabel: "Shop the Oil",
  ctaHref: "/product",
};

// ── Fetch helpers with DB fallback ───────────────────────────────────
export async function getFooterSettings() {
  try {
    const row = await prisma.footerSettings.findUnique({ where: { id: "footer" } });
    if (!row) return FALLBACK_FOOTER;
    return {
      email: row.email,
      phone: row.phone,
      address: row.address,
      instagramUrl: row.instagramUrl,
      tiktokUrl: row.tiktokUrl,
      facebookUrl: row.facebookUrl,
      copyright: row.copyright,
      shippingNote: row.shippingNote,
      description: FALLBACK_FOOTER.description, // keep site description from SiteSettings
    };
  } catch {
    return FALLBACK_FOOTER;
  }
}

export async function getSiteSettings() {
  try {
    const row = await prisma.siteSettings.findUnique({ where: { id: "site" } });
    if (!row) return FALLBACK_SITE;
    return { siteName: row.siteName, description: row.description };
  } catch {
    return FALLBACK_SITE;
  }
}

export async function getCartSettings() {
  try {
    const row = await prisma.cartSettings.findUnique({ where: { id: "cart" } });
    if (!row) return FALLBACK_CART;
    return {
      codEnabled: row.codEnabled,
      shippingFee: row.shippingFee,
      freeShippingThreshold: row.freeShippingThreshold,
      currency: row.currency,
    };
  } catch {
    return FALLBACK_CART;
  }
}

export async function getHeroSection() {
  try {
    const row = await prisma.heroSection.findUnique({ where: { id: "hero" } });
    if (!row) return FALLBACK_HERO;
    return {
      eyebrow: row.eyebrow,
      headline1: row.headline1,
      headline2: row.headline2,
      description: row.description,
      primaryCtaLabel: row.primaryCtaLabel,
      primaryCtaHref: row.primaryCtaHref,
      secondaryCtaLabel: row.secondaryCtaLabel,
      secondaryCtaHref: row.secondaryCtaHref,
      imageUrl: row.imageUrl,
      trustBadges: (row.trustBadges as { icon: string; label: string }[] | null) ?? FALLBACK_HERO.trustBadges,
    };
  } catch {
    return FALLBACK_HERO;
  }
}

export async function getFeatures() {
  try {
    const rows = await prisma.feature.findMany({ where: { active: true }, orderBy: { order: "asc" } });
    if (!rows.length) return FALLBACK_FEATURES;
    return rows.map((r) => ({ id: r.id, label: r.label, icon: r.icon, order: r.order, active: r.active }));
  } catch {
    return FALLBACK_FEATURES;
  }
}

export async function getAllFeaturesAdmin() {
  try {
    const rows = await prisma.feature.findMany({ orderBy: { order: "asc" } });
    if (!rows.length) return FALLBACK_FEATURES;
    return rows;
  } catch {
    return FALLBACK_FEATURES;
  }
}

export async function getRitualSection() {
  try {
    const row = await prisma.ritualSection.findUnique({ where: { id: "ritual" } });
    if (!row) return FALLBACK_RITUAL;
    return {
      eyebrow: row.eyebrow,
      headline: row.headline,
      description: row.description,
      bullets: row.bullets,
      imageUrl: row.imageUrl,
      ctaLabel: row.ctaLabel,
      ctaHref: row.ctaHref,
    };
  } catch {
    return FALLBACK_RITUAL;
  }
}
