import { normalizeStrapiMany, normalizeStrapiOne, strapiClient } from '@/lib/api';
import type { Category, StrapiListResponse } from '@/types';

const CATEGORY_IMAGE_PARAMS = {
  'populate[image][fields][0]': 'url',
  'populate[image][fields][1]': 'alternativeText',
  'populate[image][fields][2]': 'formats',
};

export async function getCategories() {
  const response = await strapiClient.get<StrapiListResponse<Category>>({
    path: '/categories',
    tags: ['categories'],
    revalidate: 300,
    params: {
      ...CATEGORY_IMAGE_PARAMS,
      'filters[parent][$null]': 'true',
      'sort': 'name:asc',
      'pagination[pageSize]': '50',
    },
  });

  return normalizeStrapiMany(response);
}

export async function getCategoryBySlug(slug: string) {
  const response = await strapiClient.get<StrapiListResponse<Category>>({
    path: '/categories',
    tags: [`category-${slug}`],
    revalidate: 300,
    params: {
      ...CATEGORY_IMAGE_PARAMS,
      'filters[slug][$eq]': slug,
      'populate[children][fields][0]': 'name',
      'populate[children][fields][1]': 'slug',
    },
  });

  const categories = normalizeStrapiMany(response);
  return categories[0] ?? null;
}
