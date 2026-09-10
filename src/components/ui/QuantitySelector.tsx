"use client";

export default function QuantitySelector({
  quantity,
  onChange,
  size = "md",
}: {
  quantity: number;
  onChange: (next: number) => void;
  size?: "sm" | "md";
}) {
  const dims = size === "sm" ? "h-9 w-9 text-sm" : "h-11 w-11 text-base";
  return (
    <div className="inline-flex items-center rounded-full border border-ink/15">
      <button
        type="button"
        aria-label="Decrease quantity"
        onClick={() => onChange(Math.max(1, quantity - 1))}
        className={`flex items-center justify-center text-ink/70 transition-colors hover:text-ink ${dims}`}
      >
        −
      </button>
      <span className="w-8 text-center text-sm font-medium tabular-nums">{quantity}</span>
      <button
        type="button"
        aria-label="Increase quantity"
        onClick={() => onChange(quantity + 1)}
        className={`flex items-center justify-center text-ink/70 transition-colors hover:text-ink ${dims}`}
      >
        +
      </button>
    </div>
  );
}
