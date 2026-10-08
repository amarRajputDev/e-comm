import Link from "next/link";
import { Lock, ShieldCheck } from "lucide-react";
import { Wordmark } from "@/components/layout/logo";
import { SiteFooter } from "@/components/layout/footer";

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[var(--bg)]">
      <header className="border-b border-[var(--line)] bg-[var(--surface)]">
        <div className="container-x flex h-16 items-center justify-between gap-4">
          <Link href="/" aria-label="ATELIER NOIR — home" className="text-[var(--ink)]">
            <Wordmark />
          </Link>

          <div className="flex items-center gap-5">
            <span className="hidden items-center gap-2 text-[12px] uppercase tracking-[0.14em] text-[var(--ink-3)] sm:flex">
              <Lock size={14} strokeWidth={1.6} /> Secure checkout
            </span>
            <Link
              href="/cart"
              className="text-[12px] uppercase tracking-[0.14em] text-[var(--ink-2)] underline-offset-4 transition-colors hover:text-[var(--accent)] hover:underline"
            >
              Back to bag
            </Link>
          </div>
        </div>
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <div className="border-t border-[var(--line)] bg-[var(--surface)]">
        <div className="container-x flex flex-wrap items-center justify-between gap-4 py-5 text-[12.5px] text-[var(--ink-3)]">
          <span className="flex items-center gap-4">
            <span className="flex items-center gap-2">
              <ShieldCheck size={14} strokeWidth={1.6} /> PCI-DSS compliant payments
            </span>
            <span className="hidden sm:inline">256-bit TLS encryption</span>
          </span>
          <span>© 2026 ATELIER NOIR · 30-day returns</span>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}
