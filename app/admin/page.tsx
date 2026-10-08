import { connection } from "next/server";
import Link from "next/link";
import {
  IndianRupee,
  ShoppingCart,
  Users,
  TrendingUp,
  PackageX,
  ArrowRight,
} from "lucide-react";
import { StatCard } from "@/components/admin/stat-card";
import { RevenuePanel } from "@/components/admin/revenue-panel";
import { RecentOrders } from "@/components/admin/recent-orders";
import { Panel } from "@/components/admin/panel";
import { DonutChart } from "@/components/admin/charts";
import { Avatar } from "@/components/admin/avatar";
import {
  getDashboardStats,
  getCategoryBreakdown,
  getTopProducts,
  getInventoryAlerts,
  getAcquisition,
  getFunnel,
  getPaymentSplit,
} from "@/lib/services/analytics";
import { compactMoney, money, formatDate } from "@/lib/format";
import { StatusPill } from "@/components/ui/badge";
import { Img } from "@/components/ui/img";

export default async function AdminDashboardPage() {
  // Live admin data (analytics windows, relative dates) renders per request.
  await connection();

  const stats = getDashboardStats();
  const categories = getCategoryBreakdown();
  const top = getTopProducts(5);
  const alerts = getInventoryAlerts();
  const acquisition = getAcquisition();
  const funnel = getFunnel();
  const payments = getPaymentSplit();

  const funnelMax = funnel[0]?.value ?? 1;

  return (
    <div className="space-y-4">
      {/* stat cards */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Total revenue"
          value={compactMoney(stats.revenue)}
          delta={stats.revenueDelta}
          icon={<IndianRupee size={14} strokeWidth={1.6} />}
          spark={[42, 48, 45, 52, 58, 55, 63, 68]}
          href="/admin/analytics"
        />
        <StatCard
          label="Orders"
          value={stats.orders.toLocaleString("en-IN")}
          delta={stats.ordersDelta}
          icon={<ShoppingCart size={14} strokeWidth={1.6} />}
          spark={[30, 34, 32, 38, 36, 41, 44, 47]}
          href="/admin/orders"
        />
        <StatCard
          label="Customers"
          value={stats.customers.toLocaleString("en-IN")}
          delta={stats.customersDelta}
          icon={<Users size={14} strokeWidth={1.6} />}
          spark={[12, 14, 13, 16, 18, 17, 19, 21]}
          href="/admin/customers"
        />
        <StatCard
          label="Conversion rate"
          value={`${stats.conversion}%`}
          delta={stats.conversionDelta}
          icon={<TrendingUp size={14} strokeWidth={1.6} />}
          spark={[3.2, 3.6, 3.4, 4.1, 4.4, 4.2, 4.6, 4.8]}
          href="/admin/analytics"
        />
      </div>

      {/* revenue */}
      <RevenuePanel />

      {/* orders + side */}
      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <RecentOrders />
        </div>

        <div className="grid gap-4">
          <Panel title="Revenue by category" description="Share of last 30 days">
            <DonutChart
              segments={categories.map((c) => ({
                label: c.key === "men" ? "Men" : c.key === "women" ? "Women" : c.key === "accessories" ? "Accessories" : c.key,
                value: c.revenue,
              }))}
              centerValue={compactMoney(stats.revenue)}
              centerLabel="30-day revenue"
              size={168}
              thickness={20}
            />
          </Panel>

          <Panel
            title="Inventory alerts"
            description="Low and out-of-stock pieces"
            actions={
              <Link
                href="/admin/inventory"
                className="inline-flex items-center gap-1 text-[12.5px] text-[var(--accent)] hover:underline"
              >
                Manage <ArrowRight size={13} />
              </Link>
            }
          >
            {alerts.length ? (
              <ul className="divide-y divide-[var(--line)]">
                {alerts.map((a) => (
                  <li key={a.slug} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
                    <span
                      className={`grid h-7 w-7 shrink-0 place-items-center rounded-[3px] ${
                        a.stock === 0
                          ? "bg-[var(--danger)]/12 text-[var(--danger)]"
                          : "bg-[var(--warning)]/14 text-[var(--warning)]"
                      }`}
                    >
                      <PackageX size={14} strokeWidth={1.7} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-medium text-[var(--ink)]">
                        {a.name}
                      </p>
                      <p className="text-[12px] text-[var(--ink-3)]">
                        {a.sold} sold · {a.stock} left
                      </p>
                    </div>
                    <StatusPill status={a.stock === 0 ? "out_of_stock" : "low_stock"} />
                  </li>
                ))}
              </ul>
            ) : (
              <p className="py-4 text-center text-[13px] text-[var(--ink-3)]">
                Everything is well stocked.
              </p>
            )}
          </Panel>
        </div>
      </div>

      {/* top products */}
      <div className="grid gap-4 xl:grid-cols-3">
        <Panel
          title="Top products"
          description="Ranked by units sold"
          className="xl:col-span-2"
          padded={false}
        >
          <ul className="divide-y divide-[var(--line)]">
            {top.map((p, i) => (
              <li key={p.slug} className="flex items-center gap-4 px-4 py-3">
                <span className="w-5 text-[12px] tabular-nums text-[var(--ink-3)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="h-11 w-9 shrink-0 overflow-hidden rounded-[2px] bg-[var(--surface-2)]">
                  <Img sizes="44px" width={88} height={110} src={p.image} alt="" className="h-full w-full object-cover" />
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/products/${p.slug}`}
                    className="block truncate text-[13.5px] font-medium text-[var(--ink)] hover:text-[var(--accent)]"
                  >
                    {p.name}
                  </Link>
                  <p className="text-[12px] capitalize text-[var(--ink-3)]">{p.category}</p>
                </div>
                <div className="hidden text-right sm:block">
                  <p className="text-[13px] font-medium tabular-nums text-[var(--ink)]">
                    {p.sold.toLocaleString("en-IN")}
                  </p>
                  <p className="text-[11.5px] text-[var(--ink-3)]">units</p>
                </div>
                <p className="w-24 text-right text-[13.5px] font-medium tabular-nums text-[var(--ink)]">
                  {compactMoney(p.revenue)}
                </p>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Customer acquisition" description="New accounts by channel">
          <ul className="space-y-3.5">
            {acquisition.map((a) => (
              <li key={a.channel}>
                <div className="flex items-baseline justify-between text-[13px]">
                  <span className="text-[var(--ink-2)]">{a.channel}</span>
                  <span className="font-medium tabular-nums text-[var(--ink)]">{a.value}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent)]"
                    style={{ width: `${a.value}%` }}
                  />
                </div>
                <p className="mt-1 text-[11.5px] text-[var(--ink-3)]">
                  {a.users.toLocaleString("en-IN")} users
                </p>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* funnel + payments */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Panel title="Conversion funnel" description="Sessions to purchase">
          <ul className="space-y-3">
            {funnel.map((f, i) => {
              const pct = Math.round((f.value / funnelMax) * 100);
              const rate = i === 0 ? 100 : Math.round((f.value / funnel[i - 1].value) * 100);
              return (
                <li key={f.stage}>
                  <div className="flex items-baseline justify-between text-[13px]">
                    <span className="text-[var(--ink-2)]">{f.stage}</span>
                    <span className="tabular-nums text-[var(--ink-3)]">
                      {f.value.toLocaleString("en-IN")}
                      {i > 0 ? (
                        <span className="ml-2 font-medium text-[var(--ink)]">{rate}%</span>
                      ) : null}
                    </span>
                  </div>
                  <div className="mt-1.5 h-6 overflow-hidden rounded-[3px] bg-[var(--surface-2)]">
                    <div
                      className="h-full rounded-[3px] bg-[var(--accent)]/85"
                      style={{ width: `${Math.max(pct, 4)}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        </Panel>

        <Panel title="Payment methods" description="Share of paid orders">
          <ul className="space-y-4">
            {payments.map((p) => (
              <li key={p.method} className="flex items-center gap-3">
                <span className="w-32 text-[13px] text-[var(--ink-2)]">{p.method}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]">
                  <span
                    className="block h-full rounded-full bg-[var(--ink)]"
                    style={{ width: `${p.share}%` }}
                  />
                </span>
                <span className="w-10 text-right text-[13px] font-medium tabular-nums text-[var(--ink)]">
                  {p.share}%
                </span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Today at a glance" description={formatDate(new Date(), { weekday: "long" })}>
          <dl className="space-y-3.5 text-[13.5px]">
            {[
              ["Orders today", "48"],
              ["Revenue today", money(194800)],
              ["Awaiting dispatch", "12"],
              ["Returns pending", "3"],
              ["Support tickets", "5"],
            ].map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <dt className="text-[var(--ink-3)]">{k}</dt>
                <dd className="font-medium tabular-nums text-[var(--ink)]">{v}</dd>
              </div>
            ))}
          </dl>
        </Panel>
      </div>

      {/* recent customers */}
      <Panel title="Newest customers" description="Joined in the last 30 days" padded={false}>
        <ul className="divide-y divide-[var(--line)]">
          {[
            ["Kabir Singh", "New Delhi", "1 order", "kabir.singh@example.com"],
            ["Sana Qureshi", "Lucknow", "2 orders", "sana.qureshi@example.com"],
            ["Isha Kapoor", "Gurugram", "5 orders", "isha.kapoor@example.com"],
          ].map(([name, city, orders, email]) => (
            <li key={email} className="flex items-center gap-3 px-4 py-3">
              <Avatar name={name} />
              <div className="min-w-0 flex-1">
                <p className="text-[13.5px] font-medium text-[var(--ink)]">{name}</p>
                <p className="truncate text-[12px] text-[var(--ink-3)]">{email}</p>
              </div>
              <span className="hidden text-[12.5px] text-[var(--ink-3)] sm:block">{city}</span>
              <span className="text-[12.5px] text-[var(--ink-2)]">{orders}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
