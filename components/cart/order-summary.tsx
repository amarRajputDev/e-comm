"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Tag, Check, X } from "lucide-react";
import { useCart } from "@/lib/store/providers";
import { money } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ShippingProgress } from "./shipping-progress";

export function PromoField({ className }: { className?: string }) {
  const { applyCode, removeCode, couponCode } = useCart();
  const [value, setValue] = useState(couponCode);

  const apply = () => {
    if (!value.trim()) return;
    applyCode(value.trim());
  };

  return (
    <div className={className}>
      <label
        htmlFor="promo"
        className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--ink-3)]"
      >
        Promo code
      </label>
      <div className="mt-2 flex gap-2">
        <div className="relative flex-1">
          <Tag
            size={15}
            strokeWidth={1.6}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-3)]"
          />
          <input
            id="promo"
            value={value}
            onChange={(e) => setValue(e.target.value.toUpperCase())}
            placeholder="NOIR10"
            className="h-11 w-full rounded-[2px] border border-[var(--line-strong)] bg-[var(--surface)] pl-9 pr-3 text-[14px] uppercase tracking-[0.06em] text-[var(--ink)] placeholder:normal-case placeholder:tracking-normal placeholder:text-[var(--ink-3)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/40"
          />
        </div>
        <button
          type="button"
          onClick={() => (couponCode ? (removeCode(), setValue("")) : apply())}
          className={cn(
            "h-11 rounded-[2px] px-5 text-[11px] font-medium uppercase tracking-[0.14em] transition-colors",
            couponCode
              ? "border border-[var(--line-strong)] text-[var(--ink-2)] hover:border-[var(--ink)]"
              : "bg-[var(--ink)] text-[var(--bg)] hover:bg-[var(--ink-2)]",
          )}
        >
          {couponCode ? "Remove" : "Apply"}
        </button>
      </div>

      <AnimatePresence>
        {couponCode ? (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-1.5 overflow-hidden pt-2 text-[12.5px] text-[var(--success)]"
          >
            <Check size={13} strokeWidth={2} /> {couponCode} applied
            <button
              type="button"
              aria-label="Remove promo code"
              onClick={() => {
                removeCode();
                setValue("");
              }}
              className="ml-1 text-[var(--ink-3)] hover:text-[var(--danger)]"
            >
              <X size={13} />
            </button>
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function OrderSummary({
  children,
  showPromo = true,
  showProgress = true,
  className,
}: {
  children?: ReactNode;
  showPromo?: boolean;
  showProgress?: boolean;
  className?: string;
}) {
  const { totals, couponCode } = useCart();

  return (
    <div className={cn("space-y-5", className)}>
      {showProgress ? (
        <ShippingProgress
          progress={totals.freeShippingProgress}
          remaining={totals.freeShippingRemaining}
        />
      ) : null}

      <dl className="space-y-3 text-[14px]">
        <div className="flex items-baseline justify-between">
          <dt className="text-[var(--ink-3)]">
            Subtotal ({totals.itemCount} {totals.itemCount === 1 ? "item" : "items"})
          </dt>
          <dd className="tabular-nums text-[var(--ink)]">{money(totals.subtotal)}</dd>
        </div>

        {totals.discount > 0 ? (
          <div className="flex items-baseline justify-between text-[var(--success)]">
            <dt>Discount {couponCode ? `(${couponCode})` : ""}</dt>
            <dd className="tabular-nums">−{money(totals.discount)}</dd>
          </div>
        ) : null}

        <div className="flex items-baseline justify-between">
          <dt className="text-[var(--ink-3)]">Shipping</dt>
          <dd className="tabular-nums text-[var(--ink)]">
            {totals.shipping === 0 ? (
              <span className="text-[var(--success)]">Free</span>
            ) : (
              money(totals.shipping)
            )}
          </dd>
        </div>

        <div className="flex items-baseline justify-between text-[13px]">
          <dt className="text-[var(--ink-3)]">of which GST (18%)</dt>
          <dd className="tabular-nums text-[var(--ink-3)]">{money(totals.tax)}</dd>
        </div>

        <div className="flex items-baseline justify-between border-t border-[var(--line)] pt-4">
          <dt className="text-[15px] font-medium text-[var(--ink)]">Total</dt>
          <dd className="text-[21px] font-medium tabular-nums text-[var(--ink)]">
            {money(totals.total)}
          </dd>
        </div>

        {totals.saved > 0 ? (
          <p className="text-right text-[12.5px] text-[var(--success)]">
            You’re saving {money(totals.saved)} on this order
          </p>
        ) : null}
      </dl>

      {showPromo ? <PromoField /> : null}

      {children}
    </div>
  );
}
