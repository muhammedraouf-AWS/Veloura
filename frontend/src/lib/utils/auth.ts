import { cookies } from "next/headers";
import { AUTH_COOKIE } from "@/lib/constants";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 30, // 30 days — matches Strapi JWT default
};

export async function getAuthToken(): Promise<string | null> {
  const store = await cookies();
  return store.get(AUTH_COOKIE)?.value ?? null;
}

export async function setAuthCookie(token: string): Promise<void> {
  const store = await cookies();
  store.set(AUTH_COOKIE, token, COOKIE_OPTIONS);
}

export async function clearAuthCookie(): Promise<void> {
  const store = await cookies();
  store.delete(AUTH_COOKIE);
}

// Use inside Server Actions that require a logged-in user.
// Returns the token or throws an object the action can return directly.
export async function requireAuth(): Promise<string> {
  const token = await getAuthToken();
  if (!token) throw { success: false, error: "Unauthorized" } as const;
  return token;
}
