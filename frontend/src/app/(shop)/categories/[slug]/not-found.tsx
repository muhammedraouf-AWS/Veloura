import Link from 'next/link';

export default function CategoryNotFound() {
  return (
    <div className="bg-[oklch(0.97_0.01_60)] min-h-screen flex items-center justify-center">
      <div className="text-center px-6 max-w-md">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[oklch(0.45_0.08_310/0.6)] font-sans mb-4">
          404
        </p>
        <h1 className="font-heading text-[oklch(0.18_0.04_280)] text-4xl mb-4">
          Category not found
        </h1>
        <p className="text-[oklch(0.45_0.04_280/0.6)] font-sans text-sm mb-8">
          This collection doesn't exist or may have been removed.
        </p>
        <Link
          href="/categories"
          className="inline-block px-8 py-3 bg-[oklch(0.35_0.12_310)] text-[oklch(0.97_0.01_60)] font-sans text-sm tracking-[0.1em] uppercase hover:bg-[oklch(0.28_0.10_310)] transition-colors"
        >
          All categories
        </Link>
      </div>
    </div>
  );
}
