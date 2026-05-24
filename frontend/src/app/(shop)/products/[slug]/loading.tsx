export default function ProductDetailLoading() {
  return (
    <div className="bg-[oklch(0.97_0.01_60)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Breadcrumb skeleton */}
        <div className="flex gap-2 mb-10">
          {[40, 16, 60, 16, 80].map((w, i) => (
            <div key={i} className={`h-2.5 w-${w === 16 ? '4' : `[${w}px]`} bg-[oklch(0.88_0.02_60)] animate-pulse rounded`} style={{ width: w }} />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

          {/* Image skeleton */}
          <div className="aspect-[3/4] bg-[oklch(0.88_0.02_60)] animate-pulse" />

          {/* Info skeleton */}
          <div className="space-y-4 pt-2">
            <div className="h-2.5 w-24 bg-[oklch(0.88_0.02_60)] animate-pulse" />
            <div className="h-12 w-3/4 bg-[oklch(0.85_0.02_60)] animate-pulse" />
            <div className="h-4 w-full bg-[oklch(0.88_0.02_60)] animate-pulse" />
            <div className="h-4 w-5/6 bg-[oklch(0.88_0.02_60)] animate-pulse" />
            <div className="h-8 w-28 bg-[oklch(0.85_0.02_60)] animate-pulse mt-4" />
            <div className="h-2.5 w-20 bg-[oklch(0.88_0.02_60)] animate-pulse" />
            <div className="flex gap-3 mt-6">
              <div className="flex-1 h-14 bg-[oklch(0.85_0.08_310/0.2)] animate-pulse" />
              <div className="w-14 h-14 bg-[oklch(0.88_0.02_60)] animate-pulse" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
