"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Sparkline } from "./charts";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  delta,
  hint,
  icon,
  spark,
  href,
}: {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
  icon?: ReactNode;
  spark?: number[];
  href?: string;
}) {
  const positive = (delta ?? 0) >= 0;
  const classes = cn(
    "flex h-full flex-col justify-between border border-[var(--line)] bg-[var(--surface)] p-4",
    href && "transition-colors hover:border-[var(--ink-3)]",
  );

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[11.5px] font-medium uppercase tracking-[0.12em] text-[var(--ink-3)]">
          {label}
        </p>
        {icon ? (
          <span className="grid h-7 w-7 place-items-center rounded-[3px] bg-[var(--surface-2)] text-[var(--ink-3)]">
            {icon}
          </span>
        ) : null}
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <p className="text-[26px] font-semibold leading-none tracking-[-0.02em] tabular-nums text-[var(--ink)]">
            {value}
          </p>
          {delta !== undefined ? (
            <p
              className={cn(
                "mt-2 inline-flex items-center gap-1 text-[12px] font-medium tabular-nums",
                positive ? "text-[var(--success)]" : "text-[var(--danger)]",
              )}
            >
              {positive ? (
                <ArrowUpRight size={13} strokeWidth={2} />
              ) : (
                <ArrowDownRight size={13} strokeWidth={2} />
              )}
              {Math.abs(delta)}%
              <span className="font-normal text-[var(--ink-3)]">
                {hint ?? "vs last month"}
              </span>
            </p>
          ) : null}
        </div>

        {spark?.length ? <Sparkline values={spark} /> : null}
      </div>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
