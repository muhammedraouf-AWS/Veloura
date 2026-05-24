'use client';

import { useEffect } from 'react';

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ProductsError({ error, reset }: Props) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-[oklch(0.97_0.01_60)] min-h-screen flex items-center justify-center">
      <div className="text-center px-6 max-w-md">
        <p className="text-[10px] tracking-[0.25em] uppercase text-[oklch(0.45_0.08_310/0.6)] font-sans mb-4">
          Something went wrong
        </p>
        <h2 className="font-heading text-[oklch(0.18_0.04_280)] text-3xl mb-4">
          Could not load fragrances
        </h2>
        <p className="text-[oklch(0.45_0.04_280/0.6)] font-sans text-sm mb-8">
          We had trouble connecting to our catalogue. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-8 py-3 bg-[oklch(0.35_0.12_310)] text-[oklch(0.97_0.01_60)] font-sans text-sm tracking-[0.1em] uppercase hover:bg-[oklch(0.28_0.10_310)] transition-colors"
        >
          Try again
        </button>
        {error.digest && (
          <p className="mt-4 text-[oklch(0.45_0.04_280/0.35)] font-sans text-xs">
            ref: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
