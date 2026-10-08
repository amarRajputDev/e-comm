"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { banners } from "@/lib/data/site";
import { useCms } from "@/lib/store/cms";
import { Reveal } from "@/components/motion/reveal";
import { Img } from "@/components/ui/img";

export function PromoBanner() {
  const { content, hydrated } = useCms();

  const promo = hydrated
    ? (content.banners.find((b) => b.placement === "promo" && b.active) ?? null)
    : (banners.find((b) => b.placement === "promo" && b.active) ?? null);

  /* Unpublishing the promo from /admin/banners hides the whole section. */
  if (!promo) return null;

  return (
    <section className="relative isolate overflow-hidden bg-[#141210] py-24 md:py-32">
      {/* slow moving background */}
      <div className="absolute inset-0 -z-10 opacity-70">
        <Img
          src={promo.image}
          alt=""
          aria-hidden
          width={2000}
          height={1150}
          sizes="100vw"
          className="h-full w-full object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#141210] via-[#141210]/75 to-[#141210]/40" />
      </div>
      <div
        aria-hidden
        className="absolute -inset-x-10 inset-y-0 -z-10 animate-[drift_16s_ease-in-out_infinite_alternate] bg-[radial-gradient(55%_120%_at_12%_50%,rgba(191,69,20,0.4),transparent_62%)] opacity-70"
      />

      <div className="container-x">
        <Reveal y={34}>
          <p className="eyebrow flex items-center gap-3 text-[var(--accent)]">
            <span className="h-px w-8 bg-[var(--accent)]" />
            {promo.eyebrow ?? "Archive sale"}
          </p>
          <h2 className="display-lg mt-6 max-w-3xl text-white">{promo.title}</h2>
          <p className="mt-5 max-w-lg text-[16px] leading-relaxed text-white/70">
            {promo.subtitle}
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href={promo.href}
              className="group inline-flex h-[52px] items-center gap-3 bg-[var(--accent)] px-8 text-[11.5px] font-medium uppercase tracking-[0.16em] text-[var(--on-accent)] transition-colors hover:bg-[var(--accent-hover)]"
            >
              {promo.cta}
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/collections/essentials"
              className="inline-flex h-[52px] items-center border border-white/30 px-8 text-[11.5px] font-medium uppercase tracking-[0.16em] text-white transition-colors hover:border-white hover:bg-white hover:text-[#141210]"
            >
              Or shop full-price essentials
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
