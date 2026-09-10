import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import FeaturesEditor from "@/components/admin/FeaturesEditor";
import { getAllFeaturesAdmin } from "@/lib/site-content";

export default async function AdminFeaturesPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  const features = await getAllFeaturesAdmin().catch(() => []);
  return (
    <AdminShell>
      <p className="text-[12px] uppercase tracking-widest text-[#a9d389]">Content</p>
      <h1 className="font-display mt-1 text-3xl font-bold text-[#f4f7ef]">Features</h1>
      <p className="mt-1 text-sm text-[#b9c2ab]">Feature strip below hero — icons and labels.</p>
      <div className="mt-6"><FeaturesEditor features={features as any} /></div>
    </AdminShell>
  );
}
