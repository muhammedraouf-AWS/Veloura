"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, Heart, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { logoutAction } from "@/lib/actions/auth.actions";

const NAV = [
  { href: "/account/profile",  label: "Profile",  icon: User    },
  { href: "/account/orders",   label: "Orders",   icon: Package },
  { href: "/account/wishlist", label: "Wishlist", icon: Heart   },
] as const;

export function AccountSidebar() {
  const pathname = usePathname();

  return (
    <aside>
      <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col lg:overflow-visible">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 text-sm font-sans transition-colors whitespace-nowrap rounded-none",
              pathname === href
                ? "bg-[oklch(0.35_0.12_310/0.08)] text-[oklch(0.35_0.12_310)] border-b-2 lg:border-b-0 lg:border-l-2 border-[oklch(0.35_0.12_310)]"
                : "text-[oklch(0.45_0.04_280/0.7)] hover:text-[oklch(0.18_0.04_280)] hover:bg-[oklch(0.18_0.04_280/0.04)]"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {label}
          </Link>
        ))}

        <form action={logoutAction} className="lg:mt-4">
          <button
            type="submit"
            className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-sans text-[oklch(0.45_0.04_280/0.55)] hover:text-[oklch(0.55_0.18_25)] hover:bg-[oklch(0.55_0.18_25/0.05)] transition-colors whitespace-nowrap"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </button>
        </form>
      </nav>
    </aside>
  );
}
