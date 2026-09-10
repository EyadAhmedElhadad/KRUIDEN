import Image from "next/image";
import type { ProductDTO } from "@/lib/types";

export default function ProductShowcase({ product }: { product: ProductDTO }) {
  const images = product.images.slice(0, 3);
  const captions = [
    "Cold-pressed botanicals",
    "Nothing synthetic, ever",
    "Lightweight, fast-absorbing",
  ];

  return (
    <section className="bg-apos-surface py-20 md:py-28">
      <div className="container-editorial">
        <div className="mb-12 max-w-xl md:mb-16">
          <p className="apo-eyebrow">In Every Bottle</p>
          <h2 className="mt-5 font-noto text-4xl font-semibold leading-tight text-apos-onSurface md:text-[42px]">
            Crafted to be seen, felt, and trusted.
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-apos-onSurfaceVariant">
            From the first drop to the last, every detail is considered — so the
            ritual feels as good as the results.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-6">
          {images.map((src, i) => (
            <figure key={src + i} className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-apos-surfaceContainer">
                <Image
                  src={src}
                  alt={captions[i] ?? product.name}
                  fill
                  sizes="(min-width: 768px) 360px, 90vw"
                  className="object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.03]"
                />
              </div>
              <figcaption className="mt-4 text-[14px] font-medium text-apos-onSurfaceVariant">
                {captions[i]}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
