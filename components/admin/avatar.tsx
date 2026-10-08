import { hashCode } from "@/lib/utils";

const PALETTE = [
  { bg: "rgba(191,69,20,0.14)", fg: "var(--accent)" },
  { bg: "rgba(43,95,168,0.14)", fg: "var(--info)" },
  { bg: "rgba(47,125,79,0.14)", fg: "var(--success)" },
  { bg: "rgba(168,106,18,0.16)", fg: "var(--warning)" },
];

export function Avatar({
  name,
  size = "md",
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const tone = PALETTE[hashCode(name) % PALETTE.length];

  const sizes = {
    sm: "h-7 w-7 text-[10.5px]",
    md: "h-9 w-9 text-[12px]",
    lg: "h-12 w-12 text-[15px]",
  } as const;

  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-full font-semibold ${sizes[size]} ${className ?? ""}`}
      style={{ backgroundColor: tone.bg, color: tone.fg }}
    >
      {initials}
    </span>
  );
}
