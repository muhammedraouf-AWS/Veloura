export default function RootLoading() {
  return (
    <div className="flex flex-1 flex-col bg-cream animate-pulse">

      {/* Hero skeleton */}
      <div className="flex min-h-[88svh]">
        {/* Text panel */}
        <div className="flex flex-1 flex-col justify-center gap-6 px-8 sm:px-12 lg:px-16 xl:px-20 py-24">
          <div className="h-3 w-24 rounded-none bg-ink/8" />
          <div className="flex flex-col gap-3">
            <div className="h-14 w-[80%] max-w-md rounded-none bg-ink/10" />
            <div className="h-14 w-[60%] max-w-xs rounded-none bg-ink/10" />
            <div className="h-14 w-[40%] max-w-[180px] rounded-none bg-ink/10" />
          </div>
          <div className="flex flex-col gap-2 mt-2">
            <div className="h-4 w-72 rounded-none bg-ink/7" />
            <div className="h-4 w-56 rounded-none bg-ink/7" />
          </div>
          <div className="h-12 w-48 rounded-none bg-ink/12 mt-2" />
        </div>

        {/* Image panel */}
        <div className="hidden md:block md:w-[44%] lg:w-[46%] shrink-0 bg-plum/20" />
      </div>

      {/* Featured section skeleton */}
      <div className="bg-cream py-20 px-8 sm:px-12 lg:px-16 xl:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-3">
            <div className="h-3 w-32 rounded-none bg-ink/8" />
            <div className="h-10 w-64 rounded-none bg-ink/10" />
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:h-160">
            <div className="sm:col-span-2 sm:row-span-2 aspect-[3/4] sm:aspect-auto rounded-none bg-plum/15" />
            <div className="aspect-[4/5] sm:aspect-auto rounded-none bg-plum/10" />
            <div className="aspect-[4/5] sm:aspect-auto rounded-none bg-plum/10" />
          </div>
        </div>
      </div>

    </div>
  )
}
