import { getProductReviews } from '@/lib/api/review.api';
import { ReviewsList } from './ReviewsList';
import { ReviewForm } from './ReviewForm';

type Props = {
  slug: string;
  productDocumentId: string;
  isLoggedIn: boolean;
};

export async function ReviewsSection({ slug, productDocumentId, isLoggedIn }: Props) {
  const reviews = await getProductReviews(slug);
  return (
    <div className="mt-16 pt-12 border-t border-[oklch(0.35_0.08_310/0.12)]">
      <h2 className="font-heading text-[oklch(0.18_0.04_280)] text-3xl mb-10">
        Customer Reviews
      </h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        <ReviewsList reviews={reviews} />
        <ReviewForm
          productDocumentId={productDocumentId}
          productSlug={slug}
          isLoggedIn={isLoggedIn}
        />
      </div>
    </div>
  );
}
