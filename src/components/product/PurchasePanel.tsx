"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { ProductDTO } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { getEffectivePrice, isDiscountActive } from "@/lib/product";
import { useCart } from "@/lib/cart-context";
import QuantitySelector from "@/components/ui/QuantitySelector";

export default function PurchasePanel({ product }: { product: ProductDTO }) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const router = useRouter();
  const effectivePrice = getEffectivePrice(product);
  const discount = isDiscountActive(product);

  function addToCart() {
    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        image: product.images[0],
        price: effectivePrice,
        currency: product.currency,
      },
      quantity
    );
  }

  function buyNow() {
    addToCart();
    router.push("/checkout");
  }

  return (
    <>
      {discount && (
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="rounded-none bg-olive-600 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {product.discountLabel || `${Math.round((1 - effectivePrice / product.price) * 100)}% OFF`}
          </span>
          <span className="text-sm text-ink/40 line-through">{formatPrice(product.price, product.currency)}</span>
          <span className="font-serif text-lg font-semibold text-ink">{formatPrice(effectivePrice, product.currency)}</span>
        </div>
      )}

      <div className="mt-7 flex items-center gap-4">
        <QuantitySelector quantity={quantity} onChange={setQuantity} />
        <span className="text-xs text-ink/40">
          {product.inStock ? "In stock, ready to ship" : "Currently unavailable"}
        </span>
      </div>

      <div className="mt-6 hidden gap-3 sm:flex">
        <button onClick={addToCart} className="btn-secondary flex-1" disabled={!product.inStock}>
          Add to Cart
        </button>
        <button onClick={buyNow} className="btn-primary flex-1" disabled={!product.inStock}>
          Buy Now
        </button>
      </div>

      {/* Sticky mobile bar keeps the primary purchase action always reachable */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center gap-3 border-t border-ink/10 bg-cream/95 p-4 backdrop-blur sm:hidden">
        <div className="flex-1">
          <p className="text-[11px] text-ink/50">Total</p>
          <p className="font-serif text-base font-semibold">
            {formatPrice(effectivePrice * quantity, product.currency)}
          </p>
          {discount && (
            <p className="text-[11px] text-ink/40 line-through">{formatPrice(product.price * quantity, product.currency)}</p>
          )}
        </div>
        <button onClick={addToCart} className="btn-secondary" disabled={!product.inStock}>
          Add
        </button>
        <button onClick={buyNow} className="btn-primary" disabled={!product.inStock}>
          Buy Now
        </button>
      </div>
    </>
  );
}
