"use client";

import { useEffect } from "react";

export default function PrintButton() {
  useEffect(() => {
    const t = setTimeout(() => window.print(), 400);
    return () => clearTimeout(t);
  }, []);

  return (
    <button
      onClick={() => window.print()}
      className="no-print rounded-sm border border-ink/30 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink transition-colors hover:bg-ink hover:text-white"
    >
      Print
    </button>
  );
}
