import type { Metadata } from "next";
import Link from "next/link";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = {
  title: "Reset Password",
  description: "Set a new password for your Veloura account.",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ code?: string }>;
};

export default async function ResetPasswordPage({ searchParams }: Props) {
  const { code } = await searchParams;

  return (
    <div className="flex min-h-screen">

      {/* Brand panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-[45%] flex-col justify-between bg-[oklch(0.35_0.12_310)] p-12">
        <Link
          href="/"
          className="font-heading text-[oklch(0.97_0.01_60)] text-2xl tracking-[0.12em] uppercase"
        >
          Veloura
        </Link>
        <blockquote className="space-y-4">
          <p className="font-heading text-[clamp(1.8rem,3vw,2.8rem)] text-[oklch(0.97_0.01_60)] leading-[1.15] italic">
            &ldquo;Rediscover what was always yours.&rdquo;
          </p>
          <footer className="text-[0.68rem] tracking-[0.2em] uppercase text-[oklch(0.97_0.01_60/0.45)]">
            Veloura Atelier
          </footer>
        </blockquote>
        <p className="text-[0.68rem] tracking-[0.15em] uppercase text-[oklch(0.97_0.01_60/0.3)]">
          Fine Fragrances
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col justify-center px-6 py-16 sm:px-12 lg:px-16 xl:px-24">

        {/* Mobile wordmark */}
        <Link
          href="/"
          className="mb-12 font-heading text-[oklch(0.18_0.04_280)] text-xl tracking-[0.12em] uppercase lg:hidden"
        >
          Veloura
        </Link>

        <div className="w-full max-w-sm">
          {!code ? (
            <div className="space-y-4">
              <h1 className="font-heading text-[oklch(0.18_0.04_280)] text-4xl mb-2">
                Invalid link
              </h1>
              <p className="text-sm text-[oklch(0.45_0.04_280/0.6)] font-sans">
                This password reset link is invalid or has expired.
              </p>
              <Link
                href="/forgot-password"
                className="inline-block mt-4 bg-[oklch(0.35_0.12_310)] text-[oklch(0.97_0.01_60)] px-6 py-3.5 text-[0.73rem] tracking-[0.13em] uppercase font-sans hover:bg-[oklch(0.28_0.10_310)] transition-colors"
              >
                Request a new link
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="font-heading text-[oklch(0.18_0.04_280)] text-4xl mb-2">
                  New password
                </h1>
                <p className="text-sm text-[oklch(0.45_0.04_280/0.6)] font-sans">
                  Choose a strong password for your account.
                </p>
              </div>
              <ResetPasswordForm code={code} />
            </>
          )}
        </div>
      </div>

    </div>
  );
}
