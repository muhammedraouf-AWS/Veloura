import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Package } from "lucide-react";
import { getAuthToken } from "@/lib/utils/auth";
import { getCurrentUser } from "@/lib/api/user.api";
import { getUserOrders } from "@/lib/api/order.api";
import type { OrderStatus, PaymentStatus } from "@/types";

export const metadata: Metadata = {
  title: "My Orders",
  description: "View your Veloura order history and track current orders.",
  robots: { index: false, follow: false },
};

export default async function OrdersPage() {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  const user = await getCurrentUser(token);
  if (!user) redirect("/login");

  const orders = await getUserOrders(token);

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 pb-8 border-b border-[oklch(0.18_0.04_280/0.1)]">
        <p className="text-[0.68rem] tracking-[0.2em] uppercase text-[oklch(0.45_0.04_280/0.5)] font-sans mb-1">
          Account
        </p>
        <h1 className="font-heading text-[oklch(0.18_0.04_280)] text-3xl">
          My Orders
        </h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center py-20 text-center">
          <Package className="h-12 w-12 text-[oklch(0.45_0.04_280/0.12)] mb-5" />
          <h2 className="font-heading text-[oklch(0.18_0.04_280)] text-2xl mb-2">
            No orders yet
          </h2>
          <p className="text-sm text-[oklch(0.45_0.04_280/0.55)] font-sans mb-8 max-w-[28ch]">
            Once you place an order it will appear here.
          </p>
          <Link
            href="/products"
            className="bg-[oklch(0.35_0.12_310)] text-[oklch(0.97_0.01_60)] px-8 py-3 font-sans text-[0.72rem] tracking-[0.13em] uppercase hover:bg-[oklch(0.28_0.10_310)] transition-colors"
          >
            Shop fragrances
          </Link>
        </div>
      ) : (
        <ul className="divide-y divide-[oklch(0.18_0.04_280/0.07)]">
          {orders.map((order) => {
            const date = order.createdAt
              ? new Date(order.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : null;
            const itemCount = order.items?.length ?? 0;

            return (
              <li key={order.id}>
                <Link
                  href={`/account/orders/${order.orderNumber}`}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 group"
                >
                  {/* Left */}
                  <div className="space-y-1">
                    <p className="font-heading text-[oklch(0.18_0.04_280)] text-lg group-hover:text-[oklch(0.35_0.12_310)] transition-colors">
                      {order.orderNumber}
                    </p>
                    <div className="flex items-center gap-3 text-[0.68rem] font-sans text-[oklch(0.45_0.04_280/0.55)] tracking-wide">
                      {date && <span>{date}</span>}
                      {itemCount > 0 && (
                        <>
                          <span>·</span>
                          <span>{itemCount} {itemCount === 1 ? "item" : "items"}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-4 shrink-0">
                    <StatusBadge status={order.status} />
                    <span className="font-heading text-[oklch(0.18_0.04_280)] text-lg">
                      ${order.total.toFixed(2)}
                    </span>
                    <span className="text-[0.68rem] tracking-[0.12em] uppercase font-sans text-[oklch(0.45_0.04_280/0.4)] group-hover:text-[oklch(0.35_0.12_310)] transition-colors hidden sm:block">
                      View →
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

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
    <span className={`px-2.5 py-1 text-[0.62rem] tracking-[0.12em] uppercase font-sans ${styles[status]}`}>
      {status}
    </span>
  );
}
