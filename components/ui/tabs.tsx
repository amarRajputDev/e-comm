"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  count?: number;
}

export function Tabs({
  tabs,
  value,
  onChange,
  className,
  layoutId = "tabs",
}: {
  tabs: TabItem[];
  value: string;
  onChange: (id: string) => void;
  className?: string;
  layoutId?: string;
}) {
  return (
    <div
      role="tablist"
      className={cn(
        "no-scrollbar -mx-1 flex items-center gap-1 overflow-x-auto border-b border-[var(--line)]",
        className,
      )}
    >
      {tabs.map((tab) => {
        const active = tab.id === value;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(tab.id)}
            className={cn(
              "relative shrink-0 px-3 py-3 text-[12px] font-medium uppercase tracking-[0.12em] transition-colors duration-200",
              active ? "text-[var(--ink)]" : "text-[var(--ink-3)] hover:text-[var(--ink-2)]",
            )}
          >
            {tab.label}
            {typeof tab.count === "number" ? (
              <span className="ml-1.5 text-[11px] tabular-nums text-[var(--ink-3)]">
                {tab.count}
              </span>
            ) : null}
            {active ? (
              <motion.span
                layoutId={layoutId}
                className="absolute inset-x-0 -bottom-px h-[2px] bg-[var(--accent)]"
                transition={{ type: "spring", stiffness: 480, damping: 40 }}
              />
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
