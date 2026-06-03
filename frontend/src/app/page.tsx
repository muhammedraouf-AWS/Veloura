import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/shared/reveal"
import { getFeaturedProducts } from "@/lib/api/product.api"
import { getCategories } from "@/lib/api/category.api"
import type { Category, Product, StrapiEntity } from "@/types"

// ── Static assets (hero + brand story only — categories now from Strapi) ──────
const IMG = {
  hero:  "https://images.unsplash.com/photo-1595425959632-34f2822322ce",
  story: "https://images.unsplash.com/photo-1608721279136-cd41b752fa41",
} as const

function iq(url: string, w: number, h?: number, q = 85) {
  return `${url}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=${q}`
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getProductImageUrl(product: StrapiEntity<Product>): string | null {
  const img = product.images?.[0]
  if (!img) return null
  return img.formats?.large?.url ?? img.formats?.medium?.url ?? img.url ?? null
}

function getCategoryImageUrl(category: StrapiEntity<Category>): string | null {
  const img = category.image
  if (!img) return null
  return img.formats?.large?.url ?? img.formats?.medium?.url ?? img.url ?? null
}

function formatPrice(price: number): string {
  return `$${price}`
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ])
  const featured = featuredProducts.slice(0, 3)

  return (
    <>
      <HeroSection />
      {featured.length > 0 && <FeaturedSection products={featured} />}
      {categories.length > 0 && <CollectionsSection categories={categories} />}
      <BrandStorySection />
      <NewsletterSection />
    </>
  )
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative flex min-h-[88svh] overflow-hidden">

      {/* Mobile: full-bleed plum + image behind text */}
      <div className="absolute inset-0 bg-plum md:hidden">
        <Image
          src={iq(IMG.hero, 800)}
          alt=""
          fill
          priority
          className="object-cover opacity-55"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-plum via-plum/50 to-plum/10" />
      </div>

      {/* Text panel — cream on desktop, transparent overlay on mobile */}
      <div className="relative z-10 flex flex-1 flex-col justify-end pb-14 pt-24 md:justify-center md:bg-cream md:pb-0 md:pt-0 px-8 sm:px-12 lg:px-16 xl:px-20 2xl:px-28">
        <p
          className="mb-5 text-[0.68rem] tracking-[0.22em] uppercase text-cream/60 md:text-ink-subtle animate-fade-up"
          style={{ animationDelay: "0ms" }}
        >
          Fine Fragrances
        </p>

        <h1
          className="font-heading text-[clamp(2.8rem,6vw,6.5rem)] leading-[0.94] tracking-[-0.01em] text-cream md:text-ink [text-wrap:balance] max-w-[11ch] animate-fade-up"
          style={{ animationDelay: "110ms" }}
        >
          The art of<br />
          being{" "}
          <em className="font-light italic">remembered.</em>
        </h1>

        <p
          className="mt-8 max-w-[36ch] text-[0.95rem] leading-[1.7] text-cream/65 md:text-ink-subtle animate-fade-up"
          style={{ animationDelay: "230ms" }}
        >
          Every bottle holds a story. Discover fragrances crafted for those
          who know that scent is the one memory you leave behind.
        </p>

        <div
          className="mt-10 animate-fade-up"
          style={{ animationDelay: "370ms" }}
        >
          <Button
            className="h-auto rounded-none border border-cream bg-transparent px-7 py-3.5 text-[0.75rem] tracking-[0.13em] uppercase text-cream hover:bg-cream hover:text-ink transition-colors duration-300 md:border-ink md:bg-ink md:text-cream md:hover:bg-plum md:hover:border-plum"
            render={<Link href="/products" />}
          >
            Explore the Collection
            <ArrowRight className="ml-2.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {/* Desktop: plum image panel */}
      <div className="relative hidden shrink-0 bg-plum md:block md:w-[44%] lg:w-[46%]">
        <Image
          src={iq(IMG.hero, 1080)}
          alt="Veloura signature fragrance surrounded by warm florals"
          fill
          priority
          className="object-cover opacity-70"
          sizes="46vw"
        />
        <div className="absolute inset-0 bg-plum/30" />
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cream/20 to-transparent" />
      </div>
    </section>
  )
}

// ── Featured (live Strapi data) ───────────────────────────────────────────────
function FeaturedSection({ products }: { products: StrapiEntity<Product>[] }) {
  const [hero, ...secondary] = products
  if (!hero) return null

  const heroImg = getProductImageUrl(hero)

  return (
    <section className="bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <Reveal className="mb-10 flex items-end justify-between">
          <div>
            <p className="mb-2 text-[0.68rem] tracking-[0.22em] uppercase text-ink-subtle">
              Curated Selection
            </p>
            <h2 className="font-heading text-[clamp(2rem,4vw,3.5rem)] text-ink leading-none">
              Featured Fragrances
            </h2>
          </div>
          <Button
            variant="ghost"
            className="hidden shrink-0 text-[0.72rem] tracking-[0.1em] uppercase text-ink-subtle hover:text-ink sm:flex"
            render={<Link href="/products" />}
          >
            View all <ArrowUpRight className="ml-1 h-3.5 w-3.5" />
          </Button>
        </Reveal>

        {/* Asymmetric grid: hero (left 2/3) + two stacked secondaries (right 1/3) */}
        <Reveal delay={100} className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:grid-rows-2 sm:h-160">

          {/* Hero card */}
          <Link
            href={`/products/${hero.slug}`}
            className="group relative overflow-hidden bg-plum-surface sm:col-span-2 sm:row-span-2 aspect-[3/4] sm:aspect-auto"
          >
            {heroImg && (
              <Image
                src={heroImg}
                alt={hero.images?.[0]?.alternativeText ?? hero.title}
                fill
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
                sizes="(min-width: 640px) 66vw, 100vw"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-7 sm:p-9">
              <p className="mb-1.5 text-[0.65rem] tracking-[0.18em] uppercase text-cream/55">
                {hero.category?.name ?? 'Signature'}
              </p>
              <h3 className="font-heading text-3xl sm:text-4xl text-cream mb-2 leading-tight">
                {hero.title}
              </h3>
              {hero.shortDescription && (
                <p className="text-sm text-cream/65 mb-4 max-w-[34ch] leading-relaxed">
                  {hero.shortDescription}
                </p>
              )}
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-cream/90">
                  {formatPrice(hero.price)}
                </span>
                <span className="inline-flex items-center text-[0.68rem] tracking-[0.15em] uppercase text-cream/50 opacity-0 translate-x-[-6px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  View product <ArrowRight className="ml-1.5 h-3 w-3" />
                </span>
              </div>
            </div>

            {/* Overlay — navigates via parent Link */}
            <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out pointer-events-none">
              <div className="flex items-center justify-center gap-2 w-full bg-[oklch(0.18_0.04_280/0.85)] backdrop-blur-sm text-[oklch(0.97_0.01_60)] font-sans text-[0.7rem] tracking-[0.15em] uppercase py-3">
                Select size
              </div>
            </div>
          </Link>

          {/* Secondary cards */}
          {secondary.map((product) => {
            const productImg = getProductImageUrl(product)
            return (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group relative overflow-hidden bg-plum-surface aspect-[4/5] sm:aspect-auto"
              >
                {productImg && (
                  <Image
                    src={productImg}
                    alt={product.images?.[0]?.alternativeText ?? product.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    sizes="(min-width: 640px) 33vw, 100vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 p-5">
                  <h3 className="font-heading text-xl text-cream leading-tight mb-0.5">
                    {product.title}
                  </h3>
                  <p className="text-xs text-cream/60">{formatPrice(product.price)}</p>
                </div>

                {/* Overlay — navigates via parent Link */}
                <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out pointer-events-none">
                  <div className="flex items-center justify-center gap-2 w-full bg-[oklch(0.18_0.04_280/0.85)] backdrop-blur-sm text-[oklch(0.97_0.01_60)] font-sans text-[0.7rem] tracking-[0.15em] uppercase py-3">
                    Select size
                  </div>
                </div>
              </Link>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}

// ── Collections (live Strapi data) ───────────────────────────────────────────
function CollectionsSection({ categories }: { categories: StrapiEntity<Category>[] }) {
  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <Reveal className="mb-10">
          <p className="mb-2 text-[0.68rem] tracking-[0.22em] uppercase text-ink-subtle">
            Browse by Collection
          </p>
          <h2 className="font-heading text-[clamp(2rem,4vw,3.5rem)] text-ink leading-none">
            Our Collections
          </h2>
        </Reveal>

        <Reveal delay={100} className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {categories.map((category) => {
            const categoryImg = getCategoryImageUrl(category)
            return (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative aspect-[3/4] overflow-hidden bg-plum-surface"
              >
                {categoryImg && (
                  <Image
                    src={categoryImg}
                    alt={category.image?.alternativeText ?? category.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                    sizes="(min-width: 1024px) 25vw, 50vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-5 sm:p-6">
                  <h3 className="font-heading text-2xl italic text-cream leading-tight">
                    {category.name}
                  </h3>
                  <span className="mt-2 inline-flex translate-y-1 items-center text-[0.62rem] tracking-[0.18em] uppercase text-cream/50 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    Shop now <ArrowRight className="ml-1 h-3 w-3" />
                  </span>
                </div>
              </Link>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}

// ── Brand Story ───────────────────────────────────────────────────────────────
function BrandStorySection() {
  return (
    <section className="bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-20">

          {/* Text */}
          <Reveal className="order-2 lg:order-1">
            <p className="mb-6 text-[0.68rem] tracking-[0.22em] uppercase text-ink-subtle">
              Our Philosophy
            </p>
            <h2 className="font-heading text-[clamp(2rem,4vw,3.5rem)] text-ink leading-[1.08] mb-8 max-w-[18ch] [text-wrap:balance]">
              The alchemy of memory and scent
            </h2>
            <p className="mb-5 max-w-[50ch] text-[0.95rem] leading-[1.75] text-ink-subtle">
              Veloura was founded on a single belief: that fragrance is not
              decoration, but identity. Each formula is composed from raw
              materials sourced at the height of their season — vetiver from
              Haiti, rose absolute from Grasse, oud from the forests of Assam.
            </p>
            <p className="mb-10 max-w-[50ch] text-[0.95rem] leading-[1.75] text-ink-subtle">
              We do not rush the process. We do not follow trends. We make
              fragrances for people who wear the same scent for twenty years
              and feel entirely themselves in it.
            </p>
            <Button
              variant="ghost"
              className="h-auto rounded-none border border-ink/25 px-6 py-3.5 text-[0.73rem] tracking-[0.12em] uppercase text-ink hover:border-ink hover:bg-ink hover:text-cream transition-colors duration-300"
              render={<Link href="/about" />}
            >
              Our story <ArrowUpRight className="ml-2 h-3.5 w-3.5" />
            </Button>
          </Reveal>

          {/* Image */}
          <Reveal delay={150} className="order-1 lg:order-2 relative aspect-4/5 overflow-hidden">
            <Image
              src={iq(IMG.story, 720)}
              alt="A glass perfume bottle in warm pink light — the essence of Veloura"
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 50vw, 100vw"
            />
            <div className="absolute inset-0 bg-plum/10" />
          </Reveal>

        </div>
      </div>
    </section>
  )
}

// ── Newsletter ────────────────────────────────────────────────────────────────
function NewsletterSection() {
  return (
    <section className="bg-plum py-20 lg:py-28">
      <div className="mx-auto max-w-xl px-4 sm:px-6 text-center">
        <Reveal>
          <p className="mb-5 text-[0.68rem] tracking-[0.22em] uppercase text-cream/45">
            Stay Close
          </p>
          <h2 className="font-heading text-[clamp(2rem,4vw,3.5rem)] text-cream mb-5 [text-wrap:balance]">
            New arrivals,{" "}
            <em className="font-light italic">before anyone else.</em>
          </h2>
          <p className="mb-10 text-[0.95rem] leading-[1.75] text-cream/55">
            Early access to new fragrances, limited editions, and letters
            from the atelier.
          </p>
          <form
            action="#"
            className="flex flex-col gap-0 sm:flex-row"
          >
            <input
              type="email"
              name="email"
              placeholder="Your email address"
              required
              aria-label="Email address"
              className="flex-1 rounded-none border border-cream/20 bg-cream/10 px-5 py-3.5 text-sm text-cream placeholder:text-cream/35 outline-none focus:border-cream/50 focus:bg-cream/15 transition-colors"
              suppressHydrationWarning
            />
            <button
              type="submit"
              className="rounded-none border border-cream bg-cream px-7 py-3.5 text-[0.73rem] tracking-[0.13em] uppercase text-plum font-medium hover:bg-transparent hover:text-cream transition-colors duration-300"
              suppressHydrationWarning
            >
              Subscribe
            </button>
          </form>
          <p className="mt-4 text-[0.65rem] text-cream/28">
            No frequency commitments. Unsubscribe at any time.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
