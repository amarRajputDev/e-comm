"use client";

import { useMemo, useState, type ReactNode } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, Search, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { EmptyState } from "@/components/ui/empty-state";

export interface Column<T> {
  key: string;
  header: ReactNode;
  render: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
  align?: "left" | "right";
  className?: string;
  /** Hide the column below this breakpoint (Tailwind sm/md/lg). */
  hideBelow?: "sm" | "md" | "lg";
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  getRowId: (row: T) => string;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (v: string) => void;
  /** Custom haystack for the search box. Defaults to the row's own data. */
  searchText?: (row: T) => string;
  toolbar?: ReactNode;
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  bulkActions?: (selected: string[], clear: () => void) => ReactNode;
  empty?: { title: string; description?: string; action?: { label: string; onClick?: () => void } };
  pageSize?: number;
  footer?: ReactNode;
  initialSort?: { key: string; dir: "asc" | "desc" };
}

export function DataTable<T>({
  columns,
  rows,
  getRowId,
  searchable = false,
  searchPlaceholder = "Search…",
  searchValue,
  onSearchChange,
  searchText,
  toolbar,
  onRowClick,
  selectable = false,
  bulkActions,
  empty,
  pageSize = 8,
  footer,
  initialSort,
}: DataTableProps<T>) {
  const [internalSearch, setInternalSearch] = useState("");
  const [sort, setSort] = useState(initialSort ?? null);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string[]>([]);

  const search = searchValue ?? internalSearch;
  const setSearch = onSearchChange ?? setInternalSearch;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    const toText = searchText ?? ((row: T) => JSON.stringify(row));
    return rows.filter((row) => toText(row).toLowerCase().includes(q));
  }, [rows, search, searchText]);

  const sorted = useMemo(() => {
    const base = filtered;
    if (!sort) return base;
    const col = columns.find((c) => c.key === sort.key);
    if (!col?.sortValue) return base;
    const copy = [...base];
    copy.sort((a, b) => {
      const av = col.sortValue!(a);
      const bv = col.sortValue!(b);
      const cmp = typeof av === "number" && typeof bv === "number" ? av - bv : String(av).localeCompare(String(bv));
      return sort.dir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [filtered, sort, columns]);

  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pages);
  const visible = sorted.slice((current - 1) * pageSize, current * pageSize);

  const toggleSort = (key: string) => {
    setPage(1);
    setSort((prev) =>
      prev?.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" },
    );
  };

  const allSelected = visible.length > 0 && visible.every((r) => selected.includes(getRowId(r)));
  const toggleAll = () => {
    if (allSelected) {
      setSelected((prev) => prev.filter((id) => !visible.some((r) => getRowId(r) === id)));
    } else {
      setSelected((prev) => Array.from(new Set([...prev, ...visible.map(getRowId)])));
    }
  };

  const hideClass = (col: Column<T>) =>
    col.hideBelow
      ? {
          sm: "hidden sm:table-cell",
          md: "hidden md:table-cell",
          lg: "hidden lg:table-cell",
        }[col.hideBelow]
      : "";

  return (
    <div className="border border-[var(--line)] bg-[var(--surface)]">
      {(searchable || toolbar) && (
        <div className="flex flex-wrap items-center gap-3 border-b border-[var(--line)] px-4 py-3">
          {searchable ? (
            <label className="relative min-w-56 flex-1">
              <span className="sr-only">{searchPlaceholder}</span>
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ink-3)]"
              />
              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder={searchPlaceholder}
                className="h-9 w-full rounded-[3px] border border-[var(--line)] bg-[var(--surface-2)] pl-9 pr-3 text-[13px] text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-[var(--ink-3)] focus:outline-none"
              />
            </label>
          ) : null}
          {toolbar}
        </div>
      )}

      {selectable && selected.length ? (
        <div className="flex flex-wrap items-center gap-3 border-b border-[var(--line)] bg-[var(--accent-tint)] px-4 py-2.5">
          <p className="text-[13px] font-medium text-[var(--ink)]">
            {selected.length} selected
          </p>
          <div className="ml-auto flex items-center gap-2">
            {bulkActions?.(selected, () => setSelected([]))}
            <button
              type="button"
              onClick={() => setSelected([])}
              className="text-[12.5px] text-[var(--ink-3)] underline-offset-4 hover:text-[var(--ink)] hover:underline"
            >
              Clear
            </button>
          </div>
        </div>
      ) : null}

      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-left">
          <thead>
            <tr className="border-b border-[var(--line)]">
              {selectable ? (
                <th className="w-10 px-4 py-3">
                  <input
                    type="checkbox"
                    aria-label="Select all visible rows"
                    checked={allSelected}
                    onChange={toggleAll}
                    className="h-3.5 w-3.5 accent-[var(--accent)]"
                  />
                </th>
              ) : null}

              {columns.map((col) => {
                const sortable = Boolean(col.sortValue);
                const active = sort?.key === col.key;
                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn(
                      "px-4 py-3 text-[11px] font-semibold uppercase tracking-[0.1em] text-[var(--ink-3)]",
                      col.align === "right" && "text-right",
                      hideClass(col),
                      col.className,
                    )}
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() => toggleSort(col.key)}
                        className={cn(
                          "inline-flex items-center gap-1.5 transition-colors hover:text-[var(--ink)]",
                          active && "text-[var(--ink)]",
                        )}
                      >
                        {col.header}
                        <ArrowUpDown
                          size={12}
                          strokeWidth={1.8}
                          className={cn(active && "text-[var(--accent)]")}
                        />
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {visible.map((row) => {
              const id = getRowId(row);
              const isSelected = selected.includes(id);
              return (
                <tr
                  key={id}
                  onClick={() => onRowClick?.(row)}
                  className={cn(
                    "border-b border-[var(--line)] last:border-0 transition-colors",
                    onRowClick && "cursor-pointer",
                    isSelected ? "bg-[var(--accent-tint)]/50" : "hover:bg-[var(--surface-2)]/60",
                  )}
                >
                  {selectable ? (
                    <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                      <input
                        type="checkbox"
                        aria-label={`Select ${id}`}
                        checked={isSelected}
                        onChange={() =>
                          setSelected((prev) =>
                            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
                          )
                        }
                        className="h-3.5 w-3.5 accent-[var(--accent)]"
                      />
                    </td>
                  ) : null}

                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={cn(
                        "px-4 py-3 text-[13.5px] text-[var(--ink-2)] align-middle",
                        col.align === "right" && "text-right",
                        hideClass(col),
                        col.className,
                      )}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {!visible.length && empty ? (
        <div className="px-4 py-6">
          <EmptyState
            compact
            title={
              search.trim() && rows.length
                ? `No matches for “${search.trim()}”`
                : empty.title
            }
            description={
              search.trim() && rows.length
                ? "Try a different term, or clear the search box."
                : empty.description
            }
            action={
              search.trim() && rows.length
                ? { label: "Clear search", onClick: () => setSearch("") }
                : empty.action
            }
          />
        </div>
      ) : null}

      {(footer || pages > 1) && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[var(--line)] px-4 py-3">
          <p className="text-[12.5px] text-[var(--ink-3)]">
            Showing{" "}
            <span className="font-medium text-[var(--ink)]">
              {(current - 1) * pageSize + 1}–{Math.min(current * pageSize, sorted.length)}
            </span>{" "}
            of <span className="font-medium text-[var(--ink)]">{sorted.length}</span>
          </p>

          {pages > 1 ? (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                aria-label="Previous page"
                disabled={current <= 1}
                onClick={() => setPage(current - 1)}
                className="grid h-8 w-8 place-items-center rounded-[3px] border border-[var(--line)] text-[var(--ink-2)] transition-colors hover:border-[var(--ink-3)] disabled:opacity-35"
              >
                <ChevronLeft size={15} />
              </button>

              <select
                value={current}
                onChange={(e) => setPage(Number(e.target.value))}
                aria-label="Select page"
                className="h-8 rounded-[3px] border border-[var(--line)] bg-[var(--surface)] px-2 text-[13px] text-[var(--ink)] focus:border-[var(--ink-3)] focus:outline-none"
              >
                {Array.from({ length: pages }).map((_, i) => (
                  <option key={i} value={i + 1}>
                    Page {i + 1}
                  </option>
                ))}
              </select>

              <button
                type="button"
                aria-label="Next page"
                disabled={current >= pages}
                onClick={() => setPage(current + 1)}
                className="grid h-8 w-8 place-items-center rounded-[3px] border border-[var(--line)] text-[var(--ink-2)] transition-colors hover:border-[var(--ink-3)] disabled:opacity-35"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          ) : (
            footer
          )}
        </div>
      )}
    </div>
  );
}

export function SelectMenu({
  value,
  onChange,
  options,
  label,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  label?: string;
  className?: string;
}) {
  return (
    <label className={cn("relative inline-flex items-center", className)}>
      {label ? <span className="sr-only">{label}</span> : null}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 cursor-pointer appearance-none rounded-[3px] border border-[var(--line)] bg-[var(--surface)] pl-3 pr-8 text-[13px] text-[var(--ink)] focus:border-[var(--ink-3)] focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-2.5 text-[var(--ink-3)]"
      />
    </label>
  );
}
