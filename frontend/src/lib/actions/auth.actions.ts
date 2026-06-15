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

// ── forgotPasswordAction ──────────────────────────────────────────────────────
export async function forgotPasswordAction(
  _prevState: ActionResult<null> | null,
  formData: FormData
): Promise<ActionResult<null>> {
  const email = formData.get("email");

  if (typeof email !== "string" || !email.trim()) {
    return { success: false, error: "Please enter your email address." };
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
      cache: "no-store",
    });

    if (!res.ok) {
      const json = await res.json().catch(() => null);
      const message: string = json?.error?.message ?? "Request failed.";
      return { success: false, error: message };
    }

    return { success: true, data: null };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}

// ── resetPasswordAction ───────────────────────────────────────────────────────
export async function resetPasswordAction(
  _prevState: ActionResult<null> | null,
  formData: FormData
): Promise<ActionResult<null>> {
  const code = formData.get("code");
  const password = formData.get("password");
  const passwordConfirmation = formData.get("passwordConfirmation");

  if (
    typeof code !== "string" ||
    typeof password !== "string" ||
    typeof passwordConfirmation !== "string"
  ) {
    return { success: false, error: "Invalid form data." };
  }

  if (password !== passwordConfirmation) {
    return { success: false, error: "Passwords do not match." };
  }

  if (password.length < 6) {
    return { success: false, error: "Password must be at least 6 characters." };
  }

  try {
    const res = await fetch(`${STRAPI_URL}/api/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code, password, passwordConfirmation }),
      cache: "no-store",
    });

    if (!res.ok) {
      const json = await res.json().catch(() => null);
      const message: string =
        json?.error?.message ?? "Reset failed. The link may have expired.";
      return { success: false, error: message };
    }

    return { success: true, data: null };
  } catch {
    return { success: false, error: "Something went wrong. Please try again." };
  }
}
