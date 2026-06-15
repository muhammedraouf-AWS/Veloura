import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getCategoryBySlug, getCategories } from '@/lib/api/category.api';
import { getProductsByCategory } from '@/lib/api/product.api';
import { ProductGrid } from '@/components/product/ProductGrid';
import { PaginationControls } from '@/components/shared/PaginationControls';

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((c) => ({ slug: c.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return {};
  const description = category.description ?? `Shop ${category.name} fragrances at Veloura.`;
  const ogImage =
    category.image?.formats?.large?.url ??
    category.image?.formats?.medium?.url ??
    category.image?.url;
  return {
    title: category.name,
    description,
    openGraph: {
      title: `${category.name} | Veloura`,
      description,
      url: `/categories/${slug}`,
      ...(ogImage && { images: [{ url: ogImage, alt: category.name }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.name} | Veloura`,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? '1', 10) || 1);

  const [category, { products, pagination }] = await Promise.all([
    getCategoryBySlug(slug),
    getProductsByCategory(slug, page),
  ]);

  if (!category) notFound();

  const heroImageUrl =
    category.image?.formats?.large?.url ??
    category.image?.formats?.medium?.url ??
    category.image?.url ??
    null;

  return (
    <div className="bg-[oklch(0.97_0.01_60)] min-h-screen">

      {/* Category hero */}
      <div className="relative h-56 md:h-72 overflow-hidden bg-[oklch(0.88_0.04_310/0.2)]">
        {heroImageUrl && (
          <Image
            src={heroImageUrl}
            alt={category.image?.alternativeText ?? category.name}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.18_0.04_280/0.7)] to-[oklch(0.18_0.04_280/0.3)]" />

        <div className="absolute inset-0 flex flex-col justify-end max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[10px] tracking-[0.15em] uppercase font-sans text-[oklch(0.97_0.01_60/0.6)] mb-3">
            <Link href="/" className="hover:text-[oklch(0.97_0.01_60)] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/categories" className="hover:text-[oklch(0.97_0.01_60)] transition-colors">Categories</Link>
            <span>/</span>
            <span className="text-[oklch(0.97_0.01_60/0.9)]">{category.name}</span>
          </nav>

          <h1 className="font-heading text-[oklch(0.97_0.01_60)] text-4xl md:text-5xl">
            {category.name}
          </h1>

          {category.description && (
            <p className="text-[oklch(0.97_0.01_60/0.75)] font-sans text-sm mt-2 max-w-lg">
              {category.description}
            </p>
          )}
        </div>
      </div>

      {/* Products */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        <p className="text-[oklch(0.45_0.04_280/0.6)] font-sans text-sm mb-8">
          {pagination.total} {pagination.total === 1 ? 'fragrance' : 'fragrances'}
        </p>

        <ProductGrid products={products} />

        {pagination.pageCount > 1 && (
          <div className="mt-16">
            <PaginationControls
              pagination={pagination}
              basePath={`/categories/${slug}`}
            />
          </div>
        )}

      </div>
    </div>
  );
}
