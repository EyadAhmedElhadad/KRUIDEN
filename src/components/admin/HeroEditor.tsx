"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/admin/Icon";

type Hero = {
  eyebrow: string;
  headline1: string;
  headline2: string;
  description: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  imageUrl: string | null;
  trustBadges: { icon: string; label: string }[];
};

export default function HeroEditor({ hero }: { hero: Hero }) {
  const [form, setForm] = useState({ ...hero, trustBadgesText: hero.trustBadges.map((b) => `${b.icon}:${b.label}`).join(", ") });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof typeof form>(k: K, v: (typeof form)[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await fileToDataUrl(file);
      const res = await fetch("/api/upload", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ image: dataUrl }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      update("imageUrl", data.url);
    } catch (err) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "Upload failed" });
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function save() {
    setSaving(true);
    setMsg(null);
    try {
      const trustBadges = form.trustBadgesText
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((s) => {
          const [icon, ...rest] = s.split(":");
          return { icon: (icon || "leaf").trim(), label: rest.join(":").trim() || icon.trim() };
        });
      const payload = {
        eyebrow: form.eyebrow,
        headline1: form.headline1,
        headline2: form.headline2,
        description: form.description,
        primaryCtaLabel: form.primaryCtaLabel,
        primaryCtaHref: form.primaryCtaHref,
        secondaryCtaLabel: form.secondaryCtaLabel,
        secondaryCtaHref: form.secondaryCtaHref,
        imageUrl: form.imageUrl || null,
        trustBadges,
      };
      const res = await fetch("/api/hero", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) throw new Error("Save failed");
      setMsg({ type: "ok", text: "Saved." });
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "Failed" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5 max-w-2xl">
      <Field label="Eyebrow"><input value={form.eyebrow} onChange={(e) => update("eyebrow", e.target.value)} className="labs-input" /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Headline line 1"><input value={form.headline1} onChange={(e) => update("headline1", e.target.value)} className="labs-input" /></Field>
        <Field label="Headline line 2"><input value={form.headline2} onChange={(e) => update("headline2", e.target.value)} className="labs-input" /></Field>
      </div>
      <Field label="Description"><textarea rows={3} value={form.description} onChange={(e) => update("description", e.target.value)} className="labs-input resize-none" /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Primary CTA label"><input value={form.primaryCtaLabel} onChange={(e) => update("primaryCtaLabel", e.target.value)} className="labs-input" /></Field>
        <Field label="Primary CTA href"><input value={form.primaryCtaHref} onChange={(e) => update("primaryCtaHref", e.target.value)} className="labs-input" /></Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Secondary CTA label"><input value={form.secondaryCtaLabel} onChange={(e) => update("secondaryCtaLabel", e.target.value)} className="labs-input" /></Field>
        <Field label="Secondary CTA href"><input value={form.secondaryCtaHref} onChange={(e) => update("secondaryCtaHref", e.target.value)} className="labs-input" /></Field>
      </div>
      <Field label="Trust badges (icon:label, comma separated)"><input value={form.trustBadgesText} onChange={(e) => update("trustBadgesText", e.target.value)} className="labs-input" placeholder="leaf:100% Botanical, shield:No Fillers" /></Field>
      <div>
        <span className="mb-1.5 block text-[13px] font-medium text-[#b9c2ab]">Hero image (overrides product image if set)</span>
        {form.imageUrl && <div className="relative mb-3 h-48 w-full overflow-hidden bg-[#161a12]"><Image src={form.imageUrl} alt="Hero" fill className="object-cover" /></div>}
        <div className="flex gap-2">
          <label className="labs-pill cursor-pointer"><Icon name="upload" size={16} /> {uploading ? "…" : "Upload"}<input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} disabled={uploading} /></label>
          {form.imageUrl && <button onClick={() => update("imageUrl", null)} className="labs-pill">Clear</button>}
        </div>
      </div>
      {msg && <p className={`text-sm ${msg.type === "ok" ? "text-[#a9d389]" : "text-[#d97a7a]"}`}>{msg.text}</p>}
      <button onClick={save} disabled={saving} className="labs-btn">{saving ? "Saving…" : "Save Hero"}</button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-[13px] font-medium text-[#b9c2ab]">{label}</span>{children}</label>;
}
function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
