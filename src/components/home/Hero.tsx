import Image from "next/image";
import Link from "next/link";
import TrustIcon from "./TrustIcon";
import type { ProductDTO } from "@/lib/types";
import { getHeroSection } from "@/lib/site-content";

export default async function Hero({ product }: { product: ProductDTO }) {
  const hero = await getHeroSection();
  const heroImage = hero.imageUrl || product.images[0];
  return (
    <section className="relative overflow-hidden bg-apos-surface">
      <div className="container-editorial grid items-center gap-12 py-16 md:grid-cols-2 md:gap-16 md:py-24">
        <div className="order-2 md:order-1">
          <p className="apo-eyebrow">{hero.eyebrow}</p>
          <h1 className="mt-5 font-noto text-4xl font-semibold leading-[1.08] tracking-tight text-apos-onSurface md:text-[56px]">
            {hero.headline1}
            <br />
            {hero.headline2}
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-apos-onSurfaceVariant">
            {hero.description}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href={hero.primaryCtaHref} className="apo-btn">
              {hero.primaryCtaLabel}
            </Link>
            <Link href={hero.secondaryCtaHref} className="apo-btn-ghost">
              {hero.secondaryCtaLabel}
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-5">
            {hero.trustBadges.map((t) => (
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
            src={heroImage}
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
