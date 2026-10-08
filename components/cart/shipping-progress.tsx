"use client";

import { motion } from "framer-motion";
import { Truck } from "lucide-react";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/tokens";
import { money } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ShippingProgress({
  progress,
  remaining,
  className,
}: {
  progress: number;
  remaining: number;
  className?: string;
}) {
  const reached = remaining <= 0;
  return (
    <div className={cn("rounded-[2px] border border-[var(--line)] bg-[var(--surface-2)] px-4 py-3", className)}>
      <div className="flex items-center gap-2.5">
        <Truck
          size={15}
          strokeWidth={1.6}
          className={reached ? "text-[var(--success)]" : "text-[var(--accent)]"}
        />
        <p className="text-[13px] text-[var(--ink-2)]">
          {reached ? (
            <>
              <span className="font-medium text-[var(--ink)]">Free shipping unlocked.</span>{" "}
              Nice one.
            </>
          ) : (
            <>
              <span className="font-medium text-[var(--ink)]">
                {money(remaining)}
              </span>{" "}
              away from free shipping
            </>
          )}
        </p>
      </div>
      <div className="mt-2.5 h-1 w-full overflow-hidden rounded-full bg-[var(--line)]">
        <motion.div
          className={cn(
            "h-full rounded-full",
            reached ? "bg-[var(--success)]" : "bg-[var(--accent)]",
          )}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(4, progress * 100)}%` }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>
      <p className="mt-2 text-[11.5px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
        Threshold {money(FREE_SHIPPING_THRESHOLD)}
      </p>
    </div>
  );
}
