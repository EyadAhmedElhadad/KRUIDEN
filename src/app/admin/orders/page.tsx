import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import OrdersTable from "@/components/admin/OrdersTable";

export default async function AdminOrdersPage() {
  if (!(await isAdminAuthenticated())) redirect("/admin");

  const orders = await prisma.order
    .findMany({
      orderBy: { createdAt: "desc" },
      include: { items: { include: { product: true } } },
    })
    .catch(() => [] as unknown as Awaited<ReturnType<typeof prisma.order.findMany>>);

  return (
    <AdminShell>
      <p className="text-[12px] uppercase tracking-widest text-[#a9d389]">Fulfillment</p>
      <h1 className="font-display mt-1 text-3xl font-bold text-[#f4f7ef]">Orders</h1>
      <p className="mt-1 text-sm text-[#b9c2ab]">{orders.length} total orders.</p>
      <div className="mt-6">
        <OrdersTable
          orders={(orders as unknown as Array<Awaited<ReturnType<typeof prisma.order.findMany>>[number]>).map((o) => ({
            id: o.id,
            customerName: o.customerName,
            phone: o.phone,
            governorate: o.governorate,
            address: o.address,
            notes: o.notes,
            internalNotes: (o as { internalNotes: string | null }).internalNotes,
            paymentStatus: o.paymentStatus,
            total: o.total,
            paymentMethod: o.paymentMethod,
            status: o.status,
            createdAt: o.createdAt.toISOString(),
            items: (o as unknown as { items: Array<{ product: { name: string; images: string[] }; quantity: number; unitPrice: number }> }).items.map((i) => ({
              name: i.product.name,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
              image: i.product.images?.[0] ?? "",
            })),
          }))}
        />
      </div>
    </AdminShell>
  );
}
