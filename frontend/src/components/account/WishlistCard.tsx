'use client';

import { useState, useTransition } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'sonner';
import { toggleWishlistAction } from '@/lib/actions/user.actions';
import type { Product, StrapiEntity } from '@/types';

type Props = {
  product: StrapiEntity<Product>;
};

export function WishlistCard({ product }: Props) {
  const { title, slug, price, compareAtPrice, shortDescription, images, category } = product;
  const [removed, setRemoved] = useState(false);
  const [pending, startTransition] = useTransition();

  const image = images?.[0];
  const imageUrl = image?.formats?.medium?.url ?? image?.url ?? null;
  const hasDiscount = compareAtPrice != null && compareAtPrice > price;
  const discountPct = hasDiscount
    ? Math.round((1 - price / compareAtPrice) * 100)
    : null;

  function handleRemove() {
    setRemoved(true);
    startTransition(async () => {
      const result = await toggleWishlistAction(product.id, false);
      if (!result.success) {
        setRemoved(false);
        toast.error(result.error);
      } else {
        toast.success('Removed from wishlist');
      }
    });
  }

  if (removed) return null;

  return (
    <div className={`group relative transition-opacity duration-300 ${pending ? 'opacity-50' : 'opacity-100'}`}>
      {/* Remove button */}
      <button
        onClick={handleRemove}
        disabled={pending}
        aria-label="Remove from wishlist"
        className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center bg-[oklch(0.97_0.01_60/0.9)] backdrop-blur-sm border border-[oklch(0.35_0.04_280/0.15)] text-[oklch(0.35_0.12_310)] hover:bg-white hover:border-[oklch(0.35_0.12_310/0.4)] transition-all duration-150 text-base disabled:opacity-40"
      >
        ♥
      </button>

      <Link href={`/products/${slug}`} className="block">
        {/* Image */}
        <div className="relative overflow-hidden bg-[oklch(0.96_0.01_60)] aspect-[3/4]">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={image?.alternativeText ?? title}
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

          {discountPct && (
            <div className="absolute top-3 left-3">
              <span className="bg-[oklch(0.55_0.18_25)] text-white text-[10px] tracking-[0.1em] uppercase px-2.5 py-1 font-sans">
                -{discountPct}%
              </span>
            </div>
          )}
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
    </div>
  );
}
