import { DEFAULT_PAGE_SIZE } from '@/lib/constants';
import { normalizeStrapiMany, normalizeStrapiOne, strapiClient } from '@/lib/api';
import type { Product, StrapiListResponse, StrapiResponse } from '@/types';

const PRODUCT_LIST_PARAMS = {
  'populate[images][fields][0]': 'url',
  'populate[images][fields][1]': 'alternativeText',
  'populate[images][fields][2]': 'formats',
  'populate[category][fields][0]': 'name',
  'populate[category][fields][1]': 'slug',
  'filters[isActive][$eq]': 'true',
  'sort': 'createdAt:desc',
};

export async function getProducts(page = 1): Promise<{
  products: ReturnType<typeof normalizeStrapiMany<Product>>;
  pagination: StrapiListResponse<Product>['meta']['pagination'];
}> {
  const response = await strapiClient.get<StrapiListResponse<Product>>({
    path: '/products',
    tags: ['products'],
    revalidate: 60,
    params: {
      ...PRODUCT_LIST_PARAMS,
      'pagination[page]': page,
      'pagination[pageSize]': DEFAULT_PAGE_SIZE,
    },
  });

  return {
    products: normalizeStrapiMany(response),
    pagination: response.meta.pagination,
  };
}

export async function getFeaturedProducts(): Promise<ReturnType<typeof normalizeStrapiMany<Product>>> {
  const response = await strapiClient.get<StrapiListResponse<Product>>({
    path: '/products',
    tags: ['products', 'featured-products'],
    revalidate: 60,
    params: {
      ...PRODUCT_LIST_PARAMS,
      'filters[isFeatured][$eq]': 'true',
      'pagination[pageSize]': '8',
    },
  });

  return normalizeStrapiMany(response);
}

export async function getProductsByCategory(
  categorySlug: string,
  page = 1
): Promise<{
  products: ReturnType<typeof normalizeStrapiMany<Product>>;
  pagination: StrapiListResponse<Product>['meta']['pagination'];
}> {
  const response = await strapiClient.get<StrapiListResponse<Product>>({
    path: '/products',
    tags: ['products', `category-products-${categorySlug}`],
    revalidate: 60,
    params: {
      ...PRODUCT_LIST_PARAMS,
      'filters[category][slug][$eq]': categorySlug,
      'pagination[page]': page,
      'pagination[pageSize]': DEFAULT_PAGE_SIZE,
    },
  });

  return {
    products: normalizeStrapiMany(response),
    pagination: response.meta.pagination,
  };
}

export async function searchProducts(
  query: string,
  page = 1
): Promise<{
  products: ReturnType<typeof normalizeStrapiMany<Product>>;
  pagination: StrapiListResponse<Product>['meta']['pagination'];
}> {
  if (!query.trim()) {
    return {
      products: [],
      pagination: { page: 1, pageSize: DEFAULT_PAGE_SIZE, pageCount: 0, total: 0 },
    };
  }

  const response = await strapiClient.get<StrapiListResponse<Product>>({
    path: '/products',
    revalidate: 0,
    params: {
      ...PRODUCT_LIST_PARAMS,
      'filters[title][$containsi]': query,
      'pagination[page]': page,
      'pagination[pageSize]': DEFAULT_PAGE_SIZE,
    },
  });

  return {
    products: normalizeStrapiMany(response),
    pagination: response.meta.pagination,
  };
}

export async function getProductBySlug(slug: string): Promise<ReturnType<typeof normalizeStrapiOne<Product>> | null> {
  const response = await strapiClient.get<StrapiListResponse<Product>>({
    path: '/products',
    tags: [`product-${slug}`],
    revalidate: 60,
    params: {
      'filters[slug][$eq]': slug,
      'populate[images][fields][0]': 'url',
      'populate[images][fields][1]': 'alternativeText',
      'populate[images][fields][2]': 'formats',
      'populate[category][fields][0]': 'name',
      'populate[category][fields][1]': 'slug',
      'populate[variants][fields][0]': 'name',
      'populate[variants][fields][1]': 'price',
      'populate[variants][fields][2]': 'inventory',
      'populate[variants][fields][3]': 'options',
      'populate[variants][fields][4]': 'sku',
    },
  });

  const products = normalizeStrapiMany(response);
  return products[0] ?? null;
}
