"use server";

import { strapiClient } from "@/lib/api";
import { getCurrentUser } from "@/lib/api/user.api";
import { requireAuth } from "@/lib/utils/auth";
import {
  checkoutSchema,
  type CheckoutFormData,
  SHIPPING_THRESHOLD,
  SHIPPING_COST,
} from "@/lib/validations/checkout";
import { validateCouponAction } from "@/lib/actions/coupon.actions";
import type { ActionResult, CartItem } from "@/types";

function generateOrderNumber(): string {
  const now = new Date();
  const date = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const suffix = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `VEL-${date}-${suffix}`;
}

export async function placeOrderAction(
  formData: CheckoutFormData,
  items: CartItem[],
  couponCode?: string
): Promise<ActionResult<{ orderNumber: string }>> {
  // 1. Auth
  let token: string;
  try {
    token = await requireAuth();
  } catch {
    return { success: false, error: "Please sign in to place an order." };
  }

  // 2. Server-side form validation (never trust client)
  const parsed = checkoutSchema.safeParse(formData);
  if (!parsed.success) {
    return { success: false, error: "Invalid form data. Please check your details." };
  }

  // 3. Cart must not be empty
  if (items.length === 0) {
    return { success: false, error: "Your cart is empty." };
  }

  // 4. Verify user is still valid
  const user = await getCurrentUser(token);
  if (!user) return { success: false, error: "Could not verify your account." };

  // 5. Recalculate totals server-side (never trust client)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const shipping = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
  const tax = 0;

  // Re-validate coupon server-side
  let discount = 0;
  let couponDocumentId: string | undefined;
  if (couponCode) {
    const couponResult = await validateCouponAction(couponCode, subtotal);
    if (couponResult.success) {
      discount = couponResult.data.discount;
      couponDocumentId = couponResult.data.documentId;
    }
  }

  const total = Math.max(0, subtotal + shipping + tax - discount);

  const address = {
    fullName: parsed.data.fullName,
    phone: parsed.data.phone,
    addressLine1: parsed.data.addressLine1,
    addressLine2: parsed.data.addressLine2 ?? null,
    city: parsed.data.city,
    state: parsed.data.state,
    postalCode: parsed.data.postalCode,
    country: parsed.data.country,
  };

  const orderNumber = generateOrderNumber();

  try {
    // 6. Create the order
    const orderRes = await strapiClient.mutate<{
      data: { id: number; documentId: string };
    }>({
      path: "/orders",
      method: "POST",
      jwt: token,
      body: {
        orderNumber,
        status: "pending",
        subtotal,
        shipping,
        tax,
        total,
        shippingAddress: address,
        billingAddress: address,
        paymentMethod: "cod",
        paymentStatus: "unpaid",
        ...(couponDocumentId ? { coupon: couponDocumentId } : {}),
      },
    });

    const orderId = orderRes.data.id;

    // 7. Create order items (parallel)
    await Promise.all(
      items.map((item) =>
        strapiClient.mutate({
          path: "/order-items",
          method: "POST",
          jwt: token,
          body: {
            quantity: item.quantity,
            unitPrice: item.price,
            totalPrice: item.price * item.quantity,
            productSnapshot: {
              title: item.title,
              slug: item.slug,
              price: item.price,
              image: item.image || null,
              variant: item.variant || null,
            },
            order: orderId,
          },
        })
      )
    );

    return { success: true, data: { orderNumber } };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to place order.";
    return { success: false, error: message };
  }
}
