export default function OrdersLoading() {
  return (
    <div className="animate-pulse">
      {/* Page header */}
      <div className="mb-8 pb-8 border-b border-[oklch(0.18_0.04_280/0.1)]">
        <div className="h-2.5 w-16 bg-[oklch(0.88_0.01_280/0.4)] mb-3" />
        <div className="h-8 w-36 bg-[oklch(0.88_0.01_280/0.4)]" />
      </div>

      {/* Order rows */}
      <ul className="divide-y divide-[oklch(0.18_0.04_280/0.07)]">
        {[1, 2, 3, 4].map((i) => (
          <li key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5">
            <div className="space-y-2">
              <div className="h-5 w-44 bg-[oklch(0.88_0.01_280/0.4)]" />
              <div className="h-3 w-32 bg-[oklch(0.88_0.01_280/0.25)]" />
            </div>
            <div className="flex items-center gap-4">
              <div className="h-6 w-20 bg-[oklch(0.88_0.04_310/0.25)]" />
              <div className="h-6 w-16 bg-[oklch(0.88_0.01_280/0.3)]" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
