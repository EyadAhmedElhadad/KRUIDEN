"use client";

import { useState } from "react";

type FooterData = {
  email: string;
  phone: string;
  address: string;
  instagramUrl: string;
  tiktokUrl: string;
  facebookUrl: string;
  copyright: string;
  shippingNote: string;
};

type SiteData = {
  siteName: string;
  description: string;
};

export default function FooterEditor({ footer, site }: { footer: FooterData; site: SiteData }) {
  const [form, setForm] = useState({ ...footer, ...site });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const footerPayload = {
        email: form.email,
        phone: form.phone,
        address: form.address,
        instagramUrl: form.instagramUrl,
        tiktokUrl: form.tiktokUrl,
        facebookUrl: form.facebookUrl,
        copyright: form.copyright,
        shippingNote: form.shippingNote,
      };
      const sitePayload = { siteName: form.siteName, description: form.description };
      const [r1, r2] = await Promise.all([
        fetch("/api/footer", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(footerPayload) }),
        fetch("/api/site-settings", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(sitePayload) }),
      ]);
      if (!r1.ok || !r2.ok) throw new Error("Save failed");
      setMsg({ type: "ok", text: "Saved." });
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "Failed" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <Field label="Site name"><input value={form.siteName} onChange={(e) => update("siteName", e.target.value)} className="labs-input" /></Field>
      <Field label="Site description"><textarea rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} className="labs-input resize-none" /></Field>
      <Field label="Email"><input value={form.email} onChange={(e) => update("email", e.target.value)} className="labs-input" /></Field>
      <Field label="Phone"><input value={form.phone} onChange={(e) => update("phone", e.target.value)} className="labs-input" /></Field>
      <Field label="Address"><input value={form.address} onChange={(e) => update("address", e.target.value)} className="labs-input" /></Field>
      <Field label="Instagram URL"><input value={form.instagramUrl} onChange={(e) => update("instagramUrl", e.target.value)} className="labs-input" placeholder="https://instagram.com/..." /></Field>
      <Field label="TikTok URL"><input value={form.tiktokUrl} onChange={(e) => update("tiktokUrl", e.target.value)} className="labs-input" /></Field>
      <Field label="Facebook URL"><input value={form.facebookUrl} onChange={(e) => update("facebookUrl", e.target.value)} className="labs-input" /></Field>
      <Field label="Copyright"><input value={form.copyright} onChange={(e) => update("copyright", e.target.value)} className="labs-input" /></Field>
      <Field label="Shipping note (bottom bar)"><input value={form.shippingNote} onChange={(e) => update("shippingNote", e.target.value)} className="labs-input" /></Field>
      {msg && <p className={`text-sm ${msg.type === "ok" ? "text-[#a9d389]" : "text-[#d97a7a]"}`}>{msg.text}</p>}
      <button onClick={save} disabled={saving} className="labs-btn">{saving ? "Saving…" : "Save Footer"}</button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-[13px] font-medium text-[#b9c2ab]">{label}</span>{children}</label>;
}
