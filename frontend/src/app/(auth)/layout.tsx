import type { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[oklch(0.97_0.01_60)]">{children}</div>
  );
}
