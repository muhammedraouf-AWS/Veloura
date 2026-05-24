export default function CategoriesLoading() {
  return (
    <div className="bg-[oklch(0.97_0.01_60)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        <div className="mb-12 space-y-3">
          <div className="h-2.5 w-16 bg-[oklch(0.88_0.02_60)] animate-pulse" />
          <div className="h-10 w-56 bg-[oklch(0.85_0.02_60)] animate-pulse" />
          <div className="h-3 w-72 bg-[oklch(0.88_0.02_60)] animate-pulse" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] bg-[oklch(0.88_0.02_60)] animate-pulse" />
          ))}
        </div>

      </div>
    </div>
  );
}
