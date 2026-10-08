import type { Metadata } from "next";
import { CartView } from "@/components/cart/cart-view";
import { Breadcrumb } from "@/components/shared/breadcrumb";

export const metadata: Metadata = {
  title: "Shopping bag",
  description: "Review the pieces in your bag, apply a promo code and check out securely.",
  alternates: { canonical: "/cart" },
};

export default function CartPage() {
  return (
    <div className="container-x pb-24 pt-10 md:pt-14">
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Shopping bag" },
        ]}
      />
      <h1 className="h1 mt-6 border-b border-[var(--line)] pb-8 text-[var(--ink)]">
        Shopping bag
      </h1>
      <div className="mt-9">
        <CartView />
      </div>
    </div>
  );
}
