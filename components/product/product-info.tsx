"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Truck, RotateCcw, ShieldCheck, Ruler } from "lucide-react";
import type { Product } from "@/types";
import { useCart, useWishlist } from "@/lib/store/providers";
import { Price } from "./price";
import { RatingSummary } from "@/components/ui/rating";
import { QuantitySelector } from "@/components/ui/quantity";
import { Accordion } from "@/components/ui/accordion";
import { Dialog } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { money, discountPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

const SIZE_GUIDE = [
  { size: "XS", chest: "86", waist: "72", length: "66" },
  { size: "S", chest: "92", waist: "78", length: "68" },
  { size: "M", chest: "98", waist: "84", length: "70" },
  { size: "L", chest: "104", waist: "90", length: "72" },
  { size: "XL", chest: "110", waist: "96", length: "74" },
  { size: "XXL", chest: "116", waist: "102", length: "76" },
];

export function ProductInfo({ product }: { product: Product }) {
  const router = useRouter();
  const { add } = useCart();
  const { has, toggle, hydrated } = useWishlist();
  const firstAvailableColor =
    product.colors.find((c) => c.available)?.name ?? product.colors[0]?.name;
  const firstAvailableSize =
    product.sizes.find((s) => s.available)?.label ?? product.sizes[0]?.label ?? null;

  const [color, setColor] = useState(firstAvailableColor);
  const [size, setSize] = useState<string | null>(firstAvailableSize);
  const [qty, setQty] = useState(1);
  const [guideOpen, setGuideOpen] = useState(false);
  const [touched, setTouched] = useState(false);

  const wished = hydrated && has(product.id);
  const pct = discountPercent(product.price, product.compareAt);
  const soldOut = product.stock === 0;
  const lowStock = !soldOut && product.stock <= 15;

  const selectedSize = useMemo(
    () => product.sizes.find((s) => s.label === size),
    [product.sizes, size],
  );

  const needsSize = product.sizes.length > 1 && !size;
  const sizeNote = selectedSize?.note;

  const onAdd = () => {
    if (needsSize) {
      setTouched(true);
      return;
    }
    add(product, color, size, qty);
  };

  const onBuyNow = () => {
    if (needsSize) {
      setTouched(true);
      return;
    }
    add(product, color, size, qty);
    router.push("/checkout");
  };

  return (
    <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
      <div className="flex items-center gap-3">
        <p className="eyebrow text-[var(--ink-3)]">{product.brand}</p>
        <span className="h-3 w-px bg-[var(--line-strong)]" />
        <p className="eyebrow capitalize text-[var(--ink-3)]">{product.category}</p>
        {product.isNew ? <Badge tone="dark">New in</Badge> : null}
      </div>

      <h1 className="mt-4 text-[clamp(1.75rem,3vw,2.4rem)] font-medium leading-[1.06] tracking-[-0.03em] text-[var(--ink)]">
        {product.name}
      </h1>

      <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
        <RatingSummary value={product.rating} count={product.reviewCount} />
        <a
          href="#reviews"
          className="text-[13px] text-[var(--ink-3)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
        >
          Read reviews
        </a>
      </div>

      <div className="mt-6 flex flex-wrap items-end gap-x-4 gap-y-2 border-b border-[var(--line)] pb-6">
        <Price price={product.price} compareAt={product.compareAt} size="lg" />
        {pct > 0 ? (
          <span className="rounded-[2px] bg-[var(--accent)] px-2 py-1 text-[10.5px] font-semibold uppercase tracking-[0.1em] text-[var(--on-accent)]">
            {pct}% off
          </span>
        ) : null}
        <span className="text-[12.5px] text-[var(--ink-3)]">Inclusive of all taxes</span>
      </div>

      <p className="mt-5 text-[15px] leading-relaxed text-[var(--ink-2)]">
        {product.shortDescription}
      </p>

      {/* availability */}
      <p className="mt-4 flex items-center gap-2 text-[13.5px]">
        <span
          className={cn(
            "h-1.5 w-1.5 rounded-full",
            soldOut
              ? "bg-[var(--danger)]"
              : lowStock
                ? "animate-[pulse-dot_1.6s_ease-in-out_infinite] bg-[var(--warning)]"
                : "bg-[var(--success)]",
          )}
        />
        <span className="text-[var(--ink-2)]">
          {soldOut
            ? "Sold out — join the waitlist below"
            : lowStock
              ? `Only ${product.stock} left in stock`
              : "In stock — ships within 24 hours"}
        </span>
      </p>

      {/* colours */}
      <div className="mt-7">
        <div className="flex items-baseline justify-between">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--ink-3)]">
            Colour
          </p>
          <p className="text-[13px] text-[var(--ink)]">{color}</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-2.5">
          {product.colors.map((c) => {
            const active = color === c.name;
            return (
              <button
                key={c.name}
                type="button"
                title={c.name}
                aria-label={`Colour ${c.name}${c.available ? "" : " (sold out)"}`}
                aria-pressed={active}
                disabled={!c.available}
                onClick={() => setColor(c.name)}
                className={cn(
                  "relative grid h-10 w-10 place-items-center rounded-full border transition-all duration-200",
                  active
                    ? "border-[var(--ink)]"
                    : "border-[var(--line-strong)] hover:border-[var(--ink-3)]",
                  !c.available && "cursor-not-allowed opacity-40",
                )}
              >
                <span
                  className="h-7 w-7 rounded-full border border-black/10"
                  style={{ backgroundColor: c.hex }}
                />
                {active ? (
                  <span className="absolute -bottom-1 h-1 w-4 rounded-full bg-[var(--ink)]" />
                ) : null}
              </button>
            );
          })}
        </div>
      </div>

      {/* sizes */}
      <div className="mt-7">
        <div className="flex items-baseline justify-between">
          <p className="text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--ink-3)]">
            Size {needsSize && touched ? <span className="text-[var(--accent)]">— required</span> : null}
          </p>
          <button
            type="button"
            onClick={() => setGuideOpen(true)}
            className="inline-flex items-center gap-1.5 text-[12.5px] text-[var(--ink-2)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
          >
            <Ruler size={13} strokeWidth={1.6} /> Size guide
          </button>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {product.sizes.map((s) => {
            const active = size === s.label;
            return (
              <button
                key={s.label}
                type="button"
                disabled={!s.available}
                aria-pressed={active}
                onClick={() => {
                  setSize(s.label);
                  setTouched(false);
                }}
                className={cn(
                  "relative min-w-[52px] rounded-[2px] border px-3 py-2.5 text-[13.5px] transition-all duration-200",
                  active
                    ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]"
                    : "border-[var(--line-strong)] text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]",
                  !s.available &&
                    "cursor-not-allowed text-[var(--ink-3)] line-through opacity-45 hover:border-[var(--line-strong)]",
                )}
              >
                {s.label}
              </button>
            );
          })}
        </div>
        {needsSize && touched ? (
          <p role="alert" className="mt-2 text-[13px] text-[var(--danger)]">
            Choose a size to continue.
          </p>
        ) : sizeNote ? (
          <p className="mt-2 text-[13px] text-[var(--ink-3)]">{sizeNote}</p>
        ) : null}
      </div>

      {/* quantity + actions */}
      <div className="mt-7 flex flex-wrap items-center gap-4">
        <QuantitySelector value={qty} onChange={setQty} max={Math.max(product.stock, 1)} />
        <p className="text-[13px] text-[var(--ink-3)]">
          Subtotal <span className="tabular-nums text-[var(--ink)]">{money(product.price * qty)}</span>
        </p>
      </div>

      <div className="mt-5 flex gap-3">
        <button
          type="button"
          onClick={onAdd}
          disabled={soldOut}
          className="group flex h-[54px] flex-1 items-center justify-center gap-2.5 rounded-[2px] bg-[var(--accent)] text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--on-accent)] transition-colors duration-200 hover:bg-[var(--accent-hover)] disabled:cursor-not-allowed disabled:opacity-45"
        >
          <ShoppingBag size={16} strokeWidth={1.6} />
          {soldOut ? "Sold out" : "Add to cart"}
        </button>
        <button
          type="button"
          onClick={onBuyNow}
          disabled={soldOut}
          className="h-[54px] flex-1 rounded-[2px] bg-[var(--ink)] text-[12px] font-medium uppercase tracking-[0.16em] text-[var(--bg)] transition-colors duration-200 hover:bg-[var(--ink-2)] disabled:cursor-not-allowed disabled:opacity-45"
        >
          Buy now
        </button>
        <button
          type="button"
          aria-label={wished ? "Remove from wishlist" : "Save to wishlist"}
          aria-pressed={wished}
          onClick={() => toggle(product)}
          className={cn(
            "grid h-[54px] w-[54px] shrink-0 place-items-center rounded-[2px] border transition-colors duration-200",
            wished
              ? "border-[var(--accent)] text-[var(--accent)]"
              : "border-[var(--line-strong)] text-[var(--ink-2)] hover:border-[var(--ink)] hover:text-[var(--ink)]",
          )}
        >
          <Heart size={18} strokeWidth={1.6} fill={wished ? "currentColor" : "none"} />
        </button>
      </div>

      {/* trust row */}
      <ul className="mt-7 grid gap-3 border-y border-[var(--line)] py-5 sm:grid-cols-2">
        {[
          { icon: Truck, text: "Free shipping over ₹999" },
          { icon: RotateCcw, text: "30-day easy returns" },
          { icon: ShieldCheck, text: "2-year warranty" },
          { icon: ShieldCheck, text: "Secure UPI & card checkout" },
        ].map((item, i) => (
          <li key={i} className="flex items-center gap-2.5 text-[13px] text-[var(--ink-2)]">
            <item.icon size={15} strokeWidth={1.5} className="shrink-0 text-[var(--ink-3)]" />
            {item.text}
          </li>
        ))}
      </ul>

      {/* accordion */}
      <div className="mt-7">
        <Accordion
          defaultOpen="description"
          items={[
            {
              id: "description",
              title: "Description",
              content: <p>{product.description}</p>,
            },
            {
              id: "details",
              title: "Materials & details",
              content: (
                <dl className="space-y-2.5">
                  {product.details.map((d) => (
                    <div key={d.label} className="flex gap-4">
                      <dt className="w-32 shrink-0 text-[var(--ink-3)]">{d.label}</dt>
                      <dd className="text-[var(--ink-2)]">{d.value}</dd>
                    </div>
                  ))}
                </dl>
              ),
            },
            {
              id: "shipping",
              title: "Shipping",
              content: (
                <p>
                  Dispatched from Bengaluru within 24 hours on working days. Standard delivery
                  takes 3–5 days (free over ₹999), express 1–2 days (₹249). You will get a
                  tracking link by SMS and email the moment it leaves us.
                </p>
              ),
            },
            {
              id: "returns",
              title: "Returns & exchanges",
              content: (
                <p>
                  30 days to change your mind — items must be unworn with tags attached. Start a
                  return from your account and we will send a prepaid label. Exchanges for a
                  different size are free.
                </p>
              ),
            },
            {
              id: "care",
              title: "Care instructions",
              content: (
                <ul className="list-disc space-y-1.5 pl-5">
                  {product.highlights.map((h) => (
                    <li key={h}>{h}</li>
                  ))}
                </ul>
              ),
            },
          ]}
        />
      </div>

      {/* mobile sticky buy bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--line)] bg-[var(--surface)]/95 px-4 py-3 backdrop-blur-lg lg:hidden">
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] text-[var(--ink-3)]">{product.name}</p>
            <p className="text-[16px] font-medium tabular-nums text-[var(--ink)]">
              {money(product.price * qty)}
              {product.compareAt && product.compareAt > product.price ? (
                <span className="ml-2 text-[12px] font-normal text-[var(--ink-3)] line-through">
                  {money(product.compareAt * qty)}
                </span>
              ) : null}
            </p>
          </div>
          <button
            type="button"
            onClick={onAdd}
            disabled={soldOut}
            className="h-12 flex-1 rounded-[2px] bg-[var(--accent)] text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--on-accent)] transition-colors hover:bg-[var(--accent-hover)] disabled:opacity-45 sm:max-w-[220px]"
          >
            {soldOut ? "Sold out" : needsSize && touched ? "Select size" : "Add to cart"}
          </button>
        </div>
      </div>

      <Dialog
        open={guideOpen}
        onClose={() => setGuideOpen(false)}
        title="Size guide"
        description="Measurements in centimetres, taken flat. Between sizes? Size up for a relaxed fit."
        footer={
          <button
            type="button"
            onClick={() => setGuideOpen(false)}
            className="h-10 rounded-[2px] bg-[var(--ink)] px-5 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--bg)]"
          >
            Got it
          </button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13.5px] tabular-nums">
            <thead>
              <tr className="border-b border-[var(--line)] text-[11px] uppercase tracking-[0.12em] text-[var(--ink-3)]">
                <th className="py-2 pr-4 font-medium">Size</th>
                <th className="py-2 pr-4 font-medium">Chest</th>
                <th className="py-2 pr-4 font-medium">Waist</th>
                <th className="py-2 font-medium">Length</th>
              </tr>
            </thead>
            <tbody>
              {SIZE_GUIDE.map((row) => (
                <tr key={row.size} className="border-b border-[var(--line)] last:border-0">
                  <td className="py-2.5 pr-4 font-medium text-[var(--ink)]">{row.size}</td>
                  <td className="py-2.5 pr-4 text-[var(--ink-2)]">{row.chest}</td>
                  <td className="py-2.5 pr-4 text-[var(--ink-2)]">{row.waist}</td>
                  <td className="py-2.5 text-[var(--ink-2)]">{row.length}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Dialog>
    </div>
  );
}
