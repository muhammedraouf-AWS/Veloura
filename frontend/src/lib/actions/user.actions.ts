"use server";

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
