import { products } from "@/lib/data/products";
import { ProductGrid } from "@/components/product/product-grid";
import { Section, SectionHeading } from "@/components/shared/section";
import { useCms } from "@/lib/store/cms";
import { useMemo } from "react";

export function TrendingNow() {
  const { content, hydrated } = useCms();

  const trending = useMemo(() => {
    const bySold = [...products].filter((p) => p.status === "active").sort((a, b) => b.sold - a.sold);
    if (!hydrated) return bySold.slice(0, 8);
    const rank = new Map(content.featuredSlugs.map((slug, i) => [slug, i]));
    return bySold
      .slice()
      .sort((a, b) => {
        const ra = rank.has(a.slug) ? rank.get(a.slug)! : 99;
        const rb = rank.has(b.slug) ? rank.get(b.slug)! : 99;
        return ra - rb || b.sold - a.sold;
      })
      .slice(0, 8);
  }, [hydrated, content.featuredSlugs]);

  return (
    <Section id="trending" size="lg">
      <SectionHeading
        eyebrow="Trending now"
        title="What everyone is wearing this week."
        description="Ranked by real orders over the last 30 days — restocked twice, still moving fast."
        action={{ label: "Shop best sellers", href: "/collections/best-sellers" }}
        align="between"
      />
      <ProductGrid products={trending} columns={4} priorityCount={4} />
    </Section>
  );
}
