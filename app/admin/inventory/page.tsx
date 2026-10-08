"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Boxes, PackageCheck, PackageX, RefreshCcw } from "lucide-react";
import { products as seed } from "@/lib/data/products";
import { useUi } from "@/lib/store/providers";
import { money } from "@/lib/format";
import { StatusPill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel } from "@/components/admin/panel";
import { DataTable, SelectMenu, type Column } from "@/components/admin/data-table";

type Row = { id: string; name: string; slug: string; sku: string; category: string; price: number; stock: number; sold: number };

export default function AdminInventoryPage() {
  const { toast } = useUi();
  const [rows, setRows] = useState<Row[]>(
    seed.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.id.toUpperCase().replace("PRD-", "AN-"),
      category: p.category,
      price: p.price,
      stock: p.stock,
      sold: p.sold,
    })),
  );
  const [filter, setFilter] = useState("all");

  const adjust = (id: string, delta: number) => {
    setRows((prev) =>
      prev.map((r) => (r.id === id ? { ...r, stock: Math.max(0, r.stock + delta) } : r)),
    );
  };

  const restock = (row: Row) => {
    setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, stock: r.stock + 50 } : r)));
    toast({ title: "Purchase order raised", description: `${row.name} +50 units`, tone: "success" });
  };

  const filtered = rows.filter((r) => {
    if (filter === "low") return r.stock > 0 && r.stock <= 15;
    if (filter === "out") return r.stock === 0;
    if (filter === "in") return r.stock > 15;
    return true;
  });

  const summary = useMemo(() => {
    const low = rows.filter((r) => r.stock > 0 && r.stock <= 15).length;
    const out = rows.filter((r) => r.stock === 0).length;
    const value = rows.reduce((n, r) => n + r.stock * r.price * 0.42, 0);
    return { total: rows.length, low, out, value };
  }, [rows]);

  const columns: Column<Row>[] = [
    {
      key: "product",
      header: "Product",
      sortValue: (r) => r.name,
      render: (r) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-[var(--ink)]">{r.name}</p>
          <p className="truncate text-[12px] text-[var(--ink-3)]">{r.sku}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      hideBelow: "lg",
      render: (r) => <span className="capitalize text-[var(--ink-3)]">{r.category}</span>,
    },
    {
      key: "price",
      header: "Price",
      align: "right",
      hideBelow: "md",
      sortValue: (r) => r.price,
      render: (r) => <span className="tabular-nums text-[var(--ink-2)]">{money(r.price)}</span>,
    },
    {
      key: "stock",
      header: "Stock",
      align: "right",
      sortValue: (r) => r.stock,
      render: (r) => (
        <div className="flex items-center justify-end gap-1.5">
          <button
            type="button"
            aria-label={`Decrease stock for ${r.name}`}
            onClick={() => adjust(r.id, -1)}
            className="grid h-7 w-7 place-items-center rounded-[3px] border border-[var(--line)] text-[var(--ink-3)] transition-colors hover:border-[var(--ink-3)] hover:text-[var(--ink)]"
          >
            −
          </button>
          <span
            className={`w-9 text-center text-[14px] font-medium tabular-nums ${
              r.stock === 0
                ? "text-[var(--danger)]"
                : r.stock <= 15
                  ? "text-[var(--warning)]"
                  : "text-[var(--ink)]"
            }`}
          >
            {r.stock}
          </span>
          <button
            type="button"
            aria-label={`Increase stock for ${r.name}`}
            onClick={() => adjust(r.id, 1)}
            className="grid h-7 w-7 place-items-center rounded-[3px] border border-[var(--line)] text-[var(--ink-3)] transition-colors hover:border-[var(--ink-3)] hover:text-[var(--ink)]"
          >
            +
          </button>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (r) => (
        <StatusPill status={r.stock === 0 ? "out_of_stock" : r.stock <= 15 ? "low_stock" : "in_stock"} />
      ),
    },
    {
      key: "action",
      header: "",
      align: "right",
      render: (r) => (
        <Button size="sm" variant="outline" icon={<RefreshCcw size={13} />} onClick={() => restock(r)}>
          Restock
        </Button>
      ),
    },
  ];

  const cards = [
    { label: "Total SKUs", value: String(summary.total), icon: Boxes, tone: "" },
    { label: "Low stock", value: String(summary.low), icon: AlertTriangle, tone: "text-[var(--warning)]" },
    { label: "Out of stock", value: String(summary.out), icon: PackageX, tone: "text-[var(--danger)]" },
    { label: "Inventory value", value: money(summary.value), icon: PackageCheck, tone: "" },
  ];

  return (
    <div>
      <PageHeader
        title="Inventory"
        description="Stock levels across the catalogue. Adjust in place or raise a restock."
        actions={
          <Button
            size="sm"
            variant="outline"
            onClick={() => toast({ title: "Sync started", description: "Warehouse stock updated in ~30s.", tone: "success" })}
          >
            Sync warehouse
          </Button>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="border border-[var(--line)] bg-[var(--surface)] p-4">
            <div className="flex items-start justify-between">
              <p className="text-[11.5px] uppercase tracking-[0.12em] text-[var(--ink-3)]">
                {c.label}
              </p>
              <c.icon size={15} strokeWidth={1.6} className={c.tone || "text-[var(--ink-3)]"} />
            </div>
            <p className="mt-3 text-[24px] font-semibold tracking-[-0.02em] tabular-nums text-[var(--ink)]">
              {c.value}
            </p>
          </div>
        ))}
      </div>

      <Panel className="mt-4" padded={false}>
        <DataTable
          columns={columns}
          rows={filtered}
          getRowId={(r) => r.id}
          searchable
          searchPlaceholder="Search product or SKU…"
          pageSize={10}
          toolbar={
            <SelectMenu
              className="ml-auto"
              value={filter}
              onChange={setFilter}
              label="Filter inventory"
              options={[
                { value: "all", label: "All stock" },
                { value: "in", label: "In stock" },
                { value: "low", label: "Low stock" },
                { value: "out", label: "Out of stock" },
              ]}
            />
          }
          empty={{ title: "Nothing to show", description: "No products match this filter." }}
        />
      </Panel>
    </div>
  );
}
