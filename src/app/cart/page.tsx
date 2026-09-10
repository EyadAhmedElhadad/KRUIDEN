"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import QuantitySelector from "@/components/ui/QuantitySelector";

export default function CartPage() {
  const { lines, updateQuantity, removeItem, subtotal } = useCart();

  if (lines.length === 0) {
    return (
      <div className="container-editorial flex flex-col items-center justify-center gap-5 py-32 text-center">
        <p className="font-serif text-2xl text-ink">Your cart is empty.</p>
        <p className="text-sm text-ink/50">Add the oil to begin your ritual.</p>
        <Link href="/product" className="btn-primary mt-2">
          Shop the Oil
        </Link>
      </div>
    );
  }

  return (
    <div className="container-editorial py-12 md:py-16">
      <h1 className="font-serif text-3xl font-semibold text-ink md:text-4xl">
        Your Cart
      </h1>

      <div className="mt-10 grid gap-12 md:grid-cols-3">
        <ul className="divide-y divide-ink/10 border-t border-ink/10 md:col-span-2">
          {lines.map((line) => (
            <li key={line.productId} className="flex gap-5 py-6">
              <div className="relative h-28 w-24 shrink-0 overflow-hidden rounded-sm bg-sand">
                <Image src={line.image} alt={line.name} fill className="object-cover" sizes="100px" />
              </div>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-serif text-lg font-medium">{line.name}</p>
                    <p className="mt-1 text-sm text-ink/50">
                      {formatPrice(line.price, line.currency)} each
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatPrice(line.price * line.quantity, line.currency)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <QuantitySelector
                    quantity={line.quantity}
                    onChange={(q) => updateQuantity(line.productId, q)}
                    size="sm"
                  />
                  <button
                    onClick={() => removeItem(line.productId)}
                    className="text-xs font-medium uppercase tracking-wide text-ink/40 hover:text-ink"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div className="h-fit rounded-sm border border-ink/10 bg-sand/50 p-6">
          <h2 className="font-serif text-xl font-semibold">Order Summary</h2>
          <div className="mt-5 flex items-center justify-between text-sm">
            <span className="text-ink/60">Subtotal</span>
            <span className="font-medium">{formatPrice(subtotal)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between text-sm">
            <span className="text-ink/60">Shipping</span>
            <span className="text-ink/50">Calculated at checkout</span>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
            <span className="font-medium">Total</span>
            <span className="font-serif text-xl font-semibold">
              {formatPrice(subtotal)}
            </span>
          </div>
          <Link href="/checkout" className="btn-primary mt-6 w-full">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
