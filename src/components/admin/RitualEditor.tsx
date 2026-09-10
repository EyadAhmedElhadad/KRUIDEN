"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Icon } from "@/components/admin/Icon";

type Ritual = {
  eyebrow: string;
  headline: string;
  description: string;
  bullets: string[];
  imageUrl: string | null;
  ctaLabel: string;
  ctaHref: string;
};

export default function RitualEditor({ ritual }: { ritual: Ritual }) {
  const [form, setForm] = useState({
    eyebrow: ritual.eyebrow,
    headline: ritual.headline,
    description: ritual.description,
    bullets: ritual.bullets.join("\n"),
    imageUrl: ritual.imageUrl,
    ctaLabel: ritual.ctaLabel,
    ctaHref: ritual.ctaHref,
  });
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
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = reject;
        r.readAsDataURL(file);
      });
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
      const payload = {
        eyebrow: form.eyebrow,
        headline: form.headline,
        description: form.description,
        bullets: form.bullets.split("\n").map((s) => s.trim()).filter(Boolean),
        imageUrl: form.imageUrl || null,
        ctaLabel: form.ctaLabel,
        ctaHref: form.ctaHref,
      };
      const res = await fetch("/api/ritual", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
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
      <Field label="Headline (use \\n for line break)"><textarea rows={2} value={form.headline} onChange={(e) => update("headline", e.target.value)} className="labs-input resize-none" /></Field>
      <Field label="Description"><textarea rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} className="labs-input resize-none" /></Field>
      <Field label="Bullets (one per line)"><textarea rows={3} value={form.bullets} onChange={(e) => update("bullets", e.target.value)} className="labs-input resize-none" /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="CTA label"><input value={form.ctaLabel} onChange={(e) => update("ctaLabel", e.target.value)} className="labs-input" /></Field>
        <Field label="CTA href"><input value={form.ctaHref} onChange={(e) => update("ctaHref", e.target.value)} className="labs-input" /></Field>
      </div>
      <div>
        <span className="mb-1.5 block text-[13px] font-medium text-[#b9c2ab]">Image</span>
        {form.imageUrl && <div className="relative mb-3 h-48 w-full overflow-hidden bg-[#161a12]"><Image src={form.imageUrl} alt="Ritual" fill className="object-cover" /></div>}
        <div className="flex gap-2">
          <label className="labs-pill cursor-pointer"><Icon name="upload" size={16} /> {uploading ? "…" : "Upload"}<input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleImage} disabled={uploading} /></label>
          {form.imageUrl && <button onClick={() => update("imageUrl", null)} className="labs-pill">Clear</button>}
        </div>
      </div>
      {msg && <p className={`text-sm ${msg.type === "ok" ? "text-[#a9d389]" : "text-[#d97a7a]"}`}>{msg.text}</p>}
      <button onClick={save} disabled={saving} className="labs-btn">{saving ? "Saving…" : "Save Ritual"}</button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-[13px] font-medium text-[#b9c2ab]">{label}</span>{children}</label>;
}
