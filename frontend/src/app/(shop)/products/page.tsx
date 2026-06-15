import { Suspense } from 'react';
import { getProducts } from '@/lib/api/product.api';
import { getCategories } from '@/lib/api/category.api';
import { ProductGrid } from '@/components/product/ProductGrid';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { ProductFilters } from '@/components/shared/ProductFilters';

import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Fragrances',
  description: 'Explore our full collection of luxury perfumes — from delicate florals to rich ouds.',
  openGraph: {
    title: 'All Fragrances | Veloura',
    description: 'Explore our full collection of luxury perfumes — from delicate florals to rich ouds.',
    url: '/products',
  },
};

type Props = {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    category?: string;
    price?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const { page: pageParam, sort, category, price } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

  const [{ products, pagination }, categories] = await Promise.all([
    getProducts(page, { sort, category, price }),
    getCategories(),
  ]);

  // Build basePath preserving active filters for pagination links
  const filterParams = new URLSearchParams();
  if (sort)     filterParams.set('sort', sort);
  if (category) filterParams.set('category', category);
  if (price)    filterParams.set('price', price);
  const filterStr = filterParams.toString();
  const basePath = filterStr ? `/products?${filterStr}` : '/products';

  const categoryList = categories.map((c) => ({ name: c.name, slug: c.slug }));

  return (
    <div className="bg-[oklch(0.97_0.01_60)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header */}
        <div className="mb-10">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[oklch(0.45_0.08_310/0.6)] font-sans mb-3">
            Collection
          </p>
          <h1 className="font-heading text-[oklch(0.18_0.04_280)] text-4xl md:text-5xl mb-3">
            All Fragrances
          </h1>
          <p className="text-[oklch(0.45_0.04_280/0.7)] font-sans text-sm">
            {pagination.total} {pagination.total === 1 ? 'fragrance' : 'fragrances'}
          </p>
        </div>

        {/* Filters sidebar (handles mobile toggle + desktop sidebar internally) + product grid */}
        <div className="lg:grid lg:grid-cols-[220px_1fr] lg:gap-12 lg:items-start">

          {/* ProductFilters: mobile = toggle button above grid; desktop = sticky sidebar */}
          <Suspense fallback={<FilterSkeleton />}>
            <ProductFilters categories={categoryList} />
          </Suspense>

          {/* Products */}
          <div>
            <ProductGrid products={products} />

            {pagination.pageCount > 1 && (
              <div className="mt-16">
                <PaginationControls pagination={pagination} basePath={basePath} />
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

function FilterSkeleton() {
  return (
    <div className="hidden lg:block space-y-6 animate-pulse">
      <div className="h-3 w-24 bg-[oklch(0.88_0.01_280/0.35)]" />
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-2 pt-4 border-t border-[oklch(0.18_0.04_280/0.08)]">
          <div className="h-3 w-20 bg-[oklch(0.88_0.01_280/0.3)]" />
          <div className="h-3 w-full bg-[oklch(0.88_0.01_280/0.15)]" />
          <div className="h-3 w-3/4 bg-[oklch(0.88_0.01_280/0.15)]" />
        </div>
      ))}
    </div>
  );
}
