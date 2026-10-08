"use client";

import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  size = "md",
  label = "Quantity",
  className,
}: {
  value: number;
  onChange: (next: number) => void;
  min?: number;
  max?: number;
  size?: "sm" | "md";
  label?: string;
  className?: string;
}) {
  const btn =
    "grid h-full w-9 place-items-center text-[var(--ink-2)] transition-colors hover:bg-[var(--ink)]/[0.05] hover:text-[var(--ink)] disabled:opacity-30 disabled:hover:bg-transparent";
  return (
    <div
      role="group"
      aria-label={label}
      className={cn(
        "inline-flex h-11 items-center justify-between rounded-[2px] border border-[var(--line-strong)] bg-[var(--surface)]",
        size === "sm" && "h-9",
        className,
      )}
    >
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <Minus size={14} strokeWidth={1.75} />
      </button>
      <span
        aria-live="polite"
        className="min-w-8 text-center text-[14px] font-medium tabular-nums"
      >
        {value}
      </span>
      <button
        type="button"
        className={btn}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <Plus size={14} strokeWidth={1.75} />
      </button>
    </div>
  );
}
