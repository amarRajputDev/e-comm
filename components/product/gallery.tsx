"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Expand, ChevronLeft, ChevronRight, X } from "lucide-react";
import type { ProductImage } from "@/types";
import { Img } from "@/components/ui/img";
import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  name,
  priority = false,
}: {
  images: ProductImage[];
  name: string;
  priority?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const [viewer, setViewer] = useState(false);
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const total = images.length;

  const go = useCallback(
    (next: number) => setIndex((next + total) % total),
    [total],
  );

  useEffect(() => {
    if (!viewer) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setViewer(false);
      if (e.key === "ArrowRight") go(index + 1);
      if (e.key === "ArrowLeft") go(index - 1);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [viewer, index, go]);

  /* keep the mobile carousel in sync with the shared index */
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const target = track.children[index] as HTMLElement | undefined;
    if (target && Math.abs(track.scrollLeft - target.offsetLeft) > 4) {
      track.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
    }
  }, [index]);

  return (
    <div className="lg:sticky lg:top-[calc(var(--header-h)+1.5rem)]">
      <div className="hidden gap-4 lg:flex">
        {/* thumbnails */}
        <div className="flex w-[76px] shrink-0 flex-col gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              aria-label={`View image ${i + 1} of ${total}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                "relative aspect-4/5 overflow-hidden bg-[var(--surface-2)] transition-all duration-300",
                i === index
                  ? "ring-1 ring-[var(--ink)] ring-offset-2 ring-offset-[var(--bg)]"
                  : "opacity-65 hover:opacity-100",
              )}
            >
              <Img
                src={img.src}
                alt=""
                width={400}
                height={500}
                sizes="76px"
                className="h-full w-full"
              />
            </button>
          ))}
        </div>

        {/* main */}
        <div
          className="relative flex-1 cursor-zoom-in overflow-hidden bg-[var(--surface-2)]"
          onMouseEnter={() => setZoom({ x: 50, y: 50 })}
          onMouseLeave={() => setZoom(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setZoom({
              x: ((e.clientX - rect.left) / rect.width) * 100,
              y: ((e.clientY - rect.top) / rect.height) * 100,
            });
          }}
          onClick={() => setViewer(true)}
          role="button"
          tabIndex={0}
          aria-label="Open fullscreen viewer"
          onKeyDown={(e) => e.key === "Enter" && setViewer(true)}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
              className="aspect-4/5 overflow-hidden"
            >
              <Img
                src={images[index]?.src ?? ""}
                alt={images[index]?.alt ?? name}
                width={1200}
                height={1500}
                sizes="(max-width: 1024px) 100vw, 55vw"
                preload={priority}
                className="h-full w-full transition-transform duration-300 ease-out"
                style={{
                  transformOrigin: zoom ? `${zoom.x}% ${zoom.y}%` : "center",
                  transform: zoom ? "scale(1.75)" : "scale(1)",
                }}
              />
            </motion.div>
          </AnimatePresence>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setViewer(true);
            }}
            aria-label="Open fullscreen view"
            className="absolute bottom-4 right-4 grid h-10 w-10 place-items-center rounded-full bg-[var(--surface)]/90 text-[var(--ink)] backdrop-blur transition-colors hover:bg-[var(--surface)]"
          >
            <Expand size={16} strokeWidth={1.6} />
          </button>

          <div className="pointer-events-none absolute left-4 top-4 flex gap-1.5">
            {images.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1 rounded-full transition-all duration-300",
                  i === index ? "w-6 bg-[var(--ink)]" : "w-1 bg-[var(--ink)]/30",
                )}
              />
            ))}
          </div>
        </div>
      </div>

      {/* mobile carousel */}
      <div className="lg:hidden">
        <div
          ref={trackRef}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto px-4"
          onScroll={(e) => {
            const el = e.currentTarget;
            const i = Math.round(el.scrollLeft / Math.max(el.clientWidth * 0.92, 1));
            if (i !== index && i >= 0 && i < total) setIndex(i);
          }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              className="w-[92%] shrink-0 snap-center pr-3"
              onClick={() => setViewer(true)}
            >
              <div className="relative aspect-4/5 overflow-hidden bg-[var(--surface-2)]">
                <Img
                  src={img.src}
                  alt={img.alt ?? name}
                  width={1000}
                  height={1250}
                  sizes="92vw"
                  preload={i === 0}
                  className="h-full w-full"
                />
                <span className="absolute bottom-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-[var(--surface)]/90 text-[var(--ink)]">
                  <Expand size={15} strokeWidth={1.6} />
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-center gap-2">
          {images.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Go to image ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-6 bg-[var(--accent)]" : "w-1.5 bg-[var(--line-strong)]",
              )}
            />
          ))}
        </div>
      </div>

      {/* fullscreen viewer */}
      <AnimatePresence>
        {viewer ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.26 }}
            className="fixed inset-0 z-[110] grid place-items-center bg-[#0b0a09]/96 p-4"
            role="dialog"
            aria-modal="true"
            aria-label={`${name} — image viewer`}
          >
            <button
              type="button"
              onClick={() => setViewer(false)}
              aria-label="Close viewer"
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            >
              <X size={20} strokeWidth={1.5} />
            </button>

            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous image"
              className="absolute left-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:left-6"
            >
              <ChevronLeft size={22} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next image"
              className="absolute right-3 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:right-6"
            >
              <ChevronRight size={22} strokeWidth={1.5} />
            </button>

            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            >
              <Img
                src={images[index]?.src ?? ""}
                alt={images[index]?.alt ?? name}
                width={1600}
                height={2000}
                sizes="92vw"
                className="max-h-[86vh] max-w-[92vw] object-contain"
              />
            </motion.div>

            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[12px] uppercase tracking-[0.18em] text-white/60">
              {index + 1} / {total}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
