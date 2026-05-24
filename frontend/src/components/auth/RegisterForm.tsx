"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerAction } from "@/lib/actions/auth.actions";

export function RegisterForm() {
  const router = useRouter();
  const [state, action, isPending] = useActionState(registerAction, null);
  const [confirmError, setConfirmError] = useState<string | null>(null);

  useEffect(() => {
    if (state?.success) {
      router.refresh();
      router.push("/account/profile");
    }
  }, [state, router]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    const form = e.currentTarget;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const confirm = (form.elements.namedItem("confirmPassword") as HTMLInputElement).value;

    if (password !== confirm) {
      e.preventDefault();
      setConfirmError("Passwords do not match.");
      return;
    }

    setConfirmError(null);
  }

  const serverError = state && !state.success ? state.error : null;

  return (
    <form action={action} onSubmit={handleSubmit} className="space-y-5">

      {/* Error banner — server or confirm mismatch */}
      {(serverError ?? confirmError) && (
        <p className="text-sm text-[oklch(0.55_0.18_25)] bg-[oklch(0.97_0.04_25/0.15)] border border-[oklch(0.55_0.18_25/0.2)] px-4 py-3">
          {serverError ?? confirmError}
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
        <label
          htmlFor="password"
          className="block text-[0.68rem] tracking-[0.15em] uppercase text-[oklch(0.45_0.04_280/0.7)] font-sans"
        >
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="Min. 6 characters"
          className="w-full rounded-none border border-[oklch(0.18_0.04_280/0.2)] bg-transparent px-4 py-3 text-sm text-[oklch(0.18_0.04_280)] placeholder:text-[oklch(0.45_0.04_280/0.35)] outline-none focus:border-[oklch(0.35_0.12_310)] transition-colors"
        />
      </div>

      {/* Confirm password */}
      <div className="space-y-1.5">
        <label
          htmlFor="confirmPassword"
          className="block text-[0.68rem] tracking-[0.15em] uppercase text-[oklch(0.45_0.04_280/0.7)] font-sans"
        >
          Confirm password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          required
          autoComplete="new-password"
          placeholder="••••••••"
          onChange={() => confirmError && setConfirmError(null)}
          className="w-full rounded-none border border-[oklch(0.18_0.04_280/0.2)] bg-transparent px-4 py-3 text-sm text-[oklch(0.18_0.04_280)] placeholder:text-[oklch(0.45_0.04_280/0.35)] outline-none focus:border-[oklch(0.35_0.12_310)] transition-colors"
        />
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[oklch(0.35_0.12_310)] text-[oklch(0.97_0.01_60)] px-6 py-3.5 text-[0.73rem] tracking-[0.13em] uppercase font-sans hover:bg-[oklch(0.28_0.10_310)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Creating account…" : "Create account"}
      </button>

      {/* Terms note */}
      <p className="text-center text-[0.68rem] text-[oklch(0.45_0.04_280/0.45)] font-sans leading-relaxed">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="underline underline-offset-2 hover:text-[oklch(0.35_0.12_310)] transition-colors">
          terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="underline underline-offset-2 hover:text-[oklch(0.35_0.12_310)] transition-colors">
          privacy policy
        </Link>
        .
      </p>

      {/* Login link */}
      <p className="text-center text-sm text-[oklch(0.45_0.04_280/0.6)] font-sans">
        Already have an account?{" "}
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
