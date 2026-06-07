import type { Review, StrapiEntity } from "@/types";

type Props = {
  reviews: StrapiEntity<Review>[];
};

export function ReviewsList({ reviews }: Props) {
  if (reviews.length === 0) {
    return (
      <p className="text-sm font-sans text-[oklch(0.45_0.04_280/0.5)]">
        No reviews yet. Be the first to share your experience.
      </p>
    );
  }

  const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

  return (
    <div className="space-y-8">
      {/* Summary */}
      <div className="flex items-center gap-4">
        <span className="font-heading text-[oklch(0.18_0.04_280)] text-4xl">
          {avg.toFixed(1)}
        </span>
        <div>
          <Stars rating={avg} />
          <p className="text-xs font-sans text-[oklch(0.45_0.04_280/0.55)] mt-1">
            {reviews.length} {reviews.length === 1 ? "review" : "reviews"}
          </p>
        </div>
      </div>

      {/* Review cards */}
      <ul className="divide-y divide-[oklch(0.18_0.04_280/0.07)]">
        {reviews.map((review) => {
          const date = review.createdAt
            ? new Date(review.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : null;

          return (
            <li key={review.id} className="py-6 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <Stars rating={review.rating} />
                {date && (
                  <span className="text-[0.65rem] font-sans text-[oklch(0.45_0.04_280/0.45)]">
                    {date}
                  </span>
                )}
              </div>
              {review.title && (
                <p className="font-heading text-[oklch(0.18_0.04_280)] text-base">
                  {review.title}
                </p>
              )}
              <p className="text-sm font-sans text-[oklch(0.35_0.04_280/0.8)] leading-relaxed">
                {review.body}
              </p>
              {review.isVerified && (
                <p className="text-[0.62rem] tracking-[0.1em] uppercase font-sans text-[oklch(0.45_0.15_155)]">
                  ✓ Verified purchase
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-label={`${rating.toFixed(1)} out of 5 stars`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i < Math.round(rating);
        return (
          <span
            key={i}
            className={`text-base leading-none ${
              filled ? "text-[oklch(0.65_0.15_70)]" : "text-[oklch(0.80_0.02_280)]"
            }`}
          >
            ★
          </span>
        );
      })}
    </div>
  );
}
