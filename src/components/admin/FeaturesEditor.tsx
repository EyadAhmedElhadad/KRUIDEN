"use client";

import { useState } from "react";
import { Icon } from "@/components/admin/Icon";

type Feature = { id: string; label: string; icon: string; order: number; active: boolean };

export default function FeaturesEditor({ features: initial }: { features: Feature[] }) {
  const [features, setFeatures] = useState(initial);
  const [newLabel, setNewLabel] = useState("");
  const [newIcon, setNewIcon] = useState("leaf");
  const [msg, setMsg] = useState<string | null>(null);

  async function add() {
    if (!newLabel.trim()) return;
    const res = await fetch("/api/features", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ label: newLabel, icon: newIcon, order: features.length }) });
    const data = await res.json();
    if (res.ok) {
      setFeatures((f) => [...f, data.feature]);
      setNewLabel("");
    }
  }

  async function update(id: string, patch: Partial<Feature>) {
    const res = await fetch(`/api/features/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) });
    if (res.ok) {
      const data = await res.json();
      setFeatures((fs) => fs.map((f) => (f.id === id ? data.feature : f)));
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/features/${id}`, { method: "DELETE" });
    if (res.ok) setFeatures((fs) => fs.filter((f) => f.id !== id));
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="labs-card p-4 flex gap-2">
        <input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Label e.g. Cold-Pressed" className="labs-input flex-1" />
        <select value={newIcon} onChange={(e) => setNewIcon(e.target.value)} className="labs-input w-28">
          <option value="leaf">leaf</option>
          <option value="drop">drop</option>
          <option value="heart">heart</option>
          <option value="truck">truck</option>
        </select>
        <button onClick={add} className="labs-btn">Add</button>
      </div>

      <div className="space-y-2">
        {features.sort((a, b) => a.order - b.order).map((f) => (
          <div key={f.id} className="labs-card flex items-center gap-3 p-3">
            <input value={f.label} onChange={(e) => setFeatures((fs) => fs.map((x) => (x.id === f.id ? { ...x, label: e.target.value } : x)))} onBlur={(e) => update(f.id, { label: e.target.value })} className="flex-1 bg-transparent text-sm text-[#f4f7ef] outline-none" />
            <select value={f.icon} onChange={(e) => { const v = e.target.value; setFeatures((fs) => fs.map((x) => (x.id === f.id ? { ...x, icon: v } : x))); update(f.id, { icon: v }); }} className="bg-[#12140f] border border-[rgba(169,211,137,0.12)] text-xs text-[#b9c2ab] px-2 py-1">
              <option value="leaf">leaf</option>
              <option value="drop">drop</option>
              <option value="heart">heart</option>
              <option value="truck">truck</option>
            </select>
            <label className="flex items-center gap-1 text-xs text-[#b9c2ab]"><input type="checkbox" checked={f.active} onChange={(e) => update(f.id, { active: e.target.checked })} /> active</label>
            <button onClick={() => remove(f.id)} className="text-[#d97a7a] hover:text-[#f4f7ef]"><Icon name="close" size={18} /></button>
          </div>
        ))}
        {features.length === 0 && <p className="text-sm text-[#b9c2ab]">No features yet.</p>}
      </div>
      {msg && <p className="text-sm text-[#a9d389]">{msg}</p>}
    </div>
  );
}
