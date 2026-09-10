"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Icon } from "@/components/admin/Icon";

const NAV = [
  { href: "/admin/dashboard", label: "Overview", icon: "dashboard" },
  { href: "/admin/orders", label: "Orders", icon: "receipt_long" },
  { href: "/admin/product", label: "Product", icon: "spa" },
  { href: "/admin/hero", label: "Hero", icon: "panorama" },
  { href: "/admin/features", label: "Features", icon: "star" },
  { href: "/admin/ritual", label: "Ritual", icon: "self_care" },
  { href: "/admin/footer", label: "Footer", icon: "language" },
  { href: "/admin/settings", label: "Settings", icon: "settings" },
];

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="labs-root flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-[rgba(169,211,137,0.12)] bg-[#161a12] md:flex">
        <div className="flex h-16 items-center gap-2 border-b border-[rgba(169,211,137,0.12)] px-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-none bg-[#a9d389] text-[#12140f]">
            <Icon name="spa" size={18} />
          </span>
          <span className="font-display text-lg font-bold tracking-tight text-[#f4f7ef]">
            Kruiden
          </span>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-3">
          {NAV.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#1d2417] text-[#a9d389]"
                    : "text-[#b9c2ab] hover:bg-[#1a1f16] hover:text-[#f4f7ef]"
                }`}
              >
                <Icon name={link.icon} />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-[rgba(169,211,137,0.12)] p-3">
          <button
            onClick={logout}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium text-[#b9c2ab] transition-colors hover:text-[#f4f7ef]"
          >
            <Icon name="logout" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-[rgba(169,211,137,0.12)] bg-[#12140f] px-6">
          <div className="flex items-center gap-3 md:hidden">
            <span className="flex h-7 w-7 items-center justify-center bg-[#a9d389] text-[#12140f]">
              <Icon name="spa" size={16} />
            </span>
            <span className="font-display text-base font-bold text-[#f4f7ef]">Kruiden</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <span className="hidden text-sm text-[#b9c2ab] sm:inline">Botanist</span>
            <span className="flex h-9 w-9 items-center justify-center rounded-none border border-[rgba(169,211,137,0.3)] text-[#a9d389]">
              <Icon name="experiment" size={18} />
            </span>
          </div>
        </header>

        <main className="flex-1 px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
