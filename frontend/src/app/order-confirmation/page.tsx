import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Order Confirmed | Veloura",
};

type Props = {
  searchParams: Promise<{ number?: string }>;
};

export default async function OrderConfirmationPage({ searchParams }: Props) {
  const { number } = await searchParams;

  return (
    <div className="bg-[oklch(0.97_0.01_60)] min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center py-20">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-[oklch(0.45_0.15_155)]" strokeWidth={1.5} />
        </div>

        {/* Heading */}
        <p className="text-[0.68rem] tracking-[0.25em] uppercase text-[oklch(0.45_0.04_280/0.5)] font-sans mb-3">
          Order confirmed
        </p>
        <h1 className="font-heading text-[oklch(0.18_0.04_280)] text-4xl mb-4">
          Thank you!
        </h1>

        {/* Order number */}
        {number && (
          <div className="inline-block border border-[oklch(0.18_0.04_280/0.12)] px-6 py-3 mb-6">
            <p className="text-[0.62rem] tracking-[0.2em] uppercase text-[oklch(0.45_0.04_280/0.5)] font-sans mb-1">
              Order number
            </p>
            <p className="font-heading text-[oklch(0.35_0.12_310)] text-xl tracking-wider">
              {number}
            </p>
          </div>
        )}

        {/* Description */}
        <p className="text-sm text-[oklch(0.45_0.04_280/0.65)] font-sans leading-relaxed mb-10 max-w-[36ch] mx-auto">
          Your order has been received. Our team will prepare your fragrances
          and our courier will contact you to arrange delivery.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/account/orders"
            className="bg-[oklch(0.35_0.12_310)] text-[oklch(0.97_0.01_60)] px-8 py-3.5 font-sans text-[0.72rem] tracking-[0.13em] uppercase hover:bg-[oklch(0.28_0.10_310)] transition-colors"
          >
            View my orders
          </Link>
          <Link
            href="/products"
            className="border border-[oklch(0.18_0.04_280/0.2)] text-[oklch(0.45_0.04_280/0.7)] px-8 py-3.5 font-sans text-[0.72rem] tracking-[0.13em] uppercase hover:border-[oklch(0.18_0.04_280/0.4)] hover:text-[oklch(0.18_0.04_280)] transition-colors"
          >
            Continue shopping
          </Link>
        </div>

      </div>
    </div>
  );
}
