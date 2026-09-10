import { redirect } from "next/navigation";
import Link from "next/link";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import { formatPrice } from "@/lib/utils";
import { Icon, STATUS_META } from "@/components/admin/Icon";

export default async function AdminDashboardPage() {
  if (!isAdminAuthenticated()) redirect("/admin");

  const [orderCount, pendingCount, revenue, orders] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: "PENDING" } }),
    prisma.order.aggregate({ _sum: { total: true } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { items: { include: { product: true } } },
    }),
  ]);

  const totalRevenue = revenue._sum.total ?? 0;
  const avgOrder = orderCount > 0 ? Math.round(totalRevenue / orderCount) : 0;

  const daily = await revenueByDay();

  return (
    <AdminShell>
      <div className="mb-8">
        <p className="text-[12px] uppercase tracking-widest text-[#a9d389]">Botanical Lab</p>
        <h1 className="font-display mt-1 text-3xl font-bold text-[#f4f7ef]">
          Welcome back, Botanist
        </h1>
        <p className="mt-1 text-sm text-[#b9c2ab]">
          Here is how your restorative hair oil is performing.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total Sales" value={formatPrice(totalRevenue)} delta="+12.5%" />
        <StatCard label="Orders" value={String(orderCount)} delta="+8.2%" />
        <StatCard label="Pending" value={String(pendingCount)} />
        <StatCard label="Avg Order Value" value={formatPrice(avgOrder)} />
      </div>

      <div className="mt-6 labs-card p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="font-display text-lg font-semibold text-[#f4f7ef]">Revenue Trend</h2>
            <p className="text-xs text-[#b9c2ab]">Last 7 days</p>
          </div>
          <span className="text-sm text-[#a9d389]">{formatPrice(totalRevenue)} total</span>
        </div>
        <div className="flex h-44 items-end gap-2 sm:gap-3">
          {daily.map((d) => {
            const pct = d.max > 0 ? Math.max(4, Math.round((d.value / d.max) * 100)) : 4;
            return (
              <div key={d.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full flex-1 items-end">
                  <div
                    className="w-full bg-[#a9d389] transition-all"
                    style={{ height: `${pct}%`, opacity: d.value > 0 ? 1 : 0.25 }}
                    title={formatPrice(d.value)}
                  />
                </div>
                <span className="text-[11px] text-[#b9c2ab]">{d.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-[#f4f7ef]">Recent Orders</h2>
          <Link href="/admin/orders" className="labs-pill">
            View all
            <Icon name="arrow_forward" size={16} />
          </Link>
        </div>
        <div className="labs-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(169,211,137,0.12)] text-left text-[11px] uppercase tracking-wide text-[#b9c2ab]">
                <th className="px-4 py-3">Customer</th>
                <th className="hidden px-4 py-3 sm:table-cell">Governorate</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-[rgba(169,211,137,0.08)] last:border-0">
                  <td className="px-4 py-3 text-[#f4f7ef]">{o.customerName}</td>
                  <td className="hidden px-4 py-3 text-[#b9c2ab] sm:table-cell">{o.governorate}</td>
                  <td className="px-4 py-3 text-[#f4f7ef]">{formatPrice(o.total)}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-[#b9c2ab]">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}

async function revenueByDay() {
  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);

  const rows = await prisma.order.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true, total: true },
  });

  const days: { label: string; value: number; date: string }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    days.push({
      label: d.toLocaleDateString("en-US", { weekday: "short" }),
      date: d.toISOString().slice(0, 10),
      value: 0,
    });
  }
  for (const r of rows) {
    const key = r.createdAt.toISOString().slice(0, 10);
    const day = days.find((d) => d.date === key);
    if (day) day.value += r.total;
  }
  const max = Math.max(...days.map((d) => d.value), 0);
  return days.map((d) => ({ label: d.label, value: d.value, max }));
}

function StatCard({
  label,
  value,
  delta,
}: {
  label: string;
  value: string;
  delta?: string;
}) {
  return (
    <div className="labs-card p-5">
      <p className="text-[11px] uppercase tracking-wide text-[#b9c2ab]">{label}</p>
      <p className="font-display mt-2 text-2xl font-bold text-[#f4f7ef]">{value}</p>
      {delta && (
        <p className="mt-1 text-xs font-medium text-[#a9d389]">
          <Icon name="trending_up" size={14} /> {delta}
        </p>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const meta = STATUS_META[status] ?? { label: status, color: "#b9c2ab" };
  return (
    <span className="inline-flex items-center gap-2 text-xs font-medium">
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.color }} />
      <span style={{ color: meta.color }}>{meta.label}</span>
    </span>
  );
}
