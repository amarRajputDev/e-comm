"use client";

import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import type { Product } from "@/types";
import { useCart, useWishlist } from "@/lib/store/providers";
import { Price } from "./price";
import { RatingSummary } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { Img } from "@/components/ui/img";

export function ProductListView({ product }: { product: Product }) {
  const { add } = useCart();
  const { has, toggle, hydrated } = useWishlist();
  const wished = hydrated && has(product.id);

  const quickAdd = () => {
    const color = product.colors.find((c) => c.available)?.name ?? product.colors[0]?.name;
    const size = product.sizes.find((s) => s.available)?.label ?? product.sizes[0]?.label ?? null;
    add(product, color, size, 1);
  };

  return (
    <article className="group grid grid-cols-[100px_1fr] gap-5 py-6 sm:grid-cols-[150px_1.4fr_1fr_auto] sm:items-center sm:gap-8">
      <Link
        href={`/product/${product.slug}`}
        className="relative aspect-4/5 overflow-hidden bg-[var(--surface-2)]"
      >
        <Img
          src={product.images[0]?.src ?? ""}
          alt={product.images[0]?.alt ?? product.name}
          width={600}
          height={750}
          sizes="(max-width: 640px) 100px, 150px"
          className="h-full w-full transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </Link>

      <div className="min-w-0">
        <p className="eyebrow text-[var(--ink-3)]">{product.category}</p>
        <Link
          href={`/product/${product.slug}`}
          className="mt-1.5 block text-[17px] font-medium tracking-[-0.015em] text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
        >
          {product.name}
        </Link>
        <p className="mt-1.5 line-clamp-2 max-w-xl text-[13.5px] leading-relaxed text-[var(--ink-3)]">
          {product.shortDescription}
        </p>
        <div className="mt-2.5 flex flex-wrap items-center gap-3">
          <RatingSummary value={product.rating} count={product.reviewCount} size={12} />
          {product.stock === 0 ? <Badge tone="danger">Sold out</Badge> : null}
        </div>
      </div>

      <div className="col-span-2 flex items-center justify-between gap-4 sm:col-span-1 sm:block">
        <Price price={product.price} compareAt={product.compareAt} className="sm:justify-end" />
        <div className="mt-0 hidden gap-2 sm:flex sm:justify-end">
          <button
            type="button"
            aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
            onClick={() => toggle(product)}
            className="grid h-10 w-10 place-items-center rounded-[2px] border border-[var(--line-strong)] text-[var(--ink-2)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
          >
            <Heart size={16} strokeWidth={1.6} fill={wished ? "currentColor" : "none"} />
          </button>
          <button
            type="button"
            onClick={quickAdd}
            disabled={product.stock === 0}
            className="inline-flex h-10 items-center gap-2 rounded-[2px] border border-[var(--line-strong)] px-4 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--ink)] transition-colors hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)] disabled:opacity-40"
          >
            <Plus size={14} strokeWidth={1.75} /> Add
          </button>
        </div>
      </div>
    </article>
  );
}
