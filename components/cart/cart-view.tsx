"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingBag, Heart, ArrowRight, Lock, Truck, ShieldCheck } from "lucide-react";
import { useCart } from "@/lib/store/providers";
import { products } from "@/lib/data/products";
import { money } from "@/lib/format";
import { OrderSummary } from "./order-summary";
import { QuantitySelector } from "@/components/ui/quantity";
import { EmptyState } from "@/components/ui/empty-state";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/product/product-grid";
import { useRouter } from "next/navigation";
import { Img } from "@/components/ui/img";

function CartLineRow({
  line,
  saved,
}: {
  line: ReturnType<typeof useCart>["lines"][number];
  saved?: boolean;
}) {
  const { setQty, remove, saveForLater, moveToBag, removeSaved } = useCart();

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginTop: 0, paddingTop: 0, paddingBottom: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="flex gap-5 border-b border-[var(--line)] py-6 last:border-0"
    >
      <Link
        href={`/product/${line.productSlug}`}
        className="group h-32 w-26 shrink-0 overflow-hidden bg-[var(--surface-2)] sm:h-40 sm:w-32"
      >
        <Img sizes="160px" width={320} height={400}
          src={line.image}
          alt={line.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <Link
              href={`/product/${line.productSlug}`}
              className="text-[16px] font-medium tracking-[-0.01em] text-[var(--ink)] hover:text-[var(--accent)]"
            >
              {line.name}
            </Link>
            <p className="mt-1 text-[13.5px] text-[var(--ink-3)]">{line.variantLabel}</p>
            <p className="mt-1 text-[13px] text-[var(--ink-3)]">
              {line.compareAt && line.compareAt > line.price ? (
                <>
                  <span className="tabular-nums text-[var(--ink)]">
                    {money(line.price)}
                  </span>{" "}
                  <span className="line-through">{money(line.compareAt)}</span>
                </>
              ) : (
                <span className="tabular-nums text-[var(--ink)]">{money(line.price)}</span>
              )}
            </p>
          </div>

          <div className="text-right">
            <p className="text-[16px] font-medium tabular-nums text-[var(--ink)]">
              {money(line.price * line.quantity)}
            </p>
          </div>
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-4">
          {saved ? (
            <Button size="sm" variant="dark" onClick={() => moveToBag(line.id)}>
              Move to bag
            </Button>
          ) : (
            <QuantitySelector
              size="sm"
              value={line.quantity}
              max={line.maxStock}
              onChange={(qty) => setQty(line.id, qty)}
              label={`Quantity for ${line.name}`}
            />
          )}

          <div className="flex items-center gap-4 text-[13px]">
            {saved ? (
              <button
                type="button"
                onClick={() => removeSaved(line.id)}
                className="text-[var(--ink-3)] underline-offset-4 transition-colors hover:text-[var(--danger)] hover:underline"
              >
                Remove
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => saveForLater(line.id)}
                  className="text-[var(--ink-3)] underline-offset-4 transition-colors hover:text-[var(--ink)] hover:underline"
                >
                  Save for later
                </button>
                <button
                  type="button"
                  onClick={() => remove(line.id)}
                  className="text-[var(--ink-3)] underline-offset-4 transition-colors hover:text-[var(--danger)] hover:underline"
                >
                  Remove
                </button>
              </>
            )}
          </div>

          <p className="ml-auto text-[12.5px] text-[var(--ink-3)]">
            {line.maxStock > 12 ? "In stock" : `Only ${line.maxStock} left`}
          </p>
        </div>
      </div>
    </motion.li>
  );
}

export function CartView() {
  const { lines, saved, totals, hydrated } = useCart();
  const router = useRouter();
  const recommendations = products.filter((p) => p.featured && p.status === "active").slice(0, 4);

  if (!hydrated) {
    return (
      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6" role="status" aria-label="Loading bag">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-5">
              <div className="skeleton h-32 w-26 sm:h-40 sm:w-32" />
              <div className="flex-1 space-y-3 pt-2">
                <div className="skeleton h-4 w-1/2" />
                <div className="skeleton h-3 w-1/4" />
                <div className="skeleton h-9 w-28" />
              </div>
            </div>
          ))}
        </div>
        <div className="skeleton h-80 w-full" />
      </div>
    );
  }

  if (!lines.length) {
    return (
      <div className="space-y-16">
        <EmptyState
          icon={<ShoppingBag size={26} strokeWidth={1.4} />}
          title="Your bag is empty"
          description="Nothing here yet. Explore the collection — free shipping on orders over ₹999 and 30-day returns on everything."
          action={{ label: "Start shopping", href: "/shop" }}
          secondaryAction={{ label: "View best sellers", href: "/collections/best-sellers" }}
        />

        <section>
          <div className="mb-7 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow text-[var(--accent)]">Popular this week</p>
              <h2 className="h2 mt-3">A good place to start</h2>
            </div>
            <Link
              href="/shop"
              className="text-[11px] font-medium uppercase tracking-[0.16em] underline-offset-4 hover:text-[var(--accent)] hover:underline"
            >
              Shop all
            </Link>
          </div>
          <ProductGrid products={recommendations} columns={4} />
        </section>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-14">
      {/* lines */}
      <div>
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--ink)] pb-4">
          <h2 className="text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--ink)]">
            {totals.itemCount} {totals.itemCount === 1 ? "item" : "items"} in your bag
          </h2>
          <Link
            href="/shop"
            className="text-[13px] text-[var(--ink-3)] underline-offset-4 hover:text-[var(--ink)] hover:underline"
          >
            Continue shopping
          </Link>
        </div>

        <ul>
          <AnimatePresence initial={false}>
            {lines.map((line) => (
              <CartLineRow key={line.id} line={line} />
            ))}
          </AnimatePresence>
        </ul>

        {saved.length ? (
          <section className="mt-12">
            <h3 className="flex items-center gap-2 border-b border-[var(--line)] pb-4 text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--ink)]">
              <Heart size={14} strokeWidth={1.6} /> Saved for later ({saved.length})
            </h3>
            <ul>
              <AnimatePresence initial={false}>
                {saved.map((line) => (
                  <CartLineRow key={line.id} line={line} saved />
                ))}
              </AnimatePresence>
            </ul>
          </section>
        ) : null}
      </div>

      {/* summary */}
      <aside className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
        <div className="border border-[var(--line)] bg-[var(--surface)] p-6">
          <h2 className="mb-5 text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--ink)]">
            Order summary
          </h2>

          <OrderSummary>
            <Button
              fullWidth
              size="lg"
              variant="primary"
              onClick={() => router.push("/checkout")}
              iconEnd={<ArrowRight size={15} />}
            >
              Proceed to checkout
            </Button>
            <p className="text-center text-[12.5px] text-[var(--ink-3)]">
              or{" "}
              <Link
                href="/shop"
                className="text-[var(--ink)] underline underline-offset-4 hover:text-[var(--accent)]"
              >
                continue shopping
              </Link>
            </p>
          </OrderSummary>
        </div>

        <ul className="mt-5 space-y-3 rounded-[2px] border border-[var(--line)] bg-[var(--surface-2)] p-5 text-[13px] text-[var(--ink-2)]">
          <li className="flex items-center gap-2.5">
            <Lock size={14} strokeWidth={1.6} className="text-[var(--ink-3)]" /> 256-bit encrypted
            checkout
          </li>
          <li className="flex items-center gap-2.5">
            <Truck size={14} strokeWidth={1.6} className="text-[var(--ink-3)]" /> Dispatched
            within 24 hours
          </li>
          <li className="flex items-center gap-2.5">
            <ShieldCheck size={14} strokeWidth={1.6} className="text-[var(--ink-3)]" /> Free
            returns for 30 days
          </li>
        </ul>
      </aside>
    </div>
  );
}
