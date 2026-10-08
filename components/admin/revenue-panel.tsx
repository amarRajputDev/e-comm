"use client";

import { useMemo, useState } from "react";
import { getSeries, RANGES, type RangeKey } from "@/lib/services/analytics";
import { AreaChart, BarChart } from "./charts";
import { Panel } from "./panel";
import { compactMoney, money } from "@/lib/format";
import { cn } from "@/lib/utils";

function RangeSwitch({ value, onChange }: { value: RangeKey; onChange: (v: RangeKey) => void }) {
  return (
    <div className="flex rounded-[3px] border border-[var(--line)] p-0.5">
      {RANGES.map((r) => (
        <button
          key={r.key}
          type="button"
          aria-pressed={value === r.key}
          onClick={() => onChange(r.key)}
          className={cn(
            "rounded-[2px] px-2.5 py-1 text-[11.5px] font-medium transition-colors",
            value === r.key
              ? "bg-[var(--ink)] text-[var(--bg)]"
              : "text-[var(--ink-3)] hover:text-[var(--ink)]",
          )}
        >
          {r.label}
        </button>
      ))}
    </div>
  );
}

export function RevenuePanel() {
  const [range, setRange] = useState<RangeKey>("30d");
  const [metric, setMetric] = useState<"revenue" | "orders">("revenue");

  const series = getSeries(range);

  const data = useMemo(() => {
    const tickEvery = Math.max(1, Math.ceil(series.length / 8));
    return series.map((p, i) => ({
      label:
        range === "1y"
          ? new Date(p.date + "T00:00:00").toLocaleDateString("en-IN", { month: "short" })
          : i % tickEvery === 0
            ? new Date(p.date + "T00:00:00").toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
              })
            : "",
      value: metric === "revenue" ? p.revenue : p.orders,
      sub: metric === "revenue" ? `${p.orders} orders` : `${compactMoney(p.revenue)} revenue`,
    }));
  }, [series, metric, range]);

  const totals = useMemo(() => {
    const revenue = series.reduce((n, p) => n + p.revenue, 0);
    const orders = series.reduce((n, p) => n + p.orders, 0);
    return {
      revenue,
      orders,
      aov: Math.round(revenue / Math.max(orders, 1)),
      peak: series.reduce((max, p) => (p.revenue > max.revenue ? p : max), series[0]),
    };
  }, [series]);

  const ordersData = useMemo(() => {
    const step = Math.max(1, Math.ceil(series.length / 12));
    const buckets: { label: string; value: number; sub: string }[] = [];
    for (let i = 0; i < series.length; i += step) {
      const slice = series.slice(i, i + step);
      buckets.push({
        label: new Date(slice[0].date + "T00:00:00").toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
        }),
        value: slice.reduce((n, p) => n + p.orders, 0),
        sub: `${compactMoney(slice.reduce((n, p) => n + p.revenue, 0))} revenue`,
      });
    }
    return buckets;
  }, [series]);

  return (
    <div className="grid gap-4 xl:grid-cols-3">
      <Panel
        className="xl:col-span-2"
        title="Revenue"
        description={`Last ${RANGES.find((r) => r.key === range)?.days} days`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex rounded-[3px] border border-[var(--line)] p-0.5">
              {(
                [
                  ["revenue", "Revenue"],
                  ["orders", "Orders"],
                ] as const
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  aria-pressed={metric === key}
                  onClick={() => setMetric(key)}
                  className={cn(
                    "rounded-[2px] px-2.5 py-1 text-[11.5px] font-medium transition-colors",
                    metric === key
                      ? "bg-[var(--surface-2)] text-[var(--ink)]"
                      : "text-[var(--ink-3)] hover:text-[var(--ink)]",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <RangeSwitch value={range} onChange={setRange} />
          </div>
        }
      >
        <div className="mb-3 grid grid-cols-3 gap-3">
          {[
            { k: "Revenue", v: money(totals.revenue) },
            { k: "Orders", v: totals.orders.toLocaleString("en-IN") },
            { k: "Avg. order value", v: money(totals.aov) },
          ].map((item) => (
            <div key={item.k} className="rounded-[3px] bg-[var(--surface-2)] px-3 py-2.5">
              <p className="text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
                {item.k}
              </p>
              <p className="mt-1 text-[16px] font-semibold tabular-nums text-[var(--ink)]">
                {item.v}
              </p>
            </div>
          ))}
        </div>

        <AreaChart
          data={data}
          height={260}
          formatValue={(v) => (metric === "revenue" ? compactMoney(v) : String(v))}
        />
      </Panel>

      <div className="grid gap-4">
        <Panel title="Orders by day" description="Volume across the selected range">
          <BarChart
            data={ordersData}
            height={168}
            formatValue={(v) => (v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v))}
          />
        </Panel>

        <Panel title="Peak day" description="Best performing day in range">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[24px] font-semibold leading-none tabular-nums text-[var(--ink)]">
                {money(totals.peak?.revenue ?? 0)}
              </p>
              <p className="mt-2 text-[13px] text-[var(--ink-3)]">
                {totals.peak
                  ? new Date(totals.peak.date + "T00:00:00").toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })
                  : "—"}
              </p>
            </div>
            <p className="rounded-[3px] bg-[var(--accent-tint)] px-2.5 py-1.5 text-[12px] font-medium text-[var(--accent)]">
              {totals.peak?.orders ?? 0} orders
            </p>
          </div>
        </Panel>
      </div>
    </div>
  );
}
