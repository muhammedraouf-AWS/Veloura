import Link from 'next/link';
import { Heart } from 'lucide-react';
import { getAuthToken } from '@/lib/utils/auth';
import { getUserWithWishlist } from '@/lib/api/user.api';
import { WishlistCard } from '@/components/account/WishlistCard';

export const metadata = {
  title: 'Wishlist | Veloura',
};

export default async function WishlistPage() {
  const token = await getAuthToken();
  const user = token ? await getUserWithWishlist(token) : null;
  const wishlist = user?.wishlist ?? [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-heading text-[oklch(0.18_0.04_280)] text-3xl mb-1">
          Wishlist
        </h1>
        <p className="text-sm font-sans text-[oklch(0.45_0.04_280/0.6)]">
          {wishlist.length === 0
            ? 'No saved items yet.'
            : `${wishlist.length} saved ${wishlist.length === 1 ? 'item' : 'items'}`}
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Heart
            className="h-12 w-12 text-[oklch(0.35_0.12_310/0.25)] mb-5"
            strokeWidth={1}
          />
          <h2 className="font-heading text-[oklch(0.18_0.04_280)] text-2xl mb-2">
            Nothing saved yet
          </h2>
          <p className="text-sm font-sans text-[oklch(0.45_0.04_280/0.6)] mb-8 max-w-xs leading-relaxed">
            Tap the heart on any fragrance to save it here for later.
          </p>
          <Link
            href="/products"
            className="inline-block px-8 py-3 bg-[oklch(0.35_0.12_310)] text-[oklch(0.97_0.01_60)] font-sans text-sm tracking-[0.15em] uppercase hover:bg-[oklch(0.28_0.10_310)] transition-colors"
          >
            Browse Fragrances
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <WishlistCard key={product.documentId} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
