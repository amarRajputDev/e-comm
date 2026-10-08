"use client";

import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Img } from "@/components/ui/img";
import { cn } from "@/lib/utils";

/** Editorial assets in public/img that can be used as campaign artwork. */
export const IMAGE_LIBRARY = [
  { src: "/img/categories/men.jpg", label: "Menswear rail" },
  { src: "/img/categories/women.jpg", label: "Striped trousers" },
  { src: "/img/categories/accessories.jpg", label: "Accessories flat lay" },
  { src: "/img/categories/new-arrivals.jpg", label: "New arrivals" },
  { src: "/img/mega/featured.jpg", label: "Burgundy coat" },
  { src: "/img/mega/collections.jpg", label: "Studio store" },
  { src: "/img/hero.jpg", label: "Campaign hero" },
  { src: "/img/story.jpg", label: "Knit flat lay" },
  { src: "/img/story-hero.jpg", label: "Warm rail" },
  { src: "/img/auth.jpg", label: "Cream knit" },
  { src: "/img/promo.jpg", label: "Studio corridor" },
  { src: "/img/social/6.jpg", label: "Canvas sneakers" },
];

export function ImagePickerDialog({
  open,
  title,
  description,
  selected,
  onSelect,
  onClose,
}: {
  open: boolean;
  title: string;
  description?: string;
  /** Currently applied image path (highlights the active tile). */
  selected?: string;
  onSelect: (asset: { src: string; label: string }) => void;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={title}
      description={description}
      size="lg"
      footer={
        <Button variant="ghost" size="sm" onClick={onClose}>
          Cancel
        </Button>
      }
    >
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
        {IMAGE_LIBRARY.map((asset) => {
          const active = selected === asset.src;
          return (
            <button
              key={asset.src}
              type="button"
              aria-pressed={active}
              onClick={() => {
                onSelect(asset);
                onClose();
              }}
              className={cn(
                "group overflow-hidden rounded-[3px] border text-left transition-colors",
                active
                  ? "border-[var(--accent)] ring-1 ring-[var(--accent)]"
                  : "border-[var(--line)] hover:border-[var(--line-strong)]",
              )}
            >
              <span className="relative block aspect-4/5 overflow-hidden bg-[var(--surface-2)]">
                <Img
                  src={asset.src}
                  alt={asset.label}
                  width={300}
                  height={375}
                  sizes="160px"
                  className="h-full w-full transition-transform duration-500 group-hover:scale-105"
                />
                {active ? (
                  <span className="absolute left-1.5 top-1.5 rounded-[2px] bg-[var(--accent)] px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[var(--on-accent)]">
                    In use
                  </span>
                ) : null}
              </span>
              <span className="block px-2 py-1.5 text-[11.5px] text-[var(--ink-2)]">
                {asset.label}
              </span>
            </button>
          );
        })}
      </div>
    </Dialog>
  );
}
