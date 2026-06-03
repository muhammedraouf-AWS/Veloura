"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCartStore, cartSubtotal } from "@/lib/store/cart";
import type { CartItem } from "@/types";

export function CartDrawer() {
  const items = useCartStore((s) => s.items);
  const isOpen = useCartStore((s) => s.isOpen);
  const closeCart = useCartStore((s) => s.closeCart);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const subtotal = useCartStore(cartSubtotal);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => { if (!open) closeCart(); }}>
      <SheetContent
        side="right"
        className="flex flex-col w-full max-w-md bg-[oklch(0.97_0.01_60)] p-0 gap-0"
      >
        {/* Header */}
        <SheetHeader className="flex flex-row items-center justify-between px-6 py-5 border-b border-[oklch(0.18_0.04_280/0.08)]">
          <SheetTitle className="font-heading text-[oklch(0.18_0.04_280)] text-2xl font-normal">
            Your Cart
            {items.length > 0 && (
              <span className="ml-2 font-sans text-sm text-[oklch(0.45_0.04_280/0.5)] font-normal">
                ({items.length} {items.length === 1 ? "item" : "items"})
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {/* Body */}
        {items.length === 0 ? (
          <EmptyState onClose={closeCart} />
        ) : (
          <>
            {/* Items list */}
            <ul className="flex-1 overflow-y-auto divide-y divide-[oklch(0.18_0.04_280/0.07)] px-6">
              {items.map((item) => (
                <CartItemRow
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

            {/* Footer */}
            <div className="border-t border-[oklch(0.18_0.04_280/0.08)] px-6 py-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-sans text-sm text-[oklch(0.45_0.04_280/0.7)]">
                  Subtotal
                </span>
                <span className="font-heading text-[oklch(0.18_0.04_280)] text-xl">
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-[0.65rem] text-[oklch(0.45_0.04_280/0.45)] font-sans">
                Shipping and taxes calculated at checkout.
              </p>

              <Link
                href="/checkout"
                onClick={closeCart}
                className="flex items-center justify-center w-full bg-[oklch(0.35_0.12_310)] text-[oklch(0.97_0.01_60)] py-4 font-sans text-[0.73rem] tracking-[0.15em] uppercase hover:bg-[oklch(0.28_0.10_310)] transition-colors"
              >
                Checkout
              </Link>

              <Link
                href="/cart"
                onClick={closeCart}
                className="flex items-center justify-center w-full border border-[oklch(0.18_0.04_280/0.2)] text-[oklch(0.45_0.04_280/0.7)] py-3.5 font-sans text-[0.7rem] tracking-[0.12em] uppercase hover:border-[oklch(0.18_0.04_280/0.4)] hover:text-[oklch(0.18_0.04_280)] transition-colors"
              >
                View full cart
              </Link>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

// ── Cart item row ─────────────────────────────────────────────────────────────
function CartItemRow({
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
    <li className="flex gap-4 py-5">
      {/* Image */}
      <div className="relative w-16 h-20 shrink-0 bg-[oklch(0.93_0.01_60)] overflow-hidden">
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="64px"
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <ShoppingBag className="h-5 w-5 text-[oklch(0.45_0.04_280/0.2)]" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col justify-between min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <Link
              href={`/products/${item.slug}`}
              className="font-heading text-[oklch(0.18_0.04_280)] text-base leading-snug hover:text-[oklch(0.35_0.12_310)] transition-colors line-clamp-2"
            >
              {item.title}
            </Link>
            {item.variant && (
              <p className="text-[0.65rem] tracking-[0.1em] uppercase text-[oklch(0.45_0.04_280/0.5)] font-sans mt-0.5">
                {item.variant}
              </p>
            )}
          </div>
          <button
            onClick={onRemove}
            aria-label="Remove item"
            className="shrink-0 text-[oklch(0.45_0.04_280/0.35)] hover:text-[oklch(0.55_0.18_25)] transition-colors mt-0.5"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center justify-between mt-3">
          {/* Quantity controls */}
          <div className="flex items-center border border-[oklch(0.18_0.04_280/0.15)]">
            <button
              onClick={onDecrement}
              aria-label="Decrease quantity"
              className="px-2.5 py-1.5 text-[oklch(0.45_0.04_280/0.6)] hover:text-[oklch(0.18_0.04_280)] hover:bg-[oklch(0.18_0.04_280/0.04)] transition-colors"
            >
              <Minus className="h-3 w-3" />
            </button>
            <span className="w-7 text-center font-sans text-sm text-[oklch(0.18_0.04_280)]">
              {item.quantity}
            </span>
            <button
              onClick={onIncrement}
              aria-label="Increase quantity"
              className="px-2.5 py-1.5 text-[oklch(0.45_0.04_280/0.6)] hover:text-[oklch(0.18_0.04_280)] hover:bg-[oklch(0.18_0.04_280/0.04)] transition-colors"
            >
              <Plus className="h-3 w-3" />
            </button>
          </div>

          {/* Line price */}
          <span className="font-heading text-[oklch(0.18_0.04_280)] text-base">
            ${(item.price * item.quantity).toFixed(2)}
          </span>
        </div>
      </div>
    </li>
  );
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ onClose }: { onClose: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
      <ShoppingBag className="h-12 w-12 text-[oklch(0.45_0.04_280/0.15)] mb-5" />
      <h2 className="font-heading text-[oklch(0.18_0.04_280)] text-2xl mb-2">
        Your cart is empty
      </h2>
      <p className="text-sm text-[oklch(0.45_0.04_280/0.55)] font-sans mb-8 max-w-[24ch]">
        Discover our collection of fine fragrances.
      </p>
      <Link
        href="/products"
        onClick={onClose}
        className="bg-[oklch(0.35_0.12_310)] text-[oklch(0.97_0.01_60)] px-8 py-3 font-sans text-[0.73rem] tracking-[0.13em] uppercase hover:bg-[oklch(0.28_0.10_310)] transition-colors"
      >
        Shop fragrances
      </Link>
    </div>
  );
}
