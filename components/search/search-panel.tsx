"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Clock, Search as SearchIcon, TrendingUp, X } from "lucide-react";
import { popularSearches } from "@/lib/data/site";
import { searchProducts } from "@/lib/services/products";
import type { Product } from "@/types";
import { useUi } from "@/lib/store/providers";
import { money } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Img } from "@/components/ui/img";

const RECENT_KEY = "an.recent-searches";
const MAX_RECENT = 5;

export function SearchPanel() {
  const { searchOpen, closeSearch } = useUi();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [recent, setRecent] = useState<string[]>([]);
  const [active, setActive] = useState(-1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!searchOpen) return;
    try {
      setRecent(JSON.parse(window.localStorage.getItem(RECENT_KEY) ?? "[]"));
    } catch {
      setRecent([]);
    }
    setQuery("");
    setResults([]);
    setActive(-1);
    const t = window.setTimeout(() => inputRef.current?.focus(), 90);
    return () => window.clearTimeout(t);
  }, [searchOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const t = window.setTimeout(async () => {
      const found = await searchProducts(query, 6);
      setResults(found);
      setLoading(false);
      setActive(found.length ? 0 : -1);
    }, 160);
    return () => window.clearTimeout(t);
  }, [query]);

  const trending = useMemo(() => popularSearches.slice(0, 6), []);

  const pushRecent = (term: string) => {
    const next = [term, ...recent.filter((r) => r !== term)].slice(0, MAX_RECENT);
    setRecent(next);
    try {
      window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const go = (href: string, term?: string) => {
    if (term) pushRecent(term);
    closeSearch();
    router.push(href);
  };

  const submit = (term: string) => {
    if (!term.trim()) return;
    go(`/shop?q=${encodeURIComponent(term.trim())}`, term.trim());
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && results[active]) {
        pushRecent(query.trim() || results[active].name);
        closeSearch();
        router.push(`/product/${results[active].slug}`);
      } else {
        submit(query);
      }
    }
  };

  return (
    <AnimatePresence>
      {searchOpen ? (
        <div className="fixed inset-0 z-[100]" role="dialog" aria-modal="true" aria-label="Search">
          <motion.button
            type="button"
            aria-label="Close search"
            className="absolute inset-0 h-full w-full bg-[var(--overlay)] backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.26 }}
            onClick={closeSearch}
          />

          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.44, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-x-0 top-0 max-h-[92vh] overflow-y-auto bg-[var(--surface)] shadow-[var(--shadow-pop)]"
          >
            <div className="container-x pb-12 pt-7">
              <div className="flex items-center gap-4 border-b border-[var(--line-strong)] pb-5">
                <SearchIcon size={22} strokeWidth={1.5} className="shrink-0 text-[var(--ink-3)]" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder="Search for products, fabrics, categories…"
                  aria-label="Search products"
                  aria-controls="search-results"
                  className="h-10 w-full bg-transparent text-[clamp(1.15rem,2.4vw,1.65rem)] font-light tracking-[-0.02em] text-[var(--ink)] placeholder:text-[var(--ink-3)]/70 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={closeSearch}
                  aria-label="Close search"
                  className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-[var(--ink-3)] transition-colors hover:bg-[var(--ink)]/[0.07] hover:text-[var(--ink)]"
                >
                  <X size={20} strokeWidth={1.5} />
                </button>
              </div>

              <div className="mt-7 grid gap-10 lg:grid-cols-[1fr_1.25fr]">
                {/* recents + popular */}
                <div className="space-y-7">
                  {recent.length ? (
                    <section>
                      <p className="eyebrow mb-3 flex items-center gap-2 text-[var(--ink-3)]">
                        <Clock size={12} strokeWidth={1.75} /> Recent searches
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recent.map((term) => (
                          <button
                            key={term}
                            type="button"
                            onClick={() => {
                              setQuery(term);
                              inputRef.current?.focus();
                            }}
                            className="rounded-full border border-[var(--line)] px-3.5 py-1.5 text-[13px] text-[var(--ink-2)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </section>
                  ) : null}

                  <section>
                    <p className="eyebrow mb-3 flex items-center gap-2 text-[var(--ink-3)]">
                      <TrendingUp size={12} strokeWidth={1.75} /> Popular right now
                    </p>
                    <ul className="space-y-1">
                      {trending.map((term) => (
                        <li key={term}>
                          <button
                            type="button"
                            onClick={() => submit(term)}
                            className="group flex w-full items-center justify-between border-b border-[var(--line)] py-2.5 text-left text-[14.5px] text-[var(--ink-2)] transition-colors hover:text-[var(--accent)]"
                          >
                            {term}
                            <ArrowRight
                              size={14}
                              className="opacity-0 transition-all duration-200 group-hover:translate-x-1 group-hover:opacity-100"
                            />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </section>
                </div>

                {/* results */}
                <section aria-live="polite">
                  <p className="eyebrow mb-3 text-[var(--ink-3)]">
                    {query
                      ? loading
                        ? "Searching…"
                        : `${results.length} result${results.length === 1 ? "" : "s"}`
                      : "Suggested products"}
                  </p>

                  <div id="search-results" role="listbox" className="space-y-1">
                    {(query ? results : []).map((p, i) => (
                      <Link
                        key={p.id}
                        href={`/product/${p.slug}`}
                        role="option"
                        aria-selected={i === active}
                        onClick={() => pushRecent(query.trim() || p.name)}
                        onMouseEnter={() => setActive(i)}
                        className={cn(
                          "flex items-center gap-4 rounded-[2px] p-2.5 transition-colors",
                          i === active ? "bg-[var(--surface-2)]" : "hover:bg-[var(--surface-2)]/60",
                        )}
                      >
                        <div className="h-16 w-14 shrink-0 overflow-hidden bg-[var(--surface-2)]">
                          <Img sizes="64px" width={128} height={160}
                            src={p.images[0]?.src}
                            alt=""
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-[14.5px] font-medium text-[var(--ink)]">
                            {p.name}
                          </p>
                          <p className="truncate text-[12.5px] text-[var(--ink-3)] capitalize">
                            {p.category} · {p.colors.length} colours
                          </p>
                        </div>
                        <span className="shrink-0 text-[14px] tabular-nums text-[var(--ink)]">
                          {money(p.price)}
                        </span>
                      </Link>
                    ))}

                    {!query
                      ? (
                          [
                            "structured-trench-coat",
                            "heavyweight-box-tee",
                            "grain-leather-tote",
                            "merino-crew-knit",
                          ] as const
                        ).map((slug, i) => {
                          return (
                            <SuggestedRow key={slug} slug={slug} active={active === i} onHover={() => setActive(i)} />
                          );
                        })
                      : null}
                  </div>

                  {query && !loading && !results.length ? (
                    <div className="rounded-[2px] border border-dashed border-[var(--line-strong)] p-6 text-center">
                      <p className="text-[14.5px] text-[var(--ink-2)]">
                        Nothing for “{query}” yet.
                      </p>
                      <button
                        type="button"
                        onClick={() => submit(query)}
                        className="mt-3 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--accent)] underline-offset-4 hover:underline"
                      >
                        Search the full catalogue
                      </button>
                    </div>
                  ) : null}

                  <p className="mt-6 text-[12.5px] text-[var(--ink-3)]">
                    <kbd className="rounded-[2px] border border-[var(--line)] px-1.5 py-0.5 font-mono text-[11px]">
                      ↑
                    </kbd>{" "}
                    <kbd className="rounded-[2px] border border-[var(--line)] px-1.5 py-0.5 font-mono text-[11px]">
                      ↓
                    </kbd>{" "}
                    to navigate ·{" "}
                    <kbd className="rounded-[2px] border border-[var(--line)] px-1.5 py-0.5 font-mono text-[11px]">
                      Enter
                    </kbd>{" "}
                    to open ·{" "}
                    <kbd className="rounded-[2px] border border-[var(--line)] px-1.5 py-0.5 font-mono text-[11px]">
                      Esc
                    </kbd>{" "}
                    to close
                  </p>
                </section>
              </div>
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

function SuggestedRow({
  slug,
  active,
  onHover,
}: {
  slug: string;
  active: boolean;
  onHover: () => void;
}) {
  const [product, setProduct] = useState<Product | null>(null);

  useEffect(() => {
    let cancelled = false;
    searchProducts(slug.replace(/-/g, " "), 1).then(([found]) => {
      if (!cancelled && found) setProduct(found);
    });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!product) return null;

  return (
    <Link
      href={`/product/${product.slug}`}
      role="option"
      aria-selected={active}
      onMouseEnter={onHover}
      className={cn(
        "flex items-center gap-4 rounded-[2px] p-2.5 transition-colors",
        active ? "bg-[var(--surface-2)]" : "hover:bg-[var(--surface-2)]/60",
      )}
    >
      <div className="h-16 w-14 shrink-0 overflow-hidden bg-[var(--surface-2)]">
        <Img sizes="64px" width={128} height={160} src={product.images[0]?.src} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14.5px] font-medium text-[var(--ink)]">{product.name}</p>
        <p className="truncate text-[12.5px] text-[var(--ink-3)] capitalize">
          {product.category}
        </p>
      </div>
      <span className="shrink-0 text-[14px] tabular-nums text-[var(--ink)]">
        {money(product.price)}
      </span>
    </Link>
  );
}
