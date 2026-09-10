import { redirect } from "next/navigation";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getOrCreatePrimaryProductRecord } from "@/lib/get-or-create-product";
import AdminShell from "@/components/admin/AdminShell";
import ProductEditor from "@/components/admin/ProductEditor";

export default async function AdminProductPage() {
  if (!isAdminAuthenticated()) redirect("/admin");

  const product = await getOrCreatePrimaryProductRecord();

  return (
    <AdminShell>
      <p className="text-[12px] uppercase tracking-widest text-[#a9d389]">Inventory</p>
      <h1 className="font-display mt-1 text-3xl font-bold text-[#f4f7ef]">Product</h1>
      <p className="mt-1 text-sm text-[#b9c2ab]">
        Edit the details customers see across the storefront.
      </p>
      <div className="mt-6 max-w-2xl">
        <ProductEditor
          product={{
            id: product.id,
            name: product.name,
            tagline: product.tagline,
            description: product.description,
            price: product.price,
            ingredients: product.ingredients,
            benefits: product.benefits,
            usage: product.usage,
            images: product.images,
            inStock: product.inStock,
          }}
        />
      </div>
    </AdminShell>
  );
}
