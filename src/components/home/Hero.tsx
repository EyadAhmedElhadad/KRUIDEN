import Image from "next/image";
import Link from "next/link";
import TrustIcon from "./TrustIcon";
import type { ProductDTO } from "@/lib/types";

export default function Hero({ product }: { product: ProductDTO }) {
  return (
    <section className="relative overflow-hidden bg-apos-surface">
      <div className="container-editorial grid items-center gap-12 py-16 md:grid-cols-2 md:gap-16 md:py-24">
        <div className="order-2 md:order-1">
          <p className="apo-eyebrow">Botanical Hair Ritual</p>
          <h1 className="mt-5 font-noto text-4xl font-semibold leading-[1.08] tracking-tight text-apos-onSurface md:text-[56px]">
            Naturally better
            <br />
            hair days.
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-apos-onSurfaceVariant">
            A cold-pressed hair oil made from a short, transparent list of
            botanicals — crafted to nourish the scalp and strengthen every strand.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/product" className="apo-btn">
              Shop the Oil
            </Link>
            <Link href="#ritual" className="apo-btn-ghost">
              Discover the Ritual
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-5">
            {[
              { icon: "leaf", label: "100% Botanical" },
              { icon: "shield", label: "No Fillers" },
              { icon: "spark", label: "Cruelty-Free" },
            ].map((t) => (
              <div key={t.label} className="flex items-center gap-2">
                <TrustIcon name={t.icon} className="text-apos-primary" />
                <span className="text-[12px] font-medium text-apos-onSurfaceVariant">
                  {t.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative order-1 aspect-[4/5] w-full overflow-hidden rounded-xl md:order-2 apo-shadow">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            priority
            sizes="(min-width: 768px) 560px, 90vw"
            className="object-cover"
          />
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -right-10 -bottom-10 h-64 w-64 text-apos-primary/15"
            viewBox="0 0 200 200"
            fill="none"
          >
            <path
              d="M100 10c40 30 60 70 40 130-30 20-70 20-90-10C30 90 50 40 100 10Z"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path d="M100 10c0 60 0 100 0 130" stroke="currentColor" strokeWidth="1" />
          </svg>
        </div>
      </div>
    </section>
  );
}
