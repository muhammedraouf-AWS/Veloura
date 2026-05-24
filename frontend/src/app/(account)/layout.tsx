import type { ReactNode } from "react";
import { AccountSidebar } from "@/components/account/AccountSidebar";

export default function AccountLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[oklch(0.97_0.01_60)] min-h-screen">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 lg:py-16">

        {/* Mobile: horizontal tab nav at top; Desktop: sidebar left, content right */}
        <div className="flex flex-col lg:grid lg:grid-cols-[200px_1fr] lg:gap-12">
          <AccountSidebar />
          <main className="mt-8 lg:mt-0">{children}</main>
        </div>

      </div>
    </div>
  );
}
