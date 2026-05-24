"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { siteConfig } from "@/config/site";
import { logoutAction } from "@/lib/actions/auth.actions";

export function MobileNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" />
        }
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>

      <SheetContent side="left" className="w-72 flex flex-col">
        <SheetHeader>
          <SheetTitle>
            <Link href="/" onClick={close} className="font-heading text-2xl tracking-widest uppercase">
              Veloura
            </Link>
          </SheetTitle>
        </SheetHeader>

        {/* Main nav */}
        <nav className="mt-8 flex flex-col gap-1 px-4">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={close}
              className="flex items-center py-3 px-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Auth section */}
        <div className="mt-auto border-t p-4">
          {isLoggedIn ? (
            <div className="flex flex-col gap-1">
              <Link
                href="/account/profile"
                onClick={close}
                className="flex items-center py-3 px-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
              >
                My account
              </Link>
              <Link
                href="/account/orders"
                onClick={close}
                className="flex items-center py-3 px-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
              >
                Orders
              </Link>
              <Link
                href="/account/wishlist"
                onClick={close}
                className="flex items-center py-3 px-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
              >
                Wishlist
              </Link>
              <form action={logoutAction} className="mt-1">
                <button
                  type="submit"
                  className="w-full flex items-center py-3 px-2 text-sm font-medium rounded-md hover:bg-accent transition-colors text-left text-destructive"
                >
                  Sign out
                </button>
              </form>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <Button
                variant="outline"
                className="w-full"
                render={<Link href="/login" onClick={close} />}
              >
                Sign in
              </Button>
              <Button
                className="w-full"
                render={<Link href="/register" onClick={close} />}
              >
                Create account
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
