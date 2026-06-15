export default function OrderDetailLoading() {
  return (
    <div className="animate-pulse">
      {/* Back link */}
      <div className="h-3 w-24 bg-[oklch(0.88_0.01_280/0.3)] mb-8" />

      {/* Header */}
      <div className="pb-8 border-b border-[oklch(0.18_0.04_280/0.1)] mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="h-2.5 w-12 bg-[oklch(0.88_0.01_280/0.3)]" />
            <div className="h-8 w-48 bg-[oklch(0.88_0.01_280/0.4)]" />
            <div className="h-3 w-36 bg-[oklch(0.88_0.01_280/0.25)]" />
          </div>
          <div className="flex gap-2">
            <div className="h-7 w-20 bg-[oklch(0.88_0.04_310/0.25)]" />
            <div className="h-7 w-16 bg-[oklch(0.88_0.08_155/0.25)]" />
          </div>
        </div>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">

        {/* Items */}
        <div>
          <div className="h-6 w-12 bg-[oklch(0.88_0.01_280/0.4)] mb-5" />
          <ul className="divide-y divide-[oklch(0.18_0.04_280/0.07)]">
            {[1, 2, 3].map((i) => (
              <li key={i} className="flex items-start justify-between gap-4 py-4">
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-40 bg-[oklch(0.88_0.01_280/0.4)]" />
                  <div className="h-3 w-24 bg-[oklch(0.88_0.01_280/0.25)]" />
                </div>
                <div className="h-5 w-16 bg-[oklch(0.88_0.01_280/0.3)]" />
              </li>
            ))}
          </ul>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          <div className="border border-[oklch(0.18_0.04_280/0.1)] p-5 space-y-3">
            <div className="h-5 w-20 bg-[oklch(0.88_0.01_280/0.4)]" />
            <div className="h-3 w-full bg-[oklch(0.88_0.01_280/0.2)]" />
            <div className="h-3 w-full bg-[oklch(0.88_0.01_280/0.2)]" />
            <div className="h-3 w-full bg-[oklch(0.88_0.01_280/0.2)]" />
            <div className="pt-2 border-t border-[oklch(0.18_0.04_280/0.08)]">
              <div className="h-6 w-28 bg-[oklch(0.88_0.01_280/0.35)]" />
            </div>
          </div>
          <div className="border border-[oklch(0.18_0.04_280/0.1)] p-5 space-y-2">
            <div className="h-5 w-16 bg-[oklch(0.88_0.01_280/0.4)]" />
            <div className="h-3 w-36 bg-[oklch(0.88_0.01_280/0.2)]" />
            <div className="h-3 w-32 bg-[oklch(0.88_0.01_280/0.2)]" />
            <div className="h-3 w-28 bg-[oklch(0.88_0.01_280/0.2)]" />
          </div>
        </aside>

      </div>
    </div>
  );
}
