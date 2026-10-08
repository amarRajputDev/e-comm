"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import type { NavItem } from "@/lib/data/site";
import { Img } from "@/components/ui/img";
import { cn } from "@/lib/utils";

export function MegaMenu({
  item,
  open,
  onClose,
}: {
  item: NavItem | null;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {open && item?.children ? (
        <motion.div
          key={item.label}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-x-0 top-full hidden overflow-hidden border-b border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-lift)] lg:block"
          onMouseLeave={onClose}
        >
          <div className="container-x">
            <div className="grid grid-cols-[repeat(3,minmax(0,1fr))_1.35fr] gap-x-10 gap-y-8 py-10">
              {item.children.map((group, gi) => (
                <motion.div
                  key={group.heading}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.04 + gi * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                >
                  <p className="eyebrow mb-4 text-[var(--ink-3)]">{group.heading}</p>
                  <ul className="space-y-2.5">
                    {group.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          onClick={onClose}
                          className="group/link inline-flex items-center gap-1.5 text-[14.5px] text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
                        >
                          {link.label}
                          <span className="h-px w-0 bg-[var(--accent)] transition-all duration-300 group-hover/link:w-4" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}

              {item.featured ? (
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.16, duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                >
                  <Link
                    href={item.featured.href}
                    onClick={onClose}
                    className="group/feat block overflow-hidden bg-[var(--surface-2)]"
                  >
                    <div className="relative aspect-16/10 overflow-hidden">
                      <Img
                        src={item.featured.image}
                        alt={item.featured.title}
                        width={900}
                        height={560}
                        sizes="420px"
                        className="h-full w-full transition-transform duration-[700ms] ease-out group-hover/feat:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                    </div>
                    <div className="flex items-end justify-between gap-4 px-4 py-4">
                      <div>
                        <p className="eyebrow text-[var(--accent)]">{item.featured.subtitle}</p>
                        <p className="mt-1.5 text-[15px] font-medium text-[var(--ink)]">
                          {item.featured.title}
                        </p>
                      </div>
                      <ArrowUpRight
                        size={16}
                        className="shrink-0 text-[var(--ink-3)] transition-transform duration-300 group-hover/feat:translate-x-0.5 group-hover/feat:-translate-y-0.5 group-hover/feat:text-[var(--accent)]"
                      />
                    </div>
                  </Link>
                </motion.div>
              ) : null}
            </div>

            {item.promo ? (
              <div className="flex items-center justify-between border-t border-[var(--line)] py-4">
                <p className="text-[13px] text-[var(--ink-3)]">
                  <span className="eyebrow mr-3 text-[var(--accent)]">{item.promo.eyebrow}</span>
                  {item.promo.title}
                </p>
                <Link
                  href={item.promo.href}
                  onClick={onClose}
                  className="text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--ink)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:underline"
                >
                  Shop now
                </Link>
              </div>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export function MegaBackdrop({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className={cn("fixed inset-0 z-[75] bg-[var(--overlay)]/45")}
          onClick={onClose}
          aria-hidden
        />
      ) : null}
    </AnimatePresence>
  );
}
