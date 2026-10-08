import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Request a link to reset your ATELIER NOIR account password.",
  alternates: { canonical: "/auth/forgot-password" },
  robots: { index: false },
};

export default function ForgotPasswordPage() {
  return <AuthForm mode="forgot" />;
}
