"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Icon } from "@/components/admin/Icon";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Incorrect password");
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="labs-root flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="labs-card p-8 sm:p-10">
          <div className="flex flex-col items-center text-center">
            <span className="flex h-12 w-12 items-center justify-center bg-[#a9d389] text-[#12140f]">
              <Icon name="spa" size={26} />
            </span>
            <h1 className="font-display mt-5 text-2xl font-bold text-[#f4f7ef]">Kruiden Admin</h1>
            <p className="mt-2 text-sm text-[#b9c2ab]">
              Botanical Lab · sign in to manage products and orders
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <label className="block">
              <span className="mb-2 block text-[12px] font-medium uppercase tracking-wide text-[#b9c2ab]">
                Password
              </span>
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#a9d389]">
                  <Icon name="lock" size={18} />
                </span>
                <input
                  type="password"
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="labs-input pl-10"
                  placeholder="••••••••"
                />
              </div>
            </label>

            {error && (
              <p role="alert" className="text-sm text-[#d97a7a]">
                {error}
              </p>
            )}

            <button type="submit" disabled={loading} className="labs-btn w-full">
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
        <p className="mt-6 text-center text-xs text-[#b9c2ab]/60">
          Protected area · authorized personnel only
        </p>
      </div>
    </div>
  );
}
