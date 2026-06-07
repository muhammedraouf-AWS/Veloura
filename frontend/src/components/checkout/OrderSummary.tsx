"use client";

import { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { X, ShoppingBag } from "lucide-react";
import { useCartStore, cartSubtotal } from "@/lib/store/cart";
import { validateCouponAction, type ValidatedCoupon } from "@/lib/actions/coupon.actions";
import { SHIPPING_THRESHOLD, SHIPPING_COST } from "@/lib/validations/checkout";

type Props = {
  appliedCoupon: ValidatedCoupon | null;
  onCouponApplied: (coupon: ValidatedCoupon) => void;
  onCouponRemoved: () => void;
};

export function OrderSummary({ appliedCoupon, onCouponApplied, onCouponRemoved }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const items = useCartStore((s) => s.items);
  const subtotal = useCartStore(cartSubtotal);
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const discount = appliedCoupon?.discount ?? 0;
  const total = subtotal + shipping - discount;

  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleApply() {
    if (!couponCode.trim()) return;
    setCouponError(null);
    startTransition(async () => {
      const result = await validateCouponAction(couponCode.trim(), subtotal);
      if (result.success) {
        onCouponApplied(result.data);
        setCouponCode("");
      } else {
        setCouponError(result.error);
      }
    });
  }

  if (!mounted) {
    return <div className="space-y-4 animate-pulse">
      {[1,2].map((i) => <div key={i} className="h-12 bg-[oklch(0.90_0.01_60)]" />)}
    </div>;
  }

  return (
    <div>
      {/* Items */}
      <ul className="space-y-4 mb-6">
        {items.map((item) => (
          <li key={`${item.productId}-${item.variantId ?? "base"}`} className="flex gap-3">
            <div className="relative shrink-0">
              <div className="relative w-14 h-18 bg-[oklch(0.93_0.01_60)] overflow-hidden">
                {item.image ? (
                  <Image src={item.image} alt={item.title} fill sizes="56px" className="object-cover" />
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

      {/* Coupon input */}
      <div className="mb-4">
        {appliedCoupon ? (
          <div className="flex items-center justify-between bg-[oklch(0.97_0.03_155/0.15)] border border-[oklch(0.45_0.15_155/0.3)] px-3 py-2">
            <div>
              <p className="text-xs font-sans font-medium text-[oklch(0.40_0.12_155)] tracking-wide">
                {appliedCoupon.code}
              </p>
              <p className="text-[0.62rem] font-sans text-[oklch(0.40_0.12_155)/0.7]">
                {appliedCoupon.type === "percentage"
                  ? `${appliedCoupon.value}% off`
                  : `$${appliedCoupon.value} off`}
              </p>
            </div>
            <button
              onClick={onCouponRemoved}
              aria-label="Remove coupon"
              className="text-[oklch(0.45_0.04_280/0.4)] hover:text-[oklch(0.55_0.18_25)] transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="flex gap-2">
              <input
                type="text"
                value={couponCode}
                onChange={(e) => { setCouponCode(e.target.value); setCouponError(null); }}
                onKeyDown={(e) => e.key === "Enter" && handleApply()}
                placeholder="Coupon code"
                className="flex-1 rounded-none border border-[oklch(0.18_0.04_280/0.2)] bg-transparent px-3 py-2 text-sm text-[oklch(0.18_0.04_280)] placeholder:text-[oklch(0.45_0.04_280/0.3)] outline-none focus:border-[oklch(0.35_0.12_310)] transition-colors uppercase"
              />
              <button
                onClick={handleApply}
                disabled={isPending || !couponCode.trim()}
                className="px-4 py-2 border border-[oklch(0.18_0.04_280/0.2)] text-[0.68rem] tracking-[0.1em] uppercase font-sans text-[oklch(0.45_0.04_280/0.7)] hover:border-[oklch(0.35_0.12_310)] hover:text-[oklch(0.35_0.12_310)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {isPending ? "…" : "Apply"}
              </button>
            </div>
            {couponError && (
              <p className="text-[0.65rem] font-sans text-[oklch(0.55_0.18_25)]">{couponError}</p>
            )}
          </div>
        )}
      </div>

      {/* Totals */}
      <div className="border-t border-[oklch(0.18_0.04_280/0.08)] pt-4 space-y-2">
        <div className="flex justify-between text-sm font-sans text-[oklch(0.45_0.04_280/0.7)]">
          <span>Subtotal</span>
          <span className="text-[oklch(0.18_0.04_280)]">${subtotal.toFixed(2)}</span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-sm font-sans">
            <span className="text-[oklch(0.40_0.12_155)]">Discount ({appliedCoupon!.code})</span>
            <span className="text-[oklch(0.40_0.12_155)]">−${discount.toFixed(2)}</span>
          </div>
        )}
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
          ${Math.max(0, total).toFixed(2)}
        </span>
      </div>
    </div>
  );
}
