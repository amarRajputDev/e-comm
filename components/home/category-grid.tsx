import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { categories } from "@/lib/data/categories";
import { products } from "@/lib/data/products";
import { Reveal } from "@/components/motion/reveal";
import { Img } from "@/components/ui/img";
import { cn } from "@/lib/utils";

const spans = [
  "lg:col-span-5 lg:h-[560px]",
  "lg:col-span-7 lg:h-[560px]",
  "lg:col-span-7 lg:h-[520px]",
  "lg:col-span-5 lg:h-[520px]",
];

export function CategoryGrid() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
          <div>
            <p className="eyebrow mb-4 flex items-center gap-3 text-[var(--accent)]">
              <span className="h-px w-8 bg-[var(--accent)]" />
              Shop by category
            </p>
            <h2 className="h2 max-w-xl">
              Four ways into <br className="hidden sm:block" />
              the collection.
            </h2>
          </div>
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--ink)]"
          >
            View all products
            <span className="grid h-8 w-8 place-items-center rounded-full border border-[var(--line-strong)] transition-colors duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--on-accent)]">
              <ArrowUpRight size={14} />
            </span>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12">
          {categories.map((cat, i) => {
            const count = products.filter(
              (p) => p.category === cat.slug && p.status === "active",
            ).length;
            return (
              <Reveal
                key={cat.id}
                delay={i * 0.06}
                y={30}
                className={cn("sm:col-span-1", spans[i])}
              >
                <Link
                  href={`/shop?category=${cat.slug}`}
                  className="group relative flex h-full min-h-[340px] flex-col justify-end overflow-hidden bg-[var(--surface-2)] p-7 md:p-8"
                >
                  {/* image */}
                  <div className="absolute inset-0">
                    <Img
                      src={cat.image.src}
                      alt={cat.image.alt}
                      width={1200}
                      height={1500}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 40vw"
                      className="h-full w-full transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-500 group-hover:from-black/85" />
                  </div>

                  {/* content */}
                  <div className="relative translate-y-1 transition-transform duration-500 ease-out group-hover:translate-y-0">
                    <p className="eyebrow text-white/60">
                      {count} {count === 1 ? "piece" : "pieces"}
                    </p>
                    <div className="mt-3 flex items-center gap-4">
                      <h3 className="text-[clamp(1.75rem,3vw,2.5rem)] font-medium leading-none tracking-[-0.03em] text-white">
                        {cat.name}
                      </h3>
                      <span className="grid h-9 w-9 shrink-0 translate-x-2 place-items-center rounded-full bg-[var(--accent)] text-[var(--on-accent)] opacity-0 transition-all duration-500 ease-out group-hover:translate-x-0 group-hover:opacity-100">
                        <ArrowUpRight size={16} />
                      </span>
                    </div>
                    <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-white/70 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      {cat.tagline}
                    </p>
                  </div>
                </Link>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
