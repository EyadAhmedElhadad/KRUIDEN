import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import AccountEditor from "@/components/admin/AccountEditor";

export default async function AdminAccountPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  return (
    <AdminShell>
      <p className="text-[12px] uppercase tracking-widest text-[#a9d389]">Account</p>
      <h1 className="font-display mt-1 text-3xl font-bold text-[#f4f7ef]">Account</h1>
      <p className="mt-1 text-sm text-[#b9c2ab]">Manage admin credentials — email + password (JWT).</p>
      <div className="mt-6"><AccountEditor /></div>
    </AdminShell>
  );
}
