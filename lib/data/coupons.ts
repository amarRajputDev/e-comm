import type { Coupon } from "@/types";

export const coupons: Coupon[] = [
  {
    id: "cpn-noir10",
    code: "NOIR10",
    description: "10% off your first full-price order",
    type: "percentage",
    value: 10,
    minOrder: 2999,
    maxDiscount: 1500,
    used: 412,
    usageLimit: 1000,
    expiresAt: "2026-12-31T18:29:00.000Z",
    active: true,
    scope: "all",
  },
  {
    id: "cpn-welcome15",
    code: "WELCOME15",
    description: "₹1,500 off orders above ₹9,999 for new accounts",
    type: "percentage",
    value: 15,
    minOrder: 9999,
    maxDiscount: 3000,
    used: 186,
    usageLimit: 500,
    expiresAt: "2026-11-30T18:29:00.000Z",
    active: true,
    scope: "all",
  },
  {
    id: "cpn-archive25",
    code: "ARCHIVE25",
    description: "25% off archive sale styles",
    type: "percentage",
    value: 25,
    minOrder: 0,
    maxDiscount: 4000,
    used: 97,
    usageLimit: 300,
    expiresAt: "2026-10-20T18:29:00.000Z",
    active: true,
    scope: "products",
  },
  {
    id: "cpn-freeship",
    code: "SHIP0",
    description: "Free express shipping, no minimum",
    type: "fixed",
    value: 249,
    minOrder: 0,
    maxDiscount: null,
    used: 733,
    usageLimit: 2000,
    expiresAt: "2026-11-15T18:29:00.000Z",
    active: true,
    scope: "all",
  },
  {
    id: "cpn-diwali",
    code: "DIWALI20",
    description: "Festive 20% off — expired campaign",
    type: "percentage",
    value: 20,
    minOrder: 4999,
    maxDiscount: 5000,
    used: 1204,
    usageLimit: 1500,
    expiresAt: "2025-11-05T18:29:00.000Z",
    active: false,
    scope: "all",
  },
];

export const couponMap = Object.fromEntries(coupons.map((c) => [c.code, c])) as Record<
  string,
  Coupon
>;

export interface CouponResult {
  ok: boolean;
  code?: string;
  discount: number;
  message: string;
}

export function applyCoupon(code: string, subtotal: number): CouponResult {
  const coupon = couponMap[code.trim().toUpperCase()];
  if (!coupon) return { ok: false, discount: 0, message: "That code isn’t valid." };
  if (!coupon.active)
    return { ok: false, code: coupon.code, discount: 0, message: "This code has expired." };
  if (new Date(coupon.expiresAt) < new Date())
    return { ok: false, code: coupon.code, discount: 0, message: "This code has expired." };
  if (subtotal < coupon.minOrder)
    return {
      ok: false,
      code: coupon.code,
      discount: 0,
      message: `Add ₹${(coupon.minOrder - subtotal).toLocaleString("en-IN")} more to use ${coupon.code}.`,
    };
  if (coupon.used >= coupon.usageLimit)
    return {
      ok: false,
      code: coupon.code,
      discount: 0,
      message: "This code has reached its usage limit.",
    };

  const raw =
    coupon.type === "percentage" ? (subtotal * coupon.value) / 100 : coupon.value;
  const discount = Math.min(
    Math.round(raw),
    coupon.maxDiscount ?? Number.POSITIVE_INFINITY,
    subtotal,
  );

  return {
    ok: true,
    code: coupon.code,
    discount,
    message: `${coupon.code} applied — you saved ₹${discount.toLocaleString("en-IN")}.`,
  };
}
