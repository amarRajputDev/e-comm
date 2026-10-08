import type { Metadata } from "next";
import { ShopView } from "@/components/shop/shop-view";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { parseShopParams } from "@/lib/shop-params";
import { getProducts } from "@/lib/services/products";

export const metadata: Metadata = {
  title: "Shop the collection",
  description:
    "Browse premium everyday essentials — tees, knitwear, tailoring and leather accessories. Filter by category, price, size and colour.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage(props: PageProps<"/shop">) {
  const params = await props.searchParams;
  const initial = parseShopParams(params);
  const products = await getProducts();

  const isSearch = Boolean(initial.q);
  const onlyCategory =
    initial.filters.categories.length === 1 && !initial.q
      ? initial.filters.categories[0]
      : null;

  const title = isSearch
    ? `Results for “${initial.q}”`
    : onlyCategory
      ? onlyCategory.charAt(0).toUpperCase() + onlyCategory.slice(1)
      : "The Collection";

  return (
    <div className="container-x pb-24 pt-10 md:pt-14">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          ...(onlyCategory
            ? [{ label: onlyCategory.charAt(0).toUpperCase() + onlyCategory.slice(1) }]
            : []),
          ...(isSearch ? [{ label: "Search" }] : []),
        ]}
      />

      <header className="mt-6 border-b border-[var(--line)] pb-9">
        <p className="eyebrow text-[var(--accent)]">
          {isSearch ? "Search" : "Catalogue"}
        </p>
        <h1 className="h1 mt-4 max-w-3xl capitalize text-[var(--ink)]">{title}</h1>
        <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-[var(--ink-3)]">
          {isSearch
            ? "Everything in the collection matching your search — refine with the filters if you need to narrow it down."
            : "Every piece we currently make, in order of what we would put on first. Filter by fit, fabric or price to find yours."}
        </p>
      </header>

      <div className="mt-9">
        <ShopView products={products} initial={initial} />
      </div>
    </div>
  );
}
