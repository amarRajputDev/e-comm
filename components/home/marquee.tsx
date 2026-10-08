"use client";

import { marqueeItems } from "@/lib/data/site";

export function BrandMarquee() {
  return (
    <section
      aria-label="Brand promises"
      className="group overflow-hidden border-y border-[var(--line)] bg-[var(--surface)] py-5"
    >
      <div className="flex w-max animate-[marquee_42s_linear_infinite] group-hover:[animation-play-state:paused]">
        {[0, 1].map((dup) => (
          <div key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
            {marqueeItems.map((item) => (
              <span key={`${dup}-${item}`} className="flex items-center whitespace-nowrap">
                <span className="px-7 text-[13px] font-medium uppercase tracking-[0.24em] text-[var(--ink-2)]">
                  {item}
                </span>
                <span className="text-[var(--accent)]">/</span>
              </span>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
