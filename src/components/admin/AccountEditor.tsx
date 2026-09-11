"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/admin/Icon";

export default function AccountEditor() {
  const [email, setEmail] = useState("");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  useEffect(() => {
    fetch("/api/admin/password").then((r) => r.json()).then((d) => { if (d.email) setEmail(d.email); }).catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (next !== confirm) { setMsg({ type: "err", text: "New passwords do not match" }); return; }
    if (next.length < 8) { setMsg({ type: "err", text: "New password must be at least 8 characters" }); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword: current, newPassword: next, confirmPassword: confirm }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMsg({ type: "ok", text: "Password updated. Use new password next login." });
      setCurrent(""); setNext(""); setConfirm("");
    } catch (err) {
      setMsg({ type: "err", text: err instanceof Error ? err.message : "Failed" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl space-y-6">
      <div className="labs-card p-5">
        <p className="text-[11px] uppercase tracking-wide text-[#b9c2ab]">Signed in as</p>
        <p className="mt-1 flex items-center gap-2 text-sm font-medium text-[#f4f7ef]"><Icon name="mail" size={16} /> {email || "…"}</p>
        <p className="mt-2 text-xs text-[#b9c2ab]/70">Single admin — role ADMIN. Email is from JWT / User table.</p>
      </div>

      <form onSubmit={handleSubmit} className="labs-card p-6 space-y-4">
        <h3 className="font-display text-lg font-semibold text-[#f4f7ef]">Change password</h3>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-[#b9c2ab]">Current password</span>
          <input type="password" required value={current} onChange={(e) => setCurrent(e.target.value)} className="labs-input" placeholder="••••••••" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-[#b9c2ab]">New password (min 8)</span>
          <input type="password" required value={next} onChange={(e) => setNext(e.target.value)} className="labs-input" placeholder="••••••••" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-[#b9c2ab]">Confirm new password</span>
          <input type="password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} className="labs-input" placeholder="••••••••" />
        </label>
        {msg && <p className={`text-sm ${msg.type === "ok" ? "text-[#a9d389]" : "text-[#d97a7a]"}`}>{msg.text}</p>}
        <button type="submit" disabled={saving} className="labs-btn">{saving ? "Updating…" : "Update password"}</button>
        <p className="text-xs text-[#b9c2ab]/60">After change, you stay logged in (JWT re-issued). Next login use new password. Vercel env ADMIN_PASSWORD is now only for initial seed — change here persists in DB.</p>
      </form>
    </div>
  );
}
