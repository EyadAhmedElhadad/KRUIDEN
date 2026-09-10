import { getFeatures } from "@/lib/site-content";

export default async function FeatureStrip() {
  const FEATURES = await getFeatures();
  return (
    <section className="border-y border-apos-outlineVariant bg-apos-surface">
      <div className="container-editorial grid grid-cols-2 gap-y-8 py-10 md:grid-cols-4 md:gap-y-0 md:py-12">
        {FEATURES.map((f) => (
          <div key={f.label} className="flex items-center gap-3 md:justify-center">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-apos-secondaryContainer text-apos-primary">
              <Icon name={f.icon} />
            </span>
            <span className="text-[13px] font-medium leading-tight text-apos-onSurfaceVariant">
              {f.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function Icon({ name }: { name: string }) {
  const common = { width: 16, height: 16, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.6 };
  if (name === "leaf")
    return (
      <svg {...common}>
        <path d="M5 19c8-1 13-6 14-14-8 1-13 6-14 14Z" strokeLinejoin="round" />
        <path d="M6 18c3-4 6-7 12-11" strokeLinecap="round" />
      </svg>
    );
  if (name === "drop")
    return (
      <svg {...common}>
        <path d="M12 3s6 7 6 11.5a6 6 0 1 1-12 0C6 10 12 3 12 3Z" strokeLinejoin="round" />
      </svg>
    );
  if (name === "heart")
    return (
      <svg {...common}>
        <path d="M12 20s-7-4.4-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 5c-2.5 4.6-9.5 9-9.5 9Z" strokeLinejoin="round" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M2 7h11v8H2z" strokeLinejoin="round" />
      <path d="M13 10h4l3 3v2h-7z" strokeLinejoin="round" />
      <circle cx="6" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </svg>
  );
}
