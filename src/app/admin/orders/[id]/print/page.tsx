import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, orderRef } from "@/lib/utils";
import PrintButton from "@/components/admin/PrintButton";

export default async function PrintOrderPage({
  params,
}: {
  params: { id: string };
}) {
  if (!isAdminAuthenticated()) redirect("/admin");

  const order = await prisma.order.findUnique({
    where: { id: params.id },
    include: { items: { include: { product: true } } },
  });

  if (!order) {
    return <div className="p-10 text-center text-ink">Order not found.</div>;
  }

  const paymentLabel =
    order.paymentMethod === "CASH_ON_DELIVERY" ? "Cash on Delivery" : "Paymob";

  return (
    <div className="min-h-screen bg-white px-4 py-10 text-ink">
      <style>{`@media print { .no-print { display: none !important } body { background:#fff !important } }`}</style>
      <div className="mx-auto max-w-2xl">
        <div className="flex items-center justify-between border-b border-ink/20 pb-4">
          <div>
            <p className="font-serif text-2xl font-semibold">Kruiden</p>
            <p className="text-xs text-ink/50">Restorative Hair Oil — Packing Slip</p>
          </div>
          <PrintButton />
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-ink/50">Order</p>
            <p className="font-medium">{orderRef(order.id)}</p>
            <p className="text-ink/60">{new Date(order.createdAt).toLocaleString("en-EG")}</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-widest text-ink/50">Customer</p>
            <p className="font-medium">{order.customerName}</p>
            <p className="text-ink/60">{order.phone}</p>
            <p className="text-ink/60">{order.governorate}</p>
            <p className="text-ink/60">{order.address}</p>
            {order.notes && <p className="mt-1 text-ink/60">Note: {order.notes}</p>}
          </div>
        </div>

        <table className="mt-6 w-full border-t border-ink/20 text-sm">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wide text-ink/50">
              <th className="py-2">Product</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Unit</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((it) => (
              <tr key={it.id} className="border-t border-ink/10">
                <td className="py-2">{it.product.name}</td>
                <td className="py-2 text-center">{it.quantity}</td>
                <td className="py-2 text-right">{formatPrice(it.unitPrice)}</td>
                <td className="py-2 text-right">{formatPrice(it.unitPrice * it.quantity)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-4 ml-auto w-56 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-ink/60">Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/60">Shipping</span>
            <span>{formatPrice(order.shippingFee)}</span>
          </div>
          <div className="flex justify-between border-t border-ink/20 pt-2 font-semibold">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="mt-6 border-t border-ink/20 pt-4 text-sm">
          <p>
            <span className="text-ink/50">Payment method: </span>
            {paymentLabel}
          </p>
          <p>
            <span className="text-ink/50">Payment status: </span>
            {order.paymentStatus}
          </p>
        </div>

        <p className="mt-10 text-center text-xs text-ink/40">Kruiden · Botanical Lab</p>
      </div>
    </div>
  );
}
