import { cn } from "@/lib/utils";
import type { OrderTimelineEntry } from "@/types";
import { formatDate } from "@/lib/format";

const ORDER: OrderTimelineEntry["status"][] = [
  "processing",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
];

const LABELS: Record<string, string> = {
  processing: "Processing",
  confirmed: "Confirmed",
  packed: "Packed",
  shipped: "Shipped",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
  returned: "Returned",
};

export function OrderTimeline({ entries }: { entries: OrderTimelineEntry[] }) {
  const terminal = entries[entries.length - 1]?.status;
  const isFailure = terminal === "cancelled" || terminal === "returned";
  const reached = entries.map((e) => ORDER.indexOf(e.status));

  return (
    <ol className="relative">
      {(isFailure ? entries : [...entries].reverse()).map((entry, i, list) => {
        const last = i === list.length - 1;
        const index = ORDER.indexOf(entry.status);
        const done = isFailure ? true : index <= Math.max(...reached);
        const active = last;

        return (
          <li key={`${entry.status}-${entry.at}`} className="relative flex gap-4 pb-7 last:pb-0">
            {!last ? (
              <span
                aria-hidden
                className={cn(
                  "absolute left-[9px] top-5 h-full w-px",
                  isFailure ? "bg-[var(--danger)]/40" : "bg-[var(--line-strong)]",
                )}
              />
            ) : null}

            <span
              aria-hidden
              className={cn(
                "relative z-10 mt-0.5 grid h-[19px] w-[19px] shrink-0 place-items-center rounded-full border-2 transition-colors",
                active && isFailure && "border-[var(--danger)] bg-[var(--danger)]",
                active && !isFailure && "border-[var(--accent)] bg-[var(--accent)]",
                done && !active && (isFailure ? "border-[var(--danger)]/50 bg-[var(--danger)]/20" : "border-[var(--success)] bg-[var(--success)]"),
                !done && "border-[var(--line-strong)] bg-[var(--bg)]",
              )}
            />

            <div className="-mt-0.5 min-w-0">
              <p
                className={cn(
                  "text-[14.5px] font-medium",
                  done ? "text-[var(--ink)]" : "text-[var(--ink-3)]",
                )}
              >
                {entry.label}
              </p>
              <p className="mt-0.5 text-[12.5px] text-[var(--ink-3)]">
                {formatDate(entry.at, { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
              </p>
              {entry.note ? (
                <p className="mt-1.5 max-w-md text-[13px] leading-relaxed text-[var(--ink-3)]">
                  {entry.note}
                </p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export { LABELS as STATUS_LABELS };
