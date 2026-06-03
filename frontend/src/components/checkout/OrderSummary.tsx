"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/lib/store/cart";
import { SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/validations/checkout";

export function OrderSummary() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(cartSubtotal);
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const total = subtotal + shipping;

  if (!mounted) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="flex gap-3">
            <div className="w-14 h-18 bg-[oklch(0.90_0.01_60)] animate-pulse shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 bg-[oklch(0.90_0.01_60)] animate-pulse" />
              <div className="h-3 w-1/4 bg-[oklch(0.90_0.01_60)] animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Items */}
      <ul className="space-y-4 mb-6">
        {items.map((item) => (
          <li
            key={`${item.productId}-${item.variantId ?? "base"}`}
            className="flex gap-3"
          >
            {/* Image with qty badge */}
            <div className="relative shrink-0">
              <div className="relative w-14 h-18 bg-[oklch(0.93_0.01_60)] overflow-hidden">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ShoppingBag className="h-4 w-4 text-[oklch(0.45_0.04_280/0.2)]" />
                  </div>
                )}
              </div>
              <span className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center rounded-full bg-[oklch(0.45_0.04_280/0.7)] text-[oklch(0.97_0.01_60)] text-[10px] font-sans">
                {item.quantity}
              </span>
            </div>

            {/* Info */}
            <div className="flex flex-1 items-start justify-between gap-2 min-w-0">
              <div className="min-w-0">
                <p className="font-heading text-[oklch(0.18_0.04_280)] text-sm leading-snug truncate">
                  {item.title}
                </p>
                {item.variant && (
                  <p className="text-[0.62rem] tracking-[0.1em] uppercase text-[oklch(0.45_0.04_280/0.5)] font-sans mt-0.5">
                    {item.variant}
                  </p>
                )}
              </div>
              <span className="font-sans text-sm text-[oklch(0.18_0.04_280)] shrink-0">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Totals */}
      <div className="border-t border-[oklch(0.18_0.04_280/0.08)] pt-4 space-y-2">
        <div className="flex justify-between text-sm font-sans text-[oklch(0.45_0.04_280/0.7)]">
          <span>Subtotal</span>
          <span className="text-[oklch(0.18_0.04_280)]">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm font-sans text-[oklch(0.45_0.04_280/0.7)]">
          <span>Shipping</span>
          <span className={shipping === 0 ? "text-[oklch(0.45_0.15_155)]" : "text-[oklch(0.18_0.04_280)]"}>
            {shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        {subtotal > 0 && subtotal < SHIPPING_THRESHOLD && (
          <p className="text-[0.62rem] text-[oklch(0.45_0.04_280/0.45)] font-sans">
            Add ${(SHIPPING_THRESHOLD - subtotal).toFixed(2)} more for free shipping
          </p>
        )}
      </div>

      <div className="border-t border-[oklch(0.18_0.04_280/0.08)] mt-4 pt-4 flex justify-between items-baseline">
        <span className="font-sans text-sm font-medium text-[oklch(0.18_0.04_280)]">Total</span>
        <span className="font-heading text-[oklch(0.18_0.04_280)] text-2xl">
          ${total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
