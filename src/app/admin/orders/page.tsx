import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import AdminShell from "@/components/admin/AdminShell";
import OrdersTable from "@/components/admin/OrdersTable";

export default async function AdminOrdersPage() {
  if (!isAdminAuthenticated()) redirect("/admin");

  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return (
    <AdminShell>
      <p className="text-[12px] uppercase tracking-widest text-[#a9d389]">Fulfillment</p>
      <h1 className="font-display mt-1 text-3xl font-bold text-[#f4f7ef]">Orders</h1>
      <p className="mt-1 text-sm text-[#b9c2ab]">{orders.length} total orders.</p>
      <div className="mt-6">
        <OrdersTable
          orders={orders.map((o: (typeof orders)[number]) => ({
            id: o.id,
            customerName: o.customerName,
            phone: o.phone,
            governorate: o.governorate,
            address: o.address,
            notes: o.notes,
            internalNotes: o.internalNotes,
            paymentStatus: o.paymentStatus,
            total: o.total,
            paymentMethod: o.paymentMethod,
            status: o.status,
            createdAt: o.createdAt.toISOString(),
            items: o.items.map((i: (typeof o.items)[number]) => ({
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
