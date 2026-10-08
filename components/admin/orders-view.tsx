"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Loader2 } from "lucide-react";
import { queryOrders, orderStatuses } from "@/lib/services/orders";
import type { Order, OrderStatus } from "@/types";
import { money, formatDate } from "@/lib/format";
import { StatusPill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUi } from "@/lib/store/providers";
import { PageHeader, Panel } from "@/components/admin/panel";
import { DataTable, SelectMenu, type Column } from "@/components/admin/data-table";
import { Avatar } from "@/components/admin/avatar";

export function OrdersView({ initialQuery }: { initialQuery?: string }) {
  const router = useRouter();
  const { toast } = useUi();
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("recent");
  const [query, setQuery] = useState(initialQuery ?? "");
  const [rows, setRows] = useState<Order[] | null>(null);

  useEffect(() => {
    setQuery(initialQuery ?? "");
  }, [initialQuery]);

  useEffect(() => {
    let cancelled = false;
    setRows(null);
    queryOrders({ status: status as OrderStatus, sort: sort as never, perPage: 100 }).then(
      (res) => {
        if (!cancelled) setRows(res.items);
      },
    );
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
        <p className="max-w-56 truncate text-[var(--ink-2)]">
          {o.items.map((i) => i.name).join(", ")}
        </p>
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
        <div className="capitalize">
          <p className="text-[var(--ink-2)]">{o.paymentMethod}</p>
          <p className="text-[12px] text-[var(--ink-3)]">{o.paymentStatus}</p>
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
  ];

  return (
    <div>
      <PageHeader
        title="Orders"
        description="Track, fulfil and manage every order in one place."
        actions={
          <Button
            variant="outline"
            size="sm"
            icon={<Download size={14} />}
            onClick={() =>
              toast({ title: "Orders exported", description: "orders-oct-2026.csv", tone: "success" })
            }
          >
            Export
          </Button>
        }
      />

      <Panel padded={false}>
        <DataTable
          columns={columns}
          rows={rows ?? []}
          getRowId={(o) => o.id}
          searchable
          searchValue={query}
          onSearchChange={(v) => {
            setQuery(v);
            const url = v.trim()
              ? `/admin/orders?q=${encodeURIComponent(v.trim())}`
              : "/admin/orders";
            window.history.replaceState(null, "", url);
          }}
          searchPlaceholder="Search order number, customer, item…"
          pageSize={10}
          onRowClick={(o) => router.push(`/admin/orders/${o.number}`)}
          toolbar={
            <div className="ml-auto flex items-center gap-2">
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
                  { value: "amount-asc", label: "Lowest value" },
                ]}
              />
            </div>
          }
          empty={{
            title: rows === null ? "Loading orders…" : "No orders match",
            description: "Try a different status or search term.",
          }}
        />
        {rows === null ? (
          <div className="flex items-center justify-center gap-2 py-6 text-[13px] text-[var(--ink-3)]">
            <Loader2 size={15} className="animate-spin" /> Fetching orders
          </div>
        ) : null}
      </Panel>
    </div>
  );
}
