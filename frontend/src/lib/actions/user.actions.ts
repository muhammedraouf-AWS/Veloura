"use server";

import { revalidatePath } from "next/cache";
import { STRAPI_URL } from "@/lib/constants";
import { getCurrentUser } from "@/lib/api/user.api";
import { requireAuth } from "@/lib/utils/auth";
import type { ActionResult, AuthUser } from "@/types";

export async function updateProfileAction(
  _prevState: ActionResult<AuthUser> | null,
  formData: FormData
): Promise<ActionResult<AuthUser>> {
  let token: string;
  try {
    token = await requireAuth();
  } catch {
    return { success: false, error: "Unauthorized." };
  }

  const username = formData.get("username");
  if (typeof username !== "string" || !username.trim()) {
    return { success: false, error: "Display name is required." };
  }

  const user = await getCurrentUser(token);
  if (!user) return { success: false, error: "Could not fetch user." };

  try {
    const res = await fetch(`${STRAPI_URL}/api/users/${user.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ username: username.trim() }),
      cache: "no-store",
    });

    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json?.error?.message ?? "Update failed." };
    }

    return { success: true, data: json as AuthUser };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

export async function toggleWishlistAction(
  productId: number,
  shouldAdd: boolean
): Promise<ActionResult<{ isInWishlist: boolean }>> {
  let token: string;
  try {
    token = await requireAuth();
  } catch {
    return { success: false, error: "Please sign in to manage your wishlist." };
  }

  let userId: number;
  try {
    const res = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return { success: false, error: "Could not fetch user." };
    const user = await res.json();
    userId = user.id;
  } catch {
    return { success: false, error: "Something went wrong." };
  }

  const operation = shouldAdd ? "connect" : "disconnect";

  try {
    const res = await fetch(`${STRAPI_URL}/api/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      // users-permissions DB layer (toIdArray) expects a plain integer, not { id } or { documentId }
      body: JSON.stringify({
        wishlist: { [operation]: [productId] },
      }),
      cache: "no-store",
    });

    if (!res.ok) {
      const json = await res.json().catch(() => ({}));
      return {
        success: false,
        error: json?.error?.message ?? "Could not update wishlist.",
      };
    }

    revalidatePath("/account/wishlist");
    return { success: true, data: { isInWishlist: shouldAdd } };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
