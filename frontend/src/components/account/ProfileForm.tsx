"use client";

import { useActionState, useEffect } from "react";
import { updateProfileAction } from "@/lib/actions/user.actions";
import type { AuthUser } from "@/types";

export function ProfileForm({ user }: { user: AuthUser }) {
  const [state, action, isPending] = useActionState(updateProfileAction, null);

  const currentName = state?.success ? state.data.username : user.username;

  useEffect(() => {
    // no redirect needed — success message shown inline
  }, [state]);

  return (
    <form action={action} className="space-y-6">

      {/* Success banner */}
      {state?.success && (
        <p className="text-sm text-[oklch(0.45_0.15_155)] bg-[oklch(0.97_0.03_155/0.15)] border border-[oklch(0.45_0.15_155/0.25)] px-4 py-3">
          Profile updated successfully.
        </p>
      )}

      {/* Error banner */}
      {state && !state.success && (
        <p className="text-sm text-[oklch(0.55_0.18_25)] bg-[oklch(0.97_0.04_25/0.15)] border border-[oklch(0.55_0.18_25/0.2)] px-4 py-3">
          {state.error}
        </p>
      )}

      {/* Email — read-only */}
      <div className="space-y-1.5">
        <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-[oklch(0.45_0.04_280/0.7)] font-sans">
          Email
        </label>
        <p className="px-4 py-3 text-sm text-[oklch(0.45_0.04_280/0.6)] bg-[oklch(0.18_0.04_280/0.04)] border border-[oklch(0.18_0.04_280/0.1)]">
          {user.email}
        </p>
        <p className="text-[0.65rem] text-[oklch(0.45_0.04_280/0.45)] font-sans">
          Email cannot be changed.
        </p>
      </div>

      {/* Display name */}
      <div className="space-y-1.5">
        <label
          htmlFor="username"
          className="block text-[0.68rem] tracking-[0.15em] uppercase text-[oklch(0.45_0.04_280/0.7)] font-sans"
        >
          Display name
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          defaultValue={currentName}
          className="w-full rounded-none border border-[oklch(0.18_0.04_280/0.2)] bg-transparent px-4 py-3 text-sm text-[oklch(0.18_0.04_280)] placeholder:text-[oklch(0.45_0.04_280/0.35)] outline-none focus:border-[oklch(0.35_0.12_310)] transition-colors"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="bg-[oklch(0.35_0.12_310)] text-[oklch(0.97_0.01_60)] px-8 py-3 text-[0.73rem] tracking-[0.13em] uppercase font-sans hover:bg-[oklch(0.28_0.10_310)] disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
