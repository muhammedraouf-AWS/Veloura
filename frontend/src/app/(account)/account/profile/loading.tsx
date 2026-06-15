export default function ProfileLoading() {
  return (
    <div className="animate-pulse">
      {/* Page header */}
      <div className="mb-8 pb-8 border-b border-[oklch(0.18_0.04_280/0.1)]">
        <div className="h-2.5 w-16 bg-[oklch(0.88_0.01_280/0.4)] mb-3" />
        <div className="h-8 w-32 bg-[oklch(0.88_0.01_280/0.4)] mb-2" />
        <div className="h-3 w-40 bg-[oklch(0.88_0.01_280/0.25)]" />
      </div>

      {/* Form skeleton */}
      <div className="max-w-md space-y-6">
        {[
          { label: 24, field: 40 },
          { label: 24, field: 40 },
          { label: 24, field: 40 },
          { label: 24, field: 40 },
        ].map((row, i) => (
          <div key={i} className="space-y-2">
            <div className={`h-3 w-${row.label} bg-[oklch(0.88_0.01_280/0.35)]`} />
            <div className="h-10 w-full bg-[oklch(0.88_0.01_280/0.2)] border border-[oklch(0.18_0.04_280/0.08)]" />
          </div>
        ))}
        <div className="h-10 w-32 bg-[oklch(0.88_0.04_310/0.3)] mt-4" />
      </div>
    </div>
  );
}
