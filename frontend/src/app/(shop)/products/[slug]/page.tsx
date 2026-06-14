import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getProductBySlug, getProducts } from '@/lib/api/product.api';
import { getProductReviews } from '@/lib/api/review.api';
import { getAuthToken } from '@/lib/utils/auth';
import { getUserWishlistIds } from '@/lib/api/user.api';
import { ProductImageGallery } from '@/components/product/ProductImageGallery';
import { ProductActions } from '@/components/product/ProductActions';
import { ReviewsList } from '@/components/product/ReviewsList';
import { ReviewForm } from '@/components/product/ReviewForm';
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
  return {
    title: `${product.title} | Veloura`,
    description:
      product.shortDescription ??
      `Discover ${product.title} — a luxury fragrance by Veloura.`,
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;

  const token = await getAuthToken();

  const [product, reviews, wishlistData] = await Promise.all([
    getProductBySlug(slug),
    getProductReviews(slug),
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

        {/* ── Reviews ── */}
        <div className="mt-16 pt-12 border-t border-[oklch(0.35_0.08_310/0.12)]">
          <h2 className="font-heading text-[oklch(0.18_0.04_280)] text-3xl mb-10">
            Customer Reviews
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            <ReviewsList reviews={reviews} />
            <ReviewForm
              productDocumentId={product.documentId}
              productSlug={slug}
              isLoggedIn={!!token}
            />
          </div>
        </div>

      </div>
    </div>
  );
}
