"use client";

import { useState } from "react";
import { Eye, EyeOff, ImagePlus, Plus, Trash2 } from "lucide-react";
import type { Banner } from "@/types";
import { useCms } from "@/lib/store/cms";
import { useUi } from "@/lib/store/providers";
import { StatusPill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader, Panel } from "@/components/admin/panel";
import { ImagePickerDialog } from "@/components/admin/image-library";
import { Img } from "@/components/ui/img";

export default function AdminBannersPage() {
  const { toast } = useUi();
  const { content, hydrated, save, reset } = useCms();
  const [picking, setPicking] = useState<Banner | null>(null);

  const rows = hydrated ? content.banners : [];

  /** Every field change is written straight through to the storefront. */
  const patch = (id: string, next: Partial<Banner>) => {
    const name = rows.find((b) => b.id === id)?.title ?? "Banner";
    save({ banners: rows.map((b) => (b.id === id ? { ...b, ...next } : b)) });
    if (next.active !== undefined) {
      toast({
        title: next.active ? "Banner published" : "Banner hidden",
        description: name,
        tone: next.active ? "success" : "error",
      });
    }
  };

  const remove = (banner: Banner) => {
    save({ banners: rows.filter((b) => b.id !== banner.id) });
    toast({ title: "Banner deleted", description: banner.title, tone: "error" });
  };

  const add = () => {
    const next: Banner = {
      id: `bnr-${Date.now()}`,
      eyebrow: "Limited time",
      title: "NEW PROMOTION",
      subtitle: "Describe the offer in one line.",
      image: "/img/promo.jpg",
      cta: "Shop now",
      href: "/shop",
      placement: "strip",
      active: false,
    };
    save({ banners: [next, ...rows] });
    toast({ title: "Banner created", description: "It starts hidden until you publish it." });
  };

  if (!hydrated) {
    return (
      <div role="status" aria-label="Loading banners" className="space-y-4">
        <div className="skeleton h-8 w-64" />
        {[0, 1].map((i) => (
          <div key={i} className="skeleton h-44 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Banners & promotions"
        description="Promo and strip artwork rendered on the homepage. Edits go live the moment you type — the hero lives under Content."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                reset();
                toast({ title: "Reset to defaults", description: "All content restored." });
              }}
            >
              Reset content
            </Button>
            <Button size="sm" icon={<Plus size={15} />} onClick={add}>
              New banner
            </Button>
          </>
        }
      />

      {!rows.length ? (
        <EmptyState
          icon={<ImagePlus size={24} strokeWidth={1.4} />}
          title="No banners yet"
          description="Create a promotion to fill the homepage banner slot."
          action={{ label: "Create a banner", onClick: add }}
        />
      ) : (
        <div className="grid gap-4">
          {rows.map((banner) => (
            <Panel key={banner.id} className="flex flex-col gap-5 lg:flex-row">
              <div className="lg:w-72 lg:shrink-0">
                <div className="relative aspect-16/10 w-full overflow-hidden rounded-[3px] bg-[var(--surface-2)]">
                  <Img
                    sizes="240px"
                    width={480}
                    height={300}
                    src={banner.image}
                    alt=""
                    className="h-full w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute inset-x-3 bottom-2.5">
                    <p className="truncate text-[11px] font-semibold uppercase tracking-[0.1em] text-white">
                      {banner.title}
                    </p>
                  </div>
                  <span className="absolute left-2 top-2">
                    <StatusPill status={banner.active ? "active" : "draft"} />
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setPicking(banner)}
                  className="mt-2 inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-[3px] border border-[var(--line-strong)] text-[12.5px] text-[var(--ink-3)] transition-colors hover:border-[var(--ink-3)] hover:text-[var(--ink)]"
                >
                  <ImagePlus size={13} /> Change image
                </button>
              </div>

              <div className="grid min-w-0 flex-1 gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor={`title-${banner.id}`}>Headline</Label>
                  <div className="mt-2">
                    <Input
                      id={`title-${banner.id}`}
                      value={banner.title}
                      onChange={(e) => patch(banner.id, { title: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`eyebrow-${banner.id}`}>Eyebrow</Label>
                  <div className="mt-2">
                    <Input
                      id={`eyebrow-${banner.id}`}
                      value={banner.eyebrow ?? ""}
                      onChange={(e) => patch(banner.id, { eyebrow: e.target.value })}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor={`sub-${banner.id}`}>Supporting line</Label>
                  <div className="mt-2">
                    <Input
                      id={`sub-${banner.id}`}
                      value={banner.subtitle}
                      onChange={(e) => patch(banner.id, { subtitle: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`cta-${banner.id}`}>CTA label</Label>
                  <div className="mt-2">
                    <Input
                      id={`cta-${banner.id}`}
                      value={banner.cta}
                      onChange={(e) => patch(banner.id, { cta: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`href-${banner.id}`}>Link</Label>
                  <div className="mt-2">
                    <Input
                      id={`href-${banner.id}`}
                      value={banner.href}
                      onChange={(e) => patch(banner.id, { href: e.target.value })}
                    />
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <Label>Placement</Label>
                  <div className="mt-2 flex gap-2">
                    {(["promo", "strip"] as const).map((p) => (
                      <button
                        key={p}
                        type="button"
                        aria-pressed={banner.placement === p}
                        onClick={() => patch(banner.id, { placement: p })}
                        className={`h-9 rounded-[3px] border px-3 text-[12.5px] capitalize transition-colors ${
                          banner.placement === p
                            ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]"
                            : "border-[var(--line-strong)] text-[var(--ink-3)] hover:border-[var(--ink-3)]"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <span className="ml-auto self-center text-[12px] text-[var(--ink-3)]">
                      {banner.placement === "promo" ? "Homepage banner slot" : "Reserved slot"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-row gap-2 lg:flex-col lg:justify-start">
                <Button
                  size="sm"
                  variant={banner.active ? "outline" : "primary"}
                  icon={banner.active ? <EyeOff size={14} /> : <Eye size={14} />}
                  onClick={() => patch(banner.id, { active: !banner.active })}
                >
                  {banner.active ? "Unpublish" : "Publish"}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  icon={<Trash2 size={14} />}
                  onClick={() => remove(banner)}
                >
                  Delete
                </Button>
              </div>
            </Panel>
          ))}
        </div>
      )}

      <ImagePickerDialog
        open={Boolean(picking)}
        title="Banner artwork"
        description="Pick a shot from the library — it updates the homepage instantly."
        selected={picking?.image}
        onClose={() => setPicking(null)}
        onSelect={(asset) => {
          if (!picking) return;
          patch(picking.id, { image: asset.src });
          toast({ title: "Artwork updated", description: asset.label, tone: "success" });
        }}
      />
    </div>
  );
}
