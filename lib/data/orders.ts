import type { Order, OrderItem, OrderStatus, PaymentStatus } from "@/types";
import { customerMap, addresses } from "./customers";
import { productMap } from "./products";
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from "@/lib/tokens";

/** Prices are GST-inclusive — `tax` is the included portion, never re-added. */
export const GST_RATE = 0.18;

function line(slug: string, qty: number, color: string, size?: string): OrderItem {
  const p = productMap[slug];
  if (!p) throw new Error(`Unknown product slug: ${slug}`);
  return {
    productId: p.id,
    productSlug: p.slug,
    name: p.name,
    image: p.images[0].src,
    variantLabel: [color, size].filter(Boolean).join(" / "),
    price: p.price,
    quantity: qty,
  };
}

function daysAgo(days: number, hour = 11, minute = 20) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
}

interface Seed {
  number: string;
  customerId: string;
  placedAt: string;
  items: OrderItem[];
  status: OrderStatus;
  payment: PaymentStatus;
  method: "card" | "upi" | "netbanking" | "cod";
  coupon?: string | null;
  discount?: number;
  shipping?: number;
  addressIndex?: number;
  note?: string;
}

const STATUS_LABELS: Record<OrderStatus, string> = {
  processing: "Processing",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

const FLOW: OrderStatus[] = [
  "processing",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
];

function buildTimeline(seed: Seed) {
  const placed = new Date(seed.placedAt);
  const startIndex = FLOW.indexOf(seed.status);

  if (seed.status === "cancelled") {
    return [
      { status: "processing" as const, label: "Order placed", at: placed.toISOString() },
      {
        status: "cancelled" as const,
        label: "Order cancelled",
        at: new Date(placed.getTime() + 5.2 * 36e5).toISOString(),
        note: "Cancelled by customer within the 30-minute window.",
      },
    ];
  }
  if (seed.status === "returned") {
    return [
      { status: "processing" as const, label: "Order placed", at: placed.toISOString() },
      { status: "shipped" as const, label: "Shipped", at: new Date(placed.getTime() + 20 * 36e5).toISOString() },
      { status: "delivered" as const, label: "Delivered", at: new Date(placed.getTime() + 58 * 36e5).toISOString() },
      { status: "returned" as const, label: "Return collected", at: new Date(placed.getTime() + 150 * 36e5).toISOString(), note: "Refund issued to source account." },
    ];
  }

  const stepMs = 9 * 36e5;
  return FLOW.slice(0, startIndex + 1).map((status, i) => ({
    status,
    label: i === 0 ? "Order placed" : STATUS_LABELS[status],
    at: new Date(placed.getTime() + i * stepMs).toISOString(),
  }));
}

const seeds: Seed[] = [
  { number: "AN-10482", customerId: "cus-amar", placedAt: daysAgo(1, 10, 12), items: [line("heavyweight-box-tee", 2, "Bone", "M"), line("merino-crew-knit", 1, "Rust", "L")], status: "processing", payment: "paid", method: "upi" },
  { number: "AN-10481", customerId: "cus-kabir", placedAt: daysAgo(1, 9, 32), items: [line("heavyweight-box-tee", 1, "Black", "M")], status: "confirmed", payment: "paid", method: "card" },
  { number: "AN-10479", customerId: "cus-sana", placedAt: daysAgo(2, 8, 55), items: [line("silk-slip-dress", 1, "Rust", "M")], status: "processing", payment: "pending", method: "cod" },
  { number: "AN-10476", customerId: "cus-meera", placedAt: daysAgo(4, 15, 5), items: [line("structured-trench-coat", 1, "Bone", "S"), line("brushed-wool-scarf", 1, "Charcoal")], status: "packed", payment: "paid", method: "card", coupon: "NOIR10", discount: 1450 },
  { number: "AN-10470", customerId: "cus-amar", placedAt: daysAgo(6, 17, 40), items: [line("grain-leather-tote", 1, "Espresso")], status: "shipped", payment: "paid", method: "upi", coupon: "NOIR10", discount: 980 },
  { number: "AN-10468", customerId: "cus-ananya", placedAt: daysAgo(7, 12, 15), items: [line("cashmere-cardigan", 1, "Cream", "M"), line("ribbed-knit-tank", 2, "Black", "S")], status: "shipped", payment: "paid", method: "netbanking" },
  { number: "AN-10465", customerId: "cus-rohan", placedAt: daysAgo(9, 10, 41), items: [line("cafe-racer-jacket", 1, "Cognac", "L"), line("court-canvas-sneaker", 1, "Chalk", "9")], status: "out_for_delivery", payment: "paid", method: "card" },
  { number: "AN-10461", customerId: "cus-tara", placedAt: daysAgo(12, 13, 27), items: [line("poplin-midi-shirt", 2, "Chalk", "M"), line("high-rise-wide-trouser", 1, "Charcoal", "M")], status: "out_for_delivery", payment: "paid", method: "upi" },
  { number: "AN-10455", customerId: "cus-amar", placedAt: daysAgo(16, 11, 12), items: [line("minimal-automatic-watch", 1, "Black"), line("edge-grain-belt", 1, "Espresso", "34")], status: "delivered", payment: "paid", method: "card", coupon: "WELCOME15", discount: 1875 },
  { number: "AN-10452", customerId: "cus-isha", placedAt: daysAgo(19, 16, 2), items: [line("acetate-sunglasses", 1, "Espresso")], status: "delivered", payment: "paid", method: "upi" },
  { number: "AN-10447", customerId: "cus-neel", placedAt: daysAgo(24, 9, 18), items: [line("oxford-overshirt", 1, "Sage", "L"), line("pleated-wool-trouser", 1, "Navy", "32")], status: "delivered", payment: "paid", method: "card" },
  { number: "AN-10441", customerId: "cus-meera", placedAt: daysAgo(31, 14, 50), items: [line("relaxed-linen-shirt", 2, "Sage", "S")], status: "delivered", payment: "refunded", method: "upi", addressIndex: 0 },
  { number: "AN-10436", customerId: "cus-ananya", placedAt: daysAgo(38, 12, 44), items: [line("structured-trench-coat", 1, "Espresso", "M")], status: "returned", payment: "refunded", method: "card" },
  { number: "AN-10428", customerId: "cus-dev", placedAt: daysAgo(46, 18, 9), items: [line("minimal-automatic-watch", 1, "Charcoal")], status: "cancelled", payment: "refunded", method: "netbanking", note: "Payment failed on the issuing bank side." },
  { number: "AN-10420", customerId: "cus-tara", placedAt: daysAgo(52, 10, 33), items: [line("ribbed-knit-tank", 3, "Stone", "M"), line("brushed-wool-scarf", 1, "Rust")], status: "delivered", payment: "paid", method: "cod" },
  { number: "AN-10412", customerId: "cus-amar", placedAt: daysAgo(58, 15, 21), items: [line("court-canvas-sneaker", 1, "Black", "10"), line("heavyweight-box-tee", 2, "Olive", "L")], status: "delivered", payment: "paid", method: "card" },
];

export const orders: Order[] = seeds.map((seed) => {
  const customer = customerMap[seed.customerId];
  const addrs = addresses[seed.customerId] ?? [];
  const address = addrs[seed.addressIndex ?? 0] ?? addrs[0] ?? {
    id: "addr-fallback",
    label: "Home",
    fullName: customer?.name ?? "Customer",
    phone: customer?.phone ?? "",
    line1: "Address on file",
    city: customer?.city ?? "",
    state: "",
    pincode: "",
    country: "India",
    isDefault: true,
  };

  const subtotal = seed.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const discount = seed.discount ?? 0;
  const shipping =
    seed.shipping ??
    (subtotal - discount >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE);
  const total = subtotal - discount + shipping;
  const tax = Math.round((total * GST_RATE) / (1 + GST_RATE));

  return {
    id: `ord-${seed.number}`,
    number: seed.number,
    customerId: seed.customerId,
    customerName: customer?.name ?? "Customer",
    customerEmail: customer?.email ?? "customer@example.com",
    placedAt: seed.placedAt,
    items: seed.items,
    itemCount: seed.items.reduce((n, i) => n + i.quantity, 0),
    subtotal,
    discount,
    shipping,
    tax,
    total,
    status: seed.status,
    paymentStatus: seed.payment,
    paymentMethod: seed.method,
    address,
    couponCode: seed.coupon ?? null,
    eta:
      seed.status === "delivered" || seed.status === "cancelled"
        ? "—"
        : new Date(new Date(seed.placedAt).getTime() + 4 * 864e5).toLocaleDateString(
            "en-IN",
            { day: "2-digit", month: "short" },
          ),
    timeline: buildTimeline(seed),
    internalNote: seed.note,
  };
});

export const orderMap = Object.fromEntries(orders.map((o) => [o.number, o])) as Record<
  string,
  Order
>;

export function ordersForCustomer(customerId: string) {
  return orders.filter((o) => o.customerId === customerId);
}

export { STATUS_LABELS };
