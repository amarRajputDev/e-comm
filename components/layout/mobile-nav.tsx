"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Heart, Search, PackageSearch, User } from "lucide-react";
import { primaryNav } from "@/lib/data/site";
import { useUi, useWishlist } from "@/lib/store/providers";
import { Sheet } from "@/components/ui/sheet";
import { ThemeToggle } from "./theme-toggle";
import { Wordmark } from "./logo";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const { navOpen, setNavOpen, openSearch } = useUi();
  const { ids } = useWishlist();
  const pathname = usePathname();
  const [expanded, setExpanded] = useState<string | null>("Shop");

  useEffect(() => {
    setNavOpen(false);
  }, [pathname, setNavOpen]);

  return (
    <Sheet open={navOpen} onClose={() => setNavOpen(false)} side="left" width="max-w-[400px]" bare>
      <div className="px-6 pb-10 pt-5">
        <Link
          href="/"
          onClick={() => setNavOpen(false)}
          className="mb-7 inline-block text-[var(--ink)]"
        >
          <Wordmark />
        </Link>

        <nav aria-label="Mobile" className="border-t border-[var(--line)]">
          {primaryNav.map((item) => {
            const hasChildren = Boolean(item.children?.length);
            const isOpen = expanded === item.label && hasChildren;
            return (
              <div key={item.label} className="border-b border-[var(--line)]">
                <div className="flex items-center justify-between">
                  <Link
                    href={item.href}
                    onClick={() => setNavOpen(false)}
                    className="flex-1 py-4 text-[15px] font-medium tracking-[-0.01em] text-[var(--ink)]"
                  >
                    {item.label}
                  </Link>
                  {hasChildren ? (
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      aria-label={`Toggle ${item.label} submenu`}
                      onClick={() => setExpanded(isOpen ? null : item.label)}
                      className="grid h-9 w-9 place-items-center text-[var(--ink-3)]"
                    >
                      <ChevronDown
                        size={17}
                        strokeWidth={1.5}
                        className={cn(
                          "transition-transform duration-300",
                          isOpen && "rotate-180",
                        )}
                      />
                    </button>
                  ) : null}
                </div>

                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-4 pb-5 pl-1">
                        {item.children?.map((group) => (
                          <div key={group.heading}>
                            <p className="eyebrow mb-2 text-[var(--accent)]">{group.heading}</p>
                            <ul className="space-y-1.5">
                              {group.links.map((link) => (
                                <li key={link.label}>
                                  <Link
                                    href={link.href}
                                    onClick={() => setNavOpen(false)}
                                    className="block py-1 text-[14.5px] text-[var(--ink-2)]"
                                  >
                                    {link.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>
            );
          })}
        </nav>

        <div className="mt-7 space-y-1">
          {(
            [
              { label: "Search", href: null, icon: Search, onClick: () => openSearch() },
              { label: "Wishlist", href: "/wishlist", icon: Heart, badge: ids.length },
              { label: "Track your order", href: "/account/orders", icon: PackageSearch },
              { label: "Account", href: "/account", icon: User },
            ] as {
              label: string;
              href: string | null;
              icon: typeof Search;
              onClick?: () => void;
              badge?: number;
            }[]
          ).map((item) => (
            <Link
              key={item.label}
              href={item.href ?? "#"}
              onClick={(e) => {
                if (item.onClick) {
                  e.preventDefault();
                  item.onClick();
                }
                setNavOpen(false);
              }}
              className="flex items-center justify-between rounded-[2px] px-3 py-3.5 text-[14.5px] text-[var(--ink-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
            >
              <span className="flex items-center gap-3">
                <item.icon size={17} strokeWidth={1.5} className="text-[var(--ink-3)]" />
                {item.label}
              </span>
              {item.badge ? (
                <span className="grid min-w-[20px] place-items-center rounded-full bg-[var(--accent)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--on-accent)]">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          ))}
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-[var(--line)] pt-5">
          <p className="text-[12.5px] text-[var(--ink-3)]">Free shipping over ₹999</p>
          <ThemeToggle />
        </div>
      </div>
    </Sheet>
  );
}
