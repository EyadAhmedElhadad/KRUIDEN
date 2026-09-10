import React from "react";

export function Icon({
  name,
  className = "",
  size,
}: {
  name: string;
  className?: string;
  size?: number;
}) {
  return (
    <span
      className={`material-symbols-outlined ${className}`}
      style={size ? { fontSize: size } : undefined}
      aria-hidden="true"
    >
      {name}
    </span>
  );
}

export const STATUS_META: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "#e0b15e" },
  CONFIRMED: { label: "Confirmed", color: "#a9d389" },
  SHIPPED: { label: "Shipped", color: "#6ea8c9" },
  DELIVERED: { label: "Delivered", color: "#7bc86c" },
  CANCELLED: { label: "Cancelled", color: "#d97a7a" },
};
