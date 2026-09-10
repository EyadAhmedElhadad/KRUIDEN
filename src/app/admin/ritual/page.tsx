import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import RitualEditor from "@/components/admin/RitualEditor";
import { getRitualSection, FALLBACK_RITUAL } from "@/lib/site-content";
import { prisma } from "@/lib/prisma";

export default async function AdminRitualPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  let ritual = FALLBACK_RITUAL;
  try {
    const row = await prisma.ritualSection.findUnique({ where: { id: "ritual" } });
    if (row) ritual = { eyebrow: row.eyebrow, headline: row.headline, description: row.description, bullets: row.bullets, imageUrl: row.imageUrl, ctaLabel: row.ctaLabel, ctaHref: row.ctaHref };
  } catch {}
  if (ritual === FALLBACK_RITUAL) {
    try { ritual = await getRitualSection(); } catch {}
  }
  return (
    <AdminShell>
      <p className="text-[12px] uppercase tracking-widest text-[#a9d389]">Content</p>
      <h1 className="font-display mt-1 text-3xl font-bold text-[#f4f7ef]">Ritual</h1>
      <p className="mt-1 text-sm text-[#b9c2ab]">The Ritual section — headline, bullets and image.</p>
      <div className="mt-6"><RitualEditor ritual={ritual} /></div>
    </AdminShell>
  );
}
