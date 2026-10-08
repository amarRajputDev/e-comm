"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Copy, Eye, Plus, Star, Trash2, Archive, Pencil } from "lucide-react";
import { products as allProducts } from "@/lib/data/products";
import type { Product } from "@/types";
import { money, formatDate, discountPercent } from "@/lib/format";
import { useUi } from "@/lib/store/providers";
import { StatusPill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeader, Panel } from "@/components/admin/panel";
import { DataTable, SelectMenu, type Column } from "@/components/admin/data-table";
import { categories } from "@/lib/data/categories";
import { Img } from "@/components/ui/img";

export default function AdminProductsPage() {
  const router = useRouter();
  const { toast } = useUi();
  const [status, setStatus] = useState("all");
  const [category, setCategory] = useState("all");
  /* Mutations below edit the shared catalogue in lib/data/products so the
     storefront, PDP and admin lists all see the same truth. The counter only
     exists to re-render this screen after an in-place change. */
  const [, setVersion] = useState(0);

  const rows = allProducts.filter(
    (p) =>
      (status === "all" || p.status === status) &&
      (category === "all" || p.category === category),
  );

  const duplicate = (p: Product) => {
    const now = new Date().toISOString();
    const copy: Product = {
      ...p,
      id: `${p.id}-copy-${Date.now()}`,
      slug: `${p.slug}-copy`,
      name: `${p.name} (Copy)`,
      status: "draft",
      isNew: true,
      images: [...p.images],
      createdAt: now,
      updatedAt: now,
      seo: { ...p.seo },
      tags: [...p.tags],
      collections: [...p.collections],
    };
    allProducts.unshift(copy);
    setVersion((v) => v + 1);
    toast({
      title: "Product duplicated",
      description: `${copy.name} was created as a draft.`,
      tone: "success",
    });
  };

  const archive = (p: Product) => {
    p.status = p.status === "archived" ? "active" : "archived";
    p.updatedAt = new Date().toISOString();
    setVersion((v) => v + 1);
    toast({
      title: p.status === "archived" ? "Product archived" : "Product restored",
      description: p.name,
      tone: p.status === "archived" ? "error" : "success",
    });
  };

  const remove = (p: Product) => {
    const index = allProducts.findIndex((x) => x.id === p.id);
    if (index >= 0) allProducts.splice(index, 1);
    setVersion((v) => v + 1);
    toast({ title: "Product deleted", description: p.name, tone: "error" });
  };

  const openProduct = (p: Product) => router.push(`/admin/products/${p.slug}`);

  const columns: Column<Product>[] = [
    {
      key: "product",
      header: "Product",
      sortValue: (p) => p.name,
      render: (p) => (
        <div className="flex items-center gap-3">
          <span className="h-11 w-9 shrink-0 overflow-hidden rounded-[2px] bg-[var(--surface-2)]">
            <Img sizes="44px" width={88} height={110} src={p.images[0]?.src} alt="" className="h-full w-full object-cover" />
          </span>
          <div className="min-w-0">
            <p className="truncate font-medium text-[var(--ink)]">{p.name}</p>
            <p className="truncate text-[12px] text-[var(--ink-3)]">{p.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      hideBelow: "lg",
      sortValue: (p) => p.category,
      render: (p) => <span className="capitalize">{p.category}</span>,
    },
    {
      key: "price",
      header: "Price",
      align: "right",
      sortValue: (p) => p.price,
      render: (p) => (
        <div>
          <p className="font-medium tabular-nums text-[var(--ink)]">{money(p.price)}</p>
          {p.compareAt ? (
            <p className="text-[11.5px] tabular-nums text-[var(--ink-3)] line-through">
              {money(p.compareAt)}
              <span className="ml-1 text-[var(--accent)]">
                −{discountPercent(p.price, p.compareAt)}%
              </span>
            </p>
          ) : null}
        </div>
      ),
    },
    {
      key: "stock",
      header: "Stock",
      align: "right",
      hideBelow: "md",
      sortValue: (p) => p.stock,
      render: (p) => (
        <span
          className={
            p.stock === 0
              ? "font-medium tabular-nums text-[var(--danger)]"
              : p.stock <= 15
                ? "font-medium tabular-nums text-[var(--warning)]"
                : "tabular-nums text-[var(--ink-2)]"
          }
        >
          {p.stock}
        </span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (p) => <StatusPill status={p.stock === 0 && p.status === "active" ? "active" : p.status} />,
    },
    {
      key: "created",
      header: "Created",
      align: "right",
      hideBelow: "lg",
      sortValue: (p) => p.createdAt,
      render: (p) => (
        <span className="tabular-nums text-[var(--ink-3)]">{formatDate(p.createdAt)}</span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (p) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            aria-label={`Edit ${p.name}`}
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/admin/products/${p.slug}`);
            }}
            className="grid h-7 w-7 place-items-center rounded-[3px] text-[var(--ink-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
          >
            <Pencil size={14} strokeWidth={1.6} />
          </button>
          <button
            type="button"
            aria-label={`Preview ${p.name}`}
            onClick={(e) => {
              e.stopPropagation();
            if (p.status !== "active") {
              toast({
                title: "Publish before previewing",
                description: "Draft and archived products are hidden from the storefront.",
              });
              return;
            }
            router.push(`/product/${p.slug}`);
            }}
            className="grid h-7 w-7 place-items-center rounded-[3px] text-[var(--ink-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
          >
            <Eye size={14} strokeWidth={1.6} />
          </button>
          <button
            type="button"
            aria-label={`Duplicate ${p.name}`}
            onClick={(e) => {
              e.stopPropagation();
              duplicate(p);
            }}
            className="grid h-7 w-7 place-items-center rounded-[3px] text-[var(--ink-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
          >
            <Copy size={14} strokeWidth={1.6} />
          </button>
          <button
            type="button"
            aria-label={`${p.status === "archived" ? "Restore" : "Archive"} ${p.name}`}
            onClick={(e) => {
              e.stopPropagation();
              archive(p);
            }}
            className="grid h-7 w-7 place-items-center rounded-[3px] text-[var(--ink-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
          >
            <Archive size={14} strokeWidth={1.6} />
          </button>
          <button
            type="button"
            aria-label={`Delete ${p.name}`}
            onClick={(e) => {
              e.stopPropagation();
              remove(p);
            }}
            className="grid h-7 w-7 place-items-center rounded-[3px] text-[var(--ink-3)] transition-colors hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
          >
            <Trash2 size={14} strokeWidth={1.6} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Products"
        description={`${allProducts.length} products across ${categories.length} categories`}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              icon={<Star size={14} />}
              onClick={() => {
                const header = [
                  "Name",
                  "Slug",
                  "Category",
                  "Price",
                  "Compare at",
                  "Stock",
                  "Status",
                  "Created",
                ];
                const body = rows.map((p) => [
                  p.name,
                  p.slug,
                  p.category,
                  p.price,
                  p.compareAt ?? "",
                  p.stock,
                  p.status,
                  p.createdAt.slice(0, 10),
                ]);
                const csv = [header, ...body]
                  .map((line) =>
                    line.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
                  )
                  .join("\r\n");
                const blob = new Blob(["\uFEFF" + csv], {
                  type: "text/csv;charset=utf-8;",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "atelier-noir-products.csv";
                document.body.appendChild(a);
                a.click();
                a.remove();
                URL.revokeObjectURL(url);
                toast({
                  title: "Export downloaded",
                  description: `${rows.length} products written to CSV.`,
                  tone: "success",
                });
              }}
            >
              Export
            </Button>
            <Button href="/admin/products/new" size="sm" icon={<Plus size={15} />}>
              Add product
            </Button>
          </>
        }
      />

      <Panel padded={false}>
        <DataTable
          columns={columns}
          rows={rows}
          getRowId={(p) => p.id}
          searchable
          searchPlaceholder="Search products or slugs…"
          selectable
          pageSize={10}
          onRowClick={openProduct}
          bulkActions={(selected, clear) => (
            <>
              <button
                type="button"
                onClick={() => {
                  allProducts.forEach((x) => {
                    if (selected.includes(x.id)) x.status = "archived";
                  });
                  setVersion((v) => v + 1);
                  toast({
                    title: `${selected.length} products archived`,
                    description: "They are hidden from the storefront until restored.",
                    tone: "success",
                  });
                  clear();
                }}
                className="rounded-[3px] border border-[var(--line-strong)] px-2.5 py-1 text-[12.5px] text-[var(--ink-2)] hover:border-[var(--ink)]"
              >
                Archive
              </button>
              <button
                type="button"
                onClick={() => {
                  for (let i = allProducts.length - 1; i >= 0; i--) {
                    if (selected.includes(allProducts[i].id)) allProducts.splice(i, 1);
                  }
                  setVersion((v) => v + 1);
                  toast({
                    title: `${selected.length} products deleted`,
                    description: "Removed from the catalogue.",
                    tone: "error",
                  });
                  clear();
                }}
                className="rounded-[3px] border border-[var(--danger)]/40 px-2.5 py-1 text-[12.5px] text-[var(--danger)] hover:bg-[var(--danger)]/10"
              >
                Delete
              </button>
            </>
          )}
          toolbar={
            <div className="ml-auto flex items-center gap-2">
              <SelectMenu
                value={category}
                onChange={setCategory}
                label="Filter by category"
                options={[
                  { value: "all", label: "All categories" },
                  ...categories
                    .filter((c) => c.order <= 3)
                    .map((c) => ({ value: c.slug, label: c.name })),
                ]}
              />
              <SelectMenu
                value={status}
                onChange={setStatus}
                label="Filter by status"
                options={[
                  { value: "all", label: "All statuses" },
                  { value: "active", label: "Active" },
                  { value: "draft", label: "Draft" },
                  { value: "archived", label: "Archived" },
                ]}
              />
            </div>
          }
          empty={{ title: "No products match", description: "Try clearing a filter." }}
        />
      </Panel>
    </div>
  );
}
