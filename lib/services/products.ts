import type { Filters, Product, SortKey } from "@/types";
import { EMPTY_FILTERS } from "@/types";
import { products as source, COLLECTIONS, type CollectionSlug } from "@/lib/data/products";
import { discountPercent } from "@/lib/format";

export interface ProductQuery {
  category?: string;
  collection?: string;
  q?: string;
  filters?: Filters;
  sort?: SortKey;
  page?: number;
  perPage?: number;
  /** Include drafts/archived items (admin tooling only). */
  includeHidden?: boolean;
}

/** The storefront only ever shows active products. */
export function visible(list: Product[] = source): Product[] {
  return list.filter((p) => p.status === "active");
}

export interface ProductPage {
  items: Product[];
  total: number;
  page: number;
  perPage: number;
  pages: number;
  /** Counts faceted results before pagination. */
  all: Product[];
}

function matchesQuery(p: Product, q: string) {
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const hay = [
    p.name,
    p.category,
    p.shortDescription,
    p.tags.join(" "),
    p.colors.map((c) => c.name).join(" "),
  ]
    .join(" ")
    .toLowerCase();
  return needle.split(/\s+/).every((word) => hay.includes(word));
}

export function filterProducts(list: Product[], query: ProductQuery): Product[] {
  const f = query.filters ?? EMPTY_FILTERS;

  return list.filter((p) => {
    if (!query.includeHidden && p.status !== "active") return false;

    if (query.category && p.category !== query.category) return false;

    if (query.collection) {
      const col = COLLECTIONS.find((c) => c.slug === query.collection);
      if (col && !col.match(p)) return false;
    }

    if (!matchesQuery(p, query.q ?? "")) return false;

    if (f.categories.length && !f.categories.includes(p.category)) return false;

    if (f.price && (p.price < f.price[0] || p.price > f.price[1])) return false;

    if (f.sizes.length && !p.sizes.some((s) => f.sizes.includes(s.label) && s.available))
      return false;

    if (f.colors.length && !p.colors.some((c) => f.colors.includes(c.name)))
      return false;

    if (f.rating && p.rating < f.rating) return false;

    if (f.inStock && p.stock <= 0) return false;

    if (f.maxDiscount != null) {
      const pct = discountPercent(p.price, p.compareAt);
      if (pct < f.maxDiscount) return false;
    }

    return true;
  });
}

export function sortProducts(list: Product[], sort: SortKey = "featured"): Product[] {
  const items = [...list];
  switch (sort) {
    case "price-asc":
      return items.sort((a, b) => a.price - b.price);
    case "price-desc":
      return items.sort((a, b) => b.price - a.price);
    case "rating":
      return items.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case "newest":
      return items.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    case "best-selling":
      return items.sort((a, b) => b.sold - a.sold);
    case "featured":
    default:
      return items.sort(
        (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)) || b.sold - a.sold,
      );
  }
}

export async function queryProducts(query: ProductQuery = {}): Promise<ProductPage> {
  const perPage = query.perPage ?? 12;
  const page = Math.max(1, query.page ?? 1);
  const filtered = filterProducts(source, query);
  const sorted = sortProducts(filtered, query.sort);
  const start = (page - 1) * perPage;
  const items = sorted.slice(start, start + perPage);

  return {
    items,
    all: sorted,
    total: filtered.length,
    page,
    perPage,
    pages: Math.max(1, Math.ceil(filtered.length / perPage)),
  };
}

export async function getProducts(limit?: number): Promise<Product[]> {
  const list = visible();
  return typeof limit === "number" ? list.slice(0, limit) : list;
}

export async function getProduct(slug: string): Promise<Product | undefined> {
  /* Read the live array (admin edits mutate it in place) and never expose
     drafts or archived products on the storefront. */
  return source.find((p) => p.slug === slug && p.status === "active");
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  const list = visible();
  const featured = list.filter((p) => p.featured);
  const trending = [...list].sort((a, b) => b.sold - a.sold);
  return [...new Set([...featured, ...trending])].slice(0, limit);
}

export async function getTrendingProducts(limit = 8): Promise<Product[]> {
  return visible()
    .sort((a, b) => b.sold - a.sold)
    .slice(0, limit);
}

export async function getNewArrivals(limit = 4): Promise<Product[]> {
  return visible()
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    .slice(0, limit);
}

export async function getRelatedProducts(slug: string, limit = 4): Promise<Product[]> {
  const base = source.find((p) => p.slug === slug);
  const pool = visible();
  if (!base) return pool.slice(0, limit);
  const sameCategory = pool.filter((p) => p.category === base.category && p.slug !== slug);
  const others = pool.filter((p) => p.category !== base.category && p.slug !== slug);
  return [...sameCategory.sort((a, b) => b.sold - a.sold), ...others].slice(0, limit);
}

export async function searchProducts(q: string, limit = 6): Promise<Product[]> {
  if (!q.trim()) return [];
  return filterProducts(visible(), { q }).slice(0, limit);
}

export async function getCollection(slug: CollectionSlug) {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export function getFacetOptions() {
  const list = visible();
  const prices = list.map((p) => p.price);
  return {
    priceRange: [Math.min(...prices), Math.max(...prices)] as [number, number],
    sizes: Array.from(new Set(list.flatMap((p) => p.sizes.map((s) => s.label)))),
    colors: Array.from(new Set(list.flatMap((p) => p.colors.map((c) => c.name)))),
    maxDiscount: Math.max(
      ...list.map((p) => discountPercent(p.price, p.compareAt)),
    ),
  };
}
