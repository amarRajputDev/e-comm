"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode } from "react";
import {
  LayoutDashboard,
  Package,
  Heart,
  MapPin,
  User,
  Settings as SettingsIcon,
  LogOut,
  Loader2,
} from "lucide-react";
import { useSession, useWishlist } from "@/lib/store/providers";
import { cn } from "@/lib/utils";
import { Wordmark } from "@/components/layout/logo";

const NAV = [
  { href: "/account", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/account/orders", label: "Orders", icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart },
  { href: "/account/addresses", label: "Addresses", icon: MapPin },
  { href: "/account/profile", label: "Profile", icon: User },
  { href: "/account/settings", label: "Settings", icon: SettingsIcon },
];

export function AccountShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, hydrated, logout } = useSession();
  const { ids } = useWishlist();

  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[248px_1fr] lg:gap-12" role="status" aria-label="Loading account">
        <div className="space-y-3">
          <div className="skeleton h-5 w-32" />
          <div className="skeleton h-7 w-40" />
          <div className="mt-6 space-y-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="skeleton h-10 w-full" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="skeleton h-8 w-56" />
          <div className="skeleton h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--surface-2)] text-[var(--ink-3)]">
          <Loader2 size={22} strokeWidth={1.5} className="animate-spin" />
        </div>
        <h1 className="h2 mt-6">Sign in to your account</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-3)]">
          Track orders, manage addresses and see everything you have saved.
        </p>
        <div className="mt-7 flex flex-col gap-3">
          <Link
            href="/auth/login"
            className="h-12 rounded-[2px] bg-[var(--accent)] text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--on-accent)] transition-colors hover:bg-[var(--accent-hover)]"
          >
            Sign in
          </Link>
          <Link
            href="/auth/register"
            className="h-12 rounded-[2px] border border-[var(--line-strong)] text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
          >
            Create account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[248px_1fr] lg:gap-12">
      {/* sidebar */}
      <aside className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
        <div className="mb-6 hidden lg:block">
          <Link href="/" className="text-[var(--ink)]">
            <Wordmark />
          </Link>
          <p className="mt-5 text-[15px] text-[var(--ink-3)]">Welcome back,</p>
          <p className="text-[19px] font-medium tracking-[-0.01em] text-[var(--ink)]">
            {user.name}
          </p>
        </div>

        <nav aria-label="Account" className="no-scrollbar -mx-1 flex gap-1 overflow-x-auto px-1 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0">
          {NAV.map((item) => {
            const active = item.exact
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex shrink-0 items-center gap-3 rounded-[2px] px-3.5 py-2.5 text-[14px] transition-colors duration-200",
                  active
                    ? "bg-[var(--ink)] text-[var(--bg)]"
                    : "text-[var(--ink-2)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)]",
                )}
              >
                <item.icon size={16} strokeWidth={1.5} />
                <span className="whitespace-nowrap">{item.label}</span>
                {item.label === "Wishlist" && ids.length ? (
                  <span
                    className={cn(
                      "ml-auto grid min-w-5 place-items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
                      active
                        ? "bg-[var(--bg)]/20 text-[var(--bg)]"
                        : "bg-[var(--accent)] text-[var(--on-accent)]",
                    )}
                  >
                    {ids.length}
                  </span>
                ) : null}
              </Link>
            );
          })}

          <button
            type="button"
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="mt-3 flex shrink-0 items-center gap-3 rounded-[2px] px-3.5 py-2.5 text-[14px] text-[var(--ink-3)] transition-colors hover:bg-[var(--danger)]/10 hover:text-[var(--danger)] lg:mt-5 lg:border-t lg:border-[var(--line)] lg:pt-5"
          >
            <LogOut size={16} strokeWidth={1.5} />
            <span className="whitespace-nowrap">Log out</span>
          </button>
        </nav>
      </aside>

      <div className="min-w-0">{children}</div>
    </div>
  );
}
