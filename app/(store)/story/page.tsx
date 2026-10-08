import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Recycle, Scissors, Store, Sprout } from "lucide-react";
import { Breadcrumb } from "@/components/shared/breadcrumb";
import { Reveal } from "@/components/motion/reveal";
import { Img } from "@/components/ui/img";
import { Section } from "@/components/shared/section";
import { SITE } from "@/lib/tokens";

export const metadata: Metadata = {
  title: "Our story",
  description:
    "ATELIER NOIR began in a Bengaluru studio in 2019. How we choose fabric, pay our makers and repair what you already own.",
  alternates: { canonical: "/story" },
};

const chapters = [
  {
    id: "make",
    icon: Scissors,
    title: "How we make it",
    body: "Small runs, no speculative stock. Every pattern is sampled at least four times, worn for two weeks by someone on the team, and only then cut. We work with three family-run units in Bengaluru and Tiruppur that pay above award wages and hold weekly quality reviews.",
    stat: ["4", "samples before production"],
  },
  {
    id: "fabric",
    icon: Sprout,
    title: "The fabric library",
    body: "We buy from mills we have visited: 19.5-micron merino from Biella, organic oxford from Coimbatore, selvedge denim from Okayama, European flax for linen. If a fabric cannot survive fifty washes, it does not enter the library.",
    stat: ["42", "mills across 9 countries"],
  },
  {
    id: "repair",
    icon: Recycle,
    title: "Repair, don’t replace",
    body: "Send anything back with a busted seam, a lost button or a worn cuff and we will fix it free, forever. Last year we repaired 1,860 pieces — roughly 11 tonnes of clothing kept out of landfill.",
    stat: ["1,860", "free repairs last year"],
  },
  {
    id: "stores",
    icon: Store,
    title: "Where to find us",
    body: "One store, done properly. Our Indiranagar studio carries the full collection, a made-to-measure corner and a coffee cart on the terrace. Everything else lives online — with free shipping over ₹999 and 30-day returns.",
    stat: ["1", "studio store in Bengaluru"],
  },
];

export default function StoryPage() {
  return (
    <>
      {/* hero */}
      <section className="relative isolate -mt-[var(--header-h)] flex min-h-[70svh] items-end overflow-hidden bg-[#141210]">
        <div className="absolute inset-0 -z-10">
          <Img
            src="/img/story-hero.jpg"
            alt="Rails of finished garments in the ATELIER NOIR studio"
            width={2000}
            height={1150}
            sizes="100vw"
            preload
            className="h-full w-full"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/35" />
        </div>

        <div className="container-x pb-16 pt-40">
          <Reveal>
            <p className="eyebrow flex items-center gap-3 text-white/70">
              <span className="h-px w-8 bg-[var(--accent)]" />
              Since 2019
            </p>
            <h1 className="display-lg mt-6 max-w-3xl text-white">BUILT WITH INTENTION.</h1>
            <p className="mt-6 max-w-xl text-[16.5px] leading-relaxed text-white/75">
              We started with one heavyweight tee and a stubborn belief that everyday things
              should be made properly. Six years later that stubbornness is the whole business.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="container-x pt-8">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Our story" }]} />
      </div>

      {/* intro */}
      <Section size="md">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow text-[var(--accent)]">The short version</p>
            <h2 className="h1 mt-5 text-[var(--ink)]">
              Fewer things,
              <br />
              made better.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-[17px] leading-relaxed text-[var(--ink-2)]">
              ATELIER NOIR exists because we were tired of buying the same item every eighteen
              months. So we build a permanent collection instead of chasing seasons: natural
              fibres, honest construction, and a palette that never fights itself.
            </p>
            <p className="mt-4 text-[15.5px] leading-relaxed text-[var(--ink-3)]">
              Nothing here is drop-shipped. Every piece is cut, sewn and checked within 400
              kilometres of our studio, then shipped in compostable packaging with a hand-written
              card — because the last impression matters as much as the first.
            </p>
            <Link
              href="/shop"
              className="group mt-8 inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[var(--ink)]"
            >
              Shop the collection
              <span className="grid h-9 w-9 place-items-center rounded-full border border-[var(--line-strong)] transition-colors duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--on-accent)]">
                <ArrowRight size={15} />
              </span>
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* chapters */}
      <Section size="md" className="bg-[var(--surface)]">
        <div className="grid gap-4 md:grid-cols-2">
          {chapters.map((chapter, i) => (
            <Reveal key={chapter.id} delay={i * 0.06} y={26}>
              <article
                id={chapter.id}
                className="flex h-full flex-col border border-[var(--line)] bg-[var(--bg)] p-7 scroll-mt-32"
              >
                <span className="grid h-10 w-10 place-items-center rounded-[3px] bg-[var(--surface-2)] text-[var(--accent)]">
                  <chapter.icon size={18} strokeWidth={1.6} />
                </span>
                <h3 className="h3 mt-5 text-[var(--ink)]">{chapter.title}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-[var(--ink-3)]">
                  {chapter.body}
                </p>
                <p className="mt-6 flex items-baseline gap-3 border-t border-[var(--line)] pt-5">
                  <span className="text-[34px] font-medium leading-none tracking-[-0.03em] text-[var(--ink)]">
                    {chapter.stat[0]}
                  </span>
                  <span className="text-[13.5px] text-[var(--ink-3)]">{chapter.stat[1]}</span>
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* quote */}
      <Section>
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-[var(--accent)]">Why we do it</p>
          <blockquote className="display-lg mt-6 text-[var(--ink)]">
            “If it cannot be worn for a decade, we are not done designing it.”
          </blockquote>
          <p className="mt-6 text-[14.5px] text-[var(--ink-3)]">
            Nisha Kulkarni · Founder &amp; design director
          </p>
        </Reveal>
      </Section>

      {/* CTA */}
      <section className="border-t border-[var(--line)] bg-[var(--surface)] py-16">
        <div className="container-x flex flex-wrap items-center justify-between gap-6">
          <div>
            <h2 className="h2">Come see it in person</h2>
            <p className="mt-3 max-w-xl text-[15.5px] text-[var(--ink-3)]">
              {SITE.address}. Open Monday to Saturday, 10:00–19:00 IST.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="inline-flex h-12 items-center rounded-[2px] bg-[var(--accent)] px-7 text-[11.5px] font-medium uppercase tracking-[0.16em] text-[var(--on-accent)] transition-colors hover:bg-[var(--accent-hover)]"
            >
              Shop now
            </Link>
            <Link
              href="/help"
              className="inline-flex h-12 items-center rounded-[2px] border border-[var(--line-strong)] px-7 text-[11.5px] font-medium uppercase tracking-[0.16em] text-[var(--ink)] transition-colors hover:border-[var(--ink)]"
            >
              Contact us
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
