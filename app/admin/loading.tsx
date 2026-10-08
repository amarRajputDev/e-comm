import { Skeleton, SkeletonTable } from "@/components/ui/skeleton";

export default function AdminLoading() {
  return (
    <div className="space-y-4" role="status" aria-label="Loading admin">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="border border-[var(--line)] bg-[var(--surface)] p-4">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="mt-5 h-7 w-32" />
            <Skeleton className="mt-3 h-3 w-20" />
          </div>
        ))}
      </div>
      <div className="border border-[var(--line)] bg-[var(--surface)] p-4">
        <Skeleton className="h-4 w-40" />
        <div className="mt-4 space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
      <div className="border border-[var(--line)] bg-[var(--surface)] p-4">
        <Skeleton className="mb-4 h-4 w-32" />
        <SkeletonTable rows={6} cols={5} />
      </div>
      <span className="sr-only">Loading…</span>
    </div>
  );
}
