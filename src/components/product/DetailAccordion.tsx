"use client";

import { useState } from "react";

export default function DetailAccordion({
  sections,
}: {
  sections: { title: string; content: React.ReactNode }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-ink/10 border-t border-b border-ink/10">
      {sections.map((s, i) => {
        const isOpen = open === i;
        return (
          <div key={s.title}>
            <button
              className="flex w-full items-center justify-between py-4 text-left"
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
            >
              <span className="text-[13px] font-semibold uppercase tracking-wide text-ink">
                {s.title}
              </span>
              <span
                className={`text-lg text-olive-600 transition-transform duration-300 ${
                  isOpen ? "rotate-45" : ""
                }`}
                aria-hidden="true"
              >
                +
              </span>
            </button>
            <div
              className={`grid overflow-hidden transition-all duration-300 ease-editorial ${
                isOpen ? "grid-rows-[1fr] pb-5" : "grid-rows-[0fr]"
              }`}
            >
              <div className="min-h-0 text-[14px] leading-relaxed text-ink/60">
                {s.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
