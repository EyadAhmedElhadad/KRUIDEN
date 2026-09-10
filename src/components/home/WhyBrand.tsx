import Image from "next/image";
import Link from "next/link";
import type { ProductDTO } from "@/lib/types";

export default function WhyBrand({ product }: { product: ProductDTO }) {
  return (
    <section id="ritual" className="bg-apos-surfaceContainer">
      <div className="container-editorial grid gap-10 py-20 md:grid-cols-2 md:items-center md:gap-16 md:py-28">
        <div className="relative order-2 aspect-[4/5] w-full overflow-hidden rounded-xl md:order-1 apo-shadow">
          <Image
            src={product.images[1] ?? product.images[0]}
            alt="Botanical ingredients used in the oil"
            fill
            sizes="(min-width: 768px) 560px, 90vw"
            className="object-cover"
          />
        </div>

        <div className="order-1 max-w-lg md:order-2">
          <p className="apo-eyebrow">The Ritual</p>
          <h2 className="mt-5 font-noto text-4xl font-semibold leading-tight text-apos-onSurface md:text-[42px]">
            Simple ingredients.
            <br />
            Better hair days.
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-apos-onSurfaceVariant">
            We started with one question: what would this oil look like with
            nothing to hide? The answer is a short list of cold-pressed
            botanicals, blended in small batches and bottled without
            dilution — so every drop does the work.
          </p>

          <ul className="mt-8 space-y-5">
            {[
              "No synthetic fillers, ever",
              "Cold-pressed to preserve nutrients",
              "Formulated for daily scalp care",
            ].map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-apos-onSurfaceVariant">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-apos-primary" />
                {item}
              </li>
            ))}
          </ul>

          <Link href="/product" className="apo-btn mt-9">
            Shop the Oil
          </Link>
        </div>
      </div>
    </section>
  );
}
