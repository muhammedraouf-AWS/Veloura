"use client"

import { useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, RefreshCw } from "lucide-react"

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function RootError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-cream px-8 py-24 text-center">

      <p className="mb-6 text-[0.68rem] tracking-[0.22em] uppercase text-ink-subtle">
        Something went wrong
      </p>

      <h1 className="font-heading text-[clamp(2.5rem,5vw,5rem)] leading-[0.95] text-ink mb-6 max-w-[16ch] [text-wrap:balance]">
        We lost the thread for a moment.
      </h1>

      <p className="mb-12 max-w-[38ch] text-[0.95rem] leading-[1.75] text-ink-subtle">
        An unexpected error occurred. Try again — if the problem persists,
        come back shortly.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-none border border-ink bg-ink px-7 py-3.5 text-[0.73rem] tracking-[0.13em] uppercase text-cream hover:bg-plum hover:border-plum transition-colors duration-300"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-none border border-ink/25 px-7 py-3.5 text-[0.73rem] tracking-[0.13em] uppercase text-ink hover:bg-ink hover:text-cream transition-colors duration-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </Link>
      </div>

      {error.digest && (
        <p className="mt-10 text-[0.65rem] text-ink-faint">
          Error reference: {error.digest}
        </p>
      )}

    </div>
  )
}
