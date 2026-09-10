import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import FooterEditor from "@/components/admin/FooterEditor";
import { getFooterSettings, getSiteSettings, FALLBACK_FOOTER, FALLBACK_SITE } from "@/lib/site-content";
import { prisma } from "@/lib/prisma";

export default async function AdminFooterPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  let footer = FALLBACK_FOOTER;
  let site = FALLBACK_SITE;
  try {
    const [f, s] = await Promise.all([
      prisma.footerSettings.findUnique({ where: { id: "footer" } }),
      prisma.siteSettings.findUnique({ where: { id: "site" } }),
    ]);
    if (f) footer = { email: f.email, phone: f.phone, address: f.address, instagramUrl: f.instagramUrl, tiktokUrl: f.tiktokUrl, facebookUrl: f.facebookUrl, copyright: f.copyright, shippingNote: f.shippingNote, description: FALLBACK_FOOTER.description };
    if (s) site = { siteName: s.siteName, description: s.description };
  } catch {}
  // fallback to lib if DB down
  if (footer === FALLBACK_FOOTER) {
    try { footer = await getFooterSettings(); } catch {}
  }
  if (site === FALLBACK_SITE) {
    try { site = await getSiteSettings(); } catch {}
  }
  return (
    <AdminShell>
      <p className="text-[12px] uppercase tracking-widest text-[#a9d389]">Content</p>
      <h1 className="font-display mt-1 text-3xl font-bold text-[#f4f7ef]">Footer</h1>
      <p className="mt-1 text-sm text-[#b9c2ab]">Edit brand info and contact links shown in the footer.</p>
      <div className="mt-6"><FooterEditor footer={footer} site={site} /></div>
    </AdminShell>
  );
}
