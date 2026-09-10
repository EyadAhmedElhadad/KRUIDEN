import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import HeroEditor from "@/components/admin/HeroEditor";
import { getHeroSection, FALLBACK_HERO } from "@/lib/site-content";
import { prisma } from "@/lib/prisma";

export default async function AdminHeroPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  let hero = FALLBACK_HERO;
  try {
    const row = await prisma.heroSection.findUnique({ where: { id: "hero" } });
    if (row) hero = { eyebrow: row.eyebrow, headline1: row.headline1, headline2: row.headline2, description: row.description, primaryCtaLabel: row.primaryCtaLabel, primaryCtaHref: row.primaryCtaHref, secondaryCtaLabel: row.secondaryCtaLabel, secondaryCtaHref: row.secondaryCtaHref, imageUrl: row.imageUrl, trustBadges: (row.trustBadges as any) ?? FALLBACK_HERO.trustBadges };
  } catch {}
  if (hero === FALLBACK_HERO) {
    try { hero = await getHeroSection(); } catch {}
  }
  return (
    <AdminShell>
      <p className="text-[12px] uppercase tracking-widest text-[#a9d389]">Content</p>
      <h1 className="font-display mt-1 text-3xl font-bold text-[#f4f7ef]">Hero</h1>
      <p className="mt-1 text-sm text-[#b9c2ab]">Headline, description, CTAs and trust badges.</p>
      <div className="mt-6"><HeroEditor hero={hero} /></div>
    </AdminShell>
  );
}
