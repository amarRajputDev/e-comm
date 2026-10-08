"use client";

import { useCms } from "@/lib/store/cms";
import { BrandMarquee } from "./marquee";
import { CategoryGrid } from "./category-grid";
import { TrendingNow } from "./trending";
import { NewArrivals } from "./new-arrivals";
import { BrandStory } from "./brand-story";
import { PromoBanner } from "./promo-banner";
import { Testimonials } from "./testimonials";
import { InstagramGrid } from "./instagram-grid";
import { Newsletter } from "./newsletter";

const RENDERERS: Record<string, () => React.ReactNode> = {
  marquee: () => <BrandMarquee />,
  categories: () => <CategoryGrid />,
  trending: () => <TrendingNow />,
  "new-arrivals": () => <NewArrivals />,
  story: () => <BrandStory />,
  promo: () => <PromoBanner />,
  reviews: () => <Testimonials />,
  instagram: () => <InstagramGrid />,
  newsletter: () => <Newsletter />,
};

/**
 * Homepage sections render in the order defined in the admin console
 * (/admin/content). The hero is always first and cannot be reordered.
 */
export function HomeSections() {
  const { content, hydrated } = useCms();

  if (!hydrated) {
    return (
      <>
        <BrandMarquee />
        <CategoryGrid />
        <TrendingNow />
        <NewArrivals />
        <BrandStory />
        <PromoBanner />
        <Testimonials />
        <InstagramGrid />
        <Newsletter />
      </>
    );
  }

  return (
    <>
      {content.sections
        .filter((s) => s.enabled && RENDERERS[s.id])
        .map((section) => (
          <div key={section.id}>{RENDERERS[section.id]()}</div>
        ))}
    </>
  );
}
