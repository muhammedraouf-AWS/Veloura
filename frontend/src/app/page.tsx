import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Reveal } from "@/components/shared/reveal"

// ── Verified Unsplash CDN URLs ───────────────────────────────────────────────
const IMG = {
  hero:   "https://images.unsplash.com/photo-1595425959632-34f2822322ce",
  p1:     "https://images.unsplash.com/photo-1608721279136-cd41b752fa41",
  p2:     "https://images.unsplash.com/photo-1533603208986-24fd819e718a",
  p3:     "https://images.unsplash.com/photo-1594035910387-fea47794261f",
  story:  "https://images.unsplash.com/photo-1608721279136-cd41b752fa41",
  cHer:   "https://images.unsplash.com/photo-1595425959632-34f2822322ce",
  cHim:   "https://images.unsplash.com/photo-1594035910387-fea47794261f",
  cLtd:   "https://images.unsplash.com/photo-1533603208986-24fd819e718a",
  cGifts: "https://images.unsplash.com/photo-1608721279136-cd41b752fa41",
} as const

function iq(url: string, w: number, h?: number, q = 85) {
  return `${url}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=${q}`
}

// ── Static placeholder data (wired to Strapi in Phase 11) ───────────────────
const FEATURED = [
  {
    name: "Sable Noir",
    tagline: "Sandalwood, black amber, and a trace of warm smoke.",
    price: "$185",
    href: "/products/sable-noir",
    img: IMG.p1,
    large: true,
  },
  {
    name: "Velours Rose",
    tagline: "Rose absolute, ripe peach, white musk.",
    price: "$140",
    href: "/products/velours-rose",
    img: IMG.p2,
    large: false,
  },
  {
    name: "Lumière d'Or",
    tagline: "Bergamot, golden iris, aged cedarwood.",
    price: "$160",
    href: "/products/lumiere-dor",
    img: IMG.p3,
    large: false,
  },
] as const

const COLLECTIONS = [
  { name: "For Her",          slug: "for-her",          img: IMG.cHer   },
  { name: "For Him",          slug: "for-him",          img: IMG.cHim   },
  { name: "Limited Edition",  slug: "limited-edition",  img: IMG.cLtd   },
  { name: "Gifts",            slug: "gifts",            img: IMG.cGifts },
] as const

// ── Page ─────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedSection />
      <CollectionsSection />
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
        {/* Feather toward cream panel */}
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-cream/20 to-transparent" />
      </div>
    </section>
  )
}

// ── Featured ─────────────────────────────────────────────────────────────────
function FeaturedSection() {
  const hero = FEATURED[0]
  const secondary = FEATURED.slice(1)

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

        {/* Asymmetric grid: hero card (left 2/3) + two stacked cards (right 1/3) */}
        <Reveal delay={100} className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 sm:grid-rows-2 sm:h-160">

          {/* Large card */}
          <Link
            href={hero.href}
            className="group relative overflow-hidden bg-plum-surface sm:col-span-2 sm:row-span-2 aspect-[3/4] sm:aspect-auto"
          >
            <Image
              src={iq(hero.img, 960)}
              alt={hero.name}
              fill
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.03]"
              sizes="(min-width: 640px) 66vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/65 via-ink/10 to-transparent" />
            <div className="absolute bottom-0 left-0 p-7 sm:p-9">
              <p className="mb-1.5 text-[0.65rem] tracking-[0.18em] uppercase text-cream/55">
                Signature
              </p>
              <h3 className="font-heading text-3xl sm:text-4xl text-cream mb-2 leading-tight">
                {hero.name}
              </h3>
              <p className="text-sm text-cream/65 mb-4 max-w-[34ch] leading-relaxed">
                {hero.tagline}
              </p>
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-cream/90">{hero.price}</span>
                <span className="inline-flex items-center text-[0.68rem] tracking-[0.15em] uppercase text-cream/50 opacity-0 translate-x-[-6px] transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                  Add to cart <ArrowRight className="ml-1.5 h-3 w-3" />
                </span>
              </div>
            </div>
          </Link>

          {/* Secondary cards */}
          {secondary.map((product) => (
            <Link
              key={product.name}
              href={product.href}
              className="group relative overflow-hidden bg-plum-surface aspect-[4/5] sm:aspect-auto"
            >
              <Image
                src={iq(product.img, 480)}
                alt={product.name}
                fill
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                sizes="(min-width: 640px) 33vw, 100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 p-5">
                <h3 className="font-heading text-xl text-cream leading-tight mb-0.5">
                  {product.name}
                </h3>
                <p className="text-xs text-cream/60">{product.price}</p>
              </div>
            </Link>
          ))}
        </Reveal>
      </div>
    </section>
  )
}

// ── Collections ───────────────────────────────────────────────────────────────
function CollectionsSection() {
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
          {COLLECTIONS.map((col) => (
            <Link
              key={col.slug}
              href={`/categories/${col.slug}`}
              className="group relative aspect-[3/4] overflow-hidden bg-plum-surface"
            >
              <Image
                src={iq(col.img, 500, 667)}
                alt={col.name}
                fill
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
                sizes="(min-width: 1024px) 25vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/20 to-transparent" />
              <div className="absolute bottom-0 left-0 w-full p-5 sm:p-6">
                <h3 className="font-heading text-2xl italic text-cream leading-tight">
                  {col.name}
                </h3>
                <span className="mt-2 inline-flex translate-y-1 items-center text-[0.62rem] tracking-[0.18em] uppercase text-cream/50 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                  Shop now <ArrowRight className="ml-1 h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
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
