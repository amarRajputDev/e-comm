"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { useCart, useWishlist } from "@/lib/store/providers";
import { products } from "@/lib/data/products";
import { money } from "@/lib/format";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusPill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs } from "@/components/ui/tabs";
import { Img } from "@/components/ui/img";

export function WishlistView() {
  const { ids, remove, hydrated } = useWishlist();
  const { add } = useCart();
  const [sort, setSort] = useState("recent");

  const saved = useMemo(() => {
    const list = products.filter((p) => ids.includes(p.id));
    if (sort === "price-asc") return list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return list.sort((a, b) => b.price - a.price);
    if (sort === "rating") return list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [ids, sort]);

  if (!hydrated) {
    return (
      <div role="status" aria-label="Loading wishlist" className="space-y-4">
        <div className="skeleton h-8 w-56" />
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-3">
              <div className="skeleton aspect-4/5 w-full" />
              <div className="skeleton h-4 w-2/3" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <header className="border-b border-[var(--line)] pb-7">
        <p className="eyebrow text-[var(--accent)]">Saved</p>
        <h1 className="h1 mt-3 text-[var(--ink)]">Your wishlist</h1>
        <p className="mt-3 text-[15px] text-[var(--ink-3)]">
          {saved.length
            ? `${saved.length} piece${saved.length === 1 ? "" : "s"} saved. We’ll tell you when one goes on sale.`
            : "Tap the heart on any product to save it here."}
        </p>
      </header>

      {saved.length ? (
        <>
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <Tabs
              layoutId="wishlist"
              value={sort}
              onChange={setSort}
              tabs={[
                { id: "recent", label: "Recently saved" },
                { id: "price-asc", label: "Price ↑" },
                { id: "price-desc", label: "Price ↓" },
                { id: "rating", label: "Top rated" },
              ]}
            />
          </div>

          <ul className="mt-8 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {saved.map((product) => (
              <li key={product.id} className="group">
                <div className="relative">
                  <Link
                    href={`/product/${product.slug}`}
                    className="block aspect-4/5 overflow-hidden bg-[var(--surface-2)]"
                  >
                    <Img sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 320px" width={800} height={1000}
                      src={product.images[0]?.src}
                      alt={product.images[0]?.alt ?? product.name}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  </Link>
                  <button
                    type="button"
                    aria-label={`Remove ${product.name} from wishlist`}
                    onClick={() => remove(product.id)}
                    className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-[var(--surface)]/90 text-[var(--accent)] backdrop-blur transition-colors hover:bg-[var(--surface)]"
                  >
                    <Trash2 size={15} strokeWidth={1.6} />
                  </button>
                  <div className="absolute inset-x-3 bottom-3 hidden lg:block">
                    <button
                      type="button"
                      disabled={product.stock === 0}
                      onClick={() => {
                        const color =
                          product.colors.find((c) => c.available)?.name ??
                          product.colors[0]?.name;
                        const size =
                          product.sizes.find((s) => s.available)?.label ?? null;
                        add(product, color, size, 1);
                      }}
                      className="flex h-10 w-full items-center justify-center gap-2 rounded-[2px] bg-[var(--surface)]/95 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--ink)] transition-colors hover:bg-[var(--ink)] hover:text-[var(--bg)] disabled:opacity-50"
                    >
                      <ShoppingBag size={14} strokeWidth={1.6} />
                      {product.stock === 0 ? "Sold out" : "Add to bag"}
                    </button>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="eyebrow text-[var(--ink-3)]">{product.category}</p>
                      <Link
                        href={`/product/${product.slug}`}
                        className="mt-1.5 block truncate text-[15px] font-medium text-[var(--ink)] hover:text-[var(--accent)]"
                      >
                        {product.name}
                      </Link>
                    </div>
                    <StatusPill status={product.stock === 0 ? "out_of_stock" : "in_stock"} />
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-[15px] font-medium tabular-nums text-[var(--ink)]">
                      {money(product.price)}
                    </span>
                    {product.compareAt && product.compareAt > product.price ? (
                      <span className="text-[13px] tabular-nums text-[var(--ink-3)] line-through">
                        {money(product.compareAt)}
                      </span>
                    ) : null}
                  </div>

                  <Button
                    fullWidth
                    size="sm"
                    variant="outline"
                    className="lg:hidden"
                    disabled={product.stock === 0}
                    onClick={() => {
                      const color =
                        product.colors.find((c) => c.available)?.name ??
                        product.colors[0]?.name;
                      const size = product.sizes.find((s) => s.available)?.label ?? null;
                      add(product, color, size, 1);
                    }}
                  >
                    Add to bag
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className="mt-10">
          <EmptyState
            icon={<Heart size={24} strokeWidth={1.4} />}
            title="Nothing saved yet"
            description="Build your shortlist — we’ll keep an eye on stock and price drops for you."
            action={{ label: "Explore the collection", href: "/shop" }}
            secondaryAction={{ label: "View best sellers", href: "/collections/best-sellers" }}
          />
        </div>
      )}
    </div>
  );
}
