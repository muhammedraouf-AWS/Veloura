import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MobileNav } from "./mobile-nav";
import { UserMenu } from "./user-menu";
import { CartIconButton } from "./CartIconButton";
import { siteConfig } from "@/config/site";
import { getAuthToken } from "@/lib/utils/auth";

export async function Header() {
  const token = await getAuthToken();
  const isLoggedIn = !!token;

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

          <CartIconButton />

          <UserMenu isLoggedIn={isLoggedIn} />

          <MobileNav isLoggedIn={isLoggedIn} />
        </div>
      </div>
    </header>
  );
}
