/** Format an integer stored in the smallest currency unit (e.g. piastres) into a display string. */
export function formatPrice(amount: number, currency: string = "EGP") {
  const major = amount / 100;
  return new Intl.NumberFormat("en-EG", {
    style: "currency",
    currency,
    maximumFractionDigits: major % 1 === 0 ? 0 : 2,
  }).format(major);
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** Short, human-readable order reference derived from the Prisma id. */
export function orderRef(id: string) {
  const tail = id.replace(/[^a-zA-Z0-9]/g, "").slice(-8).toUpperCase();
  return `#${tail}`;
}

/** WhatsApp click-to-chat link. Strips non-digits, adds Egypt country code (20) when a leading 0 is present. */
export function waLink(phone: string) {
  let digits = phone.replace(/\D/g, "");
  if (digits.startsWith("0")) digits = `20${digits}`;
  return `https://wa.me/${digits}`;
}

/** tel: link with spaces removed. */
export function telLink(phone: string) {
  return `tel:${phone.replace(/\s+/g, "")}`;
}
