import { connection } from "next/server";
import { AdminShell } from "@/components/admin/admin-shell";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { default: "Admin", template: "%s · Admin — ATELIER NOIR" },
  description: "ATELIER NOIR administration console.",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  // Admin data is live and per-session — never statically prerendered.
  await connection();
  return <AdminShell>{children}</AdminShell>;
}
