"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ChevronRight, Package, Search } from "lucide-react";
import { useSession } from "@/lib/store/providers";
import { ordersForCustomer } from "@/lib/data/orders";
import { formatDate, money, timeAgo } from "@/lib/format";
import { StatusPill } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Tabs } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { Img } from "@/components/ui/img";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "In progress" },
  { id: "delivered", label: "Delivered" },
  { id: "cancelled", label: "Cancelled" },
];

const ACTIVE_STATUSES = ["processing", "confirmed", "packed", "shipped", "out_for_delivery"];

export default function AccountOrdersPage() {
  const { user } = useSession();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const orders = useMemo(() => {
    if (!user) return [];
    return ordersForCustomer(user.id)
      .slice()
      .sort((a, b) => +new Date(b.placedAt) - +new Date(a.placedAt))
      .filter((o) => {
        if (filter === "active" && !ACTIVE_STATUSES.includes(o.status)) return false;
        if (filter === "delivered" && o.status !== "delivered") return false;
        if (filter === "cancelled" && !["cancelled", "returned"].includes(o.status))
          return false;
        if (!query.trim()) return true;
        return `${o.number} ${o.items.map((i) => i.name).join(" ")}`
          .toLowerCase()
          .includes(query.toLowerCase());
      });
  }, [user, filter, query]);

  if (!user) return null;

  return (
    <div>
      <header className="border-b border-[var(--line)] pb-7">
        <p className="eyebrow text-[var(--accent)]">Your orders</p>
        <h1 className="h1 mt-3 text-[var(--ink)]">Order history</h1>
        <p className="mt-3 text-[15px] text-[var(--ink-3)]">
          Track deliveries, download invoices and start a return.
        </p>
      </header>

      <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
        <Tabs tabs={FILTERS} value={filter} onChange={setFilter} layoutId="account-orders" />

        <label className="relative w-full max-w-xs sm:w-auto">
          <span className="sr-only">Search orders</span>
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-3)]"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by number or item"
            className="h-10 w-full rounded-[2px] border border-[var(--line-strong)] bg-[var(--surface)] pl-9 pr-3 text-[14px] text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-[var(--accent)] focus:outline-none sm:w-72"
          />
        </label>
      </div>

      {orders.length ? (
        <div className="mt-8 divide-y divide-[var(--line)] border-y border-[var(--line)]">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/account/orders/${order.number}`}
              className={cn(
                "group grid grid-cols-1 gap-x-6 gap-y-4 py-5 transition-colors hover:bg-[var(--surface-2)]/50 sm:grid-cols-[auto_1fr_auto_auto_auto]",
                "sm:items-center",
              )}
            >
              <div className="flex -space-x-2.5">
                {order.items.slice(0, 3).map((item) => (
                  <span
                    key={item.productId}
                    className="h-14 w-12 overflow-hidden rounded-[2px] border border-[var(--bg)] bg-[var(--surface-2)]"
                  >
                    <Img sizes="56px" width={112} height={140} src={item.image} alt="" className="h-full w-full object-cover" />
                  </span>
                ))}
              </div>

              <div className="min-w-0">
                <p className="text-[15px] font-medium text-[var(--ink)]">{order.number}</p>
                <p className="mt-1 truncate text-[13.5px] text-[var(--ink-3)]">
                  {order.items.map((i) => i.name).join(", ")}
                </p>
                <p className="mt-1 text-[12.5px] text-[var(--ink-3)]">
                  {formatDate(order.placedAt)} · {order.itemCount}{" "}
                  {order.itemCount === 1 ? "item" : "items"} ·{" "}
                  <span className="capitalize">{order.paymentMethod}</span>
                </p>
              </div>

              <div className="sm:justify-self-end">
                <StatusPill status={order.status} />
                <p className="mt-2 text-[11.5px] text-[var(--ink-3)]">
                  {order.status === "delivered"
                    ? `Delivered ${timeAgo(order.placedAt)}`
                    : `ETA ${order.eta}`}
                </p>
              </div>

              <p className="text-[16px] font-medium tabular-nums text-[var(--ink)] sm:justify-self-end">
                {money(order.total)}
              </p>

              <ChevronRight
                size={17}
                className="hidden text-[var(--ink-3)] transition-transform group-hover:translate-x-1 sm:block"
              />
            </Link>
          ))}
        </div>
      ) : (
        <div className="mt-10">
          <EmptyState
            icon={<Package size={24} strokeWidth={1.4} />}
            title={query ? "No orders match that search" : "Nothing here yet"}
            description={
              query
                ? "Try a different order number or product name."
                : "Orders you place will appear here with live tracking."
            }
            action={{ label: "Browse the collection", href: "/shop" }}
          />
        </div>
      )}
    </div>
  );
}
