function CardSkeleton() {
  return (
    <div>
      <div className="aspect-[3/4] bg-[oklch(0.88_0.02_60)] animate-pulse" />
      <div className="pt-4 space-y-2">
        <div className="h-2.5 w-16 bg-[oklch(0.88_0.02_60)] animate-pulse" />
        <div className="h-5 w-3/4 bg-[oklch(0.85_0.02_60)] animate-pulse" />
        <div className="h-3 w-full bg-[oklch(0.88_0.02_60)] animate-pulse" />
        <div className="h-3 w-2/3 bg-[oklch(0.88_0.02_60)] animate-pulse" />
        <div className="h-5 w-20 bg-[oklch(0.85_0.02_60)] animate-pulse mt-1" />
      </div>
    </div>
  );
}

export default function ProductsLoading() {
  return (
    <div className="bg-[oklch(0.97_0.01_60)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header skeleton */}
        <div className="mb-12 space-y-3">
          <div className="h-2.5 w-20 bg-[oklch(0.88_0.02_60)] animate-pulse" />
          <div className="h-10 w-64 bg-[oklch(0.85_0.02_60)] animate-pulse" />
          <div className="h-3 w-24 bg-[oklch(0.88_0.02_60)] animate-pulse" />
        </div>

        {/* Grid skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>

      </div>
    </div>
  );
}
