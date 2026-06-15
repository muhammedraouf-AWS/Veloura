import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getProducts } from '@/lib/api/product.api';
import { getAuthToken } from '@/lib/utils/auth';
import { getUserWishlistIds } from '@/lib/api/user.api';
import { ProductImageGallery } from '@/components/product/ProductImageGallery';
import { ProductActions } from '@/components/product/ProductActions';
import { ReviewsSection } from '@/components/product/ReviewsSection';
import type { StrapiEntity, ProductVariant } from '@/types';

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  try {
    const { products } = await getProducts();
    return products.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  const description =
    product.shortDescription ?? `Discover ${product.title} — a luxury fragrance by Veloura.`;
  const ogImage =
    product.images?.[0]?.formats?.large?.url ??
    product.images?.[0]?.formats?.medium?.url ??
    product.images?.[0]?.url;
  return {
    title: product.title,
    description,
    openGraph: {
      title: `${product.title} | Veloura`,
      description,
      url: `/products/${slug}`,
      ...(ogImage && { images: [{ url: ogImage, alt: product.title }] }),
    },
    twitter: {
      card: "summary_large_image",
      title: `${product.title} | Veloura`,
      description,
      ...(ogImage && { images: [ogImage] }),
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const token = await getAuthToken();

  const [product, wishlistData] = await Promise.all([
    getProductBySlug(slug),
    token ? getUserWishlistIds(token) : Promise.resolve(null),
  ]);

  if (!product) notFound();

  const isInWishlist =
    wishlistData?.wishlist?.some((p) => p.id === product.id) ?? false;

  const {
    title,
    price,
    compareAtPrice,
    description,
    shortDescription,
    images,
    category,
    sku,
    inventory,
    isFeatured,
    variants,
  } = product;

  const safeImages = images ?? [];
  const safeVariants = (variants ?? []) as StrapiEntity<ProductVariant>[];
  const firstImageUrl =
    safeImages[0]?.formats?.medium?.url ?? safeImages[0]?.url ?? '';

  return (
    <div className="bg-[oklch(0.97_0.01_60)] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[11px] tracking-[0.15em] uppercase font-sans text-[oklch(0.45_0.04_280/0.5)] mb-10">
          <Link href="/" className="hover:text-[oklch(0.35_0.12_310)] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[oklch(0.35_0.12_310)] transition-colors">Fragrances</Link>
          <span>/</span>
          <span className="text-[oklch(0.35_0.08_310)]">{title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

          {/* ── Image gallery (client) ── */}
          <ProductImageGallery
            images={safeImages}
            title={title}
            isFeatured={isFeatured}
          />

          {/* ── Product info ── */}
          <div className="flex flex-col">

            {/* Category + SKU */}
            <div className="flex items-center justify-between mb-4">
              {category && (
                <Link
                  href={`/categories/${category.slug}`}
                  className="text-[10px] tracking-[0.2em] uppercase text-[oklch(0.45_0.08_310/0.7)] font-sans hover:text-[oklch(0.35_0.12_310)] transition-colors"
                >
                  {category.name}
                </Link>
              )}
              {sku && (
                <span className="text-[10px] tracking-[0.1em] font-sans text-[oklch(0.45_0.04_280/0.4)]">
                  SKU: {sku}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="font-heading text-[oklch(0.18_0.04_280)] text-4xl md:text-5xl leading-tight mb-6">
              {title}
            </h1>

            {/* Short description */}
            {shortDescription && (
              <p className="text-[oklch(0.35_0.04_280/0.75)] font-sans text-base leading-relaxed mb-8 border-l-2 border-[oklch(0.35_0.12_310/0.3)] pl-4 italic">
                {shortDescription}
              </p>
            )}

            {/* Price + variants + add to cart (client island) */}
            <ProductActions
              productId={product.id}
              documentId={product.documentId}
              slug={slug}
              title={title}
              image={firstImageUrl}
              basePrice={price}
              compareAtPrice={compareAtPrice}
              baseInventory={inventory}
              variants={safeVariants}
              isLoggedIn={!!token}
              isInWishlist={isInWishlist}
            />

            {/* Divider */}
            <div className="border-t border-[oklch(0.35_0.08_310/0.12)] my-8" />

            {/* Full description */}
            {description && (
              <div className="mb-8">
                <h2 className="font-heading text-[oklch(0.18_0.04_280)] text-xl mb-4">
                  About this fragrance
                </h2>
                <div
                  className="prose prose-sm font-sans text-[oklch(0.35_0.04_280/0.8)] leading-relaxed max-w-none [&_p]:mb-3"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
            )}

            {/* Delivery notes */}
            <div className="border-t border-[oklch(0.35_0.08_310/0.12)] pt-6 space-y-2">
              {[
                'Complimentary shipping on orders over $100',
                'Samples included with every order',
                'Free returns within 30 days',
              ].map((note) => (
                <p
                  key={note}
                  className="text-xs font-sans text-[oklch(0.45_0.04_280/0.6)] flex items-center gap-2"
                >
                  <span className="text-[oklch(0.35_0.12_310)]">✦</span> {note}
                </p>
              ))}
            </div>

          </div>
        </div>

        {/* ── Reviews (streamed independently) ── */}
        <Suspense fallback={<ReviewsSkeleton />}>
          <ReviewsSection
            slug={slug}
            productDocumentId={product.documentId}
            isLoggedIn={!!token}
          />
        </Suspense>

      </div>
    </div>
  );
}

function ReviewsSkeleton() {
  return (
    <div className="mt-16 pt-12 border-t border-[oklch(0.35_0.08_310/0.12)] animate-pulse">
      <div className="h-8 w-48 bg-[oklch(0.88_0.01_280/0.35)] mb-10" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="py-5 space-y-3 border-b border-[oklch(0.35_0.08_310/0.1)]">
              <div className="h-3 w-20 bg-[oklch(0.88_0.01_280/0.3)]" />
              <div className="h-4 w-44 bg-[oklch(0.88_0.01_280/0.35)]" />
              <div className="h-3 w-full bg-[oklch(0.88_0.01_280/0.2)]" />
              <div className="h-3 w-3/4 bg-[oklch(0.88_0.01_280/0.2)]" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-4 w-32 bg-[oklch(0.88_0.01_280/0.3)]" />
          <div className="h-24 w-full bg-[oklch(0.88_0.01_280/0.15)]" />
          <div className="h-10 w-28 bg-[oklch(0.88_0.04_310/0.25)]" />
        </div>
      </div>
    </div>
  );
}
