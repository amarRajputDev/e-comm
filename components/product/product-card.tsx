"use client";

import Link from "next/link";
import { Heart, Plus } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/types";
import { useCart, useWishlist } from "@/lib/store/providers";
import { discountPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Price } from "./price";
import { Stars } from "@/components/ui/rating";
import { Img } from "@/components/ui/img";

export function ProductCard({
  product,
  priority = false,
  className,
  showRating = true,
}: {
  product: Product;
  priority?: boolean;
  className?: string;
  showRating?: boolean;
}) {
  const { add } = useCart();
  const { has, toggle, hydrated } = useWishlist();

  const pct = discountPercent(product.price, product.compareAt);
  const wished = hydrated && has(product.id);
  const secondary = product.images[product.hoverIndex ?? 1] ?? product.images[0];
  const primary = product.images[0];

  const quickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const color = product.colors.find((c) => c.available)?.name ?? product.colors[0]?.name;
    const size =
      product.sizes.find((s) => s.available)?.label ?? product.sizes[0]?.label ?? null;
    add(product, color, size, 1);
  };

  const wishlistBtn = (
    <button
      type="button"
      aria-label={wished ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
      aria-pressed={wished}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(product);
      }}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full bg-[var(--surface)]/85 text-[var(--ink)] backdrop-blur-sm transition-all duration-200 hover:bg-[var(--surface)] lg:opacity-0 lg:group-hover:opacity-100 lg:group-focus-within:opacity-100",
        wished && "opacity-100 text-[var(--accent)]",
      )}
    >
      <motion.span
        key={String(wished)}
        initial={{ scale: 0.6 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 460, damping: 18 }}
        className="grid place-items-center"
      >
        <Heart size={16} strokeWidth={1.6} fill={wished ? "currentColor" : "none"} />
      </motion.span>
    </button>
  );

  return (
    <article className={cn("group relative", className)}>
      <Link
        href={`/product/${product.slug}`}
        className="block focus-visible:outline-offset-4"
        aria-label={`${product.name} — ${product.shortDescription}`}
      >
        <div className="relative aspect-4/5 overflow-hidden bg-[var(--surface-2)]">
          {/* primary image */}
          {primary ? (
            <Img
              src={primary.src}
              alt={primary.alt ?? product.name}
              preload={priority}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className={cn(
                "absolute inset-0 h-full w-full transition-all duration-[700ms] ease-out",
                secondary
                  ? "group-hover:scale-[1.04] group-hover:opacity-0"
                  : "group-hover:scale-[1.04]",
              )}
            />
          ) : null}
          {/* secondary image */}
          {secondary ? (
            <Img
              src={secondary.src}
              alt={secondary.alt}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="absolute inset-0 h-full w-full scale-[1.06] opacity-0 transition-all duration-[700ms] ease-out group-hover:scale-100 group-hover:opacity-100"
            />
          ) : null}

          {/* badges */}
          <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
            {pct > 0 ? (
              <span className="rounded-[2px] bg-[var(--accent)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] leading-none text-[var(--on-accent)]">
                {pct}% off
              </span>
            ) : null}
            {product.isNew ? (
              <span className="rounded-[2px] bg-[var(--ink)] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] leading-none text-[var(--bg)]">
                New
              </span>
            ) : null}
            {product.stock === 0 ? (
              <span className="rounded-[2px] bg-[var(--ink)]/85 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] leading-none text-white">
                Sold out
              </span>
            ) : product.stock <= 15 ? (
              <span className="rounded-[2px] bg-[var(--surface)]/90 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.1em] leading-none text-[var(--ink)]">
                Only {product.stock} left
              </span>
            ) : null}
          </div>

          {/* wishlist */}
          <div className="absolute right-3 top-3">{wishlistBtn}</div>

          {/* quick add */}
          {product.stock > 0 ? (
            <div className="absolute inset-x-3 bottom-3 hidden translate-y-[130%] transition-transform duration-[420ms] ease-out group-hover:translate-y-0 group-focus-within:translate-y-0 lg:block">
              <button
                type="button"
                onClick={quickAdd}
                className="flex h-10 w-full items-center justify-center gap-2 rounded-[2px] bg-[var(--surface)]/95 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--ink)] backdrop-blur-sm transition-colors hover:bg-[var(--ink)] hover:text-[var(--bg)]"
              >
                <Plus size={14} strokeWidth={1.75} /> Quick add
              </button>
            </div>
          ) : null}
        </div>

        {/* mobile quick add (tap accessible) */}
        {product.stock > 0 ? (
          <button
            type="button"
            onClick={quickAdd}
            className="mt-2 flex h-9 w-full items-center justify-center gap-1.5 rounded-[2px] border border-[var(--line)] text-[10.5px] font-medium uppercase tracking-[0.14em] text-[var(--ink-2)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)] lg:hidden"
          >
            <Plus size={13} strokeWidth={1.75} /> Quick add
          </button>
        ) : null}

        {/* info */}
        <div className="mt-3.5 space-y-1.5">
          <p className="eyebrow text-[var(--ink-3)]">
            {product.category}
            {product.compareAt ? (
              <span className="ml-2 text-[var(--accent)]">Sale</span>
            ) : null}
          </p>
          <h3 className="text-[15px] font-normal leading-snug tracking-[-0.01em] text-[var(--ink)] transition-colors duration-200 group-hover:text-[var(--accent)]">
            {product.name}
          </h3>
          <Price price={product.price} compareAt={product.compareAt} />
          {showRating ? (
            <div className="flex items-center gap-2 pt-0.5">
              <Stars value={product.rating} size={11} />
              <span className="text-[11.5px] tabular-nums text-[var(--ink-3)]">
                {product.rating.toFixed(1)} ({product.reviewCount})
              </span>
            </div>
          ) : null}
        </div>
      </Link>
    </article>
  );
}

export function ProductGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3">
          <div className="skeleton aspect-4/5 w-full" />
          <div className="skeleton h-3 w-1/3" />
          <div className="skeleton h-4 w-3/4" />
        </div>
      ))}
    </>
  );
}
