"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { resetPasswordAction } from "@/lib/actions/auth.actions";

export function ResetPasswordForm({ code }: { code: string }) {
  const router = useRouter();
  const [state, action, isPending] = useActionState(resetPasswordAction, null);

  useEffect(() => {
    if (state?.success) {
      router.push("/login?reset=1");
    }
  }, [state, router]);

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="code" value={code} />

      {state && !state.success && (
        <p className="text-sm text-[oklch(0.55_0.18_25)] bg-[oklch(0.97_0.04_25/0.15)] border border-[oklch(0.55_0.18_25/0.2)] px-4 py-3">
          {state.error}
        </p>
      )}

      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-[0.68rem] tracking-[0.15em] uppercase text-[oklch(0.45_0.04_280/0.7)] font-sans"
        >
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="••••••••"
          className="w-full rounded-none border border-[oklch(0.18_0.04_280/0.2)] bg-transparent px-4 py-3 text-sm text-[oklch(0.18_0.04_280)] placeholder:text-[oklch(0.45_0.04_280/0.35)] outline-none focus:border-[oklch(0.35_0.12_310)] transition-colors"
        />
      </div>

      <div className="space-y-1.5">
        <label
          htmlFor="passwordConfirmation"
          className="block text-[0.68rem] tracking-[0.15em] uppercase text-[oklch(0.45_0.04_280/0.7)] font-sans"
        >
          Confirm password
        </label>
        <input
          id="passwordConfirmation"
          name="passwordConfirmation"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="••••••••"
          className="w-full rounded-none border border-[oklch(0.18_0.04_280/0.2)] bg-transparent px-4 py-3 text-sm text-[oklch(0.18_0.04_280)] placeholder:text-[oklch(0.45_0.04_280/0.35)] outline-none focus:border-[oklch(0.35_0.12_310)] transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[oklch(0.35_0.12_310)] text-[oklch(0.97_0.01_60)] px-6 py-3.5 text-[0.73rem] tracking-[0.13em] uppercase font-sans hover:bg-[oklch(0.28_0.10_310)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Resetting…" : "Reset password"}
      </button>
    </form>
  );
}
