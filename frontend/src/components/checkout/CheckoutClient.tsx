"use client";

import { useState } from "react";
import { CheckoutForm } from "./CheckoutForm";
import { OrderSummary } from "./OrderSummary";
import type { ValidatedCoupon } from "@/lib/actions/coupon.actions";

export function CheckoutClient({ userEmail }: { userEmail: string }) {
  const [appliedCoupon, setAppliedCoupon] = useState<ValidatedCoupon | null>(null);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 xl:gap-16">
      <CheckoutForm userEmail={userEmail} appliedCoupon={appliedCoupon} />

      <aside className="lg:sticky lg:top-24 self-start">
        <div className="border border-[oklch(0.18_0.04_280/0.1)] p-6">
          <h2 className="font-heading text-[oklch(0.18_0.04_280)] text-xl mb-6">
            Order summary
          </h2>
          <OrderSummary
            appliedCoupon={appliedCoupon}
            onCouponApplied={setAppliedCoupon}
            onCouponRemoved={() => setAppliedCoupon(null)}
          />
        </div>
      </aside>
    </div>
  );
}
