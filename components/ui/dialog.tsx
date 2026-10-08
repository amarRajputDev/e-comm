"use client";

import { useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  const widths = { sm: "max-w-sm", md: "max-w-lg", lg: "max-w-2xl" } as const;

  return (
    <AnimatePresence>
      {open ? (
        <div
          className="fixed inset-0 z-[95] grid place-items-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dialog-title"
        >
          <motion.button
            type="button"
            aria-label="Close dialog"
            className="absolute inset-0 h-full w-full bg-[var(--overlay)] backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24 }}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.99 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "relative z-10 w-full rounded-[4px] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-pop)]",
              widths[size],
            )}
          >
            <header className="flex items-start justify-between gap-6 border-b border-[var(--line)] px-6 py-5">
              <div>
                <h2 id="dialog-title" className="text-[17px] font-medium tracking-[-0.01em]">
                  {title}
                </h2>
                {description ? (
                  <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--ink-3)]">
                    {description}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="-mr-2 -mt-1 grid h-8 w-8 place-items-center rounded-full text-[var(--ink-3)] transition-colors hover:bg-[var(--ink)]/[0.06] hover:text-[var(--ink)]"
              >
                <X size={17} strokeWidth={1.5} />
              </button>
            </header>
            <div className="px-6 py-5 text-[14.5px] leading-relaxed text-[var(--ink-2)]">
              {children}
            </div>
            {footer ? (
              <footer className="flex flex-wrap items-center justify-end gap-3 border-t border-[var(--line)] px-6 py-4">
                {footer}
              </footer>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
