"use server";

import { normalizeStrapiMany, strapiClient } from "@/lib/api";
import type { ActionResult, Coupon, CouponType, StrapiListResponse } from "@/types";

export type ValidatedCoupon = {
  documentId: string;
  code: string;
  type: CouponType;
  value: number;
  discount: number;
};

export async function validateCouponAction(
  code: string,
  subtotal: number
): Promise<ActionResult<ValidatedCoupon>> {
  if (!code.trim()) {
    return { success: false, error: "Please enter a coupon code." };
  }

  const response = await strapiClient.get<StrapiListResponse<Coupon>>({
    path: "/coupons",
    revalidate: 0,
    params: {
      "filters[code][$eq]": code.trim().toUpperCase(),
      "filters[isActive][$eq]": "true",
    },
  });

  const coupons = normalizeStrapiMany(response);
  const coupon = coupons[0];

  if (!coupon) {
    return { success: false, error: "Invalid coupon code." };
  }

  if (coupon.expiresAt && new Date(coupon.expiresAt) < new Date()) {
    return { success: false, error: "This coupon has expired." };
  }

  if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
    return { success: false, error: "This coupon has reached its usage limit." };
  }

  if (coupon.minOrderAmount != null && subtotal < coupon.minOrderAmount) {
    return {
      success: false,
      error: `Minimum order of $${coupon.minOrderAmount.toFixed(2)} required.`,
    };
  }

  const discount =
    coupon.type === "percentage"
      ? Math.round(subtotal * (coupon.value / 100) * 100) / 100
      : Math.min(subtotal, coupon.value);

  return {
    success: true,
    data: {
      documentId: coupon.documentId,
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discount,
    },
  };
}
