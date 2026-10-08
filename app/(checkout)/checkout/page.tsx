import type { Metadata } from "next";
import { CheckoutView } from "@/components/checkout/checkout-view";

export const metadata: Metadata = {
  title: "Secure checkout",
  description: "Complete your ATELIER NOIR order — encrypted payment, free returns for 30 days.",
  alternates: { canonical: "/checkout" },
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="container-x pb-20 pt-8 md:pt-12">
      <h1 className="sr-only">Checkout</h1>
      <CheckoutView />
    </div>
  );
}
