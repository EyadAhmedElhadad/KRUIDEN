"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/utils";
import { EGYPT_GOVERNORATES } from "@/lib/governorates";

export default function CheckoutForm({ paymobEnabled, codEnabled = true }: { paymobEnabled: boolean; codEnabled?: boolean }) {
  const { lines, subtotal, clear } = useCart();
  const router = useRouter();

  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    governorate: "",
    address: "",
    notes: "",
    paymentMethod: "CASH_ON_DELIVERY" as "CASH_ON_DELIVERY" | "PAYMOB",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!codEnabled && paymobEnabled && form.paymentMethod === "CASH_ON_DELIVERY") {
      setForm((f) => ({ ...f, paymentMethod: "PAYMOB" }));
    }
    if (!paymobEnabled && codEnabled && form.paymentMethod === "PAYMOB") {
      setForm((f) => ({ ...f, paymentMethod: "CASH_ON_DELIVERY" }));
    }
  }, [codEnabled, paymobEnabled, form.paymentMethod]);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (lines.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      clear();
      if (data.redirectUrl.startsWith("http")) {
        // Paymob's hosted iframe lives off-site; the app router can't
        // navigate to external URLs, so use a hard redirect.
        window.location.href = data.redirectUrl;
      } else {
        router.push(data.redirectUrl);
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setSubmitting(false);
    }
  }

  if (lines.length === 0) {
    return (
      <div className="rounded-sm border border-ink/10 bg-sand/50 p-8 text-center">
        <p className="text-sm text-ink/60">Your cart is empty.</p>
        <Link href="/product" className="btn-primary mt-5 inline-flex">
          Shop the Oil
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 md:grid-cols-5">
      <form onSubmit={handleSubmit} className="space-y-5 md:col-span-3">
        <Field label="Full Name">
          <input
            required
            value={form.customerName}
            onChange={(e) => update("customerName", e.target.value)}
            className="input"
            placeholder="Yasmin Ahmed"
          />
        </Field>

        <Field label="Phone Number">
          <input
            required
            type="tel"
            value={form.phone}
            onChange={(e) => update("phone", e.target.value)}
            className="input"
            placeholder="01xxxxxxxxx"
          />
        </Field>

        <Field label="Governorate">
          <select
            required
            value={form.governorate}
            onChange={(e) => update("governorate", e.target.value)}
            className="input"
          >
            <option value="" disabled>
              Select governorate
            </option>
            {EGYPT_GOVERNORATES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Detailed Address">
          <textarea
            required
            rows={3}
            value={form.address}
            onChange={(e) => update("address", e.target.value)}
            className="input resize-none"
            placeholder="Street, building, apartment, landmarks"
          />
        </Field>

        <Field label="Notes (optional)">
          <textarea
            rows={2}
            value={form.notes}
            onChange={(e) => update("notes", e.target.value)}
            className="input resize-none"
            placeholder="Delivery instructions, preferred time, etc."
          />
        </Field>

        <fieldset>
          <legend className="mb-2 text-[13px] font-medium text-ink/70">Payment Method</legend>
          <div className="space-y-2">
            {codEnabled && (
              <PaymentOption
                id="cod"
                label="Cash on Delivery"
                description="Pay in cash when your order arrives."
                checked={form.paymentMethod === "CASH_ON_DELIVERY"}
                onSelect={() => update("paymentMethod", "CASH_ON_DELIVERY")}
              />
            )}
            {paymobEnabled && (
              <PaymentOption
                id="paymob"
                label="Pay Online"
                description="Secure card payment via Paymob."
                checked={form.paymentMethod === "PAYMOB"}
                onSelect={() => update("paymentMethod", "PAYMOB")}
              />
            )}
            {!codEnabled && !paymobEnabled && (
              <p className="text-sm text-red-700">No payment methods are currently available. Please contact support.</p>
            )}
          </div>
        </fieldset>

        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}

        <button type="submit" disabled={submitting} className="btn-primary w-full">
          {submitting ? "Placing Order…" : "Place Order"}
        </button>
      </form>

      <div className="h-fit rounded-sm border border-ink/10 bg-sand/50 p-6 md:col-span-2">
        <h2 className="font-serif text-lg font-semibold">Order Summary</h2>
        <ul className="mt-4 space-y-4">
          {lines.map((line) => (
            <li key={line.productId} className="flex gap-3">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-sm bg-white">
                <Image src={line.image} alt={line.name} fill className="object-cover" sizes="60px" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{line.name}</p>
                <p className="text-xs text-ink/50">Qty {line.quantity}</p>
              </div>
              <p className="text-sm font-medium">
                {formatPrice(line.price * line.quantity, line.currency)}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4">
          <span className="font-medium">Total</span>
          <span className="font-serif text-xl font-semibold">{formatPrice(subtotal)}</span>
        </div>
      </div>

      <style jsx global>{`
        .input {
          width: 100%;
          border: 1px solid rgba(20, 20, 15, 0.15);
          border-radius: 2px;
          background: #fff;
          padding: 0.75rem 1rem;
          font-size: 14px;
          color: #14140f;
        }
        .input:focus {
          outline: 2px solid #4e5731;
          outline-offset: 1px;
        }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-ink/70">{label}</span>
      {children}
    </label>
  );
}

function PaymentOption({
  id,
  label,
  description,
  checked,
  onSelect,
}: {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onSelect: () => void;
}) {
  return (
    <label
      htmlFor={id}
      className={`flex cursor-pointer items-start gap-3 rounded-sm border p-3.5 transition-colors ${
        checked ? "border-olive-600 bg-olive-50" : "border-ink/12"
      }`}
    >
      <input
        id={id}
        type="radio"
        name="paymentMethod"
        checked={checked}
        onChange={onSelect}
        className="mt-1"
      />
      <span>
        <span className="block text-sm font-medium text-ink">{label}</span>
        <span className="block text-xs text-ink/50">{description}</span>
      </span>
    </label>
  );
}
