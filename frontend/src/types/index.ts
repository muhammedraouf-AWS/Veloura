// ─── Server Action result ────────────────────────────────────────────────────

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

// ─── Strapi v5 response shapes ───────────────────────────────────────────────
// Strapi v5 no longer wraps fields inside `attributes` — fields sit directly
// on the object alongside `id` and `documentId`.

export type StrapiEntity<T> = T & {
  id: number;
  documentId: string;
};

export type StrapiResponse<T> = {
  data: StrapiEntity<T>;
  meta?: Record<string, unknown>;
};

export type StrapiListResponse<T> = {
  data: StrapiEntity<T>[];
  meta: {
    pagination: Pagination;
  };
};

// ─── Pagination ───────────────────────────────────────────────────────────────

export type Pagination = {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
};

// ─── Auth ─────────────────────────────────────────────────────────────────────

export type AuthUser = {
  id: number;
  documentId: string;
  username: string;
  email: string;
  confirmed: boolean;
  blocked: boolean;
};

export type AuthResponse = {
  jwt: string;
  user: AuthUser;
};

// ─── Cart ─────────────────────────────────────────────────────────────────────

export type CartItem = {
  productId: number;
  documentId: string;
  variantId?: number;
  variantDocumentId?: string;
  title: string;
  slug: string;
  image: string;
  price: number;
  quantity: number;
  variant?: string;
};

// ─── Address ──────────────────────────────────────────────────────────────────

export type Address = {
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};
