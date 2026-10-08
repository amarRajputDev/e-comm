import { Skeleton, SkeletonGrid } from "@/components/ui/skeleton";

export default function StoreLoading() {
  return (
    <div className="container-x pb-24 pt-10" role="status" aria-label="Loading page">
      <div className="skeleton h-3 w-40" />
      <div className="mt-6 skeleton h-11 w-2/3 max-w-lg" />
      <div className="mt-4 skeleton h-4 w-96 max-w-full" />
      <div className="mt-12">
        <SkeletonGrid count={8} />
      </div>
      <span className="sr-only">Loading…</span>
      <Skeleton className="mt-10 h-4 w-64" />
    </div>
  );
}
