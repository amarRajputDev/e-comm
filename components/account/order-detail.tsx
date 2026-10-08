"use client";

import Link from "next/link";
import { ArrowLeft, Download, MessageCircle, XCircle, MapPin, CreditCard, Truck } from "lucide-react";
import type { Order } from "@/types";
import { useUi } from "@/lib/store/providers";
import { formatDate, money } from "@/lib/format";
import { StatusPill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderTimeline, STATUS_LABELS } from "@/components/account/order-timeline";
import { Img } from "@/components/ui/img";

export function OrderDetail({ order }: { order: Order }) {
  const { toast } = useUi();
  const canCancel = ["processing", "confirmed"].includes(order.status);

  return (
    <div>
      <Link
        href="/account/orders"
        className="group inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--ink-3)] transition-colors hover:text-[var(--ink)]"
      >
        <ArrowLeft
          size={14}
          className="transition-transform group-hover:-translate-x-0.5"
        />
        All orders
      </Link>

      <header className="mt-6 flex flex-wrap items-end justify-between gap-5 border-b border-[var(--line)] pb-7">
        <div>
          <p className="eyebrow text-[var(--accent)]">Order placed</p>
          <h1 className="h1 mt-3 text-[var(--ink)]">{order.number}</h1>
          <p className="mt-3 text-[14.5px] text-[var(--ink-3)]">
            {formatDate(order.placedAt, {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
            {order.eta !== "—" ? (
              <>
                {" · "}estimated delivery{" "}
                <span className="text-[var(--ink)]">{order.eta}</span>
              </>
            ) : null}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <StatusPill status={order.status} />
          <StatusPill status={order.paymentStatus} />
        </div>
      </header>

      <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_340px] lg:gap-12">
        <div className="space-y-10">
          {/* items */}
          <section>
            <h2 className="text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--ink)]">
              {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
            </h2>
            <ul className="mt-5 divide-y divide-[var(--line)] border-y border-[var(--line)]">
              {order.items.map((item) => (
                <li key={`${item.productId}-${item.variantLabel}`} className="flex gap-4 py-4">
                  <Link
                    href={`/product/${item.productSlug}`}
                    className="group h-20 w-16 shrink-0 overflow-hidden bg-[var(--surface-2)]"
                  >
                    <Img sizes="80px" width={160} height={200}
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${item.productSlug}`}
                      className="text-[15px] font-medium text-[var(--ink)] hover:text-[var(--accent)]"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-[13px] text-[var(--ink-3)]">{item.variantLabel}</p>
                    <p className="mt-1 text-[13px] text-[var(--ink-3)]">Qty {item.quantity}</p>
                  </div>
                  <p className="text-[15px] tabular-nums text-[var(--ink)]">
                    {money(item.price * item.quantity)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* timeline */}
          <section>
            <h2 className="text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--ink)]">
              Status
            </h2>
            <div className="mt-6 border border-[var(--line)] bg-[var(--surface)] p-6">
              <OrderTimeline entries={order.timeline} />
            </div>
          </section>

          {/* delivery + payment */}
          <section className="grid gap-6 sm:grid-cols-2">
            <div className="border border-[var(--line)] bg-[var(--surface)] p-5">
              <p className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--ink-3)]">
                <MapPin size={14} strokeWidth={1.6} /> Delivery address
              </p>
              <p className="mt-4 text-[14.5px] font-medium text-[var(--ink)]">
                {order.address.fullName}
              </p>
              <p className="mt-1 text-[14px] leading-relaxed text-[var(--ink-2)]">
                {order.address.line1}
                {order.address.line2 ? <>, {order.address.line2}</> : null}
                <br />
                {order.address.city}, {order.address.state} {order.address.pincode}
                <br />
                {order.address.phone}
              </p>
            </div>

            <div className="border border-[var(--line)] bg-[var(--surface)] p-5">
              <p className="flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--ink-3)]">
                <CreditCard size={14} strokeWidth={1.6} /> Payment
              </p>
              <p className="mt-4 text-[14.5px] font-medium capitalize text-[var(--ink)]">
                {order.paymentMethod}
              </p>
              <p className="mt-1 text-[14px] text-[var(--ink-2)]">
                Status:{" "}
                <span className="capitalize">{order.paymentStatus.replace("_", " ")}</span>
              </p>
              {order.couponCode ? (
                <p className="mt-1 text-[14px] text-[var(--ink-2)]">
                  Promo applied: {order.couponCode}
                </p>
              ) : null}
              <p className="mt-3 flex items-center gap-2 text-[13px] text-[var(--ink-3)]">
                <Truck size={13} strokeWidth={1.6} />
                {STATUS_LABELS[order.status]}
              </p>
            </div>
          </section>
        </div>

        {/* summary */}
        <aside className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)] lg:self-start">
          <div className="border border-[var(--line)] bg-[var(--surface)] p-6">
            <h2 className="text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--ink)]">
              Summary
            </h2>
            <dl className="mt-5 space-y-3 text-[14px]">
              <div className="flex justify-between">
                <dt className="text-[var(--ink-3)]">Subtotal</dt>
                <dd className="tabular-nums text-[var(--ink)]">{money(order.subtotal)}</dd>
              </div>
              {order.discount > 0 ? (
                <div className="flex justify-between text-[var(--success)]">
                  <dt>Discount</dt>
                  <dd className="tabular-nums">−{money(order.discount)}</dd>
                </div>
              ) : null}
              <div className="flex justify-between">
                <dt className="text-[var(--ink-3)]">Shipping</dt>
                <dd className="tabular-nums text-[var(--ink)]">
                  {order.shipping === 0 ? "Free" : money(order.shipping)}
                </dd>
              </div>
              <div className="flex justify-between border-t border-[var(--line)] pt-4 text-[16px] font-medium">
                <dt className="text-[var(--ink)]">Total</dt>
                <dd className="tabular-nums text-[var(--ink)]">{money(order.total)}</dd>
              </div>
            </dl>

            <div className="mt-6 space-y-2.5">
              <Button
                fullWidth
                variant="outline"
                icon={<Download size={15} />}
                onClick={() =>
                  toast({
                    title: "Invoice sent",
                    description: `A copy of ${order.number} is on its way to your inbox.`,
                    tone: "success",
                  })
                }
              >
                Download invoice
              </Button>
              <Button
                fullWidth
                variant="outline"
                icon={<MessageCircle size={15} />}
                onClick={() =>
                  toast({
                    title: "Support notified",
                    description: "Our team replies within 4 working hours.",
                  })
                }
              >
                Get help with this order
              </Button>
              {canCancel ? (
                <Button
                  fullWidth
                  variant="ghost"
                  icon={<XCircle size={15} />}
                  onClick={() =>
                    toast({
                      title: "Cancellation requested",
                      description: "We’ll confirm within 30 minutes.",
                      tone: "error",
                    })
                  }
                >
                  Cancel order
                </Button>
              ) : null}
            </div>
          </div>

          <p className="mt-4 text-[13px] leading-relaxed text-[var(--ink-3)]">
            Need to change something? Contact us within 30 minutes of ordering — after that the
            parcel is already moving.
          </p>
        </aside>
      </div>
    </div>
  );
}
