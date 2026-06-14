'use client';

import { useState, useTransition } from 'react';
import { toast } from 'sonner';
import { useCartStore } from '@/lib/store/cart';
import { toggleWishlistAction } from '@/lib/actions/user.actions';
import type { ProductVariant, StrapiEntity } from '@/types';

type Props = {
  productId: number;
  documentId: string;
  slug: string;
  title: string;
  image: string;
  basePrice: number;
  compareAtPrice?: number | null;
  baseInventory: number;
  variants: StrapiEntity<ProductVariant>[];
  isLoggedIn: boolean;
  isInWishlist: boolean;
};

export function ProductActions({
  productId,
  documentId,
  slug,
  title,
  image,
  basePrice,
  compareAtPrice,
  baseInventory,
  variants,
  isLoggedIn,
  isInWishlist: initialInWishlist,
}: Props) {
  const hasVariants = variants.length > 0;
  const [selected, setSelected] = useState<StrapiEntity<ProductVariant> | null>(
    hasVariants ? (variants[0] ?? null) : null
  );
  const [inWishlist, setInWishlist] = useState(initialInWishlist);
  const [wishlistPending, startWishlistTransition] = useTransition();

  const addItem = useCartStore((s) => s.addItem);

  const price = selected?.price ?? basePrice;
  const inventory = selected?.inventory ?? baseInventory;
  const inStock = inventory > 0;
  const hasDiscount = compareAtPrice != null && compareAtPrice > price;
  const discountPct = hasDiscount
    ? Math.round((1 - price / compareAtPrice) * 100)
    : null;

  function handleAddToCart() {
    addItem({
      productId,
      documentId,
      variantId: selected?.id,
      variantDocumentId: selected?.documentId,
      title,
      slug,
      image,
      price,
      quantity: 1,
      variant: selected?.name,
    });
    toast.success('Added to cart', {
      description: selected ? `${title} — ${selected.name}` : title,
    });
  }

  function handleWishlistToggle() {
    if (!isLoggedIn) {
      toast.error('Sign in to save to your wishlist');
      return;
    }
    const next = !inWishlist;
    setInWishlist(next);
    startWishlistTransition(async () => {
      const result = await toggleWishlistAction(productId, next);
      if (!result.success) {
        setInWishlist(!next);
        toast.error(result.error);
      } else {
        toast.success(next ? 'Added to wishlist' : 'Removed from wishlist');
      }
    });
  }

  return (
    <div>
      {/* Price */}
      <div className="flex items-baseline gap-3 mb-2">
        <span className="font-heading text-[oklch(0.18_0.04_280)] text-3xl">
          ${price.toFixed(2)}
        </span>
        {hasDiscount && (
          <>
            <span className="text-[oklch(0.55_0.04_280/0.5)] text-lg line-through font-sans">
              ${compareAtPrice!.toFixed(2)}
            </span>
            <span className="text-[oklch(0.55_0.18_25)] text-sm font-sans tracking-wide">
              Save {discountPct}%
            </span>
          </>
        )}
      </div>

      {/* Stock indicator */}
      <p
        className={`text-xs font-sans tracking-widest uppercase mb-6 ${
          inStock ? 'text-[oklch(0.45_0.15_145)]' : 'text-[oklch(0.55_0.18_25)]'
        }`}
      >
        {inStock ? `In stock — ${inventory} available` : 'Out of stock'}
      </p>

      {/* Variant selector */}
      {hasVariants && (
        <div className="mb-8">
          <p className="text-[10px] tracking-[0.15em] uppercase font-sans text-[oklch(0.45_0.04_280/0.6)] mb-3">
            Size
          </p>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => {
              const isSelected = selected?.documentId === v.documentId;
              const soldOut = v.inventory === 0;

              return (
                <button
                  key={v.documentId}
                  onClick={() => !soldOut && setSelected(v)}
                  disabled={soldOut}
                  aria-pressed={isSelected}
                  className={`px-4 py-2 text-sm font-sans tracking-wide border transition-all duration-150 ${
                    isSelected
                      ? 'bg-[oklch(0.35_0.12_310)] text-[oklch(0.97_0.01_60)] border-[oklch(0.35_0.12_310)]'
                      : soldOut
                      ? 'border-[oklch(0.35_0.04_280/0.15)] text-[oklch(0.45_0.04_280/0.3)] line-through cursor-not-allowed'
                      : 'border-[oklch(0.35_0.04_280/0.3)] text-[oklch(0.35_0.08_310)] hover:border-[oklch(0.35_0.12_310)]'
                  }`}
                >
                  {v.name}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Add to cart + Wishlist */}
      <div className="flex gap-3">
        <button
          onClick={handleAddToCart}
          disabled={!inStock}
          className="flex-1 py-4 bg-[oklch(0.35_0.12_310)] text-[oklch(0.97_0.01_60)] font-sans text-sm tracking-[0.15em] uppercase hover:bg-[oklch(0.28_0.10_310)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
        <button
          onClick={handleWishlistToggle}
          disabled={wishlistPending}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
          className={`px-4 py-4 border transition-all duration-200 text-lg disabled:opacity-40 ${
            inWishlist
              ? 'border-[oklch(0.35_0.12_310)] bg-[oklch(0.35_0.12_310/0.08)] text-[oklch(0.35_0.12_310)]'
              : 'border-[oklch(0.35_0.12_310/0.3)] text-[oklch(0.35_0.12_310)] hover:border-[oklch(0.35_0.12_310)]'
          }`}
        >
          {inWishlist ? '♥' : '♡'}
        </button>
      </div>
    </div>
  );
}
