"use client";

import type { Filters } from "@/types";
import { categories } from "@/lib/data/categories";
import { money, discountPercent } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Stars } from "@/components/ui/rating";

export interface FacetCounts {
  category: Record<string, number>;
  size: Record<string, number>;
  color: Record<string, number>;
}

function Group({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group border-b border-[var(--line)] py-5">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--ink)] marker:hidden">
        {title}
        <span className="relative grid h-4 w-4 place-items-center text-[var(--ink-3)]">
          <span className="absolute h-px w-3 bg-current transition-transform duration-300 group-open:rotate-90" />
          <span className="absolute h-px w-3 bg-current" />
        </span>
      </summary>
      <div className="pt-4">{children}</div>
    </details>
  );
}

function CheckRow({
  checked,
  onChange,
  label,
  count,
  swatch,
}: {
  checked: boolean;
  onChange: () => void;
  label: string;
  count?: number;
  swatch?: string;
}) {
  return (
    <label className="group flex cursor-pointer items-center gap-3 py-1.5 text-[14px] text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        aria-hidden
        className={cn(
          "grid h-4 w-4 shrink-0 place-items-center rounded-[2px] border transition-all duration-200 peer-checked:border-[var(--accent)] peer-checked:bg-[var(--accent)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent)]",
          checked ? "border-[var(--accent)] bg-[var(--accent)]" : "border-[var(--line-strong)]",
        )}
      >
        <svg viewBox="0 0 10 8" className={cn("h-2 w-2.5", checked ? "opacity-100" : "opacity-0")}>
          <path
            d="M1 4 3.5 6.5 9 1"
            fill="none"
            stroke="var(--on-accent)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {swatch ? (
        <span
          aria-hidden
          className="h-4 w-4 shrink-0 rounded-full border border-[var(--line-strong)]"
          style={{ backgroundColor: swatch }}
        />
      ) : null}
      <span className="flex-1">{label}</span>
      {typeof count === "number" ? (
        <span className="text-[12px] tabular-nums text-[var(--ink-3)]">{count}</span>
      ) : null}
    </label>
  );
}

export function FilterContent({
  filters,
  onChange,
  counts,
  priceRange,
  sizes,
  colors,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
  counts: FacetCounts;
  priceRange: [number, number];
  sizes: string[];
  colors: { name: string; hex: string }[];
}) {
  const toggleIn = (list: string[], value: string) =>
    list.includes(value) ? list.filter((v) => v !== value) : [...list, value];

  const presets: { label: string; range: [number, number] }[] = [
    { label: "Under ₹3,000", range: [0, 3000] },
    { label: "₹3,000 – ₹6,000", range: [3000, 6000] },
    { label: "₹6,000 – ₹10,000", range: [6000, 10000] },
    { label: "₹10,000+", range: [10000, priceRange[1]] },
  ];

  return (
    <div>
      <Group title="Category">
        <div className="space-y-0.5">
          {categories
            .filter((c) => c.order <= 3)
            .map((c) => (
              <CheckRow
                key={c.id}
                label={c.name}
                count={counts.category[c.slug] ?? 0}
                checked={filters.categories.includes(c.slug)}
                onChange={() =>
                  onChange({ ...filters, categories: toggleIn(filters.categories, c.slug) })
                }
              />
            ))}
        </div>
      </Group>

      <Group title="Price">
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => {
            const active =
              filters.price?.[0] === p.range[0] && filters.price?.[1] === p.range[1];
            return (
              <button
                key={p.label}
                type="button"
                onClick={() =>
                  onChange({ ...filters, price: active ? null : p.range })
                }
                className={cn(
                  "rounded-[2px] border px-3 py-1.5 text-[12.5px] transition-colors",
                  active
                    ? "border-[var(--accent)] bg-[var(--accent-tint)] text-[var(--accent)]"
                    : "border-[var(--line-strong)] text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]",
                )}
              >
                {p.label}
              </button>
            );
          })}
        </div>
        <div className="mt-4 flex items-center gap-3">
          <label className="flex-1">
            <span className="sr-only">Minimum price</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder={money(priceRange[0]).replace(/\s/g, "")}
              value={filters.price?.[0] ?? ""}
              onChange={(e) => {
                const v = Number(e.target.value);
                onChange({
                  ...filters,
                  price: [
                    Number.isFinite(v) && e.target.value !== "" ? v : 0,
                    filters.price?.[1] ?? priceRange[1],
                  ],
                });
              }}
              className="h-10 w-full rounded-[2px] border border-[var(--line-strong)] bg-[var(--surface)] px-3 text-[13.5px] tabular-nums focus:border-[var(--accent)] focus:outline-none"
            />
          </label>
          <span className="text-[var(--ink-3)]">—</span>
          <label className="flex-1">
            <span className="sr-only">Maximum price</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              placeholder={money(priceRange[1]).replace(/\s/g, "")}
              value={filters.price?.[1] ?? ""}
              onChange={(e) => {
                const v = Number(e.target.value);
                onChange({
                  ...filters,
                  price: [
                    filters.price?.[0] ?? priceRange[0],
                    Number.isFinite(v) && e.target.value !== "" ? v : priceRange[1],
                  ],
                });
              }}
              className="h-10 w-full rounded-[2px] border border-[var(--line-strong)] bg-[var(--surface)] px-3 text-[13.5px] tabular-nums focus:border-[var(--accent)] focus:outline-none"
            />
          </label>
        </div>
      </Group>

      <Group title="Size">
        <div className="flex flex-wrap gap-2">
          {sizes.map((size) => {
            const active = filters.sizes.includes(size);
            const disabled = (counts.size[size] ?? 0) === 0;
            return (
              <button
                key={size}
                type="button"
                disabled={disabled}
                aria-pressed={active}
                onClick={() => onChange({ ...filters, sizes: toggleIn(filters.sizes, size) })}
                className={cn(
                  "min-w-11 rounded-[2px] border px-3 py-2 text-[13px] transition-colors",
                  active
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]"
                    : "border-[var(--line-strong)] text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]",
                  disabled && "cursor-not-allowed opacity-35 hover:border-[var(--line-strong)]",
                )}
              >
                {size}
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Colour">
        <div className="grid grid-cols-2 gap-x-4">
          {colors.map((c) => (
            <CheckRow
              key={c.name}
              label={c.name}
              swatch={c.hex}
              count={counts.color[c.name] ?? 0}
              checked={filters.colors.includes(c.name)}
              onChange={() => onChange({ ...filters, colors: toggleIn(filters.colors, c.name) })}
            />
          ))}
        </div>
      </Group>

      <Group title="Rating" defaultOpen={false}>
        <div className="space-y-1.5">
          {[4.5, 4, 3.5, 3].map((r) => (
            <label
              key={r}
              className="flex cursor-pointer items-center gap-3 py-1 text-[13.5px] text-[var(--ink-2)] transition-colors hover:text-[var(--ink)]"
            >
              <input
                type="radio"
                name="rating-filter"
                checked={filters.rating === r}
                onChange={() =>
                  onChange({ ...filters, rating: filters.rating === r ? null : r })
                }
                className="peer sr-only"
              />
              <span
                aria-hidden
                className={cn(
                  "grid h-4 w-4 shrink-0 place-items-center rounded-full border transition-all peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent)]",
                  filters.rating === r
                    ? "border-[var(--accent)]"
                    : "border-[var(--line-strong)]",
                )}
              >
                <span
                  className={cn(
                    "h-2 w-2 rounded-full bg-[var(--accent)] transition-transform",
                    filters.rating === r ? "scale-100" : "scale-0",
                  )}
                />
              </span>
              <Stars value={r} size={12} />
              <span>&amp; up</span>
            </label>
          ))}
        </div>
      </Group>

      <Group title="Discount" defaultOpen={false}>
        <div className="flex flex-wrap gap-2">
          {[10, 20, 30].map((d) => {
            const active = filters.maxDiscount === d;
            return (
              <button
                key={d}
                type="button"
                onClick={() =>
                  onChange({ ...filters, maxDiscount: active ? null : d })
                }
                className={cn(
                  "rounded-[2px] border px-3 py-1.5 text-[12.5px] transition-colors",
                  active
                    ? "border-[var(--accent)] bg-[var(--accent-tint)] text-[var(--accent)]"
                    : "border-[var(--line-strong)] text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]",
                )}
              >
                {d}% or more
              </button>
            );
          })}
        </div>
      </Group>

      <Group title="Availability">
        <label className="flex cursor-pointer items-center justify-between text-[14px] text-[var(--ink-2)]">
          In stock only
          <span className="relative">
            <input
              type="checkbox"
              checked={filters.inStock}
              onChange={(e) => onChange({ ...filters, inStock: e.target.checked })}
              className="peer sr-only"
            />
            <span className="block h-6 w-11 rounded-full bg-[var(--line-strong)] transition-colors peer-checked:bg-[var(--accent)] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--accent)]" />
            <span
              className={cn(
                "absolute left-1 top-1 h-4 w-4 rounded-full bg-white transition-transform",
                filters.inStock ? "translate-x-5" : "translate-x-0",
              )}
            />
          </span>
        </label>
      </Group>
    </div>
  );
}

export function activeFilterChips(filters: Filters, onChange: (next: Filters) => void) {
  const chips: { key: string; label: string; clear: () => void }[] = [];

  filters.categories.forEach((c) =>
    chips.push({
      key: `cat-${c}`,
      label: categories.find((x) => x.slug === c)?.name ?? c,
      clear: () => onChange({ ...filters, categories: filters.categories.filter((x) => x !== c) }),
    }),
  );

  if (filters.price)
    chips.push({
      key: "price",
      label: `${money(filters.price[0])} – ${money(filters.price[1])}`,
      clear: () => onChange({ ...filters, price: null }),
    });

  filters.sizes.forEach((s) =>
    chips.push({
      key: `size-${s}`,
      label: `Size ${s}`,
      clear: () => onChange({ ...filters, sizes: filters.sizes.filter((x) => x !== s) }),
    }),
  );

  filters.colors.forEach((c) =>
    chips.push({
      key: `color-${c}`,
      label: c,
      clear: () => onChange({ ...filters, colors: filters.colors.filter((x) => x !== c) }),
    }),
  );

  if (filters.rating)
    chips.push({
      key: "rating",
      label: `${filters.rating}★ & up`,
      clear: () => onChange({ ...filters, rating: null }),
    });

  if (filters.maxDiscount)
    chips.push({
      key: "discount",
      label: `${filters.maxDiscount}%+ off`,
      clear: () => onChange({ ...filters, maxDiscount: null }),
    });

  if (filters.inStock)
    chips.push({
      key: "stock",
      label: "In stock",
      clear: () => onChange({ ...filters, inStock: false }),
    });

  return chips;
}

export { discountPercent };
