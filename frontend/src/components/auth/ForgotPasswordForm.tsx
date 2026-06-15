"use client";

import { useActionState } from "react";
import Link from "next/link";
import { forgotPasswordAction } from "@/lib/actions/auth.actions";

export function ForgotPasswordForm() {
  const [state, action, isPending] = useActionState(forgotPasswordAction, null);

  if (state?.success) {
    return (
      <div className="space-y-5">
        <div className="bg-[oklch(0.45_0.12_155/0.08)] border border-[oklch(0.45_0.12_155/0.25)] px-4 py-4">
          <p className="text-sm text-[oklch(0.35_0.10_155)] font-sans leading-relaxed">
            If that address is registered with Veloura, you&apos;ll receive a
            reset link shortly. Check your inbox.
          </p>
        </div>
        <Link
          href="/login"
          className="block text-center w-full border border-[oklch(0.18_0.04_280/0.2)] px-6 py-3.5 text-[0.73rem] tracking-[0.13em] uppercase font-sans text-[oklch(0.18_0.04_280)] hover:bg-[oklch(0.18_0.04_280/0.04)] transition-colors"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      {state && !state.success && (
        <p className="text-sm text-[oklch(0.55_0.18_25)] bg-[oklch(0.97_0.04_25/0.15)] border border-[oklch(0.55_0.18_25/0.2)] px-4 py-3">
          {state.error}
        </p>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="email"
          className="block text-[0.68rem] tracking-[0.15em] uppercase text-[oklch(0.45_0.04_280/0.7)] font-sans"
        >
          Email address
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

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[oklch(0.35_0.12_310)] text-[oklch(0.97_0.01_60)] px-6 py-3.5 text-[0.73rem] tracking-[0.13em] uppercase font-sans hover:bg-[oklch(0.28_0.10_310)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Sending…" : "Send reset link"}
      </button>

      <p className="text-center text-sm text-[oklch(0.45_0.04_280/0.6)] font-sans">
        Remember your password?{" "}
        <Link
          href="/login"
          className="text-[oklch(0.35_0.12_310)] hover:text-[oklch(0.28_0.10_310)] transition-colors"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
