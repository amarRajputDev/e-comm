"use client";

import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type BadgeTone = "neutral" | "accent" | "success" | "warning" | "danger" | "info" | "dark";

const tones: Record<BadgeTone, string> = {
  neutral: "bg-[var(--surface-2)] text-[var(--ink-2)] border-[var(--line)]",
  accent: "bg-[var(--accent-tint)] text-[var(--accent)] border-transparent",
  success: "bg-[var(--success)]/12 text-[var(--success)] border-transparent",
  warning: "bg-[var(--warning)]/14 text-[var(--warning)] border-transparent",
  danger: "bg-[var(--danger)]/12 text-[var(--danger)] border-transparent",
  info: "bg-[var(--info)]/12 text-[var(--info)] border-transparent",
  dark: "bg-[var(--ink)] text-[var(--bg)] border-transparent",
};

export function Badge({
  children,
  tone = "neutral",
  className,
  solid,
}: {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
  solid?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-[2px] border px-2 py-[3px] text-[10.5px] font-medium uppercase tracking-[0.12em] leading-none",
        tones[tone],
        solid && tone === "accent" && "bg-[var(--accent)] text-[var(--on-accent)]",
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, BadgeTone> = {
    processing: "info",
    confirmed: "info",
    packed: "info",
    shipped: "info",
    out_for_delivery: "warning",
    delivered: "success",
    cancelled: "danger",
    returned: "warning",
    paid: "success",
    pending: "warning",
    refunded: "neutral",
    failed: "danger",
    active: "success",
    vip: "accent",
    new: "info",
    blocked: "danger",
    approved: "success",
    draft: "neutral",
    archived: "neutral",
    low_stock: "warning",
    in_stock: "success",
    out_of_stock: "danger",
  };
  const label = status.replace(/_/g, " ");
  return <Badge tone={map[status] ?? "neutral"}>{label}</Badge>;
}
