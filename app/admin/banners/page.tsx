"use client";

import { useState } from "react";
import { Eye, EyeOff, GripVertical, Plus } from "lucide-react";
import { banners as seed } from "@/lib/data/site";
import type { Banner } from "@/types";
import { useUi } from "@/lib/store/providers";
import { StatusPill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { PageHeader, Panel } from "@/components/admin/panel";
import { Img } from "@/components/ui/img";

export default function AdminBannersPage() {
  const { toast } = useUi();
  const [rows, setRows] = useState<Banner[]>(seed);

  const patch = (id: string, next: Partial<Banner>) =>
    setRows((prev) => prev.map((b) => (b.id === id ? { ...b, ...next } : b)));

  return (
    <div>
      <PageHeader
        title="Banners & promotions"
        description="Hero, promo and strip content shown across the storefront."
        actions={
          <Button
            size="sm"
            icon={<Plus size={15} />}
            onClick={() =>
              setRows((prev) => [
                ...prev,
                {
                  id: `bnr-${Date.now()}`,
                  title: "NEW PROMOTION",
                  subtitle: "Describe the offer in one line.",
                  image: "/img/promo.jpg",
                  cta: "Shop now",
                  href: "/shop",
                  placement: "strip",
                  active: false,
                },
              ])
            }
          >
            New banner
          </Button>
        }
      />

      <div className="grid gap-4">
        {rows.map((banner) => (
          <Panel key={banner.id} className="flex flex-col gap-5 lg:flex-row">
            <div className="flex items-start gap-3 lg:w-72 lg:shrink-0">
              <span className="mt-2 text-[var(--ink-3)]">
                <GripVertical size={16} />
              </span>
              <div className="relative aspect-16/10 w-full overflow-hidden rounded-[3px] bg-[var(--surface-2)]">
                <Img sizes="240px" width={480} height={300} src={banner.image} alt="" className="h-full w-full object-cover" />
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
                <Label htmlFor={`cta-${banner.id}`}>CTA label</Label>
                <div className="mt-2">
                  <Input
                    id={`cta-${banner.id}`}
                    value={banner.cta}
                    onChange={(e) => patch(banner.id, { cta: e.target.value })}
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
                <Label htmlFor={`href-${banner.id}`}>Link</Label>
                <div className="mt-2">
                  <Input
                    id={`href-${banner.id}`}
                    value={banner.href}
                    onChange={(e) => patch(banner.id, { href: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label>Placement</Label>
                <div className="mt-2 flex gap-2">
                  {(["hero", "promo", "strip"] as const).map((p) => (
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
                </div>
              </div>
            </div>

            <div className="flex flex-row gap-2 lg:flex-col lg:justify-start">
              <Button
                size="sm"
                variant={banner.active ? "outline" : "primary"}
                icon={banner.active ? <EyeOff size={14} /> : <Eye size={14} />}
                onClick={() => {
                  patch(banner.id, { active: !banner.active });
                  toast({
                    title: banner.active ? "Banner hidden" : "Banner published",
                    description: banner.title,
                    tone: banner.active ? "error" : "success",
                  });
                }}
              >
                {banner.active ? "Unpublish" : "Publish"}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => toast({ title: "Changes saved", tone: "success" })}
              >
                Save
              </Button>
            </div>
          </Panel>
        ))}
      </div>
    </div>
  );
}
