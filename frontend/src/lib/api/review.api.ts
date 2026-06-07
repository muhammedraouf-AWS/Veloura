import { normalizeStrapiMany, strapiClient } from '@/lib/api';
import type { Review, StrapiListResponse } from '@/types';

export async function getProductReviews(productSlug: string) {
  const response = await strapiClient.get<StrapiListResponse<Review>>({
    path: '/reviews',
    tags: [`product-reviews-${productSlug}`],
    revalidate: 60,
    params: {
      'filters[product][slug][$eq]': productSlug,
      'filters[isApproved][$eq]': 'true',
      'sort': 'createdAt:desc',
      'pagination[pageSize]': '20',
    },
  });

  return normalizeStrapiMany(response);
}
