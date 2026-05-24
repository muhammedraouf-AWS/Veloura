import { STRAPI_URL } from "@/lib/constants";
import type { AuthUser } from "@/types";

// /api/users/me returns the user object directly — no data wrapper
export async function getCurrentUser(jwt: string): Promise<AuthUser | null> {
  try {
    const res = await fetch(`${STRAPI_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${jwt}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json() as Promise<AuthUser>;
  } catch {
    return null;
  }
}
