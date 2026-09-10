type IconProps = { name: string; className?: string };

export default function TrustIcon({ name, className }: IconProps) {
  const common = {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.6,
    className,
  };
  if (name === "leaf")
    return (
      <svg {...common}>
        <path d="M5 19c8-1 13-6 14-14-8 1-13 6-14 14Z" strokeLinejoin="round" />
        <path d="M6 18c3-4 6-7 12-11" strokeLinecap="round" />
      </svg>
    );
  if (name === "shield")
    return (
      <svg {...common}>
        <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" strokeLinejoin="round" />
        <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (name === "spark")
    return (
      <svg {...common}>
        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" strokeLinejoin="round" />
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
