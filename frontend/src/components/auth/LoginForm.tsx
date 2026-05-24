"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginAction } from "@/lib/actions/auth.actions";

export function LoginForm({ redirectTo = "/account/profile" }: { redirectTo?: string }) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state?.success) {
      router.refresh(); // re-render server components that depend on auth state
      router.push(redirectTo);
    }
  }, [state, router, redirectTo]);

  return (
    <form action={action} className="space-y-5">

      {/* Error banner */}
      {state && !state.success && (
        <p className="text-sm text-[oklch(0.55_0.18_25)] bg-[oklch(0.97_0.04_25/0.15)] border border-[oklch(0.55_0.18_25/0.2)] px-4 py-3">
          {state.error}
        </p>
      )}

      {/* Email */}
      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-[0.68rem] tracking-[0.15em] uppercase text-[oklch(0.45_0.04_280/0.7)] font-sans"
        >
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="w-full rounded-none border border-[oklch(0.18_0.04_280/0.2)] bg-transparent px-4 py-3 text-sm text-[oklch(0.18_0.04_280)] placeholder:text-[oklch(0.45_0.04_280/0.35)] outline-none focus:border-[oklch(0.35_0.12_310)] transition-colors"
        />
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="password"
            className="block text-[0.68rem] tracking-[0.15em] uppercase text-[oklch(0.45_0.04_280/0.7)] font-sans"
          >
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-[0.68rem] text-[oklch(0.45_0.04_280/0.55)] hover:text-[oklch(0.35_0.12_310)] transition-colors font-sans"
          >
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          className="w-full rounded-none border border-[oklch(0.18_0.04_280/0.2)] bg-transparent px-4 py-3 text-sm text-[oklch(0.18_0.04_280)] placeholder:text-[oklch(0.45_0.04_280/0.35)] outline-none focus:border-[oklch(0.35_0.12_310)] transition-colors"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[oklch(0.35_0.12_310)] text-[oklch(0.97_0.01_60)] px-6 py-3.5 text-[0.73rem] tracking-[0.13em] uppercase font-sans hover:bg-[oklch(0.28_0.10_310)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Signing in…" : "Sign in"}
      </button>

      {/* Register link */}
      <p className="text-center text-sm text-[oklch(0.45_0.04_280/0.6)] font-sans">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="text-[oklch(0.35_0.12_310)] hover:text-[oklch(0.28_0.10_310)] transition-colors"
        >
          Register
        </Link>
      </p>
    </form>
  );
}
