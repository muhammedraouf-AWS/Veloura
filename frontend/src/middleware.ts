import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE } from "@/lib/constants";

export function middleware(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE)?.value;
  const { pathname } = request.nextUrl;

  const isProtected =
    pathname.startsWith("/account") || pathname.startsWith("/checkout");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  // Unauthenticated user hitting a protected route → send to login
  if (isProtected && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Authenticated user hitting login/register → send to account
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL("/account/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/account/:path*",
    "/checkout/:path*",
    "/login",
    "/register",
  ],
};
