import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Img } from "@/components/ui/img";

const stats = [
  { k: "Fabrics", v: "42 mills, 9 countries" },
  { k: "Repairs", v: "1,860 completed free" },
  { k: "Returns", v: "30 days, no questions" },
];

export function BrandStory() {
  return (
    <section className="py-20 md:py-28">
      <div className="container-x">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal y={40}>
            <div className="relative">
              <div className="aspect-4/5 overflow-hidden bg-[var(--surface-2)]">
                <Img
                  src="/img/story.jpg"
                  alt="Flat lay of knitwear, denim and accessories from the ATELIER NOIR studio"
                  width={1200}
                  height={1500}
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="h-full w-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-4 hidden w-56 bg-[var(--surface)] p-6 shadow-[var(--shadow-lift)] sm:block lg:-right-10">
                <p className="eyebrow text-[var(--accent)]">Since 2019</p>
                <p className="mt-3 text-[32px] font-medium leading-none tracking-[-0.03em] text-[var(--ink)]">
                  128k
                </p>
                <p className="mt-2 text-[13px] leading-snug text-[var(--ink-3)]">
                  pieces worn every week and counting
                </p>
              </div>
            </div>
          </Reveal>

          <div>
            <Reveal delay={0.08}>
              <p className="eyebrow flex items-center gap-3 text-[var(--accent)]">
                <span className="h-px w-8 bg-[var(--accent)]" />
                Our story
              </p>
              <h2 className="h1 mt-5 text-[var(--ink)]">BUILT WITH INTENTION.</h2>
              <p className="mt-6 text-[17px] leading-relaxed text-[var(--ink-2)]">
                We believe everyday products should feel anything but ordinary. So we start with
                the fabric, argue about the seam allowance, and only release a piece once it has
                survived a full season of wear on real people.
              </p>
              <p className="mt-4 text-[15.5px] leading-relaxed text-[var(--ink-3)]">
                Everything is cut in small runs from mills we have visited, sewn by teams we pay
                above award wages, and backed by a free repair programme for as long as you own
                it.
              </p>
            </Reveal>

            <Reveal delay={0.16}>
              <dl className="mt-9 grid grid-cols-3 gap-6 border-y border-[var(--line)] py-6">
                {stats.map((s) => (
                  <div key={s.k}>
                    <dt className="eyebrow text-[var(--ink-3)]">{s.k}</dt>
                    <dd className="mt-2 text-[14px] leading-snug text-[var(--ink)]">{s.v}</dd>
                  </div>
                ))}
              </dl>

              <Link
                href="/story"
                className="group mt-8 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--ink)]"
              >
                Learn more
                <span className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line-strong)] transition-colors duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--on-accent)]">
                  <ArrowRight
                    size={15}
                    className="transition-transform duration-300 group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
