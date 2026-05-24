import type { Product, StrapiEntity } from '@/types';
import { ProductCard } from './ProductCard';

type Props = {
  products: StrapiEntity<Product>[];
};

export function ProductGrid({ products }: Props) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <p className="font-heading text-[oklch(0.18_0.04_280)] text-3xl mb-3">
          No fragrances found
        </p>
        <p className="text-[oklch(0.45_0.04_280/0.6)] font-sans text-sm">
          Check back soon — new arrivals are on their way.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
      {products.map((product) => (
        <ProductCard key={product.documentId} product={product} />
      ))}
    </div>
  );
}
