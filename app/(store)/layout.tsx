import { SiteHeader } from "@/components/layout/header";
import { SiteFooter } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { SearchPanel } from "@/components/search/search-panel";

export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main id="main" className="flex-1 pt-[var(--header-h)]">
        {children}
      </main>
      <SiteFooter />
      <CartDrawer />
      <SearchPanel />
    </div>
  );
}
