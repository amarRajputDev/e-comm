"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function Stars({
  value,
  size = 14,
  className,
}: {
  value: number;
  size?: number;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(1, value / 5)) * 100;
  return (
    <span
      className={cn("relative inline-flex", className)}
      role="img"
      aria-label={`Rated ${value} out of 5`}
    >
      <span className="flex gap-[2px] text-[var(--line-strong)]">
        {[0, 1, 2, 3, 4].map((i) => (
          <Star key={i} size={size} strokeWidth={1.5} fill="currentColor" />
        ))}
      </span>
      <span
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${pct}%` }}
        aria-hidden
      >
        <span className="flex gap-[2px] text-[var(--accent)]">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={size} strokeWidth={1.5} fill="currentColor" />
          ))}
        </span>
      </span>
    </span>
  );
}

export function RatingSummary({
  value,
  count,
  size = 14,
  className,
}: {
  value: number;
  count: number;
  size?: number;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <Stars value={value} size={size} />
      <span className="text-[13px] tabular-nums text-[var(--ink-3)]">
        {value.toFixed(1)}
        <span className="sr-only"> out of 5 from </span>
        <span aria-hidden> · </span>
        {count.toLocaleString("en-IN")} reviews
      </span>
    </span>
  );
}
