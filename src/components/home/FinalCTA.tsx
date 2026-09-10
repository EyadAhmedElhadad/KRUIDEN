import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="relative overflow-hidden bg-apos-primary py-24 text-apos-onSurface md:py-32">
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -bottom-20 h-[380px] w-[380px] text-apos-onSurface/10"
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

      <div className="container-editorial relative text-center">
        <h2 className="mx-auto max-w-2xl font-noto text-4xl font-semibold leading-tight md:text-5xl">
          Make hair care part of your ritual.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-[15px] leading-relaxed text-apos-onSurface/80">
          One bottle. A few minutes, a few times a week. Naturally better
          hair days ahead.
        </p>
        <Link
          href="/product"
          className="mt-9 inline-flex items-center justify-center rounded-lg bg-apos-surface px-8 py-3.5 text-[14px] font-medium uppercase tracking-[0.05em] text-apos-primary transition-colors duration-300 hover:bg-apos-surfaceContainer"
        >
          Shop the Oil
        </Link>
      </div>
    </section>
  );
}
