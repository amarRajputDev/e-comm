import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

export function Section({
  children,
  className,
  id,
  size = "lg",
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
  size?: "sm" | "md" | "lg";
}) {
  const pad = {
    sm: "py-14 md:py-16",
    md: "py-16 md:py-24",
    lg: "py-20 md:py-28",
  }[size];
  return (
    <section id={id} className={cn(pad, className)}>
      <div className="container-x">{children}</div>
    </section>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  description?: string;
  action?: { label: string; href: string };
  align?: "left" | "center" | "between";
  className?: string;
}) {
  return (
    <Reveal
      className={cn(
        "mb-10 flex flex-col gap-5 md:mb-14",
        align === "center" && "items-center text-center",
        align === "between" && "flex-row items-end justify-between md:gap-10",
        align !== "between" && "max-w-2xl",
        className,
      )}
    >
      <div className={cn(align === "between" && "max-w-2xl")}>
        {eyebrow ? (
          <p className="eyebrow mb-4 flex items-center gap-3 text-[var(--accent)]">
            {align !== "center" && align !== "between" ? (
              <span className="h-px w-8 bg-[var(--accent)]" />
            ) : null}
            {eyebrow}
          </p>
        ) : null}
        <h2 className="h2 text-[var(--ink)]">{title}</h2>
        {description ? (
          <p className="mt-4 text-[15.5px] leading-relaxed text-[var(--ink-3)]">{description}</p>
        ) : null}
      </div>

      {action ? (
        <Link
          href={action.href}
          className="group inline-flex shrink-0 items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--ink)]"
        >
          {action.label}
          <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line-strong)] transition-colors duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--on-accent)]">
            <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </Link>
      ) : null}
    </Reveal>
  );
}
