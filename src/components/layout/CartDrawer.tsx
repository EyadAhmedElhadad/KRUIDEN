"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";

export default function CartDrawer() {
  const { lines, isOpen, closeCart, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <>
      <div
        className={`fixed inset-0 z-50 bg-ink/40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ease-editorial ${
          isOpen ? "translate-x-0" : "pointer-events-none invisible translate-x-full"
        }`}
        role="dialog"
        aria-label="Shopping cart"
      >
        <div className="flex items-center justify-between border-b border-ink/8 px-6 py-5">
          <h2 className="font-serif text-xl font-semibold">Your Cart</h2>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-olive-100"
          >
            ✕
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-sm text-ink/50">Your cart is empty.</p>
            <Link href="/product" onClick={closeCart} className="btn-primary">
              Shop the Oil
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-6">
              <ul className="space-y-6">
                {lines.map((line) => (
                  <li key={line.productId} className="flex gap-4">
                    <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-md bg-sand">
                      <Image src={line.image} alt={line.name} fill className="object-cover" sizes="80px" />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium leading-snug">{line.name}</p>
                        <button
                          onClick={() => removeItem(line.productId)}
                          aria-label={`Remove ${line.name}`}
                          className="-mr-1 px-1 py-2 text-xs text-ink/40 hover:text-ink"
                        >
                          Remove
                        </button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center rounded-full border border-ink/15">
                          <button
                            className="flex h-9 w-9 items-center justify-center text-sm"
                            onClick={() => updateQuantity(line.productId, line.quantity - 1)}
                            aria-label="Decrease quantity"
                          >
                            −
                          </button>
                          <span className="w-6 text-center text-sm">{line.quantity}</span>
                          <button
                            className="flex h-9 w-9 items-center justify-center text-sm"
                            onClick={() => updateQuantity(line.productId, line.quantity + 1)}
                            aria-label="Increase quantity"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-sm font-semibold">
                          {formatPrice(line.price * line.quantity, line.currency)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-ink/8 px-6 py-6">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-ink/60">Subtotal</span>
                <span className="font-serif text-lg font-semibold">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <Link href="/checkout" onClick={closeCart} className="btn-primary w-full">
                Checkout
              </Link>
              <Link
                href="/cart"
                onClick={closeCart}
                className="mt-3 block text-center text-xs font-medium uppercase tracking-wide text-ink/50 hover:text-ink"
              >
                View full cart
              </Link>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
