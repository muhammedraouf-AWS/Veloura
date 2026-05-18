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

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu" />
        }
      >
        <Menu className="h-5 w-5" />
      </SheetTrigger>

      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="font-heading text-2xl tracking-widest uppercase"
            >
              Veloura
            </Link>
          </SheetTitle>
        </SheetHeader>

        <nav className="mt-8 flex flex-col gap-1 px-4">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="flex items-center py-3 px-2 text-sm font-medium rounded-md hover:bg-accent transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex flex-col gap-2 border-t p-4">
          <Button variant="outline" className="w-full" render={<Link href="/login" onClick={() => setOpen(false)} />}>
            Sign in
          </Button>
          <Button className="w-full" render={<Link href="/register" onClick={() => setOpen(false)} />}>
            Create account
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
