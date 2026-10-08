import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Create account",
  description:
    "Join ATELIER NOIR for early access to drops, order tracking and a ₹250 welcome credit.",
  alternates: { canonical: "/auth/register" },
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
