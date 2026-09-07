export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-lg bg-gray-800 ${className}`} />
  );
}

export function MediaCardSkeleton() {
  return (
    <div>
      <Skeleton className="aspect-[2/3] w-full rounded-lg" />
      <Skeleton className="mt-2 h-4 w-3/4" />
      <Skeleton className="mt-1 h-3 w-1/3" />
    </div>
  );
}

export function MediaGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {Array.from({ length: count }, (_, i) => (
        <MediaCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function WatchlistEntrySkeleton() {
  return (
    <div className="flex items-center gap-4 rounded-xl border border-gray-800 bg-gray-900 p-4">
      <Skeleton className="h-20 w-14 shrink-0 rounded-lg" />
      <div className="min-w-0 flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
      <Skeleton className="h-6 w-20 rounded-full" />
    </div>
  );
}

export function DetailPageSkeleton() {
  return (
    <div className="space-y-8">
      <div className="relative overflow-hidden rounded-2xl bg-gray-900 p-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <Skeleton className="h-72 w-48 shrink-0 rounded-lg" />
          <div className="flex-1 space-y-4">
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
            <div className="flex gap-2">
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-40 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-gray-800 bg-gray-900 p-8">
        <div className="flex items-start gap-6">
          <Skeleton className="h-20 w-20 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-4 w-1/6" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-7">
        {Array.from({ length: 7 }, (_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
