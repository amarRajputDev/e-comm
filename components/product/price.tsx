import { discountPercent, money } from "@/lib/format";
import { cn } from "@/lib/utils";

export function Price({
  price,
  compareAt,
  size = "md",
  className,
  align = "left",
}: {
  price: number;
  compareAt?: number | null;
  size?: "sm" | "md" | "lg";
  className?: string;
  align?: "left" | "right";
}) {
  const pct = discountPercent(price, compareAt);
  const sizes = {
    sm: "text-[13.5px]",
    md: "text-[15px]",
    lg: "text-[26px] leading-none tracking-[-0.02em]",
  } as const;

  return (
    <div
      className={cn(
        "flex flex-wrap items-baseline gap-x-2 gap-y-1",
        align === "right" && "justify-end",
        className,
      )}
    >
      <span
        className={cn(
          "font-medium tabular-nums text-[var(--ink)]",
          sizes[size],
          pct > 0 && "text-[var(--accent)]",
        )}
      >
        {money(price)}
      </span>
      {compareAt && compareAt > price ? (
        <span
          className={cn(
            "tabular-nums text-[var(--ink-3)] line-through",
            size === "lg" ? "text-[15px]" : "text-[13px]",
          )}
        >
          {money(compareAt)}
        </span>
      ) : null}
      {pct > 0 && size === "lg" ? (
        <span className="text-[13px] font-medium text-[var(--accent)]">Save {pct}%</span>
      ) : null}
    </div>
  );
}
