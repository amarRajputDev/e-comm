import type { Metadata } from "next";
import { connection } from "next/server";
import { AccountShell } from "@/components/account/account-shell";

export const metadata: Metadata = {
  title: "My account",
  description: "Manage your orders, wishlist, addresses and preferences.",
  alternates: { canonical: "/account" },
};

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  // Account data is per-session — rendered on each request.
  await connection();
  return (
    <div className="container-x pb-24 pt-10 md:pt-14">
      <AccountShell>{children}</AccountShell>
    </div>
  );
}
