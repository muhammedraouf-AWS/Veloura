import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchInput } from "@/components/shared/SearchInput";
import { searchProducts } from "@/lib/api/product.api";
import { ProductGrid } from "@/components/product/ProductGrid";
import { PaginationControls } from "@/components/shared/PaginationControls";

type Props = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `"${q}" — Search | Veloura` : "Search | Veloura",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q, page: pageParam } = await searchParams;
  const query = q?.trim() ?? "";
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const { products, pagination } = await searchProducts(query, page);

  return (
    <div className="bg-[oklch(0.97_0.01_60)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Search input — Suspense required by useSearchParams */}
        <div className="max-w-2xl mb-12">
          <Suspense fallback={<div className="h-12 bg-[oklch(0.90_0.01_60)] animate-pulse" />}>
            <SearchInput />
          </Suspense>
        </div>

        {!query ? (
          <p className="text-sm font-sans text-[oklch(0.45_0.04_280/0.5)]">
            Type above to search fragrances by name.
          </p>
        ) : (
          <>
            <p className="text-sm font-sans text-[oklch(0.45_0.04_280/0.6)] mb-8">
              {pagination.total === 0
                ? `No results for "${query}"`
                : `${pagination.total} ${pagination.total === 1 ? "result" : "results"} for "${query}"`}
            </p>

            <ProductGrid products={products} />

            {pagination.pageCount > 1 && (
              <div className="mt-16">
                <PaginationControls
                  pagination={pagination}
                  basePath={`/search?q=${encodeURIComponent(query)}`}
                />
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
