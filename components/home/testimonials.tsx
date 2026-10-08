"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, BadgeCheck } from "lucide-react";
import { testimonials as defaultTestimonials } from "@/lib/data/reviews";
import { useCms } from "@/lib/store/cms";
import { Stars } from "@/components/ui/rating";
import { Section } from "@/components/shared/section";
import { cn } from "@/lib/utils";

export function Testimonials() {
  const { content, hydrated } = useCms();
  const testimonials = hydrated ? content.testimonials : defaultTestimonials;
  const trackRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);

  const scrollTo = (i: number) => {
    const clamped = Math.max(0, Math.min(i, testimonials.length - 1));
    setIndex(clamped);
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[clamped] as HTMLElement | undefined;
    if (card) track.scrollTo({ left: card.offsetLeft, behavior: "smooth" });
  };

  return (
    <Section size="lg" className="overflow-hidden">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6 md:mb-14">
        <div>
          <p className="eyebrow mb-4 flex items-center gap-3 text-[var(--accent)]">
            <span className="h-px w-8 bg-[var(--accent)]" />
            Rated 4.8 out of 5
          </p>
          <h2 className="h2 max-w-xl">Loved by 8,900+ people.</h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => scrollTo(index - 1)}
            disabled={index === 0}
            className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line-strong)] text-[var(--ink-2)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)] disabled:opacity-30"
          >
            <ArrowLeft size={17} strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => scrollTo(index + 1)}
            disabled={index >= testimonials.length - 1}
            className="grid h-11 w-11 place-items-center rounded-full border border-[var(--line-strong)] text-[var(--ink-2)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)] disabled:opacity-30"
          >
            <ArrowRight size={17} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      <motion.div
        ref={trackRef}
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.12}
        onDragEnd={(_, info) => {
          if (info.offset.x < -80) scrollTo(index + 1);
          else if (info.offset.x > 80) scrollTo(index - 1);
        }}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-2"
        style={{ cursor: "grab" }}
      >
        {testimonials.map((t, i) => (
          <figure
            key={t.id}
            className={cn(
              "flex w-[86vw] max-w-[420px] shrink-0 snap-start flex-col justify-between border border-[var(--line)] bg-[var(--surface)] p-7 sm:w-[420px]",
              i === index && "border-[var(--ink)]",
            )}
          >
            <div>
              <Stars value={t.rating} size={15} />
              <blockquote className="mt-5 text-[17px] leading-relaxed tracking-[-0.01em] text-[var(--ink)]">
                “{t.quote}”
              </blockquote>
            </div>
            <figcaption className="mt-7 flex items-center justify-between gap-4 border-t border-[var(--line)] pt-5">
              <div>
                <p className="text-[14px] font-medium text-[var(--ink)]">{t.name}</p>
                <p className="text-[12.5px] text-[var(--ink-3)]">
                  {t.location} · {t.product}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.1em] text-[var(--success)]">
                <BadgeCheck size={14} strokeWidth={1.75} /> Verified
              </span>
            </figcaption>
          </figure>
        ))}
      </motion.div>

      <div className="mt-7 flex items-center gap-2">
        {testimonials.map((t, i) => (
          <button
            key={t.id}
            type="button"
            aria-label={`Go to testimonial ${i + 1}`}
            onClick={() => scrollTo(i)}
            className={cn(
              "h-1 rounded-full transition-all duration-300",
              i === index ? "w-8 bg-[var(--accent)]" : "w-4 bg-[var(--line-strong)] hover:bg-[var(--ink-3)]",
            )}
          />
        ))}
      </div>
    </Section>
  );
}
