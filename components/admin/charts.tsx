"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { compactMoney } from "@/lib/format";

export type ChartFormat = "money" | "number";

function resolveFormat(format?: ChartFormat, formatValue?: (v: number) => string) {
  if (formatValue) return formatValue;
  if (format === "money") return compactMoney;
  return (v: number) => String(v);
}

function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T | null>(null);
  const [width, setWidth] = useState(0);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, width] as const;
}

function niceTicks(min: number, max: number, count = 4) {
  const span = Math.max(max - min, 1);
  const raw = span / count;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const norm = raw / mag;
  const step = (norm >= 7.5 ? 10 : norm >= 3.5 ? 5 : norm >= 1.5 ? 2 : 1) * mag;
  const start = Math.floor(min / step) * step;
  const ticks: number[] = [];
  for (let v = start; v <= max + step; v += step) ticks.push(v);
  return ticks;
}

function smoothPath(points: { x: number; y: number }[]) {
  if (!points.length) return "";
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const cx = (prev.x + curr.x) / 2;
    d += ` C ${cx} ${prev.y}, ${cx} ${curr.y}, ${curr.x} ${curr.y}`;
  }
  return d;
}

export interface SeriesPoint {
  label: string;
  value: number;
  sub?: string;
}

export function AreaChart({
  data,
  height = 260,
  format,
  formatValue,
  className,
}: {
  data: SeriesPoint[];
  height?: number;
  format?: ChartFormat;
  formatValue?: (v: number) => string;
  className?: string;
}) {
  const [ref, width] = useMeasure<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const padding = { top: 18, right: 12, bottom: 28, left: 52 };

  const values = data.map((d) => d.value);
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const ticks = niceTicks(min, max);

  const innerW = Math.max(width - padding.left - padding.right, 10);
  const innerH = height - padding.top - padding.bottom;
  const low = Math.min(...ticks);
  const high = Math.max(...ticks, max);
  const scaleY = (v: number) => padding.top + innerH - ((v - low) / (high - low || 1)) * innerH;
  const scaleX = (i: number) =>
    padding.left + (data.length <= 1 ? innerW / 2 : (i / (data.length - 1)) * innerW);

  const points = data.map((d, i) => ({ x: scaleX(i), y: scaleY(d.value) }));
  const line = smoothPath(points);
  const fmt = resolveFormat(format, formatValue);
  const area = points.length
    ? `${line} L ${points[points.length - 1].x} ${padding.top + innerH} L ${points[0].x} ${padding.top + innerH} Z`
    : "";

  const labelEvery = Math.max(1, Math.ceil(data.length / 7));

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      {width > 0 ? (
        <svg
          width={width}
          height={height}
          role="img"
          aria-label="Revenue over time"
          className="block"
          onMouseLeave={() => setActive(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            let nearest = 0;
            let best = Infinity;
            points.forEach((p, i) => {
              const dist = Math.abs(p.x - x);
              if (dist < best) {
                best = dist;
                nearest = i;
              }
            });
            setActive(nearest);
          }}
        >
          <defs>
            <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={scaleY(t)}
                y2={scaleY(t)}
                stroke="var(--line)"
                strokeDasharray="3 4"
              />
              <text
                x={padding.left - 10}
                y={scaleY(t) + 4}
                textAnchor="end"
                fontSize="11"
                fill="var(--ink-3)"
              >
                {fmt(t)}
              </text>
            </g>
          ))}

          <path d={area} fill="url(#areaFill)" />
          <path
            d={line}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((p, i) =>
            i % labelEvery === 0 ? (
              <text
                key={i}
                x={p.x}
                y={height - 8}
                textAnchor="middle"
                fontSize="11"
                fill="var(--ink-3)"
              >
                {data[i]?.label}
              </text>
            ) : null,
          )}

          {active !== null && points[active] ? (
            <g>
              <line
                x1={points[active].x}
                x2={points[active].x}
                y1={padding.top}
                y2={padding.top + innerH}
                stroke="var(--ink-3)"
                strokeDasharray="3 3"
              />
              <circle cx={points[active].x} cy={points[active].y} r="4.5" fill="var(--accent)" />
              <circle
                cx={points[active].x}
                cy={points[active].y}
                r="8"
                fill="var(--accent)"
                opacity="0.18"
              />
            </g>
          ) : null}
        </svg>
      ) : (
        <div style={{ height }} className="skeleton" />
      )}

      {active !== null && data[active] ? (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-[3px] border border-[var(--line)] bg-[var(--surface)] px-3 py-2 shadow-[var(--shadow-lift)]"
          style={{
            left: Math.min(Math.max(scaleX(active), 70), Math.max(width - 70, 70)),
            top: 6,
          }}
        >
          <p className="text-[11px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
            {data[active].label}
          </p>
          <p className="text-[14px] font-semibold tabular-nums text-[var(--ink)]">
            {fmt(data[active].value)}
          </p>
          {data[active].sub ? (
            <p className="text-[11.5px] text-[var(--ink-3)]">{data[active].sub}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function BarChart({
  data,
  height = 220,
  format,
  formatValue,
  className,
}: {
  data: SeriesPoint[];
  height?: number;
  format?: ChartFormat;
  formatValue?: (v: number) => string;
  className?: string;
}) {
  const [ref, width] = useMeasure<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);
  const padding = { top: 16, right: 8, bottom: 28, left: 44 };

  const max = Math.max(...data.map((d) => d.value), 1);
  const ticks = niceTicks(0, max, 3);
  const innerW = Math.max(width - padding.left - padding.right, 10);
  const innerH = height - padding.top - padding.bottom;
  const high = Math.max(...ticks, max);
  const band = innerW / Math.max(data.length, 1);
  const barW = Math.max(Math.min(band * 0.6, 34), 4);
  const scaleY = (v: number) => padding.top + innerH - (v / (high || 1)) * innerH;
  const labelEvery = Math.max(1, Math.ceil(data.length / 6));
  const fmt = resolveFormat(format, formatValue);

  return (
    <div ref={ref} className={cn("relative w-full", className)}>
      {width > 0 ? (
        <svg width={width} height={height} role="img" aria-label="Orders by period" className="block">
          {ticks.map((t) => (
            <g key={t}>
              <line
                x1={padding.left}
                x2={width - padding.right}
                y1={scaleY(t)}
                y2={scaleY(t)}
                stroke="var(--line)"
                strokeDasharray="3 4"
              />
              <text
                x={padding.left - 10}
                y={scaleY(t) + 4}
                textAnchor="end"
                fontSize="11"
                fill="var(--ink-3)"
              >
                {fmt(t)}
              </text>
            </g>
          ))}

          {data.map((d, i) => {
            const x = padding.left + band * i + (band - barW) / 2;
            const y = scaleY(d.value);
            const h = padding.top + innerH - y;
            return (
              <g
                key={i}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                className="cursor-pointer"
              >
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={Math.max(h, 2)}
                  rx="2"
                  fill={active === i ? "var(--accent)" : "var(--ink)"}
                  opacity={active === i ? 1 : 0.82}
                />
                <rect
                  x={padding.left + band * i}
                  y={padding.top}
                  width={band}
                  height={innerH}
                  fill="transparent"
                />
                {i % labelEvery === 0 ? (
                  <text
                    x={padding.left + band * i + band / 2}
                    y={height - 8}
                    textAnchor="middle"
                    fontSize="11"
                    fill="var(--ink-3)"
                  >
                    {d.label}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      ) : (
        <div style={{ height }} className="skeleton" />
      )}

      {active !== null && data[active] ? (
        <div
          className="pointer-events-none absolute z-10 -translate-x-1/2 rounded-[3px] border border-[var(--line)] bg-[var(--surface)] px-3 py-2 shadow-[var(--shadow-lift)]"
          style={{
            left: Math.min(
              Math.max(padding.left + band * active + band / 2, 60),
              Math.max(width - 60, 60),
            ),
            top: 4,
          }}
        >
          <p className="text-[11px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
            {data[active].label}
          </p>
          <p className="text-[14px] font-semibold tabular-nums text-[var(--ink)]">
            {fmt(data[active].value)}
          </p>
          {data[active].sub ? (
            <p className="text-[11.5px] text-[var(--ink-3)]">{data[active].sub}</p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export function DonutChart({
  segments,
  size = 190,
  thickness = 22,
  centerLabel,
  centerValue,
}: {
  segments: { label: string; value: number; color?: string }[];
  size?: number;
  thickness?: number;
  centerLabel?: string;
  centerValue?: string;
}) {
  const total = segments.reduce((n, s) => n + s.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const palette = ["var(--accent)", "var(--ink)", "var(--info)", "var(--success)", "var(--warning)"];

  const { arcs } = segments.reduce(
    (acc, s, i) => {
      const dash = (s.value / total) * circumference;
      return {
        arcs: [
          ...acc.arcs,
          <circle
            key={s.label}
            r={radius}
            fill="none"
            stroke={s.color ?? palette[i % palette.length]}
            strokeWidth={thickness}
            strokeDasharray={`${dash} ${circumference - dash}`}
            strokeDashoffset={-acc.offset}
            strokeLinecap="butt"
          />,
        ],
        offset: acc.offset + dash,
      };
    },
    { arcs: [] as React.ReactNode[], offset: 0 },
  );

  return (
    <div className="flex flex-wrap items-center gap-7">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg width={size} height={size} role="img" aria-label="Category split">
          <g transform={`translate(${size / 2}, ${size / 2}) rotate(-90)`}>
            <circle r={radius} fill="none" stroke="var(--surface-2)" strokeWidth={thickness} />
            {arcs}
          </g>
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="text-[22px] font-semibold leading-none tabular-nums text-[var(--ink)]">
              {centerValue}
            </p>
            <p className="mt-1 text-[11.5px] text-[var(--ink-3)]">{centerLabel}</p>
          </div>
        </div>
      </div>

      <ul className="min-w-40 flex-1 space-y-2.5">
        {segments.map((s, i) => (
          <li key={s.label} className="flex items-center gap-3 text-[13px]">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
              style={{ backgroundColor: s.color ?? palette[i % palette.length] }}
            />
            <span className="flex-1 text-[var(--ink-2)]">{s.label}</span>
            <span className="font-medium tabular-nums text-[var(--ink)]">
              {Math.round((s.value / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Sparkline({
  values,
  width = 96,
  height = 30,
}: {
  values: number[];
  width?: number;
  height?: number;
}) {
  const max = Math.max(...values, 1);
  const min = Math.min(...values, 0);
  const points = values.map((v, i) => ({
    x: (i / Math.max(values.length - 1, 1)) * width,
    y: height - ((v - min) / (max - min || 1)) * (height - 4) - 2,
  }));
  const d = smoothPath(points);

  return (
    <svg width={width} height={height} aria-hidden className="overflow-visible">
      <path d={d} fill="none" stroke="var(--accent)" strokeWidth="1.75" strokeLinecap="round" />
    </svg>
  );
}

export function useIsMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}
