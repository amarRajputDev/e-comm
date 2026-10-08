import type { CartLine } from "@/types";
import {
  EXPRESS_SHIPPING_FEE,
  FREE_SHIPPING_THRESHOLD,
  STANDARD_SHIPPING_FEE,
} from "@/lib/tokens";
import { GST_RATE } from "@/lib/data/orders";

export type ShippingMethod = "standard" | "express" | "pickup";

export interface CartTotals {
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  freeShippingRemaining: number;
  freeShippingProgress: number;
  saved: number;
}

export const shippingLabel: Record<ShippingMethod, string> = {
  standard: "Standard delivery (3–5 days)",
  express: "Express delivery (1–2 days)",
  pickup: "Collect in store — Indiranagar",
};

export function shippingCost(method: ShippingMethod, subtotal: number) {
  if (method === "pickup") return 0;
  if (method === "express") return EXPRESS_SHIPPING_FEE;
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE;
}

export function computeTotals(
  lines: CartLine[],
  options: { discount?: number; shippingMethod?: ShippingMethod } = {},
): CartTotals {
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.quantity, 0);
  const itemCount = lines.reduce((sum, l) => sum + l.quantity, 0);
  const saved = lines.reduce(
    (sum, l) => sum + (l.compareAt && l.compareAt > l.price ? l.compareAt - l.price : 0) * l.quantity,
    0,
  );
  const discount = Math.min(options.discount ?? 0, subtotal);
  const shipping = shippingCost(options.shippingMethod ?? "standard", subtotal - discount);
  const total = subtotal - discount + shipping;
  const tax = Math.round((total * GST_RATE) / (1 + GST_RATE));
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - (subtotal - discount));

  return {
    itemCount,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    freeShippingRemaining,
    freeShippingProgress: Math.min(
      1,
      (subtotal - discount) / FREE_SHIPPING_THRESHOLD,
    ),
    saved,
  };
}

export function lineKey(productId: string, color: string, size?: string | null) {
  return [productId, color, size ?? "-"].join("::");
}
