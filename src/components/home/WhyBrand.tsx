import Image from "next/image";
import Link from "next/link";
import type { ProductDTO } from "@/lib/types";
import { getRitualSection } from "@/lib/site-content";

export default async function WhyBrand({ product }: { product: ProductDTO }) {
  const ritual = await getRitualSection();
  return (
    <section id="ritual" className="bg-apos-surfaceContainer">
      <div className="container-editorial grid gap-10 py-20 md:grid-cols-2 md:items-center md:gap-16 md:py-28">
        <div className="relative order-2 aspect-[4/5] w-full overflow-hidden rounded-xl md:order-1 apo-shadow">
          <Image
            src={ritual.imageUrl || product.images[1] || product.images[0]}
            alt="Botanical ingredients used in the oil"
            fill
            sizes="(min-width: 768px) 560px, 90vw"
            className="object-cover"
          />
        </div>

        <div className="order-1 max-w-lg md:order-2">
          <p className="apo-eyebrow">{ritual.eyebrow}</p>
          <h2 className="mt-5 whitespace-pre-line font-noto text-4xl font-semibold leading-tight text-apos-onSurface md:text-[42px]">
            {ritual.headline}
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-apos-onSurfaceVariant">
            {ritual.description}
          </p>

          <ul className="mt-8 space-y-5">
            {ritual.bullets.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-apos-onSurfaceVariant">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-apos-primary" />
                {item}
              </li>
            ))}
          </ul>

          <Link href={ritual.ctaHref} className="apo-btn mt-9">
            {ritual.ctaLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
