import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import AdminShell from "@/components/admin/AdminShell";
import SettingsEditor from "@/components/admin/SettingsEditor";
import { getCartSettings, FALLBACK_CART } from "@/lib/site-content";
import { prisma } from "@/lib/prisma";

export default async function AdminSettingsPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");
  let cart = FALLBACK_CART;
  try {
    const row = await prisma.cartSettings.findUnique({ where: { id: "cart" } });
    if (row) cart = { codEnabled: row.codEnabled, shippingFee: row.shippingFee, freeShippingThreshold: row.freeShippingThreshold, currency: row.currency };
  } catch {}
  if (cart === FALLBACK_CART) {
    try { cart = await getCartSettings(); } catch {}
  }
  return (
    <AdminShell>
      <p className="text-[12px] uppercase tracking-widest text-[#a9d389]">Config</p>
      <h1 className="font-display mt-1 text-3xl font-bold text-[#f4f7ef]">Settings</h1>
      <p className="mt-1 text-sm text-[#b9c2ab]">Cart & checkout configuration.</p>
      <div className="mt-6"><SettingsEditor cart={cart} /></div>
    </AdminShell>
  );
}
