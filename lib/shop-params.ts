import { EMPTY_FILTERS, type Filters, type SortKey } from "@/types";

type Params = Record<string, string | string[] | undefined>;

function str(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function list(value: string | string[] | undefined) {
  const raw = str(value);
  return raw ? raw.split(",").map((v) => v.trim()).filter(Boolean) : [];
}

function num(value: string | string[] | undefined) {
  const parsed = Number(str(value));
  return Number.isFinite(parsed) ? parsed : null;
}

const SORTS: SortKey[] = [
  "featured",
  "newest",
  "price-asc",
  "price-desc",
  "rating",
  "best-selling",
];

export interface ShopParams {
  q?: string;
  sort: SortKey;
  page: number;
  filters: Filters;
}

export function parseShopParams(params: Params): ShopParams {
  const min = num(params.min);
  const max = num(params.max);
  const rating = num(params.rating);
  const discount = num(params.discount);
  const sortRaw = str(params.sort) as SortKey | undefined;
  const pageRaw = num(params.page);

  const filters: Filters = {
    ...EMPTY_FILTERS,
    categories: list(params.category),
    price: min !== null || max !== null ? [min ?? 0, max ?? 100000] : null,
    sizes: list(params.size),
    colors: list(params.color),
    rating: rating ?? null,
    maxDiscount: discount ?? null,
    inStock: str(params.stock) === "1",
  };

  return {
    q: str(params.q) || undefined,
    sort: sortRaw && SORTS.includes(sortRaw) ? sortRaw : "featured",
    page: pageRaw && pageRaw > 0 ? pageRaw : 1,
    filters,
  };
}
