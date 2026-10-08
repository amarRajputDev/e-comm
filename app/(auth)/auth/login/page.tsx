import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your ATELIER NOIR account to track orders and save your details.",
  alternates: { canonical: "/auth/login" },
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
