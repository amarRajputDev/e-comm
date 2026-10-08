import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return <div aria-hidden className={cn("skeleton rounded-[2px]", className)} />;
}

export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn("space-y-2.5", className)} aria-hidden>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn("h-3.5", i === lines - 1 ? "w-3/5" : "w-full")}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-3", className)} aria-hidden>
      <Skeleton className="aspect-4/5 w-full" />
      <Skeleton className="h-3 w-1/3" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="h-3 w-1/4" />
    </div>
  );
}

export function SkeletonGrid({ count = 8, className }: { count?: number; className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 lg:grid-cols-4",
        className,
      )}
      aria-label="Loading products"
      role="status"
    >
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 6, cols = 5 }: { rows?: number; cols?: number }) {
  return (
    <div className="space-y-3" role="status" aria-label="Loading">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4">
          {Array.from({ length: cols }).map((_, c) => (
            <Skeleton
              key={c}
              className={cn("h-4", c === 0 ? "w-1/4" : c === cols - 1 ? "w-1/8" : "flex-1")}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
