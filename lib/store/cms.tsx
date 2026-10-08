"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { testimonials as defaultTestimonials } from "@/lib/data/reviews";
import { banners as defaultBanners } from "@/lib/data/site";
import type { Banner } from "@/types";

/**
 * Storefront content management.
 *
 * The admin console writes here, the homepage reads from here. State is
 * persisted to localStorage so edits survive a reload — swap the two helpers
 * below for a `PUT /api/admin/content` call when the backend lands and every
 * consumer keeps working unchanged.
 */

export interface CmsHero {
  eyebrow: string;
  line1: string;
  line2: string;
  support: string;
  primaryCta: string;
  primaryHref: string;
  secondaryCta: string;
  secondaryHref: string;
  image: string;
}

export interface CmsSection {
  id: string;
  label: string;
  enabled: boolean;
}

export interface CmsNewsletter {
  heading: string;
  body: string;
  cta: string;
}

export interface CmsTestimonial {
  id: string;
  quote: string;
  name: string;
  location: string;
  rating: number;
  product: string;
}

export interface CmsContent {
  hero: CmsHero;
  sections: CmsSection[];
  newsletter: CmsNewsletter;
  testimonials: CmsTestimonial[];
  featuredSlugs: string[];
  /** Promo + strip banners (the hero lives in `hero`). */
  banners: Banner[];
}

const DEFAULT: CmsContent = {
  hero: {
    eyebrow: "THE NEW STANDARD",
    line1: "DESIGNED FOR",
    line2: "EVERYDAY ICONS.",
    support:
      "Premium essentials designed to move with you — considered proportions, honest materials, and a palette built to outlive the season.",
    primaryCta: "Shop collection",
    primaryHref: "/collections/new-arrivals",
    secondaryCta: "Explore new arrivals",
    secondaryHref: "/shop",
    image: "/img/hero.jpg",
  },
  sections: [
    { id: "marquee", label: "Brand marquee", enabled: true },
    { id: "categories", label: "Featured categories", enabled: true },
    { id: "trending", label: "Trending now", enabled: true },
    { id: "new-arrivals", label: "New arrivals", enabled: true },
    { id: "story", label: "Brand story", enabled: true },
    { id: "promo", label: "Promotion banner", enabled: true },
    { id: "reviews", label: "Customer reviews", enabled: true },
    { id: "instagram", label: "Instagram grid", enabled: true },
    { id: "newsletter", label: "Newsletter", enabled: true },
  ],
  newsletter: {
    heading: "STAY IN THE LOOP.",
    body: "New drops, exclusive offers and things worth knowing — roughly twice a month.",
    cta: "Join",
  },
  testimonials: defaultTestimonials.map((t) => ({ ...t })),
  featuredSlugs: [
    "structured-trench-coat",
    "heavyweight-box-tee",
    "grain-leather-tote",
    "merino-crew-knit",
  ],
  banners: defaultBanners.filter((b) => b.placement !== "hero"),
};

const STORAGE_KEY = "an.cms";

function readStore(): CmsContent {
  if (typeof window === "undefined") return DEFAULT;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT;
    const parsed = JSON.parse(raw) as Partial<CmsContent>;
    return {
      ...DEFAULT,
      ...parsed,
      hero: { ...DEFAULT.hero, ...(parsed.hero ?? {}) },
      newsletter: { ...DEFAULT.newsletter, ...(parsed.newsletter ?? {}) },
      sections: parsed.sections ?? DEFAULT.sections,
      testimonials: parsed.testimonials ?? DEFAULT.testimonials,
      featuredSlugs: parsed.featuredSlugs ?? DEFAULT.featuredSlugs,
      banners: parsed.banners ?? DEFAULT.banners,
    };
  } catch {
    return DEFAULT;
  }
}

type CmsCtx = {
  content: CmsContent;
  hydrated: boolean;
  save: (patch: Partial<CmsContent>) => void;
  saveAll: (next: CmsContent) => void;
  reset: () => void;
};

const CmsContext = createContext<CmsCtx | null>(null);

export function CmsProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<CmsContent>(DEFAULT);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setContent(readStore());
    setHydrated(true);
  }, []);

  const persist = useCallback((next: CmsContent) => {
    setContent(next);
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage unavailable — state still updates in memory */
    }
  }, []);

  const save = useCallback(
    (patch: Partial<CmsContent>) => {
      const next: CmsContent = {
        ...content,
        ...patch,
        hero: { ...content.hero, ...(patch.hero ?? {}) },
        newsletter: { ...content.newsletter, ...(patch.newsletter ?? {}) },
      };
      persist(next);
    },
    [content, persist],
  );

  const saveAll = useCallback(
    (next: CmsContent) => persist(next),
    [persist],
  );

  const reset = useCallback(() => persist(DEFAULT), [persist]);

  const value = useMemo<CmsCtx>(
    () => ({ content, hydrated, save, saveAll, reset }),
    [content, hydrated, save, saveAll, reset],
  );

  return <CmsContext.Provider value={value}>{children}</CmsContext.Provider>;
}

export function useCms() {
  const ctx = useContext(CmsContext);
  if (!ctx) throw new Error("useCms must be used within <CmsProvider>");
  return ctx;
}

export const DEFAULT_CMS = DEFAULT;
