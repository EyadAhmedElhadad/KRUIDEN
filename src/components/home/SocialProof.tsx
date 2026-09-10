import Image from "next/image";

const GALLERY = [
  {
    image: "https://images.unsplash.com/photo-1595474079807-f0d3c1e5e5c9?q=80&w=800",
    caption: "“The first oil that didn’t weigh my hair down.”",
    name: "Nour A.",
  },
  {
    image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?q=80&w=800",
    caption: "“Three weeks in and the shine is real.”",
    name: "Yara M.",
  },
  {
    image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?q=80&w=800",
    caption: "“A scalp ritual I actually look forward to.”",
    name: "Farida S.",
  },
  {
    image: "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?q=80&w=800",
    caption: "“Smells clean, feels premium.”",
    name: "Hana K.",
  },
];

export default function SocialProof() {
  return (
    <section className="bg-apos-surface py-20 md:py-28">
      <div className="container-editorial">
        <div className="mb-12 flex items-end justify-between gap-6 md:mb-16">
          <div className="max-w-lg">
            <p className="apo-eyebrow">From the Community</p>
            <h2 className="mt-5 font-noto text-4xl font-semibold leading-tight text-apos-onSurface md:text-[42px]">
              Real routines, real results.
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-5">
          {GALLERY.map((item) => (
            <figure key={item.name} className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-apos-surfaceContainer">
                <Image
                  src={item.image}
                  alt={item.caption}
                  fill
                  sizes="(min-width: 768px) 280px, 45vw"
                  className="object-cover transition-transform duration-500 ease-editorial group-hover:scale-[1.03]"
                />
              </div>
              <figcaption className="mt-3">
                <p className="text-[13px] leading-snug text-apos-onSurfaceVariant">{item.caption}</p>
                <p className="mt-1 text-[11px] font-medium uppercase tracking-wide text-apos-onSurface/50">
                  {item.name}
                </p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
