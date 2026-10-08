import type { Review, ReviewStatus } from "@/types";
import { reviews as source, reviewsForProduct, testimonials } from "@/lib/data/reviews";

export async function getReviews(): Promise<Review[]> {
  return source;
}

export async function getProductReviews(productId: string): Promise<Review[]> {
  return reviewsForProduct(productId);
}

export async function getTestimonials() {
  return testimonials;
}

export interface ReviewQuery {
  q?: string;
  status?: ReviewStatus | "all";
  rating?: number | "all";
  page?: number;
  perPage?: number;
}

export async function queryReviews(query: ReviewQuery = {}) {
  const perPage = query.perPage ?? 8;
  const page = Math.max(1, query.page ?? 1);
  const q = query.q?.trim().toLowerCase() ?? "";

  const items = source.filter((r) => {
    if (query.status && query.status !== "all" && r.status !== query.status) return false;
    if (query.rating !== undefined && query.rating !== "all" && r.rating !== query.rating)
      return false;
    if (!q) return true;
    return [r.productName, r.customerName, r.title, r.body]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  return {
    items: items.slice((page - 1) * perPage, page * perPage),
    total: items.length,
    page,
    perPage,
    pages: Math.max(1, Math.ceil(items.length / perPage)),
  };
}

/** Optimistic moderation — returns the updated review for the caller to cache. */
export function moderateReview(id: string, status: ReviewStatus) {
  const found = source.find((r) => r.id === id);
  if (found) found.status = status;
  return found;
}
