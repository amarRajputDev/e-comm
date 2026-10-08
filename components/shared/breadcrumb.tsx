import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { SITE } from "@/lib/tokens";
import { cn } from "@/lib/utils";

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items, className }: { items: Crumb[]; className?: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${SITE.url}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <nav aria-label="Breadcrumb" className={cn("flex flex-wrap items-center gap-2", className)}>
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex items-center gap-2">
              {item.href && !last ? (
                <Link
                  href={item.href}
                  className="text-[12.5px] text-[var(--ink-3)] transition-colors hover:text-[var(--ink)]"
                >
                  {item.label}
                </Link>
              ) : (
                <span
                  aria-current={last ? "page" : undefined}
                  className={cn(
                    "text-[12.5px]",
                    last ? "text-[var(--ink)]" : "text-[var(--ink-3)]",
                  )}
                >
                  {item.label}
                </span>
              )}
              {!last ? (
                <ChevronRight size={13} strokeWidth={1.5} className="text-[var(--ink-3)]/70" />
              ) : null}
            </li>
          );
        })}
      </ol>
      </nav>
    </>
  );
}
