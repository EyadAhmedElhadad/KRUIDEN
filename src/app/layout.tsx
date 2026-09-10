import type { Metadata } from "next";
import "./globals.css";
import SiteChrome from "@/components/layout/SiteChrome";

// Fonts are loaded via <link> tags below (CDN) to allow offline `next build`
// without requiring Google Fonts fetch at compile time. The CSS variables are
// defined as fallbacks so Tailwind's font families continue to work.
const display = { variable: "" } as const;
const body = { variable: "" } as const;
const notoSerif = { variable: "" } as const;

export const metadata: Metadata = {
  title: "Kruiden — Restorative Hair Oil",
  description:
    "Cold-pressed, botanical hair oil crafted to nourish the scalp and strengthen hair naturally. One ritual. No fillers.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} ${notoSerif.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* CDN fonts — works offline build; browsers fetch at runtime */}
        <link
          href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Geist:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,500;1,600;1,700&family=Inter:wght@400;500;600&family=Noto+Serif:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
          rel="stylesheet"
        />
        <style>{`
          :root {
            --font-display: "Playfair Display", Georgia, serif;
            --font-body: "Inter", "Geist", system-ui, sans-serif;
            --font-noto-serif: "Noto Serif", Georgia, serif;
          }
        `}</style>
      </head>
      <body>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
