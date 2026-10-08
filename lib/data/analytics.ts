import type { AnalyticsPoint, DashboardStats } from "@/types";
import { products } from "./products";
import { orders } from "./orders";

export type RangeKey = "7d" | "30d" | "90d" | "1y";

export const RANGES: { key: RangeKey; label: string; days: number; ticks: number }[] = [
  { key: "7d", label: "7 Days", days: 7, ticks: 7 },
  { key: "30d", label: "30 Days", days: 30, ticks: 6 },
  { key: "90d", label: "90 Days", days: 90, ticks: 6 },
  { key: "1y", label: "1 Year", days: 365, ticks: 12 },
];

/** Deterministic hash → [0,1) so charts render identically on every load. */
function noise(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

function seededSeries(days: number): AnalyticsPoint[] {
  const points: AnalyticsPoint[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);
    const idx = days - i;
    const dow = d.getDay();
    const weekendLift = dow === 0 || dow === 6 ? 1.24 : 1;
    const trend = 1 + (idx / days) * 0.42;
    const wave = 1 + Math.sin(idx / 4.4) * 0.16;
    const jitter = 0.82 + noise(idx * 3.17) * 0.38;
    const revenue = Math.round(42000 * weekendLift * trend * wave * jitter);
    const visitors = Math.round(revenue / (380 + noise(idx) * 190));
    const ordersCount = Math.max(1, Math.round(revenue / (4100 + noise(idx + 7) * 900)));

    points.push({
      date: d.toISOString().slice(0, 10),
      revenue,
      orders: ordersCount,
      visitors,
    });
  }
  return points;
}

const seriesCache = new Map<number, AnalyticsPoint[]>();
function series(days: number) {
  const hit = seriesCache.get(days);
  if (hit) return hit;
  const value = seededSeries(days);
  seriesCache.set(days, value);
  return value;
}

export function getSeries(range: RangeKey) {
  const found = RANGES.find((r) => r.key === range) ?? RANGES[0];
  return series(found.days);
}

export function getDashboardStats(): DashboardStats {
  const month = series(30);
  const prevMonth = series(60).slice(0, 30);
  const sum = (pts: AnalyticsPoint[], key: "revenue" | "orders" | "visitors") =>
    pts.reduce((n, p) => n + p[key], 0);

  const revenue = sum(month, "revenue");
  const prevRevenue = sum(prevMonth, "revenue");
  const ordersCount = sum(month, "orders");
  const prevOrders = sum(prevMonth, "orders");
  const visitors = sum(month, "visitors");

  const pct = (now: number, before: number) =>
    Math.round(((now - before) / Math.max(before, 1)) * 1000) / 10;

  return {
    revenue,
    revenueDelta: pct(revenue, prevRevenue),
    orders: ordersCount,
    ordersDelta: pct(ordersCount, prevOrders),
    customers: 8942,
    customersDelta: 6.2,
    conversion: Math.round((ordersCount / Math.max(visitors, 1)) * 1000) / 10,
    conversionDelta: 0.7,
    aov: Math.round(revenue / Math.max(ordersCount, 1)),
    aovDelta: pct(revenue / Math.max(ordersCount, 1), prevRevenue / Math.max(prevOrders, 1)),
  };
}

export function getCategoryBreakdown() {
  const buckets: Record<string, { revenue: number; orders: number }> = {};
  for (const o of orders) {
    if (o.status === "cancelled") continue;
    for (const item of o.items) {
      const product = products.find((p) => p.slug === item.productSlug);
      const key = product?.category ?? "other";
      buckets[key] ??= { revenue: 0, orders: 0 };
      buckets[key].revenue += item.price * item.quantity;
      buckets[key].orders += 1;
    }
  }
  const fallback = [
    { key: "men", revenue: 486200, orders: 412 },
    { key: "women", revenue: 521800, orders: 388 },
    { key: "accessories", revenue: 240520, orders: 484 },
  ];
  const list = Object.entries(buckets).map(([key, v]) => ({ key, ...v }));
  const source = list.length >= 3 ? list : fallback;
  const total = source.reduce((n, r) => n + r.revenue, 0) || 1;
  return source
    .map((r) => ({ ...r, share: Math.round((r.revenue / total) * 1000) / 10 }))
    .sort((a, b) => b.revenue - a.revenue);
}

export function getTopProducts(limit = 6) {
  return [...products]
    .sort((a, b) => b.sold - a.sold)
    .slice(0, limit)
    .map((p) => ({
      slug: p.slug,
      name: p.name,
      category: p.category,
      sold: p.sold,
      revenue: p.sold * p.price,
      rating: p.rating,
      image: p.images[0].src,
      stock: p.stock,
    }));
}

export function getAcquisition() {
  return [
    { channel: "Organic search", value: 38, users: 41_240 },
    { channel: "Direct", value: 24, users: 26_040 },
    { channel: "Instagram", value: 19, users: 20_610 },
    { channel: "Email", value: 11, users: 11_890 },
    { channel: "Referral", value: 8, users: 8_640 },
  ];
}

export function getFunnel() {
  return [
    { stage: "Sessions", value: 108_420 },
    { stage: "Product views", value: 61_880 },
    { stage: "Add to cart", value: 14_260 },
    { stage: "Checkout started", value: 6_140 },
    { stage: "Purchased", value: 5_204 },
  ];
}

export function getPaymentSplit() {
  return [
    { method: "UPI", share: 46 },
    { method: "Card", share: 34 },
    { method: "Net banking", share: 12 },
    { method: "Cash on delivery", share: 8 },
  ];
}

export function getInventoryAlerts() {
  return products
    .filter((p) => p.stock <= 24)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6)
    .map((p) => ({ slug: p.slug, name: p.name, stock: p.stock, sold: p.sold }));
}
