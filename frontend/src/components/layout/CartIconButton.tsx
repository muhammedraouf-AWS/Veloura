"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore, cartTotalItems } from "@/lib/store/cart";

export function CartIconButton() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const count = useCartStore(cartTotalItems);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Cart"
        render={<Link href="/cart" />}
      >
        <ShoppingBag className="h-5 w-5" />
      </Button>

      {mounted && count > 0 && (
        <span className="pointer-events-none absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[oklch(0.35_0.12_310)] text-[oklch(0.97_0.01_60)] text-[9px] font-sans font-medium">
          {count > 9 ? "9+" : count}
        </span>
      )}
    </div>
  );
}
