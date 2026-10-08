import type { Metadata } from "next";
import { WishlistView } from "@/components/account/wishlist-view";
import { Breadcrumb } from "@/components/shared/breadcrumb";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Everything you have saved — check stock, price drops and add straight to your bag.",
  alternates: { canonical: "/wishlist" },
};

export default function WishlistPage() {
  return (
    <div className="container-x pb-24 pt-10 md:pt-14">
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Wishlist" }]} />
      <div className="mt-7">
        <WishlistView />
      </div>
    </div>
  );
}
