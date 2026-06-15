import type { Metadata } from 'next';
import { getCategories } from '@/lib/api/category.api';
import { CategoryCard } from '@/components/shared/CategoryCard';

export const metadata: Metadata = {
  title: 'Shop by Category',
  description: 'Explore our fragrance families — from delicate florals and fresh citrus to rich ouds and warm orientals.',
  openGraph: {
    title: 'Shop by Category | Veloura',
    description: 'Explore our fragrance families — from delicate florals and fresh citrus to rich ouds and warm orientals.',
    url: '/categories',
  },
};

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="bg-[oklch(0.97_0.01_60)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Header */}
        <div className="mb-12">
          <p className="text-[10px] tracking-[0.25em] uppercase text-[oklch(0.45_0.08_310/0.6)] font-sans mb-3">
            Explore
          </p>
          <h1 className="font-heading text-[oklch(0.18_0.04_280)] text-4xl md:text-5xl mb-4">
            Shop by Category
          </h1>
          <p className="text-[oklch(0.45_0.04_280/0.7)] font-sans text-sm max-w-lg">
            Find your signature scent within our curated fragrance families.
          </p>
        </div>

        {/* Grid */}
        {categories.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <p className="font-heading text-[oklch(0.18_0.04_280)] text-3xl mb-3">
              No categories yet
            </p>
            <p className="text-[oklch(0.45_0.04_280/0.6)] font-sans text-sm">
              Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category) => (
              <CategoryCard key={category.documentId} category={category} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
