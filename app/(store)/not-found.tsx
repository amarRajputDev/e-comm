import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { products } from "@/lib/data/products";

export default function NotFound() {
  return (
    <div className="container-x pb-24 pt-14">
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.1fr]">
        <div>
          <p className="eyebrow flex items-center gap-3 text-[var(--accent)]">
            <span className="h-px w-8 bg-[var(--accent)]" />
            Error 404
          </p>
          <h1 className="display-lg mt-6 text-[var(--ink)]">
            Looks like this page wandered off.
          </h1>
          <p className="mt-6 max-w-md text-[16px] leading-relaxed text-[var(--ink-3)]">
            The link may be old, or the piece you were looking for sold out and left the
            collection. Either way, here is where to go next.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex h-[52px] items-center gap-3 rounded-[2px] bg-[var(--accent)] px-8 text-[11.5px] font-medium uppercase tracking-[0.16em] text-[var(--on-accent)] transition-colors hover:bg-[var(--accent-hover)]"
            >
              Back to shop
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/"
              className="inline-flex h-[52px] items-center gap-3 rounded-[2px] border border-[var(--line-strong)] px-8 text-[11.5px] font-medium uppercase tracking-[0.16em] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
            >
              <Compass size={15} /> Home
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 border-t border-[var(--line)] pt-6 text-[13.5px] text-[var(--ink-3)]">
            <Link href="/collections/new-arrivals" className="hover:text-[var(--accent)]">
              New arrivals
            </Link>
            <Link href="/collections/best-sellers" className="hover:text-[var(--accent)]">
              Best sellers
            </Link>
            <Link href="/help" className="hover:text-[var(--accent)]">
              Help centre
            </Link>
            <Link href="/account/orders" className="hover:text-[var(--accent)]">
              Track an order
            </Link>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-5 text-[var(--ink-3)]">While you are here</p>
          <ProductGrid products={products.slice(0, 4)} columns={2} priorityCount={2} />
        </div>
      </div>
    </div>
  );
}
