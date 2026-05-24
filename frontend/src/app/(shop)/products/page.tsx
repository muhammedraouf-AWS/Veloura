import { getProducts } from '@/lib/api/product.api';
import { ProductGrid } from '@/components/product/ProductGrid';
import { PaginationControls } from '@/components/shared/PaginationControls';

export const metadata = {
  title: 'All Fragrances | Veloura',
  description: 'Explore our full collection of luxury perfumes — from delicate florals to rich ouds.',
};

type Props = {
  searchParams: Promise<{ page?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

  const { products, pagination } = await getProducts(page);

  return (
    <div className="bg-[oklch(0.97_0.01_60)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header */}
        <div className="mb-12">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[oklch(0.45_0.08_310/0.6)] font-sans mb-3">
            Collection
          </p>
          <h1 className="font-heading text-[oklch(0.18_0.04_280)] text-4xl md:text-5xl mb-4">
            All Fragrances
          </h1>
          <p className="text-[oklch(0.45_0.04_280/0.7)] font-sans text-sm">
            {pagination.total} {pagination.total === 1 ? 'fragrance' : 'fragrances'}
          </p>
        </div>

        {/* Grid */}
        <ProductGrid products={products} />

        {/* Pagination */}
        {pagination.pageCount > 1 && (
          <div className="mt-16">
            <PaginationControls pagination={pagination} basePath="/products" />
          </div>
        )}

      </div>
    </div>
  );
}
