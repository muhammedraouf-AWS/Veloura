import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your Veloura account to manage orders, wishlist, and profile.",
};

type Props = {
  searchParams: Promise<{ from?: string }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const { from } = await searchParams;
  const redirectTo = from && from.startsWith("/") ? from : "/account/profile";

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
            &ldquo;Scent is the one memory you leave behind.&rdquo;
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
          <div className="mb-8">
            <h1 className="font-heading text-[oklch(0.18_0.04_280)] text-4xl mb-2">
              Welcome back
            </h1>
            <p className="text-sm text-[oklch(0.45_0.04_280/0.6)] font-sans">
              Sign in to your Veloura account
            </p>
          </div>

          <LoginForm redirectTo={redirectTo} />
        </div>
      </div>

    </div>
  );
}
