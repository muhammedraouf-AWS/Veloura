import { normalizeStrapiMany, strapiClient } from '@/lib/api';
import type { Order, StrapiListResponse } from '@/types';

export async function getUserOrders(jwt: string) {
  const response = await strapiClient.get<StrapiListResponse<Order>>({
    path: '/orders',
    jwt,
    revalidate: 0,
    params: {
      'populate[items][fields][0]': 'quantity',
    },
  });

  return normalizeStrapiMany(response);
}

export async function getOrderByNumber(jwt: string, orderNumber: string) {
  const response = await strapiClient.get<StrapiListResponse<Order>>({
    path: '/orders',
    jwt,
    revalidate: 0,
    params: {
      'filters[orderNumber][$eq]': orderNumber,
      'populate[items][fields][0]': 'quantity',
      'populate[items][fields][1]': 'unitPrice',
      'populate[items][fields][2]': 'totalPrice',
      'populate[items][fields][3]': 'productSnapshot',
    },
  });

  const orders = normalizeStrapiMany(response);
  return orders[0] ?? null;
}
