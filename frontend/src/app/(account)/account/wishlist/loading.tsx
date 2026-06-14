export default function WishlistLoading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-9 w-32 bg-[oklch(0.18_0.04_280/0.08)] animate-pulse mb-2" />
        <div className="h-4 w-24 bg-[oklch(0.18_0.04_280/0.06)] animate-pulse" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <div className="aspect-[3/4] bg-[oklch(0.18_0.04_280/0.07)] animate-pulse" />
            <div className="pt-4 space-y-2">
              <div className="h-3 w-16 bg-[oklch(0.18_0.04_280/0.06)] animate-pulse" />
              <div className="h-5 w-3/4 bg-[oklch(0.18_0.04_280/0.08)] animate-pulse" />
              <div className="h-3 w-full bg-[oklch(0.18_0.04_280/0.05)] animate-pulse" />
              <div className="h-5 w-20 bg-[oklch(0.18_0.04_280/0.08)] animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
