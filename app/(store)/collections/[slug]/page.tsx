import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopView } from "@/components/shop/shop-view";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { COLLECTIONS } from "@/lib/data/products";
import { getProducts } from "@/lib/services/products";
import { parseShopParams } from "@/lib/shop-params";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata(
  props: PageProps<"/collections/[slug]">,
): Promise<Metadata> {
  const { slug } = await props.params;
  const collection = COLLECTIONS.find((c) => c.slug === slug);
  if (!collection) return { title: "Collection" };
  return {
    title: collection.name,
    description: collection.description,
    alternates: { canonical: `/collections/${slug}` },
  };
}

export default async function CollectionPage(props: PageProps<"/collections/[slug]">) {
  const { slug } = await props.params;
  const collection = COLLECTIONS.find((c) => c.slug === slug);
  if (!collection) notFound();

  const params = await props.searchParams;
  const initial = parseShopParams(params);
  const products = await getProducts();
  const count = products.filter(collection.match).length;

  return (
    <div className="container-x pb-24 pt-10 md:pt-14">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Collections", href: "/collections/new-arrivals" },
          { label: collection.name },
        ]}
      />

      <header className="mt-6 flex flex-col gap-6 border-b border-[var(--line)] pb-9 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow text-[var(--accent)]">Collection</p>
          <h1 className="h1 mt-4 text-[var(--ink)]">{collection.name}</h1>
          <p className="mt-4 max-w-xl text-[15.5px] leading-relaxed text-[var(--ink-3)]">
            {collection.description}
          </p>
        </div>
        <p className="shrink-0 text-[13px] uppercase tracking-[0.14em] text-[var(--ink-3)]">
          {count} {count === 1 ? "piece" : "pieces"}
        </p>
      </header>

      <div className="mt-9">
        <ShopView products={products.filter(collection.match)} initial={initial} />
      </div>
    </div>
  );
}
