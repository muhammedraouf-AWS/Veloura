import type { MetadataRoute } from "next";
import { strapiClient } from "@/lib/api";
import { normalizeStrapiMany } from "@/lib/api";
import type { StrapiListResponse } from "@/types";

const base = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

type SlugEntry = { slug: string; updatedAt?: string };

async function fetchAllProductSlugs(): Promise<SlugEntry[]> {
  try {
    const res = await strapiClient.get<StrapiListResponse<SlugEntry>>({
      path: "/products",
      revalidate: 3600,
      params: {
        "fields[0]": "slug",
        "fields[1]": "updatedAt",
        "filters[isActive][$eq]": "true",
        "pagination[pageSize]": "1000",
        "pagination[page]": "1",
      },
    });
    return normalizeStrapiMany(res);
  } catch {
    return [];
  }
}

async function fetchAllCategorySlugs(): Promise<SlugEntry[]> {
  try {
    const res = await strapiClient.get<StrapiListResponse<SlugEntry>>({
      path: "/categories",
      revalidate: 3600,
      params: {
        "fields[0]": "slug",
        "fields[1]": "updatedAt",
        "pagination[pageSize]": "200",
        "pagination[page]": "1",
      },
    });
    return normalizeStrapiMany(res);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([
    fetchAllProductSlugs(),
    fetchAllCategorySlugs(),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${base}/products`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/categories`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
  ];

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${base}/products/${p.slug}`,
    lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${base}/categories/${c.slug}`,
    lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [...staticRoutes, ...productRoutes, ...categoryRoutes];
}
