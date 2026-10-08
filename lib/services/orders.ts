import type { Order, OrderStatus } from "@/types";
import { orders as source, ordersForCustomer, STATUS_LABELS } from "@/lib/data/orders";

export async function getOrders(): Promise<Order[]> {
  return source;
}

export async function getOrder(number: string): Promise<Order | undefined> {
  return source.find((o) => o.number === number || o.id === number);
}

export async function getCustomerOrders(customerId: string): Promise<Order[]> {
  return ordersForCustomer(customerId);
}

export interface OrderQuery {
  q?: string;
  status?: OrderStatus | "all";
  sort?: "recent" | "oldest" | "amount-desc" | "amount-asc";
  page?: number;
  perPage?: number;
}

export async function queryOrders(query: OrderQuery = {}) {
  const perPage = query.perPage ?? 8;
  const page = Math.max(1, query.page ?? 1);
  const q = query.q?.trim().toLowerCase() ?? "";

  let items = source.filter((o) => {
    if (query.status && query.status !== "all" && o.status !== query.status) return false;
    if (!q) return true;
    return [o.number, o.customerName, o.customerEmail, ...o.items.map((i) => i.name)]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  switch (query.sort) {
    case "oldest":
      items = items.sort((a, b) => +new Date(a.placedAt) - +new Date(b.placedAt));
      break;
    case "amount-desc":
      items = items.sort((a, b) => b.total - a.total);
      break;
    case "amount-asc":
      items = items.sort((a, b) => a.total - b.total);
      break;
    default:
      items = items.sort((a, b) => +new Date(b.placedAt) - +new Date(a.placedAt));
  }

  return {
    items: items.slice((page - 1) * perPage, page * perPage),
    total: items.length,
    page,
    perPage,
    pages: Math.max(1, Math.ceil(items.length / perPage)),
  };
}

export const orderStatuses = STATUS_LABELS;

/* ------------------------------------------------------------------ */
/* Checkout                                                            */
/* ------------------------------------------------------------------ */

export const LAST_ORDER_KEY = "an.lastOrder";

export interface CheckoutPayload {
  items: {
    productSlug: string;
    name: string;
    image: string;
    variantLabel: string;
    price: number;
    quantity: number;
  }[];
  contact: { email: string; phone: string };
  address: {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
  };
  shippingMethod: string;
  paymentMethod: string;
  totals: { subtotal: number; discount: number; shipping: number; total: number };
  couponCode?: string;
}

export interface PlacedOrder {
  number: string;
  placedAt: string;
  eta: string;
  payload: CheckoutPayload;
}

/**
 * Mock order placement. Swap for a POST /orders handler once the backend is
 * wired up — the payload shape is already API-friendly.
 */
export async function placeOrder(payload: CheckoutPayload): Promise<PlacedOrder> {
  await new Promise((r) => setTimeout(r, 1400));

  const seed = Date.now() % 900;
  const order: PlacedOrder = {
    number: `AN-${10483 + seed}`,
    placedAt: new Date().toISOString(),
    eta: new Date(Date.now() + 4 * 864e5).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
    }),
    payload,
  };

  try {
    window.sessionStorage.setItem(LAST_ORDER_KEY, JSON.stringify(order));
  } catch {
    /* storage unavailable */
  }

  return order;
}

export function readLastOrder(): PlacedOrder | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(LAST_ORDER_KEY);
    return raw ? (JSON.parse(raw) as PlacedOrder) : null;
  } catch {
    return null;
  }
}
