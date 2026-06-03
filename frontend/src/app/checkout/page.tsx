import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getAuthToken } from "@/lib/utils/auth";
import { getCurrentUser } from "@/lib/api/user.api";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { OrderSummary } from "@/components/checkout/OrderSummary";

export const metadata: Metadata = {
  title: "Checkout | Veloura",
};

export default async function CheckoutPage() {
  const token = await getAuthToken();
  if (!token) redirect("/login?from=/checkout");

  const user = await getCurrentUser(token);
  if (!user) redirect("/login?from=/checkout");

  return (
    <div className="bg-[oklch(0.97_0.01_60)] min-h-screen">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-10">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.15em] uppercase text-[oklch(0.45_0.04_280/0.55)] font-sans hover:text-[oklch(0.35_0.12_310)] transition-colors mb-6"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to cart
          </Link>
          <h1 className="font-heading text-[oklch(0.18_0.04_280)] text-4xl">
            Checkout
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12 xl:gap-16">

          {/* ── Left: form ── */}
          <CheckoutForm userEmail={user.email} />

          {/* ── Right: order summary ── */}
          <aside className="lg:sticky lg:top-24 self-start">
            <div className="border border-[oklch(0.18_0.04_280/0.1)] p-6">
              <h2 className="font-heading text-[oklch(0.18_0.04_280)] text-xl mb-6">
                Order summary
              </h2>
              <OrderSummary />
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
