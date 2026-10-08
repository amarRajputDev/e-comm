"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Sheet({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  side = "right",
  width = "max-w-[440px]",
  bare,
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
  side?: "right" | "left" | "bottom";
  width?: string;
  bare?: boolean;
}) {
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const nodes = panelRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (!nodes.length) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const t = window.setTimeout(() => {
      panelRef.current
        ?.querySelector<HTMLElement>("input, button, [tabindex]:not([tabindex='-1'])")
        ?.focus();
    }, 120);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      window.clearTimeout(t);
    };
  }, [open, onClose]);

  const from =
    side === "bottom"
      ? { x: 0, y: "100%" }
      : side === "left"
        ? { x: "-100%", y: 0 }
        : { x: "100%", y: 0 };

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-[90]" role="dialog" aria-modal="true" aria-label={title}>
          <motion.button
            type="button"
            aria-label="Close"
            className="absolute inset-0 h-full w-full bg-[var(--overlay)] backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.28 }}
            onClick={onClose}
          />
          <motion.div
            ref={panelRef}
            initial={from}
            animate={{ x: 0, y: 0 }}
            exit={from}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className={cn(
              "absolute flex flex-col bg-[var(--surface)] shadow-[var(--shadow-drawer)]",
              side === "bottom"
                ? "inset-x-0 bottom-0 max-h-[88vh] rounded-t-[4px]"
                : side === "left"
                  ? "inset-y-0 left-0 h-full"
                  : "inset-y-0 right-0 h-full",
              side !== "bottom" && width,
            )}
          >
            {!bare ? (
              <header className="flex items-start justify-between gap-4 border-b border-[var(--line)] px-6 py-5">
                <div>
                  {title ? <h2 className="h3 text-[18px]">{title}</h2> : null}
                  {description ? (
                    <p className="mt-1 text-[13px] text-[var(--ink-3)]">{description}</p>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close panel"
                  className="-mr-2 -mt-1 grid h-9 w-9 place-items-center rounded-full text-[var(--ink-3)] transition-colors hover:bg-[var(--ink)]/[0.06] hover:text-[var(--ink)]"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </header>
            ) : (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close panel"
                className="absolute right-4 top-4 z-10 grid h-9 w-9 place-items-center rounded-full bg-[var(--surface)]/80 text-[var(--ink-2)] backdrop-blur transition hover:text-[var(--ink)]"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            )}
            <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
            {footer ? (
              <footer className="border-t border-[var(--line)] bg-[var(--surface)] px-6 py-5">
                {footer}
              </footer>
            ) : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}
