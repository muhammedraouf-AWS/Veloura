import Image from 'next/image';
import Link from 'next/link';
import { ShoppingBag } from 'lucide-react';
import type { Product, StrapiEntity } from '@/types';

type Props = {
  product: StrapiEntity<Product>;
};

export function ProductCard({ product }: Props) {
  const { title, slug, price, compareAtPrice, shortDescription, images, category, isFeatured } = product;

  const image = images?.[0];
  const imageUrl = image?.formats?.medium?.url ?? image?.url ?? null;
  const imageAlt = image?.alternativeText ?? title;
  const hasDiscount = compareAtPrice != null && compareAtPrice > price;
  const discountPct = hasDiscount
    ? Math.round((1 - price / compareAtPrice) * 100)
    : null;

  return (
    <Link href={`/products/${slug}`} className="group block">
      {/* Image */}
      <div className="relative overflow-hidden bg-[oklch(0.96_0.01_60)] aspect-[3/4]">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-heading text-[oklch(0.45_0.08_310/0.25)] text-lg tracking-widest uppercase">
              Veloura
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isFeatured && (
            <span className="bg-[oklch(0.35_0.12_310)] text-[oklch(0.96_0.01_60)] text-[10px] tracking-[0.15em] uppercase px-2.5 py-1 font-sans">
              Featured
            </span>
          )}
          {discountPct && (
            <span className="bg-[oklch(0.55_0.18_25)] text-white text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 font-sans">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Overlay — slides up on hover, navigates via the parent Link */}
        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <div className="flex items-center justify-center gap-2 w-full bg-[oklch(0.18_0.04_280/0.85)] backdrop-blur-sm text-[oklch(0.97_0.01_60)] font-sans text-[0.7rem] tracking-[0.15em] uppercase py-3 pointer-events-none">
            <ShoppingBag className="h-3.5 w-3.5" />
            Select size
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="pt-4 space-y-1">
        {category && (
          <p className="text-[10px] tracking-[0.2em] uppercase text-[oklch(0.45_0.08_310/0.6)] font-sans">
            {category.name}
          </p>
        )}

        <h3 className="font-heading text-[oklch(0.18_0.04_280)] text-lg leading-snug group-hover:text-[oklch(0.35_0.12_310)] transition-colors duration-200">
          {title}
        </h3>

        {shortDescription && (
          <p className="text-[oklch(0.45_0.04_280/0.7)] text-xs font-sans leading-relaxed line-clamp-2">
            {shortDescription}
          </p>
        )}

        <div className="flex items-baseline gap-2 pt-1">
          <span className="font-heading text-[oklch(0.18_0.04_280)] text-lg">
            ${price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="text-[oklch(0.55_0.04_280/0.5)] text-sm line-through font-sans">
              ${compareAtPrice!.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
