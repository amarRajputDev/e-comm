import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({
  title,
  description,
  actions,
  children,
  className,
  bodyClassName,
  padded = true,
}: {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
  padded?: boolean;
}) {
  return (
    <section
      className={cn(
        "flex flex-col border border-[var(--line)] bg-[var(--surface)]",
        className,
      )}
    >
      {title || actions ? (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--line)] px-4 py-3.5">
          <div className="min-w-0">
            <h2 className="text-[14px] font-semibold tracking-[-0.01em] text-[var(--ink)]">
              {title}
            </h2>
            {description ? (
              <p className="mt-0.5 text-[12.5px] text-[var(--ink-3)]">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
        </header>
      ) : null}

      <div className={cn(padded ? "p-4" : "", bodyClassName)}>{children}</div>
    </section>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  breadcrumb?: ReactNode;
}) {
  return (
    <header className="mb-5">
      {breadcrumb}
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-[var(--ink)]">
            {title}
          </h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-[13.5px] text-[var(--ink-3)]">{description}</p>
          ) : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-2">{actions}</div> : null}
      </div>
    </header>
  );
}
