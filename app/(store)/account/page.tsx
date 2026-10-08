"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Package,
  Heart,
  MapPin,
  Star,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { useSession, useWishlist } from "@/lib/store/providers";
import { ordersForCustomer } from "@/lib/data/orders";
import { addresses } from "@/lib/data/customers";
import { products } from "@/lib/data/products";
import { formatDate, money, timeAgo } from "@/lib/format";
import { StatusPill } from "@/components/ui/badge";
import { ProductGrid } from "@/components/product/product-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { Img } from "@/components/ui/img";

export default function AccountOverviewPage() {
  const { user } = useSession();
  const { ids } = useWishlist();

  if (!user) return null;

  const firstName = user.name.split(" ")[0];
  const orders = ordersForCustomer(user.id)
    .slice()
    .sort((a, b) => +new Date(b.placedAt) - +new Date(a.placedAt));
  const savedAddresses = addresses[user.id] ?? [];
  const recommendations = products.filter((p) => p.featured).slice(0, 4);

  const stats = [
    { label: "Orders", value: String(orders.length), href: "/account/orders", icon: Package },
    { label: "Wishlist", value: String(ids.length), href: "/account/wishlist", icon: Heart },
    {
      label: "Saved addresses",
      value: String(savedAddresses.length),
      href: "/account/addresses",
      icon: MapPin,
    },
    { label: "Rewards", value: `₹${user.rewards.toLocaleString("en-IN")}`, href: "/account/settings", icon: Star },
  ];

  return (
    <div className="space-y-12">
      {/* greeting */}
      <header>
        <p className="eyebrow text-[var(--accent)]">{formatDate(new Date(), { weekday: "long" })}</p>
        <h1 className="h1 mt-3 text-[var(--ink)]">
          Welcome back, <span className="text-[var(--accent)]">{firstName}</span>
        </h1>
        <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--ink-3)]">
          {orders.length
            ? `You have ${orders.length} order${orders.length === 1 ? "" : "s"} on the go. Here is everything at a glance.`
            : "Your account is ready — start building a wardrobe that lasts."}
        </p>
      </header>

      {/* stats */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href={s.href}
              className="group flex h-full flex-col justify-between border border-[var(--line)] bg-[var(--surface)] p-5 transition-colors hover:border-[var(--ink)]"
            >
              <div className="flex items-start justify-between">
                <s.icon size={17} strokeWidth={1.5} className="text-[var(--ink-3)]" />
                <ChevronRight
                  size={15}
                  className="text-[var(--ink-3)] transition-transform duration-300 group-hover:translate-x-1 group-hover:text-[var(--accent)]"
                />
              </div>
              <div className="mt-8">
                <p className="text-[28px] font-medium leading-none tracking-[-0.03em] tabular-nums text-[var(--ink)]">
                  {s.value}
                </p>
                <p className="mt-2 text-[12.5px] uppercase tracking-[0.12em] text-[var(--ink-3)]">
                  {s.label}
                </p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* recent orders */}
      <section>
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-[var(--ink-3)]">Activity</p>
            <h2 className="h3 mt-2.5">Recent orders</h2>
          </div>
          <Link
            href="/account/orders"
            className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--ink)]"
          >
            All orders
            <span className="grid h-7 w-7 place-items-center rounded-full border border-[var(--line-strong)] transition-colors group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--on-accent)]">
              <ArrowRight size={13} />
            </span>
          </Link>
        </div>

        {orders.length ? (
          <div className="divide-y divide-[var(--line)] border-y border-[var(--line)]">
            {orders.slice(0, 4).map((order) => (
              <Link
                key={order.id}
                href={`/account/orders/${order.number}`}
                className="group flex flex-wrap items-center gap-x-6 gap-y-3 py-4 transition-colors hover:bg-[var(--surface-2)]/50"
              >
                <div className="flex -space-x-2">
                  {order.items.slice(0, 3).map((item) => (
                    <span
                      key={item.productId}
                      className="h-11 w-9 overflow-hidden rounded-[2px] border border-[var(--bg)] bg-[var(--surface-2)]"
                    >
                      <Img sizes="44px" width={88} height={110} src={item.image} alt="" className="h-full w-full object-cover" />
                    </span>
                  ))}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px] font-medium text-[var(--ink)]">
                    {order.number}
                    <span className="ml-3 text-[13px] font-normal text-[var(--ink-3)]">
                      {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                    </span>
                  </p>
                  <p className="mt-0.5 text-[13px] text-[var(--ink-3)]">
                    Placed {timeAgo(order.placedAt)} · {formatDate(order.placedAt)}
                  </p>
                </div>

                <StatusPill status={order.status} />

                <p className="w-28 text-right text-[15px] font-medium tabular-nums text-[var(--ink)]">
                  {money(order.total)}
                </p>

                <ChevronRight
                  size={16}
                  className="text-[var(--ink-3)] transition-transform group-hover:translate-x-1"
                />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            compact
            icon={<Package size={22} strokeWidth={1.4} />}
            title="No orders yet"
            description="When you place an order it will show up here with live tracking."
            action={{ label: "Start shopping", href: "/shop" }}
          />
        )}
      </section>

      {/* recommendations */}
      <section>
        <div className="mb-6 flex items-center gap-3">
          <Sparkles size={16} className="text-[var(--accent)]" />
          <div>
            <p className="eyebrow text-[var(--ink-3)]">Picked for you</p>
            <h2 className="h3 mt-2">Because you like the essentials</h2>
          </div>
        </div>
        <ProductGrid products={recommendations} columns={4} />
      </section>
    </div>
  );
}
