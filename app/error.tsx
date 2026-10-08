"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCw, ArrowLeft } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-x flex min-h-[60vh] items-center justify-center py-20">
      <div className="mx-auto max-w-lg text-center">
        <span className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--accent-tint)] text-[var(--accent)]">
          <AlertTriangle size={26} strokeWidth={1.6} />
        </span>
        <p className="eyebrow mt-7 text-[var(--accent)]">Something went wrong</p>
        <h1 className="h1 mt-4">That one’s on us.</h1>
        <p className="mt-4 text-[15.5px] leading-relaxed text-[var(--ink-3)]">
          An unexpected error occurred while loading this page. Your bag is safe — try again and
          it should pick up where you left off.
        </p>
        {error.digest ? (
          <p className="mt-3 text-[12.5px] text-[var(--ink-3)]">Reference: {error.digest}</p>
        ) : null}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-12 items-center gap-2 rounded-[2px] bg-[var(--accent)] px-7 text-[11.5px] font-medium uppercase tracking-[0.16em] text-[var(--on-accent)] transition-colors hover:bg-[var(--accent-hover)]"
          >
            <RotateCw size={15} /> Try again
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex h-12 items-center gap-2 rounded-[2px] border border-[var(--line-strong)] px-7 text-[11.5px] font-medium uppercase tracking-[0.16em] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
          >
            <ArrowLeft size={15} /> Go back
          </button>
        </div>
      </div>
    </div>
  );
}
