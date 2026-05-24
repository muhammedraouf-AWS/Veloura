export default function CategoryLoading() {
  return (
    <div className="bg-[oklch(0.97_0.01_60)] min-h-screen">
      <div className="h-56 md:h-72 bg-[oklch(0.85_0.02_60)] animate-pulse" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-3 w-24 bg-[oklch(0.88_0.02_60)] animate-pulse mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i}>
              <div className="aspect-[3/4] bg-[oklch(0.88_0.02_60)] animate-pulse" />
              <div className="pt-4 space-y-2">
                <div className="h-2.5 w-16 bg-[oklch(0.88_0.02_60)] animate-pulse" />
                <div className="h-5 w-3/4 bg-[oklch(0.85_0.02_60)] animate-pulse" />
                <div className="h-5 w-20 bg-[oklch(0.85_0.02_60)] animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
