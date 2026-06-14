import { STRAPI_URL } from "@/lib/constants";
import type { AuthUser, Product, StrapiEntity } from "@/types";

export async function getCurrentUser(jwt: string): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json() as Promise<AuthUser>;
  } catch {
    return null;
  }
}

export async function getUserWishlistIds(
  jwt: string
): Promise<{ id: number; wishlist: { id: number }[] } | null> {
  try {
    // users/me ignores ?populate — get user id first, then filter products by wishlistedBy
    const meRes = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: "no-store",
    });
    if (!meRes.ok) return null;
    const user = await meRes.json();

    const apiToken = process.env.STRAPI_API_TOKEN;
    const productsRes = await fetch(
      `${STRAPI_URL}/api/products` +
        `?filters[wishlistedBy][id][$eq]=${user.id}` +
        `&fields[0]=id`,
      {
        headers: apiToken ? { Authorization: `Bearer ${apiToken}` } : {},
        cache: "no-store",
      }
    );
    if (!productsRes.ok) return { id: user.id, wishlist: [] };
    const json = await productsRes.json();

    return {
      id: user.id,
      wishlist: (json.data ?? []).map((p: { id: number }) => ({ id: p.id })),
    };
  } catch {
    return null;
  }
}

export async function getUserWithWishlist(
  jwt: string
): Promise<(AuthUser & { wishlist: StrapiEntity<Product>[] }) | null> {
  try {
    // users/me ignores ?populate — fetch user identity separately
    const meRes = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: "no-store",
    });
    if (!meRes.ok) return null;
    const user = await meRes.json();

    // Filter products whose wishlistedBy (inverse relation) includes this user.
    // Products API supports deep populate and relation filters correctly.
    const apiToken = process.env.STRAPI_API_TOKEN;
    const url =
      `${STRAPI_URL}/api/products` +
      `?filters[wishlistedBy][id][$eq]=${user.id}` +
      `&populate[images][fields][0]=url` +
      `&populate[images][fields][1]=alternativeText` +
      `&populate[images][fields][2]=formats` +
      `&populate[category][fields][0]=name` +
      `&populate[category][fields][1]=slug`;
    const productsRes = await fetch(url, {
      headers: apiToken ? { Authorization: `Bearer ${apiToken}` } : {},
      cache: "no-store",
    });
    if (!productsRes.ok) return { ...user, wishlist: [] };
    const productsJson = await productsRes.json();

    return { ...user, wishlist: productsJson.data ?? [] };
  } catch {
    return null;
  }
}
