"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
  compact,
  className,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: { label: string; onClick?: () => void; href?: string };
  secondaryAction?: { label: string; onClick?: () => void; href?: string };
  compact?: boolean;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "flex flex-col items-center justify-center rounded-[2px] border border-dashed border-[var(--line-strong)] bg-[var(--surface)] text-center",
        compact ? "px-6 py-10" : "px-6 py-16",
        className,
      )}
    >
      {icon ? (
        <div className="mb-5 grid h-14 w-14 place-items-center rounded-full bg-[var(--surface-2)] text-[var(--ink-3)]">
          {icon}
        </div>
      ) : null}
      <h3 className="h3 max-w-md text-[var(--ink)]">{title}</h3>
      {description ? (
        <p className="mt-2.5 max-w-sm text-[14.5px] leading-relaxed text-[var(--ink-3)]">
          {description}
        </p>
      ) : null}
      {action || secondaryAction ? (
        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          {action ? (
            <Button href={action.href} onClick={action.onClick} variant="primary" size="md">
              {action.label}
            </Button>
          ) : null}
          {secondaryAction ? (
            <Button
              href={secondaryAction.href}
              onClick={secondaryAction.onClick}
              variant="outline"
              size="md"
            >
              {secondaryAction.label}
            </Button>
          ) : null}
        </div>
      ) : null}
    </motion.div>
  );
}
