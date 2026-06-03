"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/store/cart";
import { checkoutSchema, type CheckoutFormData } from "@/lib/validations/checkout";

type Props = {
  userEmail: string;
};

export function CheckoutForm({ userEmail }: Props) {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      email: userEmail,
      country: "United States",
    },
  });

  async function onSubmit(_data: CheckoutFormData) {
    setServerError(null);
    // Phase 19: placeOrderAction(_data, items) wired here
    // For now, show a placeholder message
    setServerError("Order placement coming in the next phase. Your form is valid!");
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-10">

      {/* Server error / info */}
      {serverError && (
        <p className="text-sm text-[oklch(0.55_0.18_25)] bg-[oklch(0.97_0.04_25/0.12)] border border-[oklch(0.55_0.18_25/0.2)] px-4 py-3">
          {serverError}
        </p>
      )}

      {/* ── Contact ── */}
      <section className="space-y-5">
        <SectionHeader>Contact</SectionHeader>
        <Field label="Email" error={errors.email?.message}>
          <input
            {...register("email")}
            type="email"
            autoComplete="email"
            className={inputCls(!!errors.email)}
          />
        </Field>
      </section>

      {/* ── Shipping address ── */}
      <section className="space-y-5">
        <SectionHeader>Shipping address</SectionHeader>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Full name" error={errors.fullName?.message}>
            <input
              {...register("fullName")}
              type="text"
              autoComplete="name"
              className={inputCls(!!errors.fullName)}
            />
          </Field>
          <Field label="Phone" error={errors.phone?.message}>
            <input
              {...register("phone")}
              type="tel"
              autoComplete="tel"
              className={inputCls(!!errors.phone)}
            />
          </Field>
        </div>

        <Field label="Address line 1" error={errors.addressLine1?.message}>
          <input
            {...register("addressLine1")}
            type="text"
            autoComplete="address-line1"
            placeholder="Street address"
            className={inputCls(!!errors.addressLine1)}
          />
        </Field>

        <Field
          label="Address line 2"
          error={errors.addressLine2?.message}
          optional
        >
          <input
            {...register("addressLine2")}
            type="text"
            autoComplete="address-line2"
            placeholder="Apartment, suite, etc. (optional)"
            className={inputCls(false)}
          />
        </Field>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="City" error={errors.city?.message}>
            <input
              {...register("city")}
              type="text"
              autoComplete="address-level2"
              className={inputCls(!!errors.city)}
            />
          </Field>
          <Field label="State / Region" error={errors.state?.message}>
            <input
              {...register("state")}
              type="text"
              autoComplete="address-level1"
              className={inputCls(!!errors.state)}
            />
          </Field>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <Field label="Postal code" error={errors.postalCode?.message}>
            <input
              {...register("postalCode")}
              type="text"
              autoComplete="postal-code"
              className={inputCls(!!errors.postalCode)}
            />
          </Field>
          <Field label="Country" error={errors.country?.message}>
            <input
              {...register("country")}
              type="text"
              autoComplete="country-name"
              className={inputCls(!!errors.country)}
            />
          </Field>
        </div>
      </section>

      {/* ── Payment ── */}
      <section className="space-y-5">
        <SectionHeader>Payment</SectionHeader>
        <div className="flex items-start gap-4 border border-[oklch(0.35_0.12_310/0.35)] bg-[oklch(0.35_0.12_310/0.04)] px-5 py-4">
          <span className="text-[oklch(0.35_0.12_310)] text-lg mt-0.5">✦</span>
          <div>
            <p className="font-sans text-sm font-medium text-[oklch(0.18_0.04_280)]">
              Cash on Delivery
            </p>
            <p className="font-sans text-xs text-[oklch(0.45_0.04_280/0.6)] mt-0.5 leading-relaxed">
              Pay in cash when your order arrives. Our courier will contact
              you to confirm delivery.
            </p>
          </div>
        </div>
      </section>

      {/* ── Submit ── */}
      <button
        type="submit"
        disabled={isSubmitting || items.length === 0}
        className="w-full bg-[oklch(0.35_0.12_310)] text-[oklch(0.97_0.01_60)] py-4 font-sans text-[0.73rem] tracking-[0.15em] uppercase hover:bg-[oklch(0.28_0.10_310)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? "Placing order…" : "Place order"}
      </button>

      {items.length === 0 && (
        <p className="text-center text-xs text-[oklch(0.45_0.04_280/0.5)] font-sans -mt-6">
          Your cart is empty.
        </p>
      )}
    </form>
  );
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <h2 className="font-heading text-[oklch(0.18_0.04_280)] text-xl shrink-0">
        {children}
      </h2>
      <div className="h-px flex-1 bg-[oklch(0.18_0.04_280/0.1)]" />
    </div>
  );
}

function Field({
  label,
  error,
  optional,
  children,
}: {
  label: string;
  error?: string;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-[0.68rem] tracking-[0.15em] uppercase text-[oklch(0.45_0.04_280/0.7)] font-sans">
        {label}
        {optional && (
          <span className="normal-case tracking-normal text-[oklch(0.45_0.04_280/0.4)]">
            (optional)
          </span>
        )}
      </label>
      {children}
      {error && (
        <p className="text-xs text-[oklch(0.55_0.18_25)] font-sans">{error}</p>
      )}
    </div>
  );
}

function inputCls(hasError: boolean) {
  return [
    "w-full rounded-none border bg-transparent px-4 py-3 text-sm text-[oklch(0.18_0.04_280)]",
    "placeholder:text-[oklch(0.45_0.04_280/0.3)] outline-none transition-colors",
    hasError
      ? "border-[oklch(0.55_0.18_25/0.6)] focus:border-[oklch(0.55_0.18_25)]"
      : "border-[oklch(0.18_0.04_280/0.2)] focus:border-[oklch(0.35_0.12_310)]",
  ].join(" ");
}
