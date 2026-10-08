"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { primaryNav } from "@/lib/data/site";
import { useCart, useSession, useUi, useWishlist } from "@/lib/store/providers";
import { cn } from "@/lib/utils";
import { AnnouncementBar } from "./announcement-bar";
import { MegaBackdrop, MegaMenu } from "./mega-menu";
import { MobileNav } from "./mobile-nav";
import { Wordmark } from "./logo";
import { ThemeToggle } from "./theme-toggle";

function IconButton({
  label,
  onClick,
  href,
  active,
  badge,
  className,
  children,
}: {
  label: string;
  onClick?: () => void;
  href?: string;
  active?: boolean;
  badge?: number;
  className?: string;
  children: React.ReactNode;
}) {
  const inner = (
    <span className="relative grid h-10 w-10 place-items-center rounded-full transition-colors duration-200 hover:bg-current/10">
      {children}
      <AnimatePresence>
        {badge && badge > 0 ? (
          <motion.span
            key="badge"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 520, damping: 24 }}
            className="absolute -right-0.5 -top-0.5 grid min-w-[17px] place-items-center rounded-full bg-[var(--accent)] px-1 py-px text-[10px] font-semibold leading-[15px] text-[var(--on-accent)] tabular-nums"
          >
            {badge > 9 ? "9+" : badge}
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  );

  const cls = cn(
    "grid h-10 w-10 place-items-center transition-opacity",
    active && "opacity-60",
    className,
  );

  if (href) {
    return (
      <Link href={href} aria-label={label} className={cls}>
        {inner}
      </Link>
    );
  }
  return (
    <button type="button" aria-label={label} onClick={onClick} className={cls}>
      {inner}
    </button>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mega, setMega] = useState<string | null>(null);
  const closeTimer = useRef<number | null>(null);
  const { openCart, openSearch, setNavOpen } = useUi();
  const { totals, hydrated } = useCart();
  const { ids, hydrated: wishHydrated } = useWishlist();
  const { user } = useSession();

  const transparent = pathname === "/" && !scrolled;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMega(null);
  }, [pathname]);

  const cancelClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
  };

  const closeMega = () => {
    cancelClose();
    setMega(null);
  };

  const openMega = (label: string) => {
    cancelClose();
    setMega(label);
  };

  /* Leaving the nav schedules a close, but entering the panel (which sits
     outside the nav) must cancel it — otherwise the dropdown shuts while the
     pointer is still travelling towards a link. */
  const scheduleClose = () => {
    cancelClose();
    closeTimer.current = window.setTimeout(() => setMega(null), 260);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMega();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeItem = primaryNav.find((i) => i.label === mega) ?? null;

  return (
    <>
      <MegaBackdrop open={Boolean(mega)} onClose={() => setMega(null)} />
      <div className="fixed inset-x-0 top-0 z-[80]">
        <AnnouncementBar />

        <header
          className={cn(
            "relative h-16 transition-[background-color,border-color,box-shadow,backdrop-filter] duration-300 ease-out",
            transparent
              ? "border-b border-white/10 bg-transparent"
              : "border-b border-[var(--line)] bg-[var(--header-bg)] shadow-[0_1px_0_rgba(0,0,0,0.02)] backdrop-blur-xl",
          )}
        >
          <div className="container-x flex h-full items-center justify-between gap-6">
            {/* left: logo + desktop nav */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                aria-label="ATELIER NOIR — home"
                className={cn(
                  "group shrink-0 transition-colors duration-300",
                  transparent ? "text-white" : "text-[var(--ink)]",
                )}
              >
                <Wordmark />
              </Link>

              <nav
                aria-label="Primary"
                className="hidden items-center gap-7 lg:flex"
                onMouseLeave={scheduleClose}
              >
                {primaryNav.map((item) => (
                  <div key={item.label} onMouseEnter={() => (item.children ? openMega(item.label) : null)}>
                    <Link
                      href={item.href}
                      aria-haspopup={item.children ? "true" : undefined}
                      aria-expanded={item.children ? mega === item.label : undefined}
                      onFocus={() => (item.children ? openMega(item.label) : null)}
                      className={cn(
                        "relative flex h-16 items-center text-[12.5px] font-medium uppercase tracking-[0.14em] transition-colors duration-200",
                        transparent ? "text-white/85 hover:text-white" : "text-[var(--ink-2)] hover:text-[var(--ink)]",
                        pathname === item.href && !transparent && "text-[var(--ink)]",
                      )}
                    >
                      {item.label}
                      <span
                        className={cn(
                          "absolute inset-x-0 bottom-4 h-px origin-left scale-x-0 bg-[var(--accent)] transition-transform duration-300 ease-out",
                          (mega === item.label || pathname === item.href) && "scale-x-100",
                        )}
                      />
                    </Link>
                  </div>
                ))}
              </nav>
            </div>

            {/* right: actions */}
            <div
              className={cn(
                "flex items-center gap-0.5 transition-colors duration-300",
                transparent ? "text-white" : "text-[var(--ink)]",
              )}
              onMouseLeave={scheduleClose}
            >
              <IconButton label="Search" onClick={openSearch}>
                <Search size={18} strokeWidth={1.5} />
              </IconButton>
              <IconButton
                label="Wishlist"
                href="/wishlist"
                badge={wishHydrated ? ids.length : 0}
                className="hidden sm:grid"
              >
                <Heart size={18} strokeWidth={1.5} />
              </IconButton>
              <IconButton
                label={user ? "Account" : "Sign in"}
                href={user ? "/account" : "/auth/login"}
                className="hidden sm:grid"
              >
                <User size={18} strokeWidth={1.5} />
              </IconButton>
              <IconButton label="Cart" onClick={openCart} badge={hydrated ? totals.itemCount : 0}>
                <ShoppingBag size={18} strokeWidth={1.5} />
              </IconButton>
              <div className={cn("hidden md:grid", transparent && "text-white")}>
                <ThemeToggle />
              </div>
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setNavOpen(true)}
                className="grid h-10 w-10 place-items-center lg:hidden"
              >
                <Menu size={20} strokeWidth={1.5} />
              </button>
            </div>
          </div>

          <MegaMenu
          item={activeItem}
          open={Boolean(mega)}
          onEnter={cancelClose}
          onClose={closeMega}
        />
        </header>

        <MobileNav />
      </div>
    </>
  );
}
