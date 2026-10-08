"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, ArrowDown } from "lucide-react";
import { banners } from "@/lib/data/site";
import { useCms } from "@/lib/store/cms";
import { Img } from "@/components/ui/img";

const fallbackHero = banners[0];
const EASE = [0.22, 1, 0.36, 1] as const;

function Line({ children, delay }: { children: React.ReactNode; delay: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <motion.span
        className="block"
        initial={reduce ? { opacity: 0 } : { y: "110%" }}
        animate={reduce ? { opacity: 1 } : { y: 0 }}
        transition={{ duration: 1, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

export function Hero() {
  const reduce = useReducedMotion();
  const { content, hydrated } = useCms();
  const hero = hydrated
    ? {
        image: content.hero.image,
        eyebrow: content.hero.eyebrow,
        line1: content.hero.line1,
        line2: content.hero.line2,
        support: content.hero.support,
        primaryCta: content.hero.primaryCta,
        primaryHref: content.hero.primaryHref,
        secondaryCta: content.hero.secondaryCta,
        secondaryHref: content.hero.secondaryHref,
      }
    : {
        image: fallbackHero.image,
        eyebrow: fallbackHero.title,
        line1: "DESIGNED FOR",
        line2: "EVERYDAY ICONS.",
        support:
          "Premium essentials designed to move with you — considered proportions, honest materials, and a palette built to outlive the season.",
        primaryCta: "Shop collection",
        primaryHref: "/collections/new-arrivals",
        secondaryCta: "Explore new arrivals",
        secondaryHref: "/shop",
      };

  return (
    <section
      className="relative isolate -mt-[var(--header-h)] flex min-h-[100svh] items-end overflow-hidden bg-[#141210]"
      aria-label="Featured collection"
    >
      {/* image */}
      <motion.div
        className="absolute inset-0 -z-10"
        initial={reduce ? { scale: 1 } : { scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.8, ease: EASE }}
      >
        <Img
          src={hero.image}
          alt="Model wearing the ATELIER NOIR autumn collection"
          width={2000}
          height={1150}
          sizes="100vw"
          preload
          className="h-full w-full object-[50%_35%]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-transparent to-transparent" />
      </motion.div>

      <div className="container-x w-full pb-16 pt-40 sm:pb-20">
        <div className="max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
            className="eyebrow flex items-center gap-3 text-white/75"
          >
            <span className="h-px w-8 bg-[var(--accent)]" />
            {hero.eyebrow}
          </motion.p>

          <h1 className="display-xl mt-6 text-white">
            <Line delay={0.25}>{hero.line1}</Line>
            <Line delay={0.38}>{hero.line2}</Line>
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: EASE }}
            className="mt-7 max-w-md text-[16px] leading-relaxed text-white/80"
          >
            {hero.support}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.72, ease: EASE }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Link
              href={hero.primaryHref}
              className="group inline-flex h-[52px] items-center justify-center gap-3 bg-[var(--accent)] px-8 text-[11.5px] font-medium uppercase tracking-[0.16em] text-[var(--on-accent)] transition-colors duration-200 hover:bg-[var(--accent-hover)]"
            >
              {hero.primaryCta}
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
            <Link
              href={hero.secondaryHref}
              className="group inline-flex h-[52px] items-center justify-center gap-3 border border-white/35 px-8 text-[11.5px] font-medium uppercase tracking-[0.16em] text-white transition-colors duration-200 hover:border-white hover:bg-white hover:text-[#141210]"
            >
              {hero.secondaryCta}
            </Link>
          </motion.div>
        </div>

        {/* bottom meta */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-16 flex flex-wrap items-end justify-between gap-6 border-t border-white/15 pt-6"
        >
          <dl className="flex flex-wrap gap-x-10 gap-y-4">
            {[
              { k: "Founded", v: "2019 · Bengaluru" },
              { k: "Fabric", v: "Natural & recycled fibres" },
              { k: "Delivery", v: "Free over ₹999" },
            ].map((item) => (
              <div key={item.k}>
                <dt className="eyebrow text-white/50">{item.k}</dt>
                <dd className="mt-1.5 text-[13.5px] text-white/85">{item.v}</dd>
              </div>
            ))}
          </dl>

          <span className="hidden items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-white/55 sm:flex">
            <motion.span
              animate={reduce ? undefined : { y: [0, 5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="grid place-items-center"
            >
              <ArrowDown size={14} />
            </motion.span>
            Scroll
          </span>
        </motion.div>
      </div>
    </section>
  );
}
