export const siteConfig = {
  name: "Veloura",
  description: "Discover premium fragrances curated for the discerning nose.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  nav: [
    { label: "Shop", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "Search", href: "/search" },
  ],
  social: {
    instagram: "https://instagram.com/veloura",
    twitter: "https://twitter.com/veloura",
  },
} as const;

export type SiteConfig = typeof siteConfig;
