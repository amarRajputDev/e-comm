"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Info, X, AlertTriangle } from "lucide-react";
import { useUi } from "@/lib/store/providers";
import { cn } from "@/lib/utils";

const icons = {
  success: CheckCircle2,
  error: AlertTriangle,
  info: Info,
  default: null,
};

export function Toaster() {
  const { toasts, dismissToast } = useUi();

  return (
    <div
      aria-live="polite"
      aria-atomic="false"
      className="pointer-events-none fixed inset-x-4 bottom-4 z-[120] flex flex-col items-center gap-2.5 sm:inset-x-auto sm:right-6 sm:bottom-6 sm:items-end"
    >
      <AnimatePresence initial={false}>
        {toasts.map((t) => {
          const tone = t.tone ?? "default";
          const Icon = icons[tone];
          return (
            <motion.div
              key={t.id}
              layout
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-[3px] border border-[var(--line)] bg-[var(--surface)] px-4 py-3.5 shadow-[var(--shadow-pop)]"
              role="status"
            >
              {Icon ? (
                <span
                  className={cn(
                    "mt-0.5 shrink-0",
                    tone === "success" && "text-[var(--success)]",
                    tone === "error" && "text-[var(--danger)]",
                    tone === "info" && "text-[var(--info)]",
                  )}
                >
                  <Icon size={17} strokeWidth={1.75} />
                </span>
              ) : null}
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-medium text-[var(--ink)]">{t.title}</p>
                {t.description ? (
                  <p className="mt-0.5 truncate text-[13px] text-[var(--ink-3)]">
                    {t.description}
                  </p>
                ) : null}
                {t.action?.onClick || t.action?.href ? (
                  t.action.href ? (
                    <Link
                      href={t.action.href}
                      className="mt-1.5 inline-block text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--accent)] underline-offset-4 hover:underline"
                    >
                      {t.action.label}
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        t.action?.onClick?.();
                        dismissToast(t.id);
                      }}
                      className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--accent)] underline-offset-4 hover:underline"
                    >
                      {t.action.label}
                    </button>
                  )
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => dismissToast(t.id)}
                aria-label="Dismiss notification"
                className="-mr-1 -mt-1 grid h-7 w-7 shrink-0 place-items-center rounded-full text-[var(--ink-3)] transition-colors hover:bg-[var(--ink)]/[0.06]"
              >
                <X size={14} strokeWidth={1.75} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
