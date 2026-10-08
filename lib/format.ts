/**
 * Captured once at module load. Component render paths must not call
 * `new Date()` / `Date.now()` directly — Next's prerender treats those as
 * unstable values. Relative times are anchored to this constant instead.
 */
const NOW = Date.now();

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrPrecise = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** ₹1,45,000 — Indian digit grouping, no paise. */
export function money(value: number) {
  return inr.format(Math.round(value));
}

/** ₹1,45,000.00 — for order summaries where paise matter. */
export function moneyPrecise(value: number) {
  return inrPrecise.format(value);
}

export function compactMoney(value: number) {
  if (value >= 1_00_00_000) return `₹${(value / 1_00_00_000).toFixed(1)}Cr`;
  if (value >= 1_00_000) return `₹${(value / 1_00_000).toFixed(1)}L`;
  if (value >= 1_000) return `₹${(value / 1_000).toFixed(value >= 10_000 ? 0 : 1)}K`;
  return money(value);
}

export function discountPercent(price: number, compareAt?: number | null) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...opts,
  });
}

export function formatDateLong(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function timeAgo(date: string | Date) {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.round((NOW - d.getTime()) / 1000);
  const units: [number, Intl.RelativeTimeFormatUnit][] = [
    [60, "second"],
    [60, "minute"],
    [24, "hour"],
    [7, "day"],
    [4.34524, "week"],
    [12, "month"],
    [Number.POSITIVE_INFINITY, "year"],
  ];
  let value = seconds;
  for (const [amount, unit] of units) {
    if (Math.abs(value) < amount) {
      return new Intl.RelativeTimeFormat("en-IN", { numeric: "auto" }).format(
        -Math.round(value),
        unit,
      );
    }
    value /= amount;
  }
  return "just now";
}

export function orderDateRange(days: number) {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - days);
  return { from, to };
}
