import Link from "next/link";
import { Wordmark } from "@/components/layout/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Img } from "@/components/ui/img";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* form column */}
      <div className="flex flex-col bg-[var(--bg)]">
        <header className="flex h-16 items-center justify-between px-6 md:px-10">
          <Link href="/" className="text-[var(--ink)]">
            <Wordmark />
          </Link>
          <ThemeToggle />
        </header>

        <main id="main" className="flex flex-1 items-center justify-center px-6 py-10 md:px-10">
          <div className="w-full max-w-[420px]">{children}</div>
        </main>

        <footer className="px-6 py-6 text-center text-[12.5px] text-[var(--ink-3)] md:px-10">
          © 2026 ATELIER NOIR ·{" "}
          <Link href="/help#privacy" className="underline underline-offset-4 hover:text-[var(--ink)]">
            Privacy
          </Link>
        </footer>
      </div>

      {/* editorial column */}
      <aside className="relative hidden overflow-hidden bg-[#141210] lg:block">
        <Img sizes="(max-width: 1024px) 100vw, 50vw" width={1400} height={1800}
          src="/img/auth.jpg"
          alt="Folded knitwear in the ATELIER NOIR studio"
          className="h-full w-full object-cover opacity-85"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/50" />
        <div className="absolute inset-x-0 bottom-0 p-12">
          <p className="eyebrow text-white/60">Members get</p>
          <p className="mt-4 max-w-md text-[26px] font-medium leading-tight tracking-[-0.02em] text-white">
            Early access to drops, free express shipping and a repair credit on every order.
          </p>
          <div className="mt-7 flex gap-8 border-t border-white/15 pt-6">
            {[
              ["12,400+", "members"],
              ["4.8/5", "average rating"],
              ["30 days", "free returns"],
            ].map(([v, k]) => (
              <div key={k}>
                <p className="text-[19px] font-medium text-white">{v}</p>
                <p className="text-[12.5px] text-white/60">{k}</p>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}
