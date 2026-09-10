"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const FALLBACK = {
  siteName: "Kruiden",
  description: "A single, cold-pressed botanical hair oil — formulated without fillers, tested for one purpose: healthier hair, naturally.",
  email: "hello@kruiden.com",
  phone: "+20 100 000 0000",
  address: "Cairo, Egypt",
  instagramUrl: "#",
  tiktokUrl: "#",
  facebookUrl: "#",
  copyright: `© ${new Date().getFullYear()} Kruiden. All rights reserved.`,
  shippingNote: "Secure Checkout · Cash on Delivery · Nationwide Shipping",
};

export default function Footer() {
  const [data, setData] = useState(FALLBACK);

  useEffect(() => {
    Promise.all([
      fetch("/api/footer").then((r) => r.json()).catch(() => null),
      fetch("/api/site-settings").then((r) => r.json()).catch(() => null),
    ]).then(([f, s]) => {
      if (f?.footer || s?.site) {
        setData((d) => ({
          siteName: s?.site?.siteName || d.siteName,
          description: s?.site?.description || d.description,
          email: f?.footer?.email || d.email,
          phone: f?.footer?.phone || d.phone,
          address: f?.footer?.address || d.address,
          instagramUrl: f?.footer?.instagramUrl || d.instagramUrl,
          tiktokUrl: f?.footer?.tiktokUrl || d.tiktokUrl,
          facebookUrl: f?.footer?.facebookUrl || d.facebookUrl,
          copyright: f?.footer?.copyright || d.copyright,
          shippingNote: f?.footer?.shippingNote || d.shippingNote,
        }));
      }
    });
  }, []);

  return (
    <footer className="bg-ink text-cream/80">
      <div className="container-editorial grid gap-10 py-16 md:grid-cols-4 md:gap-8 md:py-20">
        <div className="md:col-span-2">
          <span className="font-serif text-2xl font-semibold text-cream">{data.siteName}</span>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
            {data.description}
          </p>
          <div className="mt-6 flex gap-4">
            {[
              { label: "Instagram", href: data.instagramUrl },
              { label: "TikTok", href: data.tiktokUrl },
              { label: "Facebook", href: data.facebookUrl },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                aria-label={item.label}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/15 text-cream/70 transition-colors hover:border-cream/40 hover:text-cream"
              >
                <SocialGlyph label={item.label} />
              </a>
            ))}
          </div>
        </div>

        <div>
          <p className="eyebrow text-cream/40">Shop</p>
          <ul className="mt-4 space-y-3 text-sm">
            <li><Link href="/product" className="text-cream/70 hover:text-cream">The Oil</Link></li>
            <li><Link href="/#ritual" className="text-cream/70 hover:text-cream">About</Link></li>
            <li><Link href="/#faq" className="text-cream/70 hover:text-cream">FAQ</Link></li>
            <li><Link href="/cart" className="text-cream/70 hover:text-cream">Cart</Link></li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-cream/40">Contact</p>
          <ul className="mt-4 space-y-3 text-sm text-cream/70">
            <li>{data.email}</li>
            <li>{data.phone}</li>
            <li>{data.address}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/10">
        <div className="container-editorial flex flex-col gap-3 py-6 text-xs text-cream/40 md:flex-row md:items-center md:justify-between">
          <span>{data.copyright}</span>
          <span>{data.shippingNote}</span>
        </div>
      </div>
    </footer>
  );
}

function SocialGlyph({ label }: { label: string }) {
  if (label === "Instagram")
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
      </svg>
    );
  if (label === "TikTok")
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5" strokeLinecap="round" />
        <path d="M14 3c.5 2.5 2 4 5 4.3" strokeLinecap="round" />
      </svg>
    );
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M15 8h-2a2 2 0 0 0-2 2v2H9v3h2v6h3v-6h2.2l.8-3H14v-1.5a1 1 0 0 1 1-1H16V8z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
