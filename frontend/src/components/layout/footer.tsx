import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Separator } from "@/components/ui/separator";

const footerLinks = {
  Shop: [
    { label: "All Products", href: "/products" },
    { label: "Categories", href: "/categories" },
    { label: "New Arrivals", href: "/products?sort=newest" },
    { label: "Best Sellers", href: "/products?sort=popular" },
  ],
  Account: [
    { label: "Sign In", href: "/login" },
    { label: "Register", href: "/register" },
    { label: "My Orders", href: "/account/orders" },
    { label: "Wishlist", href: "/account/wishlist" },
  ],
  Help: [
    { label: "Contact Us", href: "/contact" },
    { label: "Shipping Policy", href: "/shipping" },
    { label: "Returns", href: "/returns" },
    { label: "FAQ", href: "/faq" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-heading text-xl tracking-widest uppercase">
              Veloura
            </Link>
            <p className="mt-3 text-sm text-muted-foreground max-w-xs">
              Premium fragrances curated for the discerning nose. Discover your
              signature scent.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="text-sm font-semibold">{category}</h3>
              <ul className="mt-4 flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link
              href={siteConfig.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Instagram
            </Link>
            <Link
              href={siteConfig.social.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Twitter
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
