import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAuthToken } from "@/lib/utils/auth";
import { getCurrentUser } from "@/lib/api/user.api";
import { ProfileForm } from "@/components/account/ProfileForm";

export const metadata: Metadata = {
  title: "My Profile",
  description: "Manage your Veloura account details and preferences.",
  robots: { index: false, follow: false },
};

export default async function ProfilePage() {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  const user = await getCurrentUser(token);
  if (!user) redirect("/login");

  const memberSince = new Date(user.createdAt ?? "").toLocaleDateString(
    "en-US",
    { year: "numeric", month: "long" }
  );

  return (
    <div>
      {/* Page header */}
      <div className="mb-8 pb-8 border-b border-[oklch(0.18_0.04_280/0.1)]">
        <p className="text-[0.68rem] tracking-[0.2em] uppercase text-[oklch(0.45_0.04_280/0.5)] font-sans mb-1">
          Account
        </p>
        <h1 className="font-heading text-[oklch(0.18_0.04_280)] text-3xl">
          My Profile
        </h1>
        <p className="text-sm text-[oklch(0.45_0.04_280/0.55)] font-sans mt-1">
          Member since {memberSince}
        </p>
      </div>

      {/* Form */}
      <div className="max-w-md">
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
