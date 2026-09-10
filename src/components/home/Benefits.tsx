import type { ProductDTO } from "@/lib/types";

export default function Benefits({ product }: { product: ProductDTO }) {
  return (
    <section id="benefits" className="bg-apos-surfaceContainer py-20 md:py-28">
      <div className="container-editorial">
        <div className="mb-14 max-w-lg md:mb-16">
          <p className="apo-eyebrow">Why It Works</p>
          <h2 className="mt-5 font-noto text-4xl font-semibold leading-tight text-apos-onSurface md:text-[42px]">
            Four benefits, one bottle.
          </h2>
        </div>

        <div className="grid gap-x-8 gap-y-10 md:grid-cols-4">
          {product.benefits.map((benefit, i) => (
            <div key={benefit} className="border-t border-apos-outlineVariant pt-5">
              <span className="font-noto text-sm text-apos-primaryContainer">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-3 text-[15px] font-medium leading-snug text-apos-onSurface">
                {benefit}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
