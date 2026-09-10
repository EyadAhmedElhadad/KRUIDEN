"use client";

import { useState } from "react";

const FAQS = [
  {
    q: "How do I use the hair oil?",
    a: "Warm a few drops between your palms and massage gently into the scalp, then work any excess through mid-lengths to ends. Can be used on damp or dry hair.",
  },
  {
    q: "How often should I use it?",
    a: "Most people see the best results applying it 2–3 times per week, though it's gentle enough for daily scalp use.",
  },
  {
    q: "Is it suitable for all hair types?",
    a: "Yes. The lightweight, cold-pressed formula absorbs well across straight, wavy, curly, and coily hair without residue.",
  },
  {
    q: "What ingredients are used?",
    a: "A short, transparent list: cold-pressed olive oil, castor oil, rosemary extract, vitamin E, and argan oil. Nothing synthetic, nothing hidden.",
  },
  {
    q: "How long does one bottle last?",
    a: "With regular use 2–3 times a week, one bottle typically lasts 6–8 weeks.",
  },
  {
    q: "Do you offer Cash on Delivery?",
    a: "Yes — Cash on Delivery is available nationwide, alongside secure online payment at checkout.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="bg-apos-surfaceContainer py-20 md:py-28">
      <div className="container-editorial max-w-2xl">
        <p className="apo-eyebrow text-center">Questions</p>
        <h2 className="mt-5 text-center font-noto text-4xl font-semibold leading-tight text-apos-onSurface md:text-[42px]">
          Frequently asked.
        </h2>

        <div className="mt-12 divide-y divide-apos-outlineVariant border-t border-b border-apos-outlineVariant">
          {FAQS.map((item, i) => {
            const open = openIndex === i;
            return (
              <div key={item.q}>
                <button
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  onClick={() => setOpenIndex(open ? null : i)}
                  aria-expanded={open}
                >
                  <span className="text-[15px] font-medium text-apos-onSurface">{item.q}</span>
                  <span
                    className={`shrink-0 text-lg text-apos-primary transition-transform duration-300 ${
                      open ? "rotate-45" : ""
                    }`}
                    aria-hidden="true"
                  >
                    +
                  </span>
                </button>
                <div
                  className={`grid overflow-hidden transition-all duration-300 ease-editorial ${
                    open ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
                  }`}
                >
                  <p className="min-h-0 text-[14px] leading-relaxed text-apos-onSurfaceVariant">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
