"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ImagePlus, Plus, Star } from "lucide-react";
import { categories as seed } from "@/lib/data/categories";
import { products } from "@/lib/data/products";
import type { Category } from "@/types";
import { useUi } from "@/lib/store/providers";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input, Label, Textarea } from "@/components/ui/input";
import { PageHeader, Panel } from "@/components/admin/panel";
import { Img } from "@/components/ui/img";

export default function AdminCategoriesPage() {
  const { toast } = useUi();
  const [list, setList] = useState<Category[]>(seed);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [draft, setDraft] = useState({ name: "", tagline: "", description: "" });

  const move = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= list.length) return;
    const copy = [...list];
    [copy[index], copy[target]] = [copy[target], copy[index]];
    setList(copy.map((c, i) => ({ ...c, order: i + 1 })));
    toast({ title: "Order updated", description: "Homepage category tiles reordered." });
  };

  const add = () => {
    if (!draft.name.trim()) {
      toast({ title: "Category name required", tone: "error" });
      return;
    }
    setList((prev) => [
      ...prev,
      {
        id: `cat-${Date.now()}`,
        slug: draft.name.toLowerCase().replace(/\s+/g, "-"),
        name: draft.name.trim(),
        tagline: draft.tagline.trim() || "Coming soon",
        description: draft.description.trim() || "Category description goes here.",
        image: { src: "/img/categories/new-arrivals.jpg", alt: draft.name },
        order: prev.length + 1,
        featured: false,
        subcategories: [],
      },
    ]);
    setOpen(false);
    setDraft({ name: "", tagline: "", description: "" });
    toast({ title: "Category created", tone: "success" });
  };

  return (
    <div>
      <PageHeader
        title="Categories"
        description="Control the storefront navigation and homepage tiles."
        actions={
          <Button size="sm" icon={<Plus size={15} />} onClick={() => setOpen(true)}>
            New category
          </Button>
        }
      />

      <div className="grid gap-4">
        {list.map((cat, i) => {
          const count = products.filter((p) => p.category === cat.slug).length;
          return (
            <Panel
              key={cat.id}
              className="flex flex-col gap-4 sm:flex-row sm:items-center"
              padded
            >
              <div className="flex items-center gap-3">
                <div className="flex flex-col gap-1">
                  <button
                    type="button"
                    aria-label={`Move ${cat.name} up`}
                    disabled={i === 0}
                    onClick={() => move(i, -1)}
                    className="grid h-6 w-6 place-items-center rounded-[3px] text-[var(--ink-3)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)] disabled:opacity-30"
                  >
                    <ArrowUp size={13} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Move ${cat.name} down`}
                    disabled={i === list.length - 1}
                    onClick={() => move(i, 1)}
                    className="grid h-6 w-6 place-items-center rounded-[3px] text-[var(--ink-3)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)] disabled:opacity-30"
                  >
                    <ArrowDown size={13} />
                  </button>
                </div>

                <span className="h-16 w-14 shrink-0 overflow-hidden rounded-[3px] bg-[var(--surface-2)]">
                  <Img sizes="64px" width={128} height={160} src={cat.image.src} alt="" className="h-full w-full object-cover" />
                </span>

                <span className="grid h-8 w-7 shrink-0 place-items-center rounded-[3px] bg-[var(--surface-2)] text-[12px] tabular-nums text-[var(--ink-3)]">
                  {cat.order}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-[15px] font-medium text-[var(--ink)]">{cat.name}</p>
                  <span className="text-[12px] text-[var(--ink-3)]">/{cat.slug}</span>
                </div>
                <p className="mt-1 text-[13.5px] text-[var(--ink-3)]">{cat.tagline}</p>
                <p className="mt-1 flex flex-wrap gap-2 text-[12.5px] text-[var(--ink-3)]">
                  <span>{count} products</span>
                  <span>·</span>
                  <span>{cat.subcategories.length} subcategories</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  aria-pressed={Boolean(cat.featured)}
                  onClick={() => {
                    setList((prev) =>
                      prev.map((c) =>
                        c.id === cat.id ? { ...c, featured: !c.featured } : c,
                      ),
                    );
                    toast({
                      title: cat.featured ? "Removed from homepage" : "Added to homepage",
                      tone: "success",
                    });
                  }}
                  className={`inline-flex h-8 items-center gap-1.5 rounded-[3px] border px-3 text-[12.5px] transition-colors ${
                    cat.featured
                      ? "border-[var(--accent)] bg-[var(--accent-tint)] text-[var(--accent)]"
                      : "border-[var(--line-strong)] text-[var(--ink-3)] hover:border-[var(--ink-3)]"
                  }`}
                >
                  <Star
                    size={13}
                    strokeWidth={1.8}
                    fill={cat.featured ? "currentColor" : "none"}
                  />
                  {cat.featured ? "On homepage" : "Homepage"}
                </button>

                <button
                  type="button"
                  className="inline-flex h-8 items-center gap-1.5 rounded-[3px] border border-[var(--line-strong)] px-3 text-[12.5px] text-[var(--ink-3)] transition-colors hover:border-[var(--ink-3)] hover:text-[var(--ink)]"
                  onClick={() => toast({ title: "Media picker", description: "Connect storage to swap images." })}
                >
                  <ImagePlus size={13} /> Image
                </button>

                <Button size="sm" variant="outline" onClick={() => setEditing({ ...cat })}>
                  Edit
                </Button>
              </div>
            </Panel>
          );
        })}
      </div>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="New category"
        description="Categories drive the mega menu and the homepage tiles."
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={add}>
              Create category
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="cat-name">Name</Label>
            <div className="mt-2">
              <Input
                id="cat-name"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                placeholder="Loungewear"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="cat-tagline">Tagline</Label>
            <div className="mt-2">
              <Input
                id="cat-tagline"
                value={draft.tagline}
                onChange={(e) => setDraft({ ...draft, tagline: e.target.value })}
                placeholder="Soft layers for slow days"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="cat-desc">Description</Label>
            <div className="mt-2">
              <Textarea
                id="cat-desc"
                rows={3}
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
              />
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title="Edit category"
        description={editing ? `/${editing.slug} · drives the mega menu and shop filters` : ""}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={() => {
                if (!editing) return;
                if (!editing.name.trim()) {
                  toast({ title: "A category needs a name", tone: "error" });
                  return;
                }
                setList((prev) =>
                  prev.map((c) => (c.id === editing.id ? { ...editing } : c)),
                );
                toast({
                  title: "Category saved",
                  description: `${editing.name} updated across the storefront.`,
                  tone: "success",
                });
                setEditing(null);
              }}
            >
              Save changes
            </Button>
          </>
        }
      >
        {editing ? (
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-name">Name</Label>
              <div className="mt-2">
                <Input
                  id="edit-name"
                  value={editing.name}
                  onChange={(e) =>
                    setEditing((prev) =>
                      prev ? { ...prev, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") } : prev,
                    )
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-tagline">Tagline</Label>
              <div className="mt-2">
                <Input
                  id="edit-tagline"
                  value={editing.tagline}
                  onChange={(e) =>
                    setEditing((prev) => (prev ? { ...prev, tagline: e.target.value } : prev))
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="edit-desc">Description</Label>
              <div className="mt-2">
                <Textarea
                  id="edit-desc"
                  rows={4}
                  value={editing.description}
                  onChange={(e) =>
                    setEditing((prev) => (prev ? { ...prev, description: e.target.value } : prev))
                  }
                />
              </div>
            </div>
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
