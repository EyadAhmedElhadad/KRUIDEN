"use client";

import { useState } from "react";

type Cart = {
  codEnabled: boolean;
  shippingFee: number;
  freeShippingThreshold: number | null;
  currency: string;
};

export default function SettingsEditor({ cart }: { cart: Cart }) {
  const [form, setForm] = useState({
    codEnabled: cart.codEnabled,
    shippingFeeMajor: (cart.shippingFee / 100).toString(),
    freeThresholdMajor: cart.freeShippingThreshold ? (cart.freeShippingThreshold / 100).toString() : "",
    currency: cart.currency,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const payload = {
        codEnabled: form.codEnabled,
        shippingFee: Math.round(parseFloat(form.shippingFeeMajor || "0") * 100),
        freeShippingThreshold: form.freeThresholdMajor ? Math.round(parseFloat(form.freeThresholdMajor) * 100) : null,
        currency: form.currency,
      };
      const res = await fetch("/api/cart-settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Save failed");
      setMsg({ type: "ok", text: "Saved." });
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "Failed" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5 max-w-xl">
      <label className="flex items-center gap-3 labs-card p-4">
        <input type="checkbox" checked={form.codEnabled} onChange={(e) => update("codEnabled", e.target.checked)} className="h-4 w-4 accent-[#a9d389]" />
        <div>
          <p className="text-sm font-medium text-[#f4f7ef]">Cash on Delivery enabled</p>
          <p className="text-xs text-[#b9c2ab]">When off, checkout only shows Paymob.</p>
        </div>
      </label>

      <Field label="Shipping fee (EGP)"><input type="number" step="0.01" value={form.shippingFeeMajor} onChange={(e) => update("shippingFeeMajor", e.target.value)} className="labs-input" /></Field>
      <Field label="Free shipping threshold (EGP, leave empty to disable)"><input type="number" step="0.01" value={form.freeThresholdMajor} onChange={(e) => update("freeThresholdMajor", e.target.value)} className="labs-input" placeholder="e.g. 500" /></Field>
      <Field label="Currency"><input value={form.currency} onChange={(e) => update("currency", e.target.value)} className="labs-input" maxLength={4} /></Field>

      {msg && <p className={`text-sm ${msg.type === "ok" ? "text-[#a9d389]" : "text-[#d97a7a]"}`}>{msg.text}</p>}
      <button onClick={save} disabled={saving} className="labs-btn">{saving ? "Saving…" : "Save Settings"}</button>
      <p className="text-xs text-[#b9c2ab]/60">Changes apply instantly to checkout & cart drawer.</p>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-[13px] font-medium text-[#b9c2ab]">{label}</span>{children}</label>;
}
