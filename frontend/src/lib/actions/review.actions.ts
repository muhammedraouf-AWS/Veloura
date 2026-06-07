"use server";

import { strapiClient } from "@/lib/api";
import { requireAuth } from "@/lib/utils/auth";
import type { ActionResult } from "@/types";

export async function submitReviewAction(
  productDocumentId: string,
  _prevState: ActionResult<void> | null,
  formData: FormData
): Promise<ActionResult<void>> {
  let token: string;
  try {
    token = await requireAuth();
  } catch {
    return { success: false, error: "Please sign in to leave a review." };
  }

  const rating = Number(formData.get("rating"));
  const title = formData.get("title");
  const body = formData.get("body");

  if (!rating || rating < 1 || rating > 5) {
    return { success: false, error: "Please select a rating." };
  }
  if (typeof body !== "string" || body.trim().length < 10) {
    return { success: false, error: "Review must be at least 10 characters." };
  }

  try {
    await strapiClient.mutate({
      path: "/reviews",
      method: "POST",
      jwt: token,
      body: {
        rating,
        title: typeof title === "string" && title.trim() ? title.trim() : null,
        body: body.trim(),
        product: productDocumentId,
      },
    });

    return { success: true, data: undefined };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to submit review.";
    return { success: false, error: message };
  }
}
