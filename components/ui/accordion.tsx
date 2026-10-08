"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AccordionItem {
  id: string;
  title: string;
  content: ReactNode;
  meta?: ReactNode;
}

export function Accordion({
  items,
  defaultOpen,
  className,
  allowMultiple = false,
}: {
  items: AccordionItem[];
  defaultOpen?: string | string[];
  className?: string;
  allowMultiple?: boolean;
}) {
  const [open, setOpen] = useState<string[]>(
    defaultOpen ? (Array.isArray(defaultOpen) ? defaultOpen : [defaultOpen]) : [],
  );

  const toggle = (id: string) =>
    setOpen((prev) => {
      if (!prev.includes(id)) return allowMultiple ? [...prev, id] : [id];
      return prev.filter((x) => x !== id);
    });

  return (
    <div className={cn("divide-y divide-[var(--line)] border-y border-[var(--line)]", className)}>
      {items.map((item) => {
        const isOpen = open.includes(item.id);
        return (
          <div key={item.id}>
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={() => toggle(item.id)}
                className="group flex w-full items-center justify-between gap-4 py-5 text-left text-[14px] font-medium tracking-[0.02em] text-[var(--ink)] transition-colors hover:text-[var(--accent)]"
              >
                <span className="flex items-center gap-3">
                  {item.title}
                  {item.meta ? (
                    <span className="text-[12px] font-normal text-[var(--ink-3)]">{item.meta}</span>
                  ) : null}
                </span>
                <span className="relative grid h-6 w-6 shrink-0 place-items-center text-[var(--ink-3)] transition-colors group-hover:text-[var(--accent)]">
                  <Plus
                    size={15}
                    strokeWidth={1.5}
                    className={cn(
                      "absolute transition-transform duration-300 ease-out",
                      isOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100",
                    )}
                  />
                  <Minus
                    size={15}
                    strokeWidth={1.5}
                    className={cn(
                      "absolute transition-transform duration-300 ease-out",
                      isOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0",
                    )}
                  />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="content"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                  className="overflow-hidden"
                >
                  <div className="pb-6 pr-8 text-[14.5px] leading-relaxed text-[var(--ink-2)]">
                    {item.content}
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
