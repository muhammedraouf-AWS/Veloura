"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { submitReviewAction } from "@/lib/actions/review.actions";

type Props = {
  productDocumentId: string;
  productSlug: string;
  isLoggedIn: boolean;
};

export function ReviewForm({ productDocumentId, productSlug, isLoggedIn }: Props) {
  const boundAction = submitReviewAction.bind(null, productDocumentId);
  const [state, action, isPending] = useActionState(boundAction, null);
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);

  if (!isLoggedIn) {
    return (
      <p className="text-sm font-sans text-[oklch(0.45_0.04_280/0.6)]">
        <Link
          href={`/login?from=/products/${productSlug}`}
          className="text-[oklch(0.35_0.12_310)] hover:text-[oklch(0.28_0.10_310)] transition-colors"
        >
          Sign in
        </Link>{" "}
        to write a review.
      </p>
    );
  }

  if (state?.success) {
    return (
      <div className="border border-[oklch(0.45_0.15_155/0.3)] bg-[oklch(0.97_0.03_155/0.1)] px-5 py-4">
        <p className="text-sm font-sans text-[oklch(0.40_0.12_155)]">
          Thank you for your review! It will appear here once approved.
        </p>
      </div>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <h3 className="font-heading text-[oklch(0.18_0.04_280)] text-xl">
        Write a review
      </h3>

      {state && !state.success && (
        <p className="text-sm text-[oklch(0.55_0.18_25)] bg-[oklch(0.97_0.04_25/0.12)] border border-[oklch(0.55_0.18_25/0.2)] px-4 py-3">
          {state.error}
        </p>
      )}

      {/* Star picker */}
      <div className="space-y-1.5">
        <label className="block text-[0.68rem] tracking-[0.15em] uppercase text-[oklch(0.45_0.04_280/0.7)] font-sans">
          Rating
        </label>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }, (_, i) => {
            const val = i + 1;
            const active = val <= (hovered || rating);
            return (
              <button
                key={i}
                type="button"
                onClick={() => setRating(val)}
                onMouseEnter={() => setHovered(val)}
                onMouseLeave={() => setHovered(0)}
                aria-label={`${val} star${val > 1 ? "s" : ""}`}
                className={`text-2xl leading-none transition-colors ${
                  active ? "text-[oklch(0.65_0.15_70)]" : "text-[oklch(0.80_0.02_280)]"
                }`}
              >
                ★
              </button>
            );
          })}
        </div>
        <input type="hidden" name="rating" value={rating} />
      </div>

      {/* Title */}
      <div className="space-y-1.5">
        <label
          htmlFor="review-title"
          className="block text-[0.68rem] tracking-[0.15em] uppercase text-[oklch(0.45_0.04_280/0.7)] font-sans"
        >
          Title{" "}
          <span className="normal-case tracking-normal text-[oklch(0.45_0.04_280/0.4)]">
            (optional)
          </span>
        </label>
        <input
          id="review-title"
          name="title"
          type="text"
          maxLength={150}
          placeholder="Summarise your experience"
          className="w-full rounded-none border border-[oklch(0.18_0.04_280/0.2)] bg-transparent px-4 py-3 text-sm text-[oklch(0.18_0.04_280)] placeholder:text-[oklch(0.45_0.04_280/0.3)] outline-none focus:border-[oklch(0.35_0.12_310)] transition-colors"
        />
      </div>

      {/* Body */}
      <div className="space-y-1.5">
        <label
          htmlFor="review-body"
          className="block text-[0.68rem] tracking-[0.15em] uppercase text-[oklch(0.45_0.04_280/0.7)] font-sans"
        >
          Review
        </label>
        <textarea
          id="review-body"
          name="body"
          required
          minLength={10}
          rows={4}
          placeholder="Tell us what you think of this fragrance…"
          className="w-full rounded-none border border-[oklch(0.18_0.04_280/0.2)] bg-transparent px-4 py-3 text-sm text-[oklch(0.18_0.04_280)] placeholder:text-[oklch(0.45_0.04_280/0.3)] outline-none focus:border-[oklch(0.35_0.12_310)] transition-colors resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={isPending || rating === 0}
        className="bg-[oklch(0.35_0.12_310)] text-[oklch(0.97_0.01_60)] px-8 py-3 font-sans text-[0.72rem] tracking-[0.13em] uppercase hover:bg-[oklch(0.28_0.10_310)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isPending ? "Submitting…" : "Submit review"}
      </button>
    </form>
  );
}
