"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Icon } from "@/components/admin/Icon";

type ProductForm = {
  id: string;
  name: string;
  tagline: string | null;
  description: string;
  price: number; // smallest currency unit
  ingredients: string[];
  benefits: string[];
  usage: string | null;
  images: string[];
  inStock: boolean;
};

export default function ProductEditor({ product }: { product: ProductForm }) {
  const [form, setForm] = useState({
    name: product.name,
    tagline: product.tagline ?? "",
    description: product.description,
    priceMajor: (product.price / 100).toString(),
    ingredients: product.ingredients.join(", "),
    benefits: product.benefits.join("\n"),
    usage: product.usage ?? "",
    images: product.images,
    inStock: product.inStock,
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "err"; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function update<K extends keyof typeof form>(key: K, value: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMessage(null);
    try {
      const dataUrl = await fileToDataUrl(file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      update("images", [...form.images, data.url]);
    } catch (err) {
      setMessage({ type: "err", text: err instanceof Error ? err.message : "Upload failed" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  function removeImage(url: string) {
    update("images", form.images.filter((i) => i !== url));
  }

  async function handleSave() {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          tagline: form.tagline,
          description: form.description,
          price: Math.round(parseFloat(form.priceMajor || "0") * 100),
          ingredients: form.ingredients.split(",").map((s) => s.trim()).filter(Boolean),
          benefits: form.benefits.split("\n").map((s) => s.trim()).filter(Boolean),
          usage: form.usage,
          images: form.images,
          inStock: form.inStock,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setMessage({ type: "ok", text: "Saved." });
    } catch (err) {
      setMessage({ type: "err", text: err instanceof Error ? err.message : "Save failed" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <Field label="Name">
        <input value={form.name} onChange={(e) => update("name", e.target.value)} className="labs-input" />
      </Field>
      <Field label="Tagline">
        <input value={form.tagline} onChange={(e) => update("tagline", e.target.value)} className="labs-input" />
      </Field>
      <Field label="Description">
        <textarea
          rows={4}
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          className="labs-input resize-none"
        />
      </Field>
      <Field label="Price (EGP, major units e.g. 890.00)">
        <input
          type="number"
          step="0.01"
          value={form.priceMajor}
          onChange={(e) => update("priceMajor", e.target.value)}
          className="labs-input"
        />
      </Field>
      <Field label="Ingredients (comma separated)">
        <textarea
          rows={2}
          value={form.ingredients}
          onChange={(e) => update("ingredients", e.target.value)}
          className="labs-input resize-none"
        />
      </Field>
      <Field label="Benefits (one per line)">
        <textarea
          rows={4}
          value={form.benefits}
          onChange={(e) => update("benefits", e.target.value)}
          className="labs-input resize-none"
        />
      </Field>
      <Field label="Usage Instructions">
        <textarea
          rows={3}
          value={form.usage}
          onChange={(e) => update("usage", e.target.value)}
          className="labs-input resize-none"
        />
      </Field>

      <label className="flex items-center gap-2 text-sm text-[#b9c2ab]">
        <input
          type="checkbox"
          checked={form.inStock}
          onChange={(e) => update("inStock", e.target.checked)}
          className="h-4 w-4 accent-[#a9d389]"
        />
        In stock
      </label>

      <div>
        <span className="mb-2 block text-[13px] font-medium text-[#b9c2ab]">Product Images</span>
        <div className="flex flex-wrap gap-3">
          {form.images.map((img) => (
            <div key={img} className="relative h-24 w-24 overflow-hidden border border-[rgba(169,211,137,0.18)] bg-[#161a12]">
              <Image src={img} alt="" fill className="object-cover" sizes="96px" />
              <button
                onClick={() => removeImage(img)}
                className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center bg-[#12140f]/80 text-xs text-[#a9d389] hover:text-[#d97a7a]"
                aria-label="Remove image"
              >
                <Icon name="close" size={16} />
              </button>
            </div>
          ))}
          <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 border border-dashed border-[rgba(169,211,137,0.3)] text-xs text-[#b9c2ab] hover:border-[#a9d389]">
            <Icon name="upload" size={20} />
            {uploading ? "…" : "Add"}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageSelect}
              disabled={uploading}
            />
          </label>
        </div>
        <p className="mt-2 text-xs text-[#b9c2ab]/70">
          Uploads require Cloudinary environment variables to be configured.
        </p>
      </div>

      {message && (
        <p className={`text-sm ${message.type === "ok" ? "text-[#a9d389]" : "text-[#d97a7a]"}`}>
          {message.text}
        </p>
      )}

      <button onClick={handleSave} disabled={saving} className="labs-btn">
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[13px] font-medium text-[#b9c2ab]">{label}</span>
      {children}
    </label>
  );
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
