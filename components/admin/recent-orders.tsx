"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, Loader2 } from "lucide-react";
import { queryOrders, orderStatuses } from "@/lib/services/orders";
import type { Order, OrderStatus } from "@/types";
import { money, formatDate } from "@/lib/format";
import { StatusPill } from "@/components/ui/badge";
import { Avatar } from "./avatar";
import { DataTable, SelectMenu, type Column } from "./data-table";
import { Panel } from "./panel";
import { Img } from "@/components/ui/img";

export function RecentOrders() {
  const router = useRouter();
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("recent");
  const [items, setItems] = useState<Order[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    setItems(null);
    queryOrders({ status: status as OrderStatus, sort: sort as never }).then((res) => {
      if (!cancelled) setItems(res.items.slice(0, 7));
    });
    return () => {
      cancelled = true;
    };
  }, [status, sort]);

  const columns: Column<Order>[] = [
    {
      key: "number",
      header: "Order",
      sortValue: (o) => o.placedAt,
      render: (o) => (
        <div className="flex items-center gap-3">
          <Avatar name={o.customerName} />
          <div className="min-w-0">
            <p className="font-medium text-[var(--ink)]">{o.number}</p>
            <p className="truncate text-[12px] text-[var(--ink-3)]">{o.customerName}</p>
          </div>
        </div>
      ),
    },
    {
      key: "items",
      header: "Items",
      hideBelow: "lg",
      render: (o) => (
        <div className="flex -space-x-1.5">
          {o.items.slice(0, 3).map((i) => (
            <span
              key={`${o.id}-${i.productId}`}
              className="h-7 w-6 overflow-hidden rounded-[2px] border border-[var(--bg)] bg-[var(--surface-2)]"
            >
              <Img sizes="32px" width={64} height={80} src={i.image} alt="" className="h-full w-full object-cover" />
            </span>
          ))}
          {o.itemCount > 3 ? (
            <span className="grid h-7 w-6 place-items-center rounded-[2px] border border-[var(--bg)] bg-[var(--surface-2)] text-[10px] text-[var(--ink-3)]">
              +{o.itemCount - 3}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      key: "amount",
      header: "Amount",
      align: "right",
      sortValue: (o) => o.total,
      render: (o) => (
        <span className="font-medium tabular-nums text-[var(--ink)]">{money(o.total)}</span>
      ),
    },
    {
      key: "payment",
      header: "Payment",
      hideBelow: "md",
      render: (o) => (
        <div>
          <p className="capitalize text-[var(--ink-2)]">{o.paymentMethod}</p>
          <p className="text-[12px] capitalize text-[var(--ink-3)]">{o.paymentStatus}</p>
        </div>
      ),
    },
    { key: "status", header: "Status", render: (o) => <StatusPill status={o.status} /> },
    {
      key: "date",
      header: "Date",
      align: "right",
      hideBelow: "lg",
      sortValue: (o) => o.placedAt,
      render: (o) => (
        <span className="tabular-nums text-[var(--ink-3)]">{formatDate(o.placedAt)}</span>
      ),
    },
    {
      key: "action",
      header: "",
      align: "right",
      render: () => (
        <span className="inline-flex items-center gap-1.5 text-[12.5px] text-[var(--ink-3)]">
          View <ExternalLink size={13} />
        </span>
      ),
    },
  ];

  return (
    <Panel
      title="Recent orders"
      description="Latest activity across the store"
      padded={false}
      actions={
        <div className="flex items-center gap-2">
          <SelectMenu
            value={status}
            onChange={setStatus}
            label="Filter by status"
            options={[
              { value: "all", label: "All statuses" },
              ...(Object.entries(orderStatuses) as [OrderStatus, string][]).map(([v, l]) => ({
                value: v,
                label: l,
              })),
            ]}
          />
          <SelectMenu
            value={sort}
            onChange={setSort}
            label="Sort orders"
            options={[
              { value: "recent", label: "Newest first" },
              { value: "oldest", label: "Oldest first" },
              { value: "amount-desc", label: "Highest value" },
            ]}
          />
        </div>
      }
    >
      {items === null ? (
        <div className="flex items-center justify-center gap-2 py-16 text-[13px] text-[var(--ink-3)]">
          <Loader2 size={16} className="animate-spin" /> Loading orders…
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={items}
          getRowId={(o) => o.id}
          pageSize={7}
          onRowClick={(o) => router.push(`/admin/orders/${o.number}`)}
          empty={{
            title: "No orders match that filter",
            description: "Try a different status or sort order.",
          }}
        />
      )}
    </Panel>
  );
}
