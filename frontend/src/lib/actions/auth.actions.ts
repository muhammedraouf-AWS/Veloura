"use server";

import { redirect } from "next/navigation";
import { STRAPI_URL } from "@/lib/constants";
import { clearAuthCookie, setAuthCookie } from "@/lib/utils/auth";
import type { ActionResult, AuthResponse, AuthUser } from "@/types";

// ── loginAction ───────────────────────────────────────────────────────────────
// Signature matches useActionState: (prevState, formData) → ActionResult
export async function loginAction(
  _prevState: ActionResult<AuthUser> | null,
  formData: FormData
): Promise<ActionResult<AuthUser>> {
  const identifier = formData.get("email");
  const password = formData.get("password");

  if (typeof identifier !== "string" || typeof password !== "string") {
    return { success: false, error: "Invalid form data." };
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password }),
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
      const message: string = json?.error?.message ?? "Invalid credentials.";
      return { success: false, error: message };
    }

    const { jwt, user } = json as AuthResponse;
    await setAuthCookie(jwt);
    return { success: true, data: user };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

// ── registerAction ────────────────────────────────────────────────────────────
export async function registerAction(
  _prevState: ActionResult<AuthUser> | null,
  formData: FormData
): Promise<ActionResult<AuthUser>> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return { success: false, error: "Invalid form data." };
  }

  // Strapi requires a username — derive it from the email to keep the form simple
  const username = email.split("@")[0] ?? email;

  try {
    const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
      cache: "no-store",
    });

    const json = await res.json();

    if (!res.ok) {
      const message: string = json?.error?.message ?? "Registration failed.";
      return { success: false, error: message };
    }

    const { jwt, user } = json as AuthResponse;
    await setAuthCookie(jwt);
    return { success: true, data: user };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

// ── logoutAction ──────────────────────────────────────────────────────────────
// redirect() throws internally — must not be inside try/catch
export async function logoutAction(): Promise<void> {
  await clearAuthCookie();
  redirect("/");
}
