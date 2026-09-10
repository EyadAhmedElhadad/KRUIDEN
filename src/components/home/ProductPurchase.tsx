"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import TrustIcon from "./TrustIcon";
import type { ProductDTO } from "@/lib/types";

export default function ProductPurchase({ product }: { product: ProductDTO }) {
  const { addItem } = useCart();
  const router = useRouter();

  const handleAdd = () =>
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.price,
      currency: product.currency,
    });

  const handleBuy = () => {
    handleAdd();
    router.push("/checkout");
  };

  const filled = Math.round(product.rating);

  return (
    <section id="shop" className="bg-apos-surface py-16 md:py-24">
      <div className="container-editorial grid items-start gap-10 md:grid-cols-2 md:gap-16">
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-apos-surfaceContainer apo-shadow">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 768px) 560px, 90vw"
            className="object-cover"
          />
        </div>

        <div>
          <p className="apo-eyebrow">The Signature Oil</p>
          <h1 className="mt-4 font-noto text-4xl font-semibold leading-tight text-apos-onSurface md:text-5xl">
            {product.name}
          </h1>

          <div className="mt-4 flex items-center gap-3">
            <div className="flex gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} filled={i < filled} />
              ))}
            </div>
            <span className="text-[13px] text-apos-onSurfaceVariant">
              {product.reviewCount} reviews
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="text-3xl font-semibold text-apos-onSurface">
              {product.price} {product.currency}
            </span>
          </div>

          {product.tagline ? (
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-apos-onSurfaceVariant">
              {product.tagline}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button onClick={handleAdd} className="apo-btn-ghost" disabled={!product.inStock}>
              Add to Cart
            </button>
            <button
              onClick={handleBuy}
              className="apo-btn"
              disabled={!product.inStock}
            >
              Buy Now
            </button>
          </div>

          <p className="mt-3 text-[13px] text-apos-onSurfaceVariant">
            {product.inStock ? "In stock, ready to ship" : "Currently unavailable"}
          </p>

          <div className="mt-8 flex flex-col gap-3 border-t border-apos-outlineVariant pt-6">
            <div className="flex items-center gap-3">
              <TrustIcon name="leaf" className="text-apos-primary" />
              <span className="text-[14px] text-apos-onSurfaceVariant">
                100% botanical, cold-pressed
              </span>
            </div>
            <div className="flex items-center gap-3">
              <TrustIcon name="truck" className="text-apos-primary" />
              <span className="text-[14px] text-apos-onSurfaceVariant">
                Free shipping over 500 EGP
              </span>
            </div>
            <div className="flex items-center gap-3">
              <TrustIcon name="shield" className="text-apos-primary" />
              <span className="text-[14px] text-apos-onSurfaceVariant">
                Cash on Delivery available
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.5"
      className={filled ? "text-apos-primary" : "text-apos-onSurface/20"}
    >
      <path
        d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17.8 6.6 20l1-6.1L3.2 9.5l6.1-.9L12 3z"
        strokeLinejoin="round"
      />
    </svg>
  );
}
