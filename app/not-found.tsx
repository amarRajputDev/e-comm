import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-[var(--bg)] px-6 py-20 text-center">
      <div className="max-w-md">
        <p className="eyebrow text-[var(--accent)]">Error 404</p>
        <h1 className="h1 mt-5 text-[var(--ink)]">Page not found.</h1>
        <p className="mt-4 text-[15.5px] leading-relaxed text-[var(--ink-3)]">
          This address does not exist. Head back to the storefront or the admin console.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/"
            className="inline-flex h-12 items-center rounded-[2px] bg-[var(--accent)] px-7 text-[11.5px] font-medium uppercase tracking-[0.16em] text-[var(--on-accent)] transition-colors hover:bg-[var(--accent-hover)]"
          >
            Go to shop
          </Link>
          <Link
            href="/admin"
            className="inline-flex h-12 items-center rounded-[2px] border border-[var(--line-strong)] px-7 text-[11.5px] font-medium uppercase tracking-[0.16em] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
          >
            Admin dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
