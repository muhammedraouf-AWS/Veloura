import type { Metadata } from "next";
import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getAuthToken } from "@/lib/utils/auth";
import { getCurrentUser } from "@/lib/api/user.api";
import { getOrderByNumber } from "@/lib/api/order.api";
import type { OrderStatus, PaymentStatus, ProductSnapshot } from "@/types";

type Props = {
  params: Promise<{ orderNumber: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { orderNumber } = await params;
  return {
    title: `Order ${orderNumber}`,
    description: `Details for Veloura order ${orderNumber}.`,
    robots: { index: false, follow: false },
  };
}

export default async function OrderDetailPage({ params }: Props) {
  const { orderNumber } = await params;

  const token = await getAuthToken();
  if (!token) redirect("/login");

  const user = await getCurrentUser(token);
  if (!user) redirect("/login");

  const order = await getOrderByNumber(token, orderNumber);
  if (!order) notFound();

  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  const shipping = (order.shippingAddress as Record<string, string> | null) ?? null;

  return (
    <div>
      {/* Back link */}
      <Link
        href="/account/orders"
        className="inline-flex items-center gap-2 text-[0.68rem] tracking-[0.15em] uppercase text-[oklch(0.45_0.04_280/0.55)] font-sans hover:text-[oklch(0.35_0.12_310)] transition-colors mb-8"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        All orders
      </Link>

      {/* Header */}
      <div className="pb-8 border-b border-[oklch(0.18_0.04_280/0.1)] mb-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[0.68rem] tracking-[0.2em] uppercase text-[oklch(0.45_0.04_280/0.5)] font-sans mb-1">
              Order
            </p>
            <h1 className="font-heading text-[oklch(0.18_0.04_280)] text-3xl mb-2">
              {order.orderNumber}
            </h1>
            {date && (
              <p className="text-xs font-sans text-[oklch(0.45_0.04_280/0.55)]">
                Placed on {date}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <StatusBadge status={order.status} />
            <PaymentBadge status={order.paymentStatus} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-10">

        {/* ── Items ── */}
        <div>
          <h2 className="font-heading text-[oklch(0.18_0.04_280)] text-xl mb-5">
            Items
          </h2>
          <ul className="divide-y divide-[oklch(0.18_0.04_280/0.07)]">
            {(order.items ?? []).map((item) => {
              const snap = item.productSnapshot as ProductSnapshot | null;
              return (
                <li key={item.id} className="flex items-start justify-between gap-4 py-4">
                  <div className="min-w-0">
                    {snap ? (
                      <>
                        <Link
                          href={`/products/${snap.slug}`}
                          className="font-heading text-[oklch(0.18_0.04_280)] text-base hover:text-[oklch(0.35_0.12_310)] transition-colors"
                        >
                          {snap.title}
                        </Link>
                        {snap.variant && (
                          <p className="text-[0.62rem] tracking-[0.1em] uppercase text-[oklch(0.45_0.04_280/0.5)] font-sans mt-0.5">
                            {snap.variant}
                          </p>
                        )}
                      </>
                    ) : (
                      <span className="font-heading text-[oklch(0.18_0.04_280)] text-base">
                        Item #{item.id}
                      </span>
                    )}
                    <p className="text-xs font-sans text-[oklch(0.45_0.04_280/0.55)] mt-1">
                      Qty: {item.quantity} × ${item.unitPrice.toFixed(2)}
                    </p>
                  </div>
                  <span className="font-heading text-[oklch(0.18_0.04_280)] text-base shrink-0">
                    ${item.totalPrice.toFixed(2)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* ── Sidebar ── */}
        <aside className="space-y-6">

          {/* Order summary */}
          <div className="border border-[oklch(0.18_0.04_280/0.1)] p-5">
            <h2 className="font-heading text-[oklch(0.18_0.04_280)] text-lg mb-4">
              Summary
            </h2>
            <div className="space-y-2 text-sm font-sans">
              <div className="flex justify-between text-[oklch(0.45_0.04_280/0.7)]">
                <span>Subtotal</span>
                <span className="text-[oklch(0.18_0.04_280)]">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-[oklch(0.45_0.04_280/0.7)]">
                <span>Shipping</span>
                <span className={order.shipping === 0 ? "text-[oklch(0.45_0.15_155)]" : "text-[oklch(0.18_0.04_280)]"}>
                  {order.shipping === 0 ? "Free" : `$${order.shipping.toFixed(2)}`}
                </span>
              </div>
              {order.tax > 0 && (
                <div className="flex justify-between text-[oklch(0.45_0.04_280/0.7)]">
                  <span>Tax</span>
                  <span className="text-[oklch(0.18_0.04_280)]">${order.tax.toFixed(2)}</span>
                </div>
              )}
              {(() => {
                const discount = parseFloat(
                  (order.subtotal + order.shipping + order.tax - order.total).toFixed(2)
                );
                return discount > 0 ? (
                  <div className="flex justify-between text-sm font-sans">
                    <span className="text-[oklch(0.40_0.12_155)]">Coupon discount</span>
                    <span className="text-[oklch(0.40_0.12_155)]">−${discount.toFixed(2)}</span>
                  </div>
                ) : null;
              })()}
              <div className="flex justify-between pt-3 border-t border-[oklch(0.18_0.04_280/0.08)] font-medium">
                <span className="text-[oklch(0.18_0.04_280)]">Total</span>
                <span className="font-heading text-[oklch(0.18_0.04_280)] text-xl">
                  ${order.total.toFixed(2)}
                </span>
              </div>
            </div>
            <p className="text-[0.62rem] font-sans text-[oklch(0.45_0.04_280/0.45)] mt-3 uppercase tracking-wide">
              {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
            </p>
          </div>

          {/* Shipping address */}
          {shipping && (
            <div className="border border-[oklch(0.18_0.04_280/0.1)] p-5">
              <h2 className="font-heading text-[oklch(0.18_0.04_280)] text-lg mb-3">
                Ship to
              </h2>
              <address className="not-italic text-sm font-sans text-[oklch(0.45_0.04_280/0.7)] space-y-0.5 leading-relaxed">
                <p className="text-[oklch(0.18_0.04_280)] font-medium">{shipping["fullName"]}</p>
                <p>{shipping["addressLine1"]}</p>
                {shipping["addressLine2"] && <p>{shipping["addressLine2"]}</p>}
                <p>{shipping["city"]}, {shipping["state"]} {shipping["postalCode"]}</p>
                <p>{shipping["country"]}</p>
                {shipping["phone"] && <p className="pt-1">{shipping["phone"]}</p>}
              </address>
            </div>
          )}

        </aside>
      </div>
    </div>
  );
}

// ── Badges ────────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: OrderStatus }) {
  const styles: Record<OrderStatus, string> = {
    pending:   "bg-[oklch(0.85_0.08_80/0.3)]  text-[oklch(0.45_0.12_80)]",
    confirmed: "bg-[oklch(0.85_0.06_250/0.3)] text-[oklch(0.40_0.10_250)]",
    shipped:   "bg-[oklch(0.85_0.08_310/0.3)] text-[oklch(0.35_0.12_310)]",
    delivered: "bg-[oklch(0.85_0.08_155/0.3)] text-[oklch(0.40_0.12_155)]",
    cancelled: "bg-[oklch(0.85_0.08_25/0.3)]  text-[oklch(0.50_0.15_25)]",
    refunded:  "bg-[oklch(0.88_0.01_280/0.3)] text-[oklch(0.45_0.04_280/0.6)]",
  };
  return (
    <span className={`px-3 py-1.5 text-[0.62rem] tracking-[0.12em] uppercase font-sans ${styles[status]}`}>
      {status}
    </span>
  );
}

function PaymentBadge({ status }: { status: PaymentStatus }) {
  const styles: Record<PaymentStatus, string> = {
    unpaid:   "bg-[oklch(0.85_0.08_80/0.3)]  text-[oklch(0.45_0.12_80)]",
    paid:     "bg-[oklch(0.85_0.08_155/0.3)] text-[oklch(0.40_0.12_155)]",
    failed:   "bg-[oklch(0.85_0.08_25/0.3)]  text-[oklch(0.50_0.15_25)]",
    refunded: "bg-[oklch(0.88_0.01_280/0.3)] text-[oklch(0.45_0.04_280/0.6)]",
  };
  return (
    <span className={`px-3 py-1.5 text-[0.62rem] tracking-[0.12em] uppercase font-sans ${styles[status]}`}>
      {status}
    </span>
  );
}
