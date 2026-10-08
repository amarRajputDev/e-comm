import { connection } from "next/server";
import { IndianRupee, Percent, RefreshCcw, Repeat, TrendingUp, Users } from "lucide-react";
import { RevenuePanel } from "@/components/admin/revenue-panel";
import { Panel, PageHeader } from "@/components/admin/panel";
import { DonutChart, BarChart, AreaChart } from "@/components/admin/charts";
import { StatCard } from "@/components/admin/stat-card";
import {
  getDashboardStats,
  getCategoryBreakdown,
  getTopProducts,
  getAcquisition,
  getFunnel,
  getPaymentSplit,
  getSeries,
} from "@/lib/services/analytics";
import { compactMoney, money, formatDate } from "@/lib/format";
import Link from "next/link";
import { Img } from "@/components/ui/img";

export default async function AdminAnalyticsPage() {
  // Live analytics windows depend on the current date — render per request.
  await connection();

  const stats = getDashboardStats();
  const categories = getCategoryBreakdown();
  const top = getTopProducts(8);
  const acquisition = getAcquisition();
  const funnel = getFunnel();
  const payments = getPaymentSplit();
  const year = getSeries("1y");

  const monthly = year.filter((_, i) => i % 30 === 0);
  const aovSeries = year.map((p) => ({ label: "", value: Math.round(p.revenue / p.orders) }));
  const refundRate = 2.4;
  const repeatRate = 38.6;

  return (
    <div>
      <PageHeader
        title="Analytics"
        description={`Performance across revenue, conversion and retention · updated ${formatDate(new Date())}`}
        actions={
          <Link
            href="/admin"
            className="inline-flex h-8 items-center rounded-[3px] border border-[var(--line-strong)] px-3 text-[12.5px] text-[var(--ink-2)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
          >
            Back to dashboard
          </Link>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        <StatCard
          label="Average order value"
          value={money(stats.aov)}
          delta={stats.aovDelta}
          icon={<IndianRupee size={14} strokeWidth={1.6} />}
          spark={[3.8, 4.1, 3.9, 4.4, 4.6, 4.5, 4.9, 5.1]}
        />
        <StatCard
          label="Conversion rate"
          value={`${stats.conversion}%`}
          delta={stats.conversionDelta}
          icon={<Percent size={14} strokeWidth={1.6} />}
          spark={[3.1, 3.4, 3.6, 3.9, 4.2, 4.4, 4.6, 4.8]}
        />
        <StatCard
          label="Repeat purchase rate"
          value={`${repeatRate}%`}
          delta={4.1}
          icon={<Repeat size={14} strokeWidth={1.6} />}
          spark={[30, 32, 31, 34, 35, 37, 38, 39]}
        />
        <StatCard
          label="Refund rate"
          value={`${refundRate}%`}
          delta={-0.6}
          hint="vs last month"
          icon={<RefreshCcw size={14} strokeWidth={1.6} />}
          spark={[3.4, 3.2, 3.1, 2.9, 2.8, 2.6, 2.5, 2.4]}
        />
      </div>

      <div className="mt-4">
        <RevenuePanel />
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Revenue by category" description="Last 30 days" className="xl:col-span-1">
          <DonutChart
            segments={categories.map((c) => ({
              label:
                c.key === "men" ? "Men" : c.key === "women" ? "Women" : c.key === "accessories" ? "Accessories" : c.key,
              value: c.revenue,
            }))}
            centerValue={compactMoney(stats.revenue)}
            centerLabel="30-day revenue"
            size={180}
          />
        </Panel>

        <Panel
          title="Top products"
          description="Units and revenue"
          className="xl:col-span-2"
          padded={false}
        >
          <ul className="divide-y divide-[var(--line)]">
            {top.map((p, i) => (
              <li key={p.slug} className="flex items-center gap-4 px-4 py-3">
                <span className="w-5 text-[12px] tabular-nums text-[var(--ink-3)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="h-10 w-8 shrink-0 overflow-hidden rounded-[2px] bg-[var(--surface-2)]">
                  <Img sizes="44px" width={88} height={110} src={p.image} alt="" className="h-full w-full object-cover" />
                </span>
                <Link
                  href={`/admin/products/${p.slug}`}
                  className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-[var(--ink)] hover:text-[var(--accent)]"
                >
                  {p.name}
                </Link>
                <span className="hidden w-24 text-right text-[13px] tabular-nums text-[var(--ink-3)] sm:block">
                  {p.sold} sold
                </span>
                <span className="w-24 text-right text-[13.5px] font-medium tabular-nums text-[var(--ink)]">
                  {compactMoney(p.revenue)}
                </span>
                <span className="hidden w-14 text-right text-[12.5px] tabular-nums text-[var(--ink-3)] md:block">
                  ★ {p.rating}
                </span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <Panel title="Average order value trend" description="Rolling daily AOV">
          <AreaChart
            data={aovSeries}
            height={220}
            format="money"
          />
        </Panel>

        <Panel title="Monthly revenue" description="Aggregated every 30 days">
          <BarChart
            data={monthly.map((p, i) => ({
              label: new Date(p.date + "T00:00:00").toLocaleDateString("en-IN", {
                month: "short",
                year: "2-digit",
              }),
              value: p.revenue,
              sub: `Week ${i + 1}`,
            }))}
            height={220}
            format="money"
          />
        </Panel>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Panel title="Conversion funnel">
          <ul className="space-y-3">
            {funnel.map((f, i) => (
              <li key={f.stage}>
                <div className="flex items-baseline justify-between text-[13px]">
                  <span className="text-[var(--ink-2)]">{f.stage}</span>
                  <span className="tabular-nums text-[var(--ink)]">
                    {f.value.toLocaleString("en-IN")}
                    {i > 0 ? (
                      <span className="ml-2 text-[12px] text-[var(--ink-3)]">
                        {Math.round((f.value / funnel[i - 1].value) * 100)}%
                      </span>
                    ) : null}
                  </span>
                </div>
                <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-[var(--surface-2)]">
                  <div
                    className="h-full rounded-full bg-[var(--accent)]"
                    style={{
                      width: `${Math.max(4, Math.round((f.value / funnel[0].value) * 100))}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Acquisition channels" description="New customers by source">
          <ul className="space-y-3.5">
            {acquisition.map((a) => (
              <li key={a.channel}>
                <div className="flex items-baseline justify-between text-[13px]">
                  <span className="flex items-center gap-2 text-[var(--ink-2)]">
                    <Users size={13} className="text-[var(--ink-3)]" /> {a.channel}
                  </span>
                  <span className="font-medium tabular-nums text-[var(--ink)]">{a.value}%</span>
                </div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[var(--surface-2)]">
                  <div className="h-full rounded-full bg-[var(--ink)]" style={{ width: `${a.value}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Payment mix" description="Share of completed orders">
          <ul className="space-y-4">
            {payments.map((p) => (
              <li key={p.method} className="flex items-center gap-3 text-[13px]">
                <span className="w-32 text-[var(--ink-2)]">{p.method}</span>
                <span className="h-2 flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]">
                  <span className="block h-full rounded-full bg-[var(--accent)]" style={{ width: `${p.share}%` }} />
                </span>
                <span className="w-10 text-right font-medium tabular-nums text-[var(--ink)]">
                  {p.share}%
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-5 flex items-start gap-2.5 rounded-[3px] bg-[var(--surface-2)] p-3 text-[12.5px] leading-relaxed text-[var(--ink-2)]">
            <TrendingUp size={15} className="mt-0.5 shrink-0 text-[var(--success)]" />
            UPI share grew 6 points this quarter — consider offering a 1% incentive on prepaid
            orders to push it further.
          </div>
        </Panel>
      </div>
    </div>
  );
}
