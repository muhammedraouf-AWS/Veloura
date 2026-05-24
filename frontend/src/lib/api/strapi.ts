import { STRAPI_URL } from '@/lib/constants';
import type { StrapiEntity, StrapiListResponse, StrapiResponse } from '@/types';

// ─── Types ────────────────────────────────────────────────────────────────────

type GetOptions = {
  path: string;
  /** Pass a user JWT to make an authenticated request. Omit to use the server API token. */
  jwt?: string;
  /** Next.js cache tags for on-demand revalidation via revalidateTag(). */
  tags?: string[];
  /** Seconds to revalidate. Pass `false` to opt into static caching with no expiry. */
  revalidate?: number | false;
  /** Strapi query params — supports bracket notation e.g. "filters[slug][$eq]" */
  params?: Record<string, string | number | boolean>;
};

type MutateOptions = {
  path: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Sent as `{ data: body }` — matching Strapi's expected request shape. */
  body?: unknown;
  /** User JWT for authenticated mutations. */
  jwt: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildHeaders(jwt?: string): Record<string, string> {
  const token = jwt ?? process.env.STRAPI_API_TOKEN;
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function buildUrl(path: string, params?: GetOptions['params']): string {
  const url = new URL(`${STRAPI_URL}/api${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

async function handleResponse<T>(res: Response, path: string): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    const message = body?.error?.message ?? `${res.status} ${res.statusText}`;
    throw new Error(`Strapi [${path}]: ${message}`);
  }
  return res.json() as Promise<T>;
}

// ─── strapiClient ─────────────────────────────────────────────────────────────

export const strapiClient = {
  /**
   * Server-side GET. Cached by Next.js — pass `tags` for on-demand revalidation
   * or `revalidate` for time-based revalidation. Unauthenticated calls
   * automatically use STRAPI_API_TOKEN.
   */
  async get<T>(options: GetOptions): Promise<T> {
    const { path, jwt, tags, revalidate, params } = options;

    const nextCache: RequestInit['next'] = {};
    if (tags) nextCache.tags = tags;
    if (revalidate !== undefined) nextCache.revalidate = revalidate;

    const res = await fetch(buildUrl(path, params), {
      method: 'GET',
      headers: buildHeaders(jwt),
      next: Object.keys(nextCache).length > 0 ? nextCache : undefined,
    });

    return handleResponse<T>(res, path);
  },

  /**
   * Authenticated mutation. Always bypasses the cache.
   * Wraps `body` in `{ data: body }` to match Strapi's expected format.
   */
  async mutate<T>(options: MutateOptions): Promise<T> {
    const { path, method, body, jwt } = options;

    const res = await fetch(`${STRAPI_URL}/api${path}`, {
      method,
      headers: buildHeaders(jwt),
      body: body !== undefined ? JSON.stringify({ data: body }) : undefined,
      cache: 'no-store',
    });

    return handleResponse<T>(res, path);
  },
};

// ─── normalizeStrapi ──────────────────────────────────────────────────────────
// Strapi v5 no longer wraps fields in `attributes` — fields sit directly on the
// entity alongside `id` and `documentId`. These helpers simply unwrap `data`
// and give the result a proper type.

export function normalizeStrapiOne<T>(
  response: StrapiResponse<T>
): StrapiEntity<T> {
  return response.data;
}

export function normalizeStrapiMany<T>(
  response: StrapiListResponse<T>
): StrapiEntity<T>[] {
  return response.data;
}
