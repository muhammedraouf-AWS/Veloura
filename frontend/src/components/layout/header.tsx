import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { siteConfig } from "@/config/site";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link href="/" className="font-heading text-xl tracking-widest uppercase">
          Veloura
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            aria-label="Search"
            render={<Link href="/search" />}
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* Cart — count wired in Phase 17 */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Cart"
            render={<Link href="/cart" />}
          >
            <ShoppingBag className="h-5 w-5" />
          </Button>

          {/* Auth — state wired in Phase 15 */}
          <div className="hidden md:flex items-center gap-2 ml-2">
            <Button variant="ghost" size="sm" render={<Link href="/login" />}>
              Sign in
            </Button>
            <Button size="sm" render={<Link href="/register" />}>
              Register
            </Button>
          </div>

          <MobileNav />
        </div>
      </div>
    </header>
  );
}
