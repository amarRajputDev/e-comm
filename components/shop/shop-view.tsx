"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { LayoutGrid, List, SlidersHorizontal, X, ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import type { Filters, Product, SortKey } from "@/types";
import { EMPTY_FILTERS } from "@/types";
import { filterProducts, getFacetOptions, sortProducts } from "@/lib/services/products";
import { useIsDesktop } from "@/lib/hooks/use-media-query";
import { Sheet } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { SkeletonGrid } from "@/components/ui/skeleton";
import { ProductGrid } from "@/components/product/product-grid";
import { cn } from "@/lib/utils";
import { FilterContent, activeFilterChips, type FacetCounts } from "./filter-content";

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "best-selling", label: "Best selling" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Highest rated" },
];

const PAGE_SIZE = 12;

function buildQuery(params: {
  filters: Filters;
  sort: SortKey;
  page: number;
  q?: string;
}) {
  const sp = new URLSearchParams();
  const { filters, sort, page, q } = params;
  if (q) sp.set("q", q);
  if (filters.categories.length) sp.set("category", filters.categories.join(","));
  if (filters.price) {
    sp.set("min", String(filters.price[0]));
    sp.set("max", String(filters.price[1]));
  }
  if (filters.sizes.length) sp.set("size", filters.sizes.join(","));
  if (filters.colors.length) sp.set("color", filters.colors.join(","));
  if (filters.rating) sp.set("rating", String(filters.rating));
  if (filters.maxDiscount) sp.set("discount", String(filters.maxDiscount));
  if (filters.inStock) sp.set("stock", "1");
  if (sort !== "featured") sp.set("sort", sort);
  if (page > 1) sp.set("page", String(page));
  const qs = sp.toString();
  return qs ? `?${qs}` : "";
}

export interface ShopInitial {
  q?: string;
  sort: SortKey;
  page: number;
  filters: Filters;
}

export function ShopView({
  products,
  initial,
}: {
  products: Product[];
  initial: ShopInitial;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const isDesktop = useIsDesktop();
  const firstRender = useRef(true);

  const [filters, setFilters] = useState<Filters>(initial.filters);
  const [sort, setSort] = useState<SortKey>(initial.sort);
  const [page, setPage] = useState(initial.page);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mounting, setMounting] = useState(true);

  useEffect(() => {
    setFilters(initial.filters);
    setSort(initial.sort);
    setPage(initial.page);
    setMounting(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initial.q]);

  const facets = useMemo(() => getFacetOptions(), []);

  const counts = useMemo<FacetCounts>(() => {
    const category: Record<string, number> = {};
    const size: Record<string, number> = {};
    const color: Record<string, number> = {};
    for (const p of products) {
      category[p.category] = (category[p.category] ?? 0) + 1;
      for (const s of p.sizes) if (s.available) size[s.label] = (size[s.label] ?? 0) + 1;
      for (const c of p.colors) color[c.name] = (color[c.name] ?? 0) + 1;
    }
    return { category, size, color };
  }, [products]);

  const filtered = useMemo(
    () => sortProducts(filterProducts(products, { filters, q: initial.q }), sort),
    [products, filters, sort, initial.q],
  );

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const visible = filtered.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const changeFilters = useCallback((next: Filters) => {
    setFilters(next);
    setPage(1);
  }, []);

  /* keep the URL shareable without fighting the user's typing */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    const next = `${pathname}${buildQuery({ filters, sort, page: current, q: initial.q })}`;
    const currentUrl = `${pathname}${window.location.search}`;
    if (next !== currentUrl) router.replace(next, { scroll: false });
  }, [filters, sort, current, pathname, router, initial.q]);

  const chips = activeFilterChips(filters, changeFilters);
  const hasFilters = chips.length > 0;

  const clearAll = () => {
    setFilters({ ...EMPTY_FILTERS });
    setPage(1);
  };

  const filterButton = (
    <Button
      variant="outline"
      size="sm"
      onClick={() => setDrawerOpen(true)}
      icon={<SlidersHorizontal size={14} strokeWidth={1.75} />}
      className="relative"
    >
      Filters
      {chips.length ? (
        <span className="ml-1 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-semibold text-[var(--on-accent)]">
          {chips.length}
        </span>
      ) : null}
    </Button>
  );

  return (
    <div>
      {/* toolbar */}
      <div className="sticky top-[var(--header-h)] z-30 -mx-1 mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--line)] bg-[var(--bg)]/90 px-1 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          {filterButton}
          <p className="text-[13px] text-[var(--ink-3)]" aria-live="polite">
            <span className="font-medium text-[var(--ink)]">{filtered.length}</span>{" "}
            {filtered.length === 1 ? "product" : "products"}
            {initial.q ? (
              <>
                {" "}
                for “<span className="text-[var(--ink)]">{initial.q}</span>”
              </>
            ) : null}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <label className="hidden items-center gap-2 sm:flex">
            <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--ink-3)]">
              Sort
            </span>
            <Select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value as SortKey);
                setPage(1);
              }}
              className="h-9 w-[190px] text-[13px]"
              aria-label="Sort products"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </label>

          <div className="flex items-center rounded-[2px] border border-[var(--line-strong)]">
            {(
              [
                ["grid", LayoutGrid],
                ["list", List],
              ] as const
            ).map(([key, Icon]) => (
              <button
                key={key}
                type="button"
                aria-label={key === "grid" ? "Grid view" : "List view"}
                aria-pressed={view === key}
                onClick={() => setView(key)}
                className={cn(
                  "grid h-9 w-9 place-items-center transition-colors",
                  view === key
                    ? "bg-[var(--ink)] text-[var(--bg)]"
                    : "text-[var(--ink-3)] hover:text-[var(--ink)]",
                )}
              >
                <Icon size={15} strokeWidth={1.6} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* active chips */}
      {hasFilters ? (
        <div className="mb-7 flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.clear}
              className="group inline-flex items-center gap-1.5 rounded-full border border-[var(--line-strong)] bg-[var(--surface)] py-1.5 pl-3.5 pr-2.5 text-[12.5px] text-[var(--ink-2)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
            >
              {chip.label}
              <X size={13} strokeWidth={1.75} className="text-[var(--ink-3)] group-hover:text-[var(--ink)]" />
            </button>
          ))}
          <button
            type="button"
            onClick={clearAll}
            className="ml-1 text-[12px] uppercase tracking-[0.12em] text-[var(--accent)] underline-offset-4 hover:underline"
          >
            Clear all
          </button>
        </div>
      ) : null}

      {/* results */}
      {mounting ? (
        <SkeletonGrid count={8} />
      ) : !visible.length ? (
        <EmptyState
          icon={<SearchX size={26} strokeWidth={1.4} />}
          title="No products match those filters"
          description="Try widening the price range, or clear a filter or two to see more of the collection."
          action={{ label: "Clear all filters", onClick: clearAll }}
          secondaryAction={{ label: "Back to shop", href: "/shop" }}
        />
      ) : (
        <ProductGrid
          key={`${sort}-${current}-${view}-${filtered.length}`}
          products={visible}
          view={view}
          columns={4}
          priorityCount={4}
        />
      )}

      {/* pagination */}
      {pages > 1 && visible.length ? (
        <nav
          aria-label="Pagination"
          className="mt-14 flex items-center justify-center gap-2"
        >
          <button
            type="button"
            aria-label="Previous page"
            disabled={current <= 1}
            onClick={() => setPage(current - 1)}
            className="grid h-10 w-10 place-items-center rounded-[2px] border border-[var(--line-strong)] text-[var(--ink-2)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)] disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: pages }).map((_, i) => (
            <button
              key={i}
              type="button"
              aria-current={current === i + 1 ? "page" : undefined}
              onClick={() => {
                setPage(i + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={cn(
                "h-10 min-w-10 rounded-[2px] border px-3 text-[13.5px] tabular-nums transition-colors",
                current === i + 1
                  ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]"
                  : "border-[var(--line-strong)] text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]",
              )}
            >
              {i + 1}
            </button>
          ))}
          <button
            type="button"
            aria-label="Next page"
            disabled={current >= pages}
            onClick={() => setPage(current + 1)}
            className="grid h-10 w-10 place-items-center rounded-[2px] border border-[var(--line-strong)] text-[var(--ink-2)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)] disabled:opacity-30"
          >
            <ChevronRight size={16} />
          </button>
        </nav>
      ) : null}

      {/* filter drawer / bottom sheet */}
      <Sheet
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        side={isDesktop ? "right" : "bottom"}
        width="max-w-[440px]"
        title="Filters"
        description={`${filtered.length} products match your selection`}
        footer={
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="md" onClick={clearAll} disabled={!hasFilters}>
              Clear all
            </Button>
            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => setDrawerOpen(false)}
            >
              Show {filtered.length} results
            </Button>
          </div>
        }
      >
        <div className="px-6">
          <FilterContent
            filters={filters}
            onChange={changeFilters}
            counts={counts}
            priceRange={facets.priceRange}
            sizes={facets.sizes}
            colors={colors(facets.colors, products)}
          />
        </div>
      </Sheet>
    </div>
  );
}

function colors(names: string[], products: Product[]) {
  const map = new Map<string, string>();
  for (const p of products)
    for (const c of p.colors) if (!map.has(c.name)) map.set(c.name, c.hex);
  return names.map((n) => ({ name: n, hex: map.get(n) ?? "#999" }));
}
