"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { PackageSearch, ArrowRight, Mail } from "lucide-react";
import { readLastOrder, type PlacedOrder } from "@/lib/services/orders";
import { money } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Img } from "@/components/ui/img";

export default function CheckoutSuccessPage() {
  const [order, setOrder] = useState<PlacedOrder | null | "loading">("loading");

  useEffect(() => {
    setOrder(readLastOrder());
  }, []);

  if (order === "loading") {
    return (
      <div className="container-x py-24">
        <div className="mx-auto max-w-2xl space-y-5" role="status" aria-label="Loading order">
          <Skeleton className="mx-auto h-16 w-16 rounded-full" />
          <Skeleton className="mx-auto h-9 w-72" />
          <Skeleton className="mx-auto h-4 w-96" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-x py-24 text-center">
        <h1 className="h2">No recent order found</h1>
        <p className="mx-auto mt-3 max-w-md text-[15px] text-[var(--ink-3)]">
          Looks like your order session has expired. If you did place an order, check your
          email for confirmation.
        </p>
        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <Button href="/shop" size="lg">
            Continue shopping
          </Button>
          <Button href="/account/orders" size="lg" variant="outline">
            View my orders
          </Button>
        </div>
      </div>
    );
  }

  const { payload } = order;

  return (
    <div className="container-x pb-24 pt-12">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <motion.span
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 18, delay: 0.1 }}
            className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--success)]/12 text-[var(--success)]"
          >
            <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" aria-hidden>
              <motion.path
                d="M4.5 12.5 10 18 19.5 7"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.25 }}
              />
            </svg>
          </motion.span>

          <p className="eyebrow mt-7 text-[var(--accent)]">Order confirmed</p>
          <h1 className="h1 mt-4">Thank you — it’s on its way.</h1>
          <p className="mx-auto mt-4 max-w-lg text-[15.5px] leading-relaxed text-[var(--ink-3)]">
            We’ve sent a confirmation to{" "}
            <span className="text-[var(--ink)]">{payload.contact.email}</span>. You’ll get a
            tracking link as soon as your parcel leaves our studio.
          </p>

          <div className="mt-7 inline-flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border border-[var(--line)] bg-[var(--surface)] px-7 py-4">
            <div>
              <p className="eyebrow text-[var(--ink-3)]">Order number</p>
              <p className="mt-1.5 text-[16px] font-medium tabular-nums text-[var(--ink)]">
                {order.number}
              </p>
            </div>
            <span className="hidden h-8 w-px bg-[var(--line)] sm:block" />
            <div>
              <p className="eyebrow text-[var(--ink-3)]">Estimated delivery</p>
              <p className="mt-1.5 text-[16px] font-medium text-[var(--ink)]">{order.eta}</p>
            </div>
            <span className="hidden h-8 w-px bg-[var(--line)] sm:block" />
            <div>
              <p className="eyebrow text-[var(--ink-3)]">Paid</p>
              <p className="mt-1.5 text-[16px] font-medium tabular-nums text-[var(--ink)]">
                {money(payload.totals.total)}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 grid gap-8 md:grid-cols-[1.3fr_1fr]"
        >
          <div className="border border-[var(--line)] bg-[var(--surface)] p-6">
            <h2 className="text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--ink)]">
              What you ordered
            </h2>
            <ul className="mt-5 divide-y divide-[var(--line)]">
              {payload.items.map((item, i) => (
                <li key={i} className="flex items-center gap-4 py-3.5 first:pt-0">
                  <span className="h-14 w-12 shrink-0 overflow-hidden bg-[var(--surface-2)]">
                    <Img sizes="56px" width={112} height={140} src={item.image} alt="" className="h-full w-full object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <Link
                      href={`/product/${item.productSlug}`}
                      className="block truncate text-[14.5px] text-[var(--ink)] hover:text-[var(--accent)]"
                    >
                      {item.name}
                    </Link>
                    <span className="block text-[12.5px] text-[var(--ink-3)]">
                      {item.variantLabel} · Qty {item.quantity}
                    </span>
                  </span>
                  <span className="text-[14.5px] tabular-nums text-[var(--ink)]">
                    {money(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-5 space-y-2 border-t border-[var(--line)] pt-4 text-[14px]">
              <div className="flex justify-between text-[var(--ink-3)]">
                <span>Shipping to</span>
                <span className="max-w-[60%] text-right text-[var(--ink)]">
                  {payload.address.line1}, {payload.address.city}, {payload.address.state}{" "}
                  {payload.address.pincode}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--ink-3)]">Total paid</span>
                <span className="font-medium tabular-nums text-[var(--ink)]">
                  {money(payload.totals.total)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-[var(--line)] bg-[var(--surface)] p-6">
              <div className="flex items-start gap-3">
                <Mail size={18} strokeWidth={1.5} className="mt-0.5 text-[var(--accent)]" />
                <div>
                  <h3 className="text-[15px] font-medium text-[var(--ink)]">
                    Tracking updates
                  </h3>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--ink-3)]">
                    We’ll email {payload.contact.email} and text {payload.contact.phone} at
                    every step — packed, shipped, out for delivery, delivered.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button href="/account/orders" size="lg" fullWidth iconEnd={<ArrowRight size={15} />}>
                Track your order
              </Button>
              <Button href="/shop" size="lg" variant="outline" fullWidth>
                Continue shopping
              </Button>
            </div>

            <p className="flex items-center justify-center gap-2 pt-1 text-[12.5px] text-[var(--ink-3)]">
              <PackageSearch size={14} strokeWidth={1.6} />
              Need to change something? Contact care within 30 minutes.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
