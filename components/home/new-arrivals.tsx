import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { products } from "@/lib/data/products";
import { ProductCard } from "@/components/product/product-card";
import { Img } from "@/components/ui/img";
import { Reveal } from "@/components/motion/reveal";

export function NewArrivals() {
  const sorted = [...products]
    .filter((p) => p.status === "active")
    .sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
  const [feature, ...rest] = sorted;
  const small = rest.slice(0, 3);

  if (!feature) return null;

  return (
    <section className="border-y border-[var(--line)] bg-[var(--surface)] py-20 md:py-28">
      <div className="container-x">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          {/* feature */}
          <Reveal className="lg:col-span-7">
            <div className="group relative h-full overflow-hidden bg-[var(--surface-2)]">
              <div className="relative aspect-4/5 overflow-hidden sm:aspect-16/12 lg:aspect-[4/4.4]">
                <Img
                  src={feature.images[0]?.src ?? ""}
                  alt={feature.images[0]?.alt ?? feature.name}
                  width={1200}
                  height={1400}
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-7 pt-24 md:p-9 md:pt-28">
                  <p className="eyebrow text-white/65">Just landed</p>
                  <h3 className="mt-3 text-[clamp(1.75rem,3.2vw,2.75rem)] font-medium leading-[1.02] tracking-[-0.03em] text-white">
                    {feature.name}
                  </h3>
                  <p className="mt-3 max-w-md text-[14.5px] leading-relaxed text-white/75">
                    {feature.shortDescription}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-4">
                    <Link
                      href={`/product/${feature.slug}`}
                      className="group/btn inline-flex h-12 items-center gap-3 bg-[var(--accent)] px-7 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--on-accent)] transition-colors hover:bg-[var(--accent-hover)]"
                    >
                      Shop the piece
                      <ArrowRight
                        size={14}
                        className="transition-transform duration-300 group-hover/btn:translate-x-1"
                      />
                    </Link>
                    <span className="text-[14px] tabular-nums text-white/80">
                      ₹{feature.price.toLocaleString("en-IN")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* right column */}
          <div className="flex flex-col lg:col-span-5">
            <Reveal>
              <p className="eyebrow flex items-center gap-3 text-[var(--accent)]">
                <span className="h-px w-8 bg-[var(--accent)]" />
                New arrivals
              </p>
              <h2 className="h2 mt-4 text-[var(--ink)]">Designed for the season ahead.</h2>
              <p className="mt-4 max-w-md text-[15.5px] leading-relaxed text-[var(--ink-3)]">
                New fabrications, sharpened proportions and three colours we have been waiting
                all year to release.
              </p>
              <Link
                href="/collections/new-arrivals"
                className="group mt-6 inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--ink)]"
              >
                View all new in
                <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line-strong)] transition-colors duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--on-accent)]">
                  <ArrowRight size={14} />
                </span>
              </Link>
            </Reveal>

            <div className="mt-10 grid grid-cols-3 gap-4 lg:mt-auto lg:gap-5">
              {small.map((p, i) => (
                <Reveal key={p.id} delay={0.08 * i} y={26}>
                  <ProductCard product={p} showRating={false} />
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
