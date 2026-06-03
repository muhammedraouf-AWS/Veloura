"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag, ArrowLeft } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/lib/store/cart";
import type { CartItem } from "@/types";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const subtotal = useCartStore(cartSubtotal);

  if (!mounted) return <CartSkeleton />;

  return (
    <div className="bg-[oklch(0.97_0.01_60)] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-10">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.15em] uppercase text-[oklch(0.45_0.04_280/0.55)] font-sans hover:text-[oklch(0.35_0.12_310)] transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Continue shopping
          </Link>
          <h1 className="font-heading text-[oklch(0.18_0.04_280)] text-4xl">
            Your Cart
          </h1>
        </div>

        {items.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">

            {/* Items */}
            <div>
              <ul className="divide-y divide-[oklch(0.18_0.04_280/0.07)]">
                {items.map((item) => (
                  <CartRow
                    key={`${item.productId}-${item.variantId ?? "base"}`}
                    item={item}
                    onRemove={() => removeItem(item.productId, item.variantId)}
                    onDecrement={() =>
                      updateQuantity(item.productId, item.variantId, item.quantity - 1)
                    }
                    onIncrement={() =>
                      updateQuantity(item.productId, item.variantId, item.quantity + 1)
                    }
                  />
                ))}
              </ul>
            </div>

            {/* Order summary */}
            <aside className="lg:sticky lg:top-24 self-start">
              <div className="border border-[oklch(0.18_0.04_280/0.1)] p-6 space-y-4">
                <h2 className="font-heading text-[oklch(0.18_0.04_280)] text-xl">
                  Order Summary
                </h2>

                <div className="space-y-2 pt-2">
                  <div className="flex justify-between text-sm font-sans text-[oklch(0.45_0.04_280/0.7)]">
                    <span>Subtotal</span>
                    <span className="text-[oklch(0.18_0.04_280)]">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-sans text-[oklch(0.45_0.04_280/0.7)]">
                    <span>Shipping</span>
                    <span>Calculated at checkout</span>
                  </div>
                </div>

                <div className="border-t border-[oklch(0.18_0.04_280/0.08)] pt-4 flex justify-between">
                  <span className="font-sans text-sm text-[oklch(0.18_0.04_280)] font-medium">
                    Total
                  </span>
                  <span className="font-heading text-[oklch(0.18_0.04_280)] text-2xl">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <Link
                  href="/checkout"
                  className="flex items-center justify-center w-full bg-[oklch(0.35_0.12_310)] text-[oklch(0.97_0.01_60)] py-4 font-sans text-[0.73rem] tracking-[0.15em] uppercase hover:bg-[oklch(0.28_0.10_310)] transition-colors mt-2"
                >
                  Proceed to checkout
                </Link>

                <p className="text-[0.65rem] text-center text-[oklch(0.45_0.04_280/0.4)] font-sans">
                  Taxes and shipping calculated at checkout
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Cart row ──────────────────────────────────────────────────────────────────
function CartRow({
  item,
  onRemove,
  onDecrement,
  onIncrement,
}: {
  item: CartItem;
  onRemove: () => void;
  onDecrement: () => void;
  onIncrement: () => void;
}) {
  return (
    <li className="flex gap-5 py-6">
      {/* Image */}
      <div className="relative w-20 h-26 shrink-0 bg-[oklch(0.93_0.01_60)] overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="80px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingBag className="h-6 w-6 text-[oklch(0.45_0.04_280/0.15)]" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link
              href={`/products/${item.slug}`}
              className="font-heading text-[oklch(0.18_0.04_280)] text-xl leading-snug hover:text-[oklch(0.35_0.12_310)] transition-colors"
            >
              {item.title}
            </Link>
            {item.variant && (
              <p className="text-[0.65rem] tracking-[0.12em] uppercase text-[oklch(0.45_0.04_280/0.5)] font-sans mt-1">
                {item.variant}
              </p>
            )}
            <p className="font-sans text-sm text-[oklch(0.45_0.04_280/0.6)] mt-1">
              ${item.price.toFixed(2)} each
            </p>
          </div>
          <button
            onClick={onRemove}
            aria-label="Remove item"
            className="shrink-0 text-[oklch(0.45_0.04_280/0.3)] hover:text-[oklch(0.55_0.18_25)] transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-4">
          {/* Quantity */}
          <div className="flex items-center border border-[oklch(0.18_0.04_280/0.15)]">
            <button
              onClick={onDecrement}
              aria-label="Decrease quantity"
              className="px-3 py-2 text-[oklch(0.45_0.04_280/0.6)] hover:text-[oklch(0.18_0.04_280)] hover:bg-[oklch(0.18_0.04_280/0.04)] transition-colors"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-10 text-center font-sans text-sm text-[oklch(0.18_0.04_280)]">
              {item.quantity}
            </span>
            <button
              onClick={onIncrement}
              aria-label="Increase quantity"
              className="px-3 py-2 text-[oklch(0.45_0.04_280/0.6)] hover:text-[oklch(0.18_0.04_280)] hover:bg-[oklch(0.18_0.04_280/0.04)] transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Line total */}
          <span className="font-heading text-[oklch(0.18_0.04_280)] text-xl">
            ${(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </li>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <ShoppingBag className="h-14 w-14 text-[oklch(0.45_0.04_280/0.12)] mb-6" />
      <h2 className="font-heading text-[oklch(0.18_0.04_280)] text-3xl mb-3">
        Your cart is empty
      </h2>
      <p className="text-sm text-[oklch(0.45_0.04_280/0.55)] font-sans mb-10 max-w-[28ch]">
        Discover our collection of fine fragrances and find your signature scent.
      </p>
      <Link
        href="/products"
        className="bg-[oklch(0.35_0.12_310)] text-[oklch(0.97_0.01_60)] px-10 py-4 font-sans text-[0.73rem] tracking-[0.13em] uppercase hover:bg-[oklch(0.28_0.10_310)] transition-colors"
      >
        Shop fragrances
      </Link>
    </div>
  );
}

// ── Loading skeleton ──────────────────────────────────────────────────────────
function CartSkeleton() {
  return (
    <div className="bg-[oklch(0.97_0.01_60)] min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-4 w-32 bg-[oklch(0.90_0.01_60)] animate-pulse mb-6" />
        <div className="h-10 w-48 bg-[oklch(0.90_0.01_60)] animate-pulse mb-10" />
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-12">
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="flex gap-5 py-6 border-b border-[oklch(0.18_0.04_280/0.07)]">
                <div className="w-20 h-26 bg-[oklch(0.90_0.01_60)] animate-pulse shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-5 w-3/4 bg-[oklch(0.90_0.01_60)] animate-pulse" />
                  <div className="h-3 w-1/4 bg-[oklch(0.90_0.01_60)] animate-pulse" />
                </div>
              </div>
            ))}
          </div>
          <div className="h-64 bg-[oklch(0.90_0.01_60)] animate-pulse" />
        </div>
      </div>
    </div>
  );
}
