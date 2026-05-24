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
  createdAt?: string;
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

// ─── Strapi Media ─────────────────────────────────────────────────────────────

export type StrapiMediaFormat = {
  url: string;
  width: number;
  height: number;
  size: number;
  mime: string;
};

export type StrapiMedia = {
  id: number;
  documentId: string;
  name: string;
  url: string;
  alternativeText?: string | null;
  width?: number;
  height?: number;
  formats?: {
    thumbnail?: StrapiMediaFormat;
    small?: StrapiMediaFormat;
    medium?: StrapiMediaFormat;
    large?: StrapiMediaFormat;
  };
};

// ─── Domain enums ─────────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'refunded';

export type CouponType = 'percentage' | 'fixed';

// ─── Category ─────────────────────────────────────────────────────────────────

export type Category = {
  name: string;
  slug: string;
  description?: string | null;
  image?: StrapiMedia | null;
  parent?: StrapiEntity<Category> | null;
  children?: StrapiEntity<Category>[];
  products?: StrapiEntity<Product>[];
  publishedAt?: string | null;
};

// ─── Product ──────────────────────────────────────────────────────────────────

export type Product = {
  title: string;
  slug: string;
  description?: string | null;
  shortDescription?: string | null;
  price: number;
  compareAtPrice?: number | null;
  sku?: string | null;
  inventory: number;
  isFeatured: boolean;
  isActive: boolean;
  images?: StrapiMedia[];
  tags?: string[] | null;
  category?: StrapiEntity<Category> | null;
  variants?: StrapiEntity<ProductVariant>[];
  reviews?: StrapiEntity<Review>[];
  publishedAt?: string | null;
};

// ─── ProductVariant ───────────────────────────────────────────────────────────

export type VariantOptions = {
  size?: string;
  concentration?: string;
  [key: string]: string | undefined;
};

export type ProductVariant = {
  name: string;
  sku?: string | null;
  price: number;
  inventory: number;
  options?: VariantOptions | null;
  product?: StrapiEntity<Product> | null;
};

// ─── Review ───────────────────────────────────────────────────────────────────

export type Review = {
  rating: number;
  title?: string | null;
  body: string;
  isVerified: boolean;
  isApproved: boolean;
  product?: StrapiEntity<Product> | null;
  user?: StrapiEntity<AuthUser> | null;
};

// ─── Coupon ───────────────────────────────────────────────────────────────────

export type Coupon = {
  code: string;
  type: CouponType;
  value: number;
  minOrderAmount?: number | null;
  maxUses?: number | null;
  usedCount: number;
  expiresAt?: string | null;
  isActive: boolean;
};

// ─── Order ────────────────────────────────────────────────────────────────────

export type ProductSnapshot = {
  title: string;
  slug: string;
  price: number;
  image?: string | null;
  variant?: string | null;
};

export type OrderItem = {
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productSnapshot: ProductSnapshot;
  order?: StrapiEntity<Order> | null;
  product?: StrapiEntity<Product> | null;
  variant?: StrapiEntity<ProductVariant> | null;
};

export type Order = {
  orderNumber: string;
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: Address;
  billingAddress: Address;
  paymentMethod?: string | null;
  paymentStatus: PaymentStatus;
  notes?: string | null;
  user?: StrapiEntity<AuthUser> | null;
  items?: StrapiEntity<OrderItem>[];
  coupon?: StrapiEntity<Coupon> | null;
};
