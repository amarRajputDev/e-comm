"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { useCart, useUi } from "@/lib/store/providers";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/ui/quantity";
import { ShippingProgress } from "./shipping-progress";
import { money } from "@/lib/format";
import { EmptyState } from "@/components/ui/empty-state";
import { Img } from "@/components/ui/img";

export function CartDrawer() {
  const { cartOpen, closeCart } = useUi();
  const { lines, totals, setQty, remove, hydrated } = useCart();

  return (
    <Sheet
      open={cartOpen}
      onClose={closeCart}
      title="Your bag"
      description={
        lines.length
          ? `${totals.itemCount} item${totals.itemCount === 1 ? "" : "s"}`
          : "Nothing here yet"
      }
      width="max-w-[460px]"
      footer={
        lines.length ? (
          <div className="space-y-4">
            <ShippingProgress
              progress={totals.freeShippingProgress}
              remaining={totals.freeShippingRemaining}
            />
            <div className="flex items-baseline justify-between">
              <span className="text-[13px] uppercase tracking-[0.12em] text-[var(--ink-3)]">
                Subtotal
              </span>
              <span className="text-[19px] font-medium tabular-nums text-[var(--ink)]">
                {money(totals.subtotal)}
              </span>
            </div>
            <p className="-mt-2 text-[12px] text-[var(--ink-3)]">
              Taxes included. Shipping calculated at checkout.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <Button href="/cart" variant="outline" size="lg" fullWidth>
                View bag
              </Button>
              <Button href="/checkout" variant="primary" size="lg" fullWidth iconEnd={<ArrowRight size={15} />}>
                Checkout
              </Button>
            </div>
          </div>
        ) : null
      }
    >
      {!hydrated ? (
        <div className="space-y-4 p-6">
          {[0, 1].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="skeleton h-24 w-20 shrink-0" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="skeleton h-3.5 w-2/3" />
                <div className="skeleton h-3 w-1/3" />
                <div className="skeleton h-8 w-24" />
              </div>
            </div>
          ))}
        </div>
      ) : lines.length === 0 ? (
        <div className="p-6">
          <EmptyState
            compact
            icon={<ShoppingBag size={24} strokeWidth={1.4} />}
            title="Your bag is empty"
            description="Pieces you add will appear here — with free shipping over ₹999."
            action={{ label: "Start shopping", href: "/shop" }}
          />
        </div>
      ) : (
        <ul className="divide-y divide-[var(--line)] px-6">
          <AnimatePresence initial={false}>
            {lines.map((line) => (
              <motion.li
                key={line.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 24, height: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="flex gap-4 py-5"
              >
                <Link
                  href={`/product/${line.productSlug}`}
                  onClick={closeCart}
                  className="group h-28 w-24 shrink-0 overflow-hidden bg-[var(--surface-2)]"
                >
                  <Img sizes="96px" width={192} height={240}
                    src={line.image}
                    alt={line.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                <div className="flex min-w-0 flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link
                        href={`/product/${line.productSlug}`}
                        onClick={closeCart}
                        className="block truncate text-[14.5px] font-medium text-[var(--ink)] hover:text-[var(--accent)]"
                      >
                        {line.name}
                      </Link>
                      <p className="mt-0.5 truncate text-[12.5px] text-[var(--ink-3)]">
                        {line.variantLabel}
                      </p>
                    </div>
                    <button
                      type="button"
                      aria-label={`Remove ${line.name} from bag`}
                      onClick={() => remove(line.id)}
                      className="shrink-0 p-1 text-[var(--ink-3)] transition-colors hover:text-[var(--danger)]"
                    >
                      <Trash2 size={15} strokeWidth={1.5} />
                    </button>
                  </div>

                  <div className="mt-auto flex items-end justify-between gap-3 pt-3">
                    <QuantitySelector
                      size="sm"
                      value={line.quantity}
                      max={line.maxStock}
                      onChange={(qty) => setQty(line.id, qty)}
                      label={`Quantity for ${line.name}`}
                    />
                    <div className="text-right">
                      <p className="text-[15px] font-medium tabular-nums text-[var(--ink)]">
                        {money(line.price * line.quantity)}
                      </p>
                      {line.compareAt && line.compareAt > line.price ? (
                        <p className="text-[12px] tabular-nums text-[var(--ink-3)] line-through">
                          {money(line.compareAt * line.quantity)}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>

          <li className="py-4">
            <p className="text-[12.5px] text-[var(--ink-3)]">
              Need help?{" "}
              <Link href="/help" className="text-[var(--ink)] underline underline-offset-4">
                Talk to our team
              </Link>{" "}
              — {money(totals.subtotal)} saved so far: {money(totals.saved)}
            </p>
          </li>
        </ul>
      )}
    </Sheet>
  );
}
