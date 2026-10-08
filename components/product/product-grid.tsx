"use client";

import type { Product } from "@/types";
import { ProductCard } from "./product-card";
import { ProductListView } from "./product-list-row";
import { cn } from "@/lib/utils";

export type GridView = "grid" | "list";

export function ProductGrid({
  products,
  view = "grid",
  columns = 4,
  className,
  priorityCount = 0,
}: {
  products: Product[];
  view?: GridView;
  columns?: 2 | 3 | 4;
  className?: string;
  priorityCount?: number;
}) {
  if (!products.length) return null;

  if (view === "list") {
    return (
      <div className={cn("divide-y divide-[var(--line)] border-t border-[var(--line)]", className)}>
        {products.map((p) => (
          <ProductListView key={p.id} product={p} />
        ))}
      </div>
    );
  }

  const colClass =
    columns === 2
      ? "grid-cols-2 lg:grid-cols-2"
      : columns === 3
        ? "grid-cols-2 lg:grid-cols-3"
        : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <div className={cn("grid gap-x-5 gap-y-12 sm:gap-x-6", colClass, className)}>
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}
