"use client";

import React, { useMemo, useState } from "react";
import { formatPrice, orderRef, waLink, telLink } from "@/lib/utils";
import { Icon, STATUS_META } from "@/components/admin/Icon";

type OrderRow = {
  id: string;
  customerName: string;
  phone: string;
  governorate: string;
  address: string;
  notes: string | null;
  internalNotes: string | null;
  paymentStatus: string;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
  items: { name: string; quantity: number; unitPrice: number; image?: string }[];
};

const STATUSES = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
const FILTERS = ["ALL", ...STATUSES];

const DATE_FILTERS = [
  { key: "ALL", label: "All Time" },
  { key: "TODAY", label: "Today" },
  { key: "WEEK", label: "This Week" },
  { key: "MONTH", label: "This Month" },
  { key: "CUSTOM", label: "Custom Range" },
];

const PAYMENT_META: Record<string, { label: string; color: string }> = {
  PAID: { label: "Paid", color: "#a9d389" },
  PENDING: { label: "Payment Pending", color: "#b9c2ab" },
  FAILED: { label: "Payment Failed", color: "#d97a7a" },
};

function matchesDate(
  createdAt: string,
  mode: string,
  customFrom: string,
  customTo: string,
) {
  const d = new Date(createdAt);
  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);

  if (mode === "TODAY") return d >= startOfDay && d < endOfDay;

  if (mode === "WEEK") {
    const day = (now.getDay() + 6) % 7; // Monday = 0
    const weekStart = new Date(startOfDay);
    weekStart.setDate(startOfDay.getDate() - day);
    return d >= weekStart;
  }

  if (mode === "MONTH") {
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    return d >= monthStart;
  }

  if (mode === "CUSTOM") {
    if (customFrom) {
      const from = new Date(customFrom);
      from.setHours(0, 0, 0, 0);
      if (d < from) return false;
    }
    if (customTo) {
      const to = new Date(customTo);
      to.setHours(23, 59, 59, 999);
      if (d > to) return false;
    }
    return true;
  }

  return true;
}

export default function OrdersTable({ orders: initialOrders }: { orders: OrderRow[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [dateFilter, setDateFilter] = useState("ALL");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [page, setPage] = useState(1);

  async function patchOrder(
    id: string,
    patch: { status?: string; paymentStatus?: string; internalNotes?: string | null },
  ) {
    setUpdating(id);
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...patch } : o)));
    }
    setUpdating(null);
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders.filter((o) => {
      if (filter !== "ALL" && o.status !== filter) return false;
      if (dateFilter !== "ALL" && !matchesDate(o.createdAt, dateFilter, customFrom, customTo))
        return false;
      if (!q) return true;
      return (
        o.customerName.toLowerCase().includes(q) ||
        o.phone.toLowerCase().includes(q) ||
        o.governorate.toLowerCase().includes(q)
      );
    });
  }, [orders, query, filter, dateFilter, customFrom, customTo]);

  const PAGE_SIZE = 20;
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const pageItems = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div>
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-sm">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#a9d389]">
            <Icon name="search" size={18} />
          </span>
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search customer, phone, governorate…"
            className="labs-input pl-10"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              data-active={filter === f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className="labs-pill"
            >
              {f === "ALL" ? "All" : STATUS_META[f]?.label ?? f}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-2">
        {DATE_FILTERS.map((d) => (
          <button
            key={d.key}
            data-active={dateFilter === d.key}
            onClick={() => {
              setDateFilter(d.key);
              setPage(1);
            }}
            className="labs-pill"
          >
            {d.label}
          </button>
        ))}
        {dateFilter === "CUSTOM" && (
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={customFrom}
              onChange={(e) => {
                setCustomFrom(e.target.value);
                setPage(1);
              }}
              className="labs-input w-auto py-1.5 text-xs"
              aria-label="From date"
            />
            <span className="text-xs text-[#b9c2ab]">to</span>
            <input
              type="date"
              value={customTo}
              onChange={(e) => {
                setCustomTo(e.target.value);
                setPage(1);
              }}
              className="labs-input w-auto py-1.5 text-xs"
              aria-label="To date"
            />
          </div>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="labs-card p-10 text-center text-sm text-[#b9c2ab]">
          No orders match your filters.
        </div>
      ) : (
        <>
          <div className="labs-card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[rgba(169,211,137,0.12)] text-left text-[11px] uppercase tracking-wide text-[#b9c2ab]">
                <th className="px-4 py-3">Customer</th>
                <th className="hidden px-4 py-3 md:table-cell">Governorate</th>
                <th className="hidden px-4 py-3 sm:table-cell">Items</th>
                <th className="px-4 py-3">Payment</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {pageItems.map((o) => (
                <React.Fragment key={o.id}>
                  <tr className="border-b border-[rgba(169,211,137,0.08)] last:border-0">
                    <td className="px-4 py-3">
                      <p className="text-[11px] font-medium tracking-wide text-[#a9d389]">
                        {orderRef(o.id)}
                      </p>
                      <p className="font-medium text-[#f4f7ef]">{o.customerName}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-[#b9c2ab]">{o.phone}</p>
                        <ContactButtons phone={o.phone} />
                      </div>
                    </td>
                    <td className="hidden px-4 py-3 text-[#b9c2ab] md:table-cell">{o.governorate}</td>
                    <td className="hidden px-4 py-3 sm:table-cell">
                      <div className="flex gap-1">
                        {o.items.slice(0, 4).map((it, i) => (
                          <Thumb key={i} src={it.image} alt={it.name} />
                        ))}
                        {o.items.length > 4 && (
                          <span className="flex h-9 w-9 items-center justify-center text-[11px] text-[#b9c2ab]">
                            +{o.items.length - 4}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#b9c2ab]">
                      {o.paymentMethod === "CASH_ON_DELIVERY" ? "Cash on Delivery" : "Paymob"}
                    </td>
                    <td className="px-4 py-3 text-[#f4f7ef]">{formatPrice(o.total)}</td>
                    <td className="px-4 py-3">
                      <select
                        value={o.status}
                        disabled={updating === o.id}
                        onChange={(e) => patchOrder(o.id, { status: e.target.value })}
                        className="labs-input cursor-pointer px-2 py-1 text-xs"
                      >
                        {STATUSES.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_META[s]?.label ?? s}
                          </option>
                        ))}
                      </select>
                      <div className="mt-2">
                        <PaymentBadge status={o.paymentStatus} />
                      </div>
                      {o.paymentStatus !== "PAID" && (
                        <button
                          onClick={() => patchOrder(o.id, { paymentStatus: "PAID" })}
                          disabled={updating === o.id}
                          className="labs-pill mt-2"
                        >
                          <Icon name="paid" size={16} />
                          Mark Paid
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#a9d389] hover:underline"
                      >
                        <Icon name={expanded === o.id ? "expand_less" : "expand_more"} size={16} />
                        {expanded === o.id ? "Hide" : "Details"}
                      </button>
                    </td>
                  </tr>
                  {expanded === o.id && (
                    <tr className="border-b border-[rgba(169,211,137,0.08)] bg-[#161a12]">
                      <td colSpan={7} className="px-4 py-4">
                        <div className="grid gap-6 md:grid-cols-2">
                          <div>
                            <p className="mb-2 text-[11px] uppercase tracking-wide text-[#a9d389]">
                              Shipping Address
                            </p>
                            <p className="text-sm font-medium text-[#f4f7ef]">{o.customerName}</p>
                            <div className="flex items-center gap-2">
                              <a
                                href={telLink(o.phone)}
                                className="text-sm text-[#b9c2ab] hover:text-[#f4f7ef]"
                              >
                                {o.phone}
                              </a>
                              <ContactButtons phone={o.phone} />
                            </div>
                            <div className="mt-2 space-y-2">
                              <div>
                                <p className="text-[11px] uppercase tracking-wide text-[#b9c2ab]">
                                  Governorate
                                </p>
                                <p className="text-sm text-[#f4f7ef]">{o.governorate}</p>
                              </div>
                              <div>
                                <p className="text-[11px] uppercase tracking-wide text-[#b9c2ab]">
                                  Address
                                </p>
                                <p className="max-w-md text-sm leading-relaxed text-[#f4f7ef]">
                                  {o.address}
                                </p>
                              </div>
                            </div>
                            <a
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                `${o.governorate} ${o.address}`,
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="labs-pill mt-3"
                            >
                              <Icon name="map" size={16} />
                              View on map
                            </a>
                            {o.notes && (
                              <div className="mt-3">
                                <p className="text-[11px] uppercase tracking-wide text-[#b9c2ab]">
                                  Customer Notes
                                </p>
                                <p className="mt-1 text-sm text-[#f4f7ef]">{o.notes}</p>
                              </div>
                            )}
                            <InternalNotesEditor
                              initial={o.internalNotes}
                              onSave={(patch) => patchOrder(o.id, patch)}
                            />
                          </div>
                          <div>
                            <p className="mb-2 text-[11px] uppercase tracking-wide text-[#a9d389]">
                              Order Details
                            </p>
                            <p className="text-sm font-medium text-[#f4f7ef]">{orderRef(o.id)}</p>
                            <p className="text-sm text-[#b9c2ab]">
                              Placed {new Date(o.createdAt).toLocaleString("en-EG")}
                            </p>
                            <p className="mt-1 text-[11px] uppercase tracking-wide text-[#b9c2ab]">
                              Items
                            </p>
                            <ul className="mt-1 space-y-2 text-sm text-[#f4f7ef]">
                              {o.items.map((item, i) => (
                                <li key={i} className="flex items-center gap-3">
                                  <Thumb src={item.image} alt={item.name} />
                                  <span className="flex-1">
                                    {item.name} × {item.quantity}
                                  </span>
                                  <span className="text-[#b9c2ab]">
                                    {formatPrice(item.unitPrice * item.quantity)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                            <a
                              href={`/admin/orders/${o.id}/print`}
                              target="_blank"
                              rel="noreferrer"
                              className="labs-pill mt-3"
                            >
                              <Icon name="print" size={16} />
                              Print
                            </a>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-[#b9c2ab]">
              Showing {Math.min((currentPage - 1) * PAGE_SIZE + 1, filtered.length)}–
              {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setPage(currentPage - 1)}
                className="labs-pill"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  data-active={p === currentPage}
                  onClick={() => setPage(p)}
                  className="labs-pill"
                >
                  {p}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setPage(currentPage + 1)}
                className="labs-pill"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </>)}
    </div>
  );
}

function PaymentBadge({ status }: { status: string }) {
  const meta = PAYMENT_META[status] ?? PAYMENT_META.PENDING;
  return (
    <span
      className="inline-flex items-center gap-1.5 text-xs font-medium"
      style={{ color: meta.color }}
    >
      <span className="h-2 w-2 rounded-full" style={{ backgroundColor: meta.color }} />
      {meta.label}
    </span>
  );
}

function Thumb({ src, alt }: { src?: string; alt: string }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden border border-[rgba(169,211,137,0.2)] bg-[#161a12]">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      ) : (
        <Icon name="image" size={16} className="text-[#b9c2ab]" />
      )}
    </span>
  );
}

function ContactButtons({ phone }: { phone: string }) {
  return (
    <span className="inline-flex items-center gap-1">
      <a
        href={waLink(phone)}
        target="_blank"
        rel="noreferrer"
        aria-label={`WhatsApp ${phone}`}
        className="flex h-7 w-7 items-center justify-center border border-[rgba(169,211,137,0.25)] text-[#a9d389] transition-colors hover:bg-[#a9d389] hover:text-[#12140f]"
      >
        <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.376-.906-.515-1.243-.135-.327-.273-.282-.376-.288-.102-.006-.222-.007-.343-.007-.12 0-.314.043-.478.225-.165.297-1.04 1.016-1.04 2.479 0 .883.645 1.732.735 1.852.09.12 1.273 1.945 3.084 2.728 1.81.784 1.81.522 2.137.49.327-.03 1.058-.432 1.207-.85.15-.42.15-.78.105-.85-.045-.07-.165-.112-.345-.202m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
      <a
        href={telLink(phone)}
        aria-label={`Call ${phone}`}
        className="flex h-7 w-7 items-center justify-center border border-[rgba(169,211,137,0.25)] text-[#a9d389] transition-colors hover:bg-[#a9d389] hover:text-[#12140f]"
      >
        <Icon name="call" size={16} />
      </a>
    </span>
  );
}

function InternalNotesEditor({
  initial,
  onSave,
}: {
  initial: string | null;
  onSave: (patch: { internalNotes: string | null }) => void;
}) {
  const [val, setVal] = useState(initial ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setSaving(true);
    setSaved(false);
    onSave({ internalNotes: val });
    setSaving(false);
    setSaved(true);
  }

  return (
    <div className="mt-3">
      <p className="text-[11px] uppercase tracking-wide text-[#b9c2ab]">Internal Notes</p>
      <textarea
        value={val}
        onChange={(e) => {
          setVal(e.target.value);
          setSaved(false);
        }}
        rows={2}
        placeholder="Admin-only — never shown to the customer"
        className="labs-input mt-1 resize-none"
      />
      <button onClick={save} disabled={saving} className="labs-pill mt-2">
        {saving ? "Saving…" : "Save Notes"}
      </button>
      {saved && <span className="ml-2 text-xs text-[#a9d389]">Saved</span>}
    </div>
  );
}
