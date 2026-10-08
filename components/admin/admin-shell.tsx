"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Tags,
  Boxes,
  ShoppingCart,
  Users,
  Star,
  Ticket,
  Image as ImageIcon,
  LayoutTemplate,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  Bell,
  PanelLeftClose,
  PanelLeftOpen,
  Search,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
  Lock,
} from "lucide-react";
import { adminNotifications } from "@/lib/data/site";
import { useSession, useTheme, useUi } from "@/lib/store/providers";
import { LogoMark } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";
import { formatDateLong } from "@/lib/format";

interface SidebarItem {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  badge?: string;
}

const GROUPS: { label: string; items: SidebarItem[] }[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Catalogue",
    items: [
      { href: "/admin/products", label: "Products", icon: Package },
      { href: "/admin/categories", label: "Categories", icon: Tags },
      { href: "/admin/inventory", label: "Inventory", icon: Boxes },
    ],
  },
  {
    label: "Sales",
    items: [
      { href: "/admin/orders", label: "Orders", icon: ShoppingCart, badge: "12" },
      { href: "/admin/customers", label: "Customers", icon: Users },
      { href: "/admin/reviews", label: "Reviews", icon: Star, badge: "3" },
    ],
  },
  {
    label: "Marketing",
    items: [
      { href: "/admin/content", label: "Content", icon: LayoutTemplate },
      { href: "/admin/coupons", label: "Coupons", icon: Ticket },
      { href: "/admin/banners", label: "Banners", icon: ImageIcon },
    ],
  },
  {
    label: "System",
    items: [{ href: "/admin/settings", label: "Settings", icon: SettingsIcon }],
  },
];

function SidebarNav({
  collapsed,
  onNavigate,
}: {
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex h-full flex-col overflow-y-auto px-3 py-5" aria-label="Admin">
      <Link
        href="/admin"
        onClick={onNavigate}
        className={cn(
          "mb-6 flex items-center gap-3 px-2 text-[var(--ink)]",
          collapsed && "justify-center",
        )}
      >
        <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[3px] bg-[var(--ink)] text-[var(--bg)]">
          <LogoMark className="h-4 w-4" />
        </span>
        {!collapsed ? (
          <span className="leading-tight">
            <span className="block text-[13px] font-semibold uppercase tracking-[0.16em]">
              Atelier Noir
            </span>
            <span className="block text-[11px] text-[var(--ink-3)]">Admin console</span>
          </span>
        ) : null}
      </Link>

      {GROUPS.map((group) => (
        <div key={group.label} className="mb-5">
          {!collapsed ? (
            <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--ink-3)]">
              {group.label}
            </p>
          ) : (
            <div className="mx-3 mb-2 h-px bg-[var(--line)]" />
          )}

          <ul className="space-y-0.5">
            {group.items.map((item) => {
              const active = item.exact
                ? pathname === item.href
                : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? "page" : undefined}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      "group relative flex items-center gap-3 rounded-[3px] px-3 py-2 text-[13.5px] transition-colors duration-150",
                      active
                        ? "bg-[var(--ink)] font-medium text-[var(--bg)]"
                        : "text-[var(--ink-2)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]",
                      collapsed && "justify-center px-2",
                    )}
                  >
                    <item.icon size={16} strokeWidth={1.6} className="shrink-0" />
                    {!collapsed ? <span className="flex-1">{item.label}</span> : null}
                    {!collapsed && item.badge ? (
                      <span
                        className={cn(
                          "grid min-w-5 place-items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                          active
                            ? "bg-[var(--bg)]/20 text-[var(--bg)]"
                            : "bg-[var(--accent)] text-[var(--on-accent)]",
                        )}
                      >
                        {item.badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}

      <div className="mt-auto space-y-1 border-t border-[var(--line)] pt-4">
        <Link
          href="/"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-[3px] px-3 py-2 text-[13.5px] text-[var(--ink-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink)]",
            collapsed && "justify-center px-2",
          )}
        >
          <ExternalLink size={16} strokeWidth={1.6} />
          {!collapsed ? "View storefront" : null}
        </Link>
        <Link
          href="/auth/login"
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-[3px] px-3 py-2 text-[13.5px] text-[var(--ink-3)] transition-colors hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]",
            collapsed && "justify-center px-2",
          )}
        >
          <LogOut size={16} strokeWidth={1.6} />
          {!collapsed ? "Log out" : null}
        </Link>
      </div>
    </nav>
  );
}

function Notifications() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="relative grid h-9 w-9 place-items-center rounded-[3px] text-[var(--ink-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
      >
        <Bell size={17} strokeWidth={1.6} />
        <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
      </button>

      <AnimatePresence>
        {open ? (
          <>
            <button
              type="button"
              aria-label="Close notifications"
              className="fixed inset-0 z-40 cursor-default"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -6, scale: 0.98 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute right-0 z-50 mt-2 w-80 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] shadow-[var(--shadow-pop)]"
            >
              <div className="flex items-center justify-between border-b border-[var(--line)] px-4 py-3">
                <p className="text-[13px] font-semibold text-[var(--ink)]">Notifications</p>
                <span className="text-[11px] text-[var(--ink-3)]">
                  {adminNotifications.length} new
                </span>
              </div>
              <ul className="max-h-80 divide-y divide-[var(--line)] overflow-y-auto">
                {adminNotifications.map((n) => (
                  <li key={n.id} className="flex gap-3 px-4 py-3">
                    <span
                      className={cn(
                        "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
                        n.tone === "success" && "bg-[var(--success)]",
                        n.tone === "warning" && "bg-[var(--warning)]",
                        n.tone === "info" && "bg-[var(--info)]",
                        n.tone === "default" && "bg-[var(--ink-3)]",
                      )}
                    />
                    <div className="min-w-0">
                      <p className="text-[13px] leading-snug text-[var(--ink)]">{n.title}</p>
                      <p className="mt-0.5 text-[11.5px] text-[var(--ink-3)]">{n.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useUi();
  const { theme, setTheme } = useTheme();
  const { user, hydrated, login } = useSession();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [greeting, setGreeting] = useState("Good morning");
  const [today, setToday] = useState("");
  const [entering, setEntering] = useState(false);

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();
    setGreeting(hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening");
    setToday(formatDateLong(now));
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setProfileOpen(false);
  }, [pathname]);

  /* ------------------------------------------------------------------ *
   * Console access gate.
   *
   * This is a UX guard only. In production the same rule must be enforced
   * server-side (proxy.ts + role checks inside every /api/admin handler) —
   * never rely on a client check alone. See lib/services/auth.ts.
   * ------------------------------------------------------------------ */
  if (!hydrated) {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--bg)]" role="status" aria-label="Checking access">
        <div className="text-center">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-[3px] bg-[var(--surface)] text-[var(--ink-3)]">
            <Lock size={18} strokeWidth={1.6} />
          </span>
          <p className="mt-4 text-[13px] text-[var(--ink-3)]">Verifying console access…</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return (
      <div className="grid min-h-screen place-items-center bg-[var(--bg)] px-6 py-16">
        <div className="w-full max-w-md border border-[var(--line)] bg-[var(--surface)] p-8 text-center shadow-[var(--shadow-lift)]">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-[3px] bg-[var(--accent-tint)] text-[var(--accent)]">
            <ShieldCheck size={22} strokeWidth={1.6} />
          </span>
          <p className="eyebrow mt-6 text-[var(--ink-3)]">ATELIER NOIR · Admin</p>
          <h1 className="mt-3 text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">
            Staff access required
          </h1>
          <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--ink-3)]">
            The console is limited to store owners and fulfilment staff. Sign in with a staff
            account to continue.
          </p>

          <div className="mt-7 space-y-2.5">
            <button
              type="button"
              disabled={entering}
              onClick={async () => {
                setEntering(true);
                const res = await login("admin@ateliernoir.example.com", "admin1234");
                setEntering(false);
                if (res.ok === false) {
                  toast({ title: "Sign-in failed", description: res.message, tone: "error" });
                } else {
                  toast({ title: "Signed in as store owner", tone: "success" });
                  router.refresh();
                }
              }}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-[3px] bg-[var(--accent)] text-[11.5px] font-medium uppercase tracking-[0.14em] text-[var(--on-accent)] transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-60"
            >
              {entering ? (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-current border-t-transparent" />
              ) : (
                <Lock size={14} strokeWidth={1.75} />
              )}
              Continue as demo admin
            </button>

            <Link
              href="/auth/login"
              className="flex h-11 w-full items-center justify-center rounded-[3px] border border-[var(--line-strong)] text-[11.5px] font-medium uppercase tracking-[0.14em] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
            >
              Sign in with another account
            </Link>
            <Link
              href="/"
              className="block pt-2 text-[12.5px] text-[var(--ink-3)] underline-offset-4 hover:text-[var(--ink)] hover:underline"
            >
              Back to storefront
            </Link>
          </div>

          <p className="mt-6 border-t border-[var(--line)] pt-5 text-[11.5px] leading-relaxed text-[var(--ink-3)]">
            Demo credentials:{" "}
            <span className="font-mono text-[var(--ink-2)]">admin@ateliernoir.example.com</span> ·{" "}
            <span className="font-mono text-[var(--ink-2)]">admin1234</span>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* desktop sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 hidden border-r border-[var(--line)] bg-[var(--surface)] transition-[width] duration-300 lg:block",
          collapsed ? "w-[76px]" : "w-[280px]",
        )}
      >
        <SidebarNav collapsed={collapsed} />
      </aside>

      {/* mobile sidebar */}
      <AnimatePresence>
        {mobileOpen ? (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.button
              type="button"
              aria-label="Close menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 h-full w-full bg-[var(--overlay)]"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 left-0 w-[280px] bg-[var(--surface)] shadow-[var(--shadow-pop)]"
            >
              <SidebarNav collapsed={false} onNavigate={() => setMobileOpen(false)} />
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>

      {/* main */}
      <div
        className={cn(
          "transition-[padding] duration-300",
          collapsed ? "lg:pl-[76px]" : "lg:pl-[280px]",
        )}
      >
        {/* topbar */}
        <header className="sticky top-0 z-30 border-b border-[var(--line)] bg-[var(--header-bg)] backdrop-blur-xl">
          <div className="flex h-14 items-center gap-3 px-4 sm:px-6">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMobileOpen(true)}
              className="grid h-9 w-9 place-items-center rounded-[3px] text-[var(--ink-2)] hover:bg-[var(--surface-2)] lg:hidden"
            >
              <Menu size={18} strokeWidth={1.6} />
            </button>

            <button
              type="button"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
              onClick={() => setCollapsed((v) => !v)}
              className="hidden h-9 w-9 place-items-center rounded-[3px] text-[var(--ink-2)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink)] lg:grid"
            >
              {collapsed ? (
                <PanelLeftOpen size={17} strokeWidth={1.6} />
              ) : (
                <PanelLeftClose size={17} strokeWidth={1.6} />
              )}
            </button>

            <label className="relative hidden flex-1 max-w-xs md:block">
              <span className="sr-only">Search admin</span>
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-3)]"
              />
              <input
                placeholder="Search orders, products…"
                onKeyDown={(e) => {
                  if (e.key !== "Enter") return;
                  const term = (e.target as HTMLInputElement).value.trim();
                  if (!term) return;
                  router.push(`/admin/orders?q=${encodeURIComponent(term)}`);
                }}
                className="h-9 w-full rounded-[3px] border border-[var(--line)] bg-[var(--surface-2)] pl-9 pr-3 text-[13px] text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-[var(--ink-3)] focus:outline-none"
              />
            </label>

            <div className="ml-auto flex items-center gap-1.5">
              <ThemeToggle className="h-9 w-9" />

              <button
                type="button"
                aria-label="Toggle colour scheme"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hidden h-9 items-center gap-2 rounded-[3px] border border-[var(--line)] px-3 text-[12px] text-[var(--ink-2)] transition-colors hover:border-[var(--ink-3)] sm:flex"
              >
                {theme === "dark" ? "Dark" : "Light"}
              </button>

              <Notifications />

              <div className="relative">
                <button
                  type="button"
                  aria-expanded={profileOpen}
                  onClick={() => setProfileOpen((v) => !v)}
                  className="flex h-9 items-center gap-2 rounded-[3px] pl-1 pr-2 transition-colors hover:bg-[var(--surface-2)]"
                >
                  <span className="grid h-7 w-7 place-items-center rounded-full bg-[var(--ink)] text-[11px] font-semibold text-[var(--bg)]">
                    NK
                  </span>
                  <span className="hidden text-left leading-tight sm:block">
                    <span className="block text-[12.5px] font-medium text-[var(--ink)]">
                      Nisha Kulkarni
                    </span>
                    <span className="block text-[11px] text-[var(--ink-3)]">Owner</span>
                  </span>
                  <ChevronDown size={14} className="text-[var(--ink-3)]" />
                </button>

                <AnimatePresence>
                  {profileOpen ? (
                    <>
                      <button
                        type="button"
                        aria-label="Close menu"
                        className="fixed inset-0 z-40 cursor-default"
                        onClick={() => setProfileOpen(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.18 }}
                        className="absolute right-0 z-50 mt-2 w-52 rounded-[4px] border border-[var(--line)] bg-[var(--surface)] py-1 shadow-[var(--shadow-pop)]"
                      >
                        <Link
                          href="/admin/settings"
                          className="block px-4 py-2 text-[13px] text-[var(--ink-2)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
                        >
                          Account settings
                        </Link>
                        <Link
                          href="/"
                          className="block px-4 py-2 text-[13px] text-[var(--ink-2)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
                        >
                          View storefront
                        </Link>
                        <Link
                          href="/auth/login"
                          className="block px-4 py-2 text-[13px] text-[var(--danger)] hover:bg-[var(--danger)]/10"
                        >
                          Log out
                        </Link>
                      </motion.div>
                    </>
                  ) : null}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </header>

        <main id="main" className="px-4 py-6 sm:px-6 lg:px-8">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[17px] font-semibold tracking-[-0.01em] text-[var(--ink)]">
                {greeting}, Admin
              </p>
              <p className="text-[13px] text-[var(--ink-3)]">{today || " "}</p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/admin/products/new"
                className="inline-flex h-9 items-center rounded-[3px] bg-[var(--accent)] px-4 text-[12.5px] font-medium text-[var(--on-accent)] transition-colors hover:bg-[var(--accent-hover)]"
              >
                Add product
              </Link>
            </div>
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
