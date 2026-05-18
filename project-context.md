# Veloura — Project Context

> **This is the single source of truth for the entire project.** Update it after every step.
> Last updated: Phase 0 · Step 0.2 — Next.js frontend initialized.

---

## 0. Collaboration Rules

- **One step at a time** — complete one step, stop, explain what was built and how to test it, then wait for confirmation before moving to the next step.
- **Test before commit** — after completing any step, stop and wait for the user to test. Only commit when the user explicitly says to.
- **Update this file** after every completed step — mark the roadmap row, add a Completed Tasks entry, log any decisions made.

---

## 1. Project Overview

**Veloura** is a production-grade perfume ecommerce platform. Customers browse, search, and purchase fragrances; manage a cart, checkout, view orders, and maintain a wishlist. Content is managed through a headless Strapi CMS.

**Personas**

- **Guest** — browses catalog, views product details, searches, sees categories.
- **Customer** — registers/logs in, adds to cart, checks out, views orders, manages wishlist and profile.
- **Admin** — manages products, categories, orders, coupons, and users through the Strapi admin panel.

**Non-goals (v1)** — live chat, mobile app, multi-currency, real-time inventory sync.

---

## 2. Tech Stack

| Layer            | Choice                                          |
| ---------------- | ----------------------------------------------- |
| Framework        | Next.js (latest, App Router)                    |
| Language         | TypeScript (strict)                             |
| Styling          | Tailwind CSS                                    |
| Component system | Shadcn UI                                       |
| Client state     | Zustand (cart + UI state)                       |
| Data fetching    | React Server Components + `fetch`               |
| Client fetching  | TanStack Query (only if RSC is insufficient)    |
| Forms/mutations  | Server Actions + React Hook Form + Zod          |
| Validation       | Zod (shared: client forms + server actions)     |
| CMS / API        | Strapi v5 (REST)                                |
| Database         | PostgreSQL — Neon (prod), local (dev)           |
| Media            | Cloudinary (via Strapi upload provider)         |
| Auth             | Strapi built-in JWT + httpOnly cookie           |
| Deployment       | Vercel (frontend) · Render (Strapi) · Neon (DB) |

---

## 3. Architecture Decisions

### 3.1 Why Strapi as the backend

Strapi provides a visual admin panel, built-in REST API, role-based permissions, and a Cloudinary upload provider out of the box — avoiding the need to hand-roll a CMS. The frontend treats Strapi as an API service only; no Strapi pages are exposed publicly.

### 3.2 RSC-first, client components as the exception

Server Components reduce the JS bundle, allow direct server-side data fetching without useEffect, and improve Core Web Vitals. Client Components are only used when browser interactivity is required (cart drawer, forms with live feedback, Zustand consumers).

### 3.3 Server Actions for all mutations

Mutations called from within the Next.js app use Server Actions — collocated, CSRF-protected, and progressively enhanced on forms. REST API routes (`/app/api/*`) are reserved for webhooks and any future non-Next.js clients.

### 3.4 Custom JWT auth (no NextAuth)

Strapi issues a JWT on login/register. The JWT is stored in an **httpOnly cookie** (`veloura_token`) set via a Server Action — never in localStorage. `middleware.ts` reads the cookie to protect `/account/*` and `/checkout` routes. Server-side Strapi calls forward the cookie token as `Authorization: Bearer`.

### 3.5 Zustand for cart and UI state

Cart state must survive page navigation and be available before auth. Zustand with a localStorage persistence plugin handles guest carts cleanly. Redux would be overkill for this scope.

### 3.6 Strapi REST over GraphQL

REST is simpler to cache with Next.js `fetch` tags and `revalidate`. GraphQL would only be added if query complexity demands it.

### 3.7 Neon PostgreSQL

Serverless-compatible, free tier for dev, branch-per-environment (main/dev), and compatible with Strapi's Postgres provider.

---

## 4. Folder Structure

```
veloura/
├── frontend/                          ← Next.js app
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/                ← /login, /register, /forgot-password
│   │   │   ├── (shop)/                ← /products, /categories, /search
│   │   │   ├── (account)/             ← /account/profile, /orders, /wishlist
│   │   │   ├── checkout/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── error.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── ui/                    ← Shadcn auto-generated primitives
│   │   │   ├── layout/                ← Header, Footer, Nav
│   │   │   ├── product/               ← ProductCard, ProductGrid, ProductDetail
│   │   │   ├── cart/                  ← CartDrawer, CartItem, CartSummary
│   │   │   ├── auth/                  ← LoginForm, RegisterForm
│   │   │   ├── checkout/              ← CheckoutForm, OrderSummary
│   │   │   └── shared/                ← Badge, Rating, Price, EmptyState
│   │   ├── lib/
│   │   │   ├── api/                   ← strapiClient + normalizeStrapi
│   │   │   ├── actions/               ← all Server Actions (one file per domain)
│   │   │   ├── store/                 ← Zustand stores
│   │   │   ├── hooks/                 ← custom React hooks
│   │   │   ├── utils/                 ← pure utility functions
│   │   │   ├── validations/           ← Zod schemas
│   │   │   └── constants/             ← app-wide constants
│   │   ├── types/                     ← global TypeScript types
│   │   └── config/                    ← site metadata, nav links
│   ├── public/
│   ├── .env.local
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                           ← Strapi app
│   ├── src/
│   │   ├── api/                       ← content types (product, category, order, …)
│   │   ├── extensions/                ← User model extension (wishlist, phone, avatar)
│   │   └── middlewares/
│   ├── config/
│   ├── .env
│   └── package.json
│
├── project-context.md
└── skills-lock.json
```

### Feature folder convention (used inside `lib/actions/` and `lib/api/`)

One file per domain: `auth.actions.ts`, `cart.actions.ts`, `order.actions.ts`, `product.api.ts`, `category.api.ts`, etc.

---

## 5. Database / Content Type Structure

### Enums (Strapi)

| Enum              | Values                                                          |
| ----------------- | --------------------------------------------------------------- |
| `OrderStatus`     | `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`, `refunded` |
| `PaymentStatus`   | `unpaid`, `paid`, `failed`, `refunded`                          |
| `CouponType`      | `percentage`, `fixed`                                           |

### Content Types

| Model              | Key Fields                                                                                              |
| ------------------ | ------------------------------------------------------------------------------------------------------- |
| `Product`          | `title`, `slug` (unique), `description`, `shortDescription`, `price`, `compareAtPrice`, `sku`, `inventory`, `isFeatured`, `isActive`, `images`, `tags` |
| `ProductVariant`   | `name`, `sku`, `price`, `inventory`, `options` (json: `{color, size}`)                                 |
| `Category`         | `name`, `slug` (unique), `description`, `image`, `parent` (self-relation for subcategories)             |
| `Order`            | `orderNumber` (unique), `status`, `subtotal`, `shipping`, `tax`, `total`, `shippingAddress`, `billingAddress`, `paymentMethod`, `paymentStatus`, `notes` |
| `OrderItem`        | `quantity`, `unitPrice`, `totalPrice`, `productSnapshot` (json — product data at purchase time)         |
| `Review`           | `rating` (1–5), `title`, `body`, `isVerified`, `isApproved`                                            |
| `Coupon`           | `code` (uppercase unique), `type`, `value`, `minOrderAmount`, `maxUses`, `usedCount`, `expiresAt`, `isActive` |
| `User` (extended)  | Strapi built-in + `phone`, `avatar`, `wishlist` (many-to-many → Product), `addresses` (json)           |

### Key design decisions

- **`compareAtPrice`** on Product — when set and greater than `price`, the UI shows the original crossed-out price.
- **`productSnapshot` on OrderItem** — stores a JSON copy of the product at purchase time so order history remains accurate even if the product is edited or deleted.
- **`isApproved` on Review** — reviews are moderated; only approved reviews show publicly.
- **`addresses` as JSON on User** — avoids a separate Address table for v1; can be extracted later.
- **`parent` self-relation on Category** — supports one level of subcategories without recursive complexity.

---

## 6. API Structure

| Path                                   | Purpose                                    |
| -------------------------------------- | ------------------------------------------ |
| `GET /api/products`                    | List products (filter, sort, paginate, populate) |
| `GET /api/products?filters[slug][$eq]` | Single product by slug                     |
| `GET /api/categories`                  | All categories                             |
| `POST /api/auth/local`                 | Login — returns JWT + user                 |
| `POST /api/auth/local/register`        | Register                                   |
| `POST /api/auth/forgot-password`       | Trigger reset email                        |
| `POST /api/auth/reset-password`        | Complete reset                             |
| `GET /api/orders?filters[user][id]`    | User's orders (auth required)              |
| `POST /api/orders`                     | Create order (auth required)               |
| `GET/PUT /api/users/:id`               | Profile + wishlist (auth required)         |
| `POST /api/reviews`                    | Submit review (auth required)              |
| `GET /api/coupons?filters[code][$eq]`  | Validate coupon                            |

All Strapi responses are flattened by `normalizeStrapi()` in the frontend — removes the `data.attributes` wrapper.

---

## 7. Auth Flow

Strapi built-in JWT auth. On login/register the frontend Server Action receives the JWT from Strapi and stores it in an **httpOnly cookie** named `veloura_token`. The cookie is read server-side on every protected request and forwarded as `Authorization: Bearer <token>` to Strapi. `middleware.ts` checks the cookie and redirects unauthenticated users away from `/account/*` and `/checkout`. Logout clears the cookie via a Server Action.

---

## 8. Coding Conventions

- **TypeScript strict mode** — no `any`, no implicit returns.
- **Server Components by default**; opt into `"use client"` only when needed.
- **No default exports** for components except Next.js route files (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`).
- **Zod schemas** live in `src/lib/validations/` and are used by both RHF (client) and Server Actions (server).
- **Re-validate server-side** on every mutation — never trust client input.
- **Server Actions** always return `ActionResult<T>` (`{ success: true; data } | { success: false; error }`). Never throw to the client.
- **Component naming**: `PascalCase.tsx` for components, `kebab-case.ts` for everything else.
- **Revalidation** after mutations: `revalidatePath()` or `revalidateTag()`.

---

## 9. Environment Variables

See `.env.local` (frontend) and `.env` (backend). Never committed.

| Variable                        | App      | Purpose                                      |
| ------------------------------- | -------- | -------------------------------------------- |
| `NEXT_PUBLIC_STRAPI_URL`        | Frontend | Public Strapi base URL                       |
| `NEXT_PUBLIC_APP_URL`           | Frontend | App URL (used for metadata + OG)             |
| `STRAPI_API_TOKEN`              | Frontend | Read-only API token for server-side fetches  |
| `DATABASE_URL`                  | Backend  | Neon PostgreSQL connection string            |
| `CLOUDINARY_NAME`               | Backend  | Cloudinary cloud name                        |
| `CLOUDINARY_KEY`                | Backend  | Cloudinary API key                           |
| `CLOUDINARY_SECRET`             | Backend  | Cloudinary API secret                        |
| `JWT_SECRET`                    | Backend  | Strapi JWT signing secret                    |
| `APP_KEYS` / `API_TOKEN_SALT`   | Backend  | Strapi internal security keys                |

---

## 10. Deployment Notes

- **Frontend**: Vercel — connected to GitHub, auto-deploy on push to `main`. `NEXT_PUBLIC_STRAPI_URL` points to the Render URL in production.
- **Backend (Strapi)**: Render — web service, `npm run build` + `npm run start`. `DATABASE_URL` points to Neon.
- **Database**: Neon — one project, two branches: `main` (production) and `dev` (development).
- **Media**: Cloudinary — Strapi uploads go through the `@strapi/provider-upload-cloudinary` plugin. Frontend reads Cloudinary URLs directly from Strapi responses.
- **`next/image`** configured to allow `res.cloudinary.com` in `next.config.ts`.

---

## 11. Reusable Patterns

- **`strapiClient`** (`src/lib/api/strapi.ts`) — typed fetch wrapper for GET/POST to Strapi; accepts an optional JWT for authenticated requests.
- **`normalizeStrapi()`** — flattens Strapi's `{ data: { id, attributes } }` shape into `{ id, ...attributes }`.
- **`requireAuth()`** (`src/lib/utils/auth.ts`) — reads `veloura_token` cookie; returns `{ jwt, userId }` or throws so the Server Action can return `{ success: false, error: "Unauthorized" }`.
- **`ActionResult<T>`** — standard Server Action return type: `{ success: true; data: T } | { success: false; error: string }`.
- **Cart store** (`src/lib/store/cart.ts`) — Zustand store with `persist` middleware writing to `localStorage`.

---

## 12. Roadmap

> Current step: **Phase 0 / Step 0.2** — Initialize Next.js app

| Phase | Step | Title                                                        | Status      |
| ----- | ---- | ------------------------------------------------------------ | ----------- |
| 0     | 0.1  | Create project-context.md and full roadmap                   | ✅ Done     |
| 0     | 0.2  | Initialize Next.js app (`frontend/`) with TypeScript + Tailwind | ✅ Done    |
| 1     | 1.1  | Install and configure Shadcn UI                              | ⬅️ Current |
| 1     | 1.2  | Set up folder structure, base TypeScript types, config files | ⏳ Pending  |
| 2     | 2.1  | Root layout, global styles, font setup                       | ⏳ Pending  |
| 2     | 2.2  | Header component (logo, nav, cart icon, auth links)          | ⏳ Pending  |
| 2     | 2.3  | Footer component                                             | ⏳ Pending  |
| 3     | 3.1  | Homepage skeleton (hero + section placeholders)              | ⏳ Pending  |
| 3     | 3.2  | Root-level loading.tsx and error.tsx boundaries              | ⏳ Pending  |
| 4     | 4.1  | Initialize Strapi app (`backend/`) with PostgreSQL           | ⏳ Pending  |
| 4     | 4.2  | Configure Cloudinary upload provider                         | ⏳ Pending  |
| 5     | 5.1  | Category content type                                        | ⏳ Pending  |
| 5     | 5.2  | Product content type (all fields)                            | ⏳ Pending  |
| 5     | 5.3  | ProductVariant content type                                  | ⏳ Pending  |
| 6     | 6.1  | Order + OrderItem content types                              | ⏳ Pending  |
| 6     | 6.2  | Review + Coupon content types                                | ⏳ Pending  |
| 6     | 6.3  | API permissions + generate API token for frontend            | ⏳ Pending  |
| 7     | 7.1  | `strapiClient` fetch wrapper + `normalizeStrapi()` utility   | ⏳ Pending  |
| 7     | 7.2  | TypeScript types: Product, Category, Variant, Pagination     | ⏳ Pending  |
| 8     | 8.1  | Products grid page (RSC, Strapi data)                        | ⏳ Pending  |
| 8     | 8.2  | Pagination + loading/error states on listing                 | ⏳ Pending  |
| 9     | 9.1  | Product detail page (title, price, description)              | ⏳ Pending  |
| 9     | 9.2  | Image gallery + variant selector                             | ⏳ Pending  |
| 10    | 10.1 | All categories listing page                                  | ⏳ Pending  |
| 10    | 10.2 | Category → filtered products page                           | ⏳ Pending  |
| 11    | 11.1 | Featured products section (live Strapi data)                 | ⏳ Pending  |
| 11    | 11.2 | Category showcase section on homepage                        | ⏳ Pending  |
| 12    | 12.1 | JWT cookie read/write utilities                              | ⏳ Pending  |
| 12    | 12.2 | Auth Server Actions (login, register, logout)                | ⏳ Pending  |
| 13    | 13.1 | Login page + form                                            | ⏳ Pending  |
| 13    | 13.2 | Register page + form                                         | ⏳ Pending  |
| 14    | 14.1 | `middleware.ts` for protected routes                         | ⏳ Pending  |
| 14    | 14.2 | Forgot password flow                                         | ⏳ Pending  |
| 15    | 15.1 | User menu in header (logged-in vs guest state)               | ⏳ Pending  |
| 15    | 15.2 | Post-login redirect + session hydration                      | ⏳ Pending  |
| 16    | 16.1 | Cart Zustand store with localStorage persistence             | ⏳ Pending  |
| 16    | 16.2 | Add to cart button component                                 | ⏳ Pending  |
| 17    | 17.1 | Cart drawer (slide-out sidebar)                              | ⏳ Pending  |
| 17    | 17.2 | Cart page (`/cart`)                                          | ⏳ Pending  |
| 18    | 18.1 | Checkout page: address form + validation                     | ⏳ Pending  |
| 18    | 18.2 | Checkout page: order summary sidebar                         | ⏳ Pending  |
| 19    | 19.1 | Place order Server Action (creates Strapi order)             | ⏳ Pending  |
| 19    | 19.2 | Order confirmation page                                      | ⏳ Pending  |
| 19    | 19.3 | COD payment placeholder (ready to swap for Stripe)           | ⏳ Pending  |
| 20    | 20.1 | Profile page (`/account/profile`)                            | ⏳ Pending  |
| 20    | 20.2 | Update profile Server Action                                 | ⏳ Pending  |
| 21    | 21.1 | Orders list page (`/account/orders`)                         | ⏳ Pending  |
| 21    | 21.2 | Order detail page                                            | ⏳ Pending  |
| 22    | 22.1 | Wishlist toggle Server Action + Strapi relation              | ⏳ Pending  |
| 22    | 22.2 | Wishlist page (`/account/wishlist`)                          | ⏳ Pending  |
| 23    | 23.1 | Search input component with debounce                         | ⏳ Pending  |
| 23    | 23.2 | Search results page (`/search`)                              | ⏳ Pending  |
| 24    | 24.1 | Filter sidebar (price range, category, sort)                 | ⏳ Pending  |
| 24    | 24.2 | URL-based filter state via searchParams                      | ⏳ Pending  |
| 25    | 25.1 | Reviews display on product page                              | ⏳ Pending  |
| 25    | 25.2 | Submit review Server Action (authenticated)                  | ⏳ Pending  |
| 26    | 26.1 | Coupon validation Server Action                              | ⏳ Pending  |
| 26    | 26.2 | Coupon input field in checkout                               | ⏳ Pending  |
| 27    | 27.1 | `generateMetadata()` on all key pages                        | ⏳ Pending  |
| 27    | 27.2 | `sitemap.ts` + `robots.ts`                                   | ⏳ Pending  |
| 28    | 28.1 | Suspense boundaries + streaming review                       | ⏳ Pending  |
| 28    | 28.2 | Image optimization audit (`next/image` + Cloudinary)         | ⏳ Pending  |
| 29    | 29.1 | Strapi roles + permissions finalized                         | ⏳ Pending  |
| 29    | 29.2 | Seed script: categories + sample products                    | ⏳ Pending  |
| 30    | 30.1 | Neon DB setup + deploy Strapi to Render                      | ⏳ Pending  |
| 30    | 30.2 | Deploy Next.js to Vercel                                     | ⏳ Pending  |
| 30    | 30.3 | Environment variables audit + production smoke test          | ⏳ Pending  |

---

## 13. Completed Tasks (Phase 0 · Step 0.1)

- ✅ Created `project-context.md` with full architecture reference, content type schemas, API map, auth strategy, coding conventions, environment variables, deployment plan, and 30-phase roadmap table.

## 14. Completed Tasks (Phase 0 · Step 0.2)

- ✅ Scaffolded Next.js 16.2.6 with App Router, TypeScript strict, Tailwind v4, ESLint — inside `frontend/`
- ✅ Removed nested `.git` created by create-next-app (veloura root will be the single repo)
- ✅ Tightened `tsconfig.json`: upgraded target to ES2022, added `noUncheckedIndexedAccess` and `noImplicitOverride`
- ✅ Replaced default boilerplate in `layout.tsx` (Veloura metadata, no Geist font yet — fonts in Phase 2 Step 2.1) and `page.tsx` (minimal placeholder)
- ✅ Cleaned `globals.css` to bare Tailwind v4 tokens (no font variables until Phase 2)
- ✅ Created root `.gitignore` covering `node_modules`, `.env*`, `.next/`, Strapi build dirs, logs, OS files
- ✅ Created `frontend/.env.local.example` with all three required frontend env vars
- ✅ TypeScript type-check passes clean with new strict flags

---

## 15. Important Decisions Log

- **2026-05-18** — Chose **Strapi v5** as the headless CMS — avoids building a custom admin panel while still giving full API control on the frontend.
- **2026-05-18** — Chose **custom JWT auth** (Strapi-issued, httpOnly cookie) over NextAuth — simpler integration with Strapi's built-in auth system; no need for a separate auth library.
- **2026-05-18** — Chose **Zustand** over Redux for cart/UI state — lightweight, supports localStorage persistence natively, no boilerplate.
- **2026-05-18** — `productSnapshot` stored as JSON on `OrderItem` — order history remains accurate even if the product is later edited or deleted.
- **2026-05-18** — **TanStack Query deferred** — RSC + Server Actions cover all current data needs. TanStack Query will be added only if client-side polling or optimistic updates are needed.
- **2026-05-18** — Monorepo layout (`frontend/` + `backend/`) in a single repo — single PR for cross-stack changes, simpler local dev.
