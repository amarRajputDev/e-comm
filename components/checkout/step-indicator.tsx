"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Step {
  id: string;
  label: string;
}

export const CHECKOUT_STEPS: Step[] = [
  { id: "information", label: "Information" },
  { id: "shipping", label: "Shipping" },
  { id: "payment", label: "Payment" },
  { id: "confirmation", label: "Confirmation" },
];

export function StepIndicator({
  current,
  onStepClick,
}: {
  current: number;
  onStepClick?: (index: number) => void;
}) {
  return (
    <nav aria-label="Checkout progress" className="flex items-center">
      {CHECKOUT_STEPS.map((step, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={step.id} className="flex flex-1 items-center last:flex-none">
            <button
              type="button"
              disabled={!done || !onStepClick}
              onClick={() => done && onStepClick?.(i)}
              className={cn(
                "flex items-center gap-2.5 text-left transition-colors",
                !done && !active && "cursor-default",
              )}
            >
              <span
                className={cn(
                  "grid h-7 w-7 shrink-0 place-items-center rounded-full border text-[12px] tabular-nums transition-all duration-300",
                  done && "border-[var(--success)] bg-[var(--success)] text-white",
                  active && "border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]",
                  !done && !active && "border-[var(--line-strong)] text-[var(--ink-3)]",
                )}
              >
                {done ? <Check size={14} strokeWidth={2.5} /> : i + 1}
              </span>
              <span
                className={cn(
                  "hidden text-[12.5px] uppercase tracking-[0.12em] sm:block",
                  active ? "text-[var(--ink)]" : "text-[var(--ink-3)]",
                )}
              >
                {step.label}
              </span>
            </button>

            {i < CHECKOUT_STEPS.length - 1 ? (
              <span
                aria-hidden
                className={cn(
                  "mx-3 h-px flex-1 transition-colors duration-500",
                  i < current ? "bg-[var(--success)]" : "bg-[var(--line-strong)]",
                )}
              />
            ) : null}
          </div>
        );
      })}
    </nav>
  );
}
