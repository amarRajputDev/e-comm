"use client";

import { useEffect, useState } from "react";
import {
  ArrowDown,
  ArrowUp,
  Eye,
  EyeOff,
  Plus,
  RotateCcw,
  Save,
  Star,
  Trash2,
  Type,
} from "lucide-react";
import { useCms, type CmsContent } from "@/lib/store/cms";
import { products } from "@/lib/data/products";
import { useUi } from "@/lib/store/providers";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { PageHeader, Panel } from "@/components/admin/panel";
import { Img } from "@/components/ui/img";
import { cn } from "@/lib/utils";

function Field({
  id,
  label,
  value,
  onChange,
  hint,
  area,
  rows,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  area?: boolean;
  rows?: number;
}) {
  return (
    <div>
      <Label htmlFor={id} hint={hint}>
        {label}
      </Label>
      <div className="mt-2">
        {area ? (
          <Textarea id={id} rows={rows ?? 3} value={value} onChange={(e) => onChange(e.target.value)} />
        ) : (
          <Input id={id} value={value} onChange={(e) => onChange(e.target.value)} />
        )}
      </div>
    </div>
  );
}

export default function AdminContentPage() {
  const { toast } = useUi();
  const { content, hydrated, saveAll, reset } = useCms();
  const [draft, setDraft] = useState<CmsContent | null>(null);

  useEffect(() => {
    if (hydrated && !draft) setDraft(structuredCloneSafe(content));
  }, [hydrated, content, draft]);

  if (!draft) {
    return (
      <div role="status" aria-label="Loading content editor" className="space-y-4">
        <div className="skeleton h-8 w-56" />
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton h-40 w-full" />
        ))}
      </div>
    );
  }

  const dirty = JSON.stringify(draft) !== JSON.stringify(content);

  const patch = (fn: (d: CmsContent) => CmsContent) => setDraft((prev) => (prev ? fn(prev) : prev));

  const moveSection = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= draft.sections.length) return;
    patch((d) => {
      const sections = [...d.sections];
      [sections[index], sections[target]] = [sections[target], sections[index]];
      return { ...d, sections };
    });
  };

  const save = () => {
    saveAll(draft);
    toast({
      title: "Homepage updated",
      description: "Changes are live on the storefront.",
      tone: "success",
    });
  };

  const productPicker = products
    .slice()
    .sort((a, b) => b.sold - a.sold)
    .slice(0, 12);

  return (
    <div>
      <PageHeader
        title="Content"
        description="Hero copy, homepage sections, featured products and campaign messages — changes go live on save."
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              icon={<RotateCcw size={14} />}
              onClick={() => {
                reset();
                setDraft(null);
                toast({ title: "Content reset", description: "Defaults restored." });
              }}
            >
              Reset to defaults
            </Button>
            <Button size="sm" icon={<Save size={14} />} onClick={save} disabled={!dirty}>
              {dirty ? "Save changes" : "Saved"}
            </Button>
          </>
        }
      />

      <div className="grid gap-4 xl:grid-cols-3">
        {/* hero */}
        <Panel
          className="xl:col-span-2"
          title="Hero banner"
          description="The first thing every visitor reads"
          actions={
            <span className="inline-flex items-center gap-1.5 text-[11.5px] text-[var(--ink-3)]">
              <Eye size={13} /> Live preview below
            </span>
          }
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="hero-eyebrow"
              label="Eyebrow"
              value={draft.hero.eyebrow}
              onChange={(v) => patch((d) => ({ ...d, hero: { ...d.hero, eyebrow: v } }))}
            />
            <Field
              id="hero-img"
              label="Image path"
              value={draft.hero.image}
              onChange={(v) => patch((d) => ({ ...d, hero: { ...d.hero, image: v } }))}
              hint="/img/…"
            />
            <Field
              id="hero-l1"
              label="Headline — line 1"
              value={draft.hero.line1}
              onChange={(v) => patch((d) => ({ ...d, hero: { ...d.hero, line1: v } }))}
            />
            <Field
              id="hero-l2"
              label="Headline — line 2"
              value={draft.hero.line2}
              onChange={(v) => patch((d) => ({ ...d, hero: { ...d.hero, line2: v } }))}
            />
            <div className="sm:col-span-2">
              <Field
                id="hero-support"
                label="Supporting copy"
                value={draft.hero.support}
                onChange={(v) => patch((d) => ({ ...d, hero: { ...d.hero, support: v } }))}
                area
                rows={3}
              />
            </div>
            <Field
              id="hero-cta1"
              label="Primary CTA"
              value={draft.hero.primaryCta}
              onChange={(v) => patch((d) => ({ ...d, hero: { ...d.hero, primaryCta: v } }))}
            />
            <Field
              id="hero-href1"
              label="Primary link"
              value={draft.hero.primaryHref}
              onChange={(v) => patch((d) => ({ ...d, hero: { ...d.hero, primaryHref: v } }))}
            />
            <Field
              id="hero-cta2"
              label="Secondary CTA"
              value={draft.hero.secondaryCta}
              onChange={(v) => patch((d) => ({ ...d, hero: { ...d.hero, secondaryCta: v } }))}
            />
            <Field
              id="hero-href2"
              label="Secondary link"
              value={draft.hero.secondaryHref}
              onChange={(v) => patch((d) => ({ ...d, hero: { ...d.hero, secondaryHref: v } }))}
            />
          </div>

          {/* preview */}
          <div className="mt-5 overflow-hidden rounded-[3px] border border-[var(--line)]">
            <div className="relative aspect-21/9 bg-[#141210]">
              <Img
                src={draft.hero.image}
                alt=""
                width={1200}
                height={514}
                sizes="(max-width: 1280px) 100vw, 66vw"
                className="h-full w-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/30" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <p className="text-[10px] uppercase tracking-[0.2em] text-white/70">
                  {draft.hero.eyebrow}
                </p>
                <p className="mt-2 text-[clamp(1rem,2.4vw,1.9rem)] font-medium leading-none tracking-[-0.03em] text-white">
                  {draft.hero.line1}
                  <br />
                  {draft.hero.line2}
                </p>
                <div className="mt-3 flex gap-2">
                  <span className="rounded-[2px] bg-[var(--accent)] px-3 py-1.5 text-[9.5px] font-medium uppercase tracking-[0.14em] text-[var(--on-accent)]">
                    {draft.hero.primaryCta}
                  </span>
                  <span className="rounded-[2px] border border-white/35 px-3 py-1.5 text-[9.5px] font-medium uppercase tracking-[0.14em] text-white">
                    {draft.hero.secondaryCta}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </Panel>

        {/* sections */}
        <Panel title="Homepage sections" description="Reorder or hide sections">
          <ul className="divide-y divide-[var(--line)]">
            {draft.sections.map((section, i) => (
              <li key={section.id} className="flex items-center gap-2 py-2.5 first:pt-0">
                <span className="w-6 text-[11.5px] tabular-nums text-[var(--ink-3)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="flex-1 text-[13.5px] text-[var(--ink)]">{section.label}</span>

                <button
                  type="button"
                  aria-label={`Move ${section.label} up`}
                  disabled={i === 0}
                  onClick={() => moveSection(i, -1)}
                  className="grid h-7 w-7 place-items-center rounded-[3px] text-[var(--ink-3)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)] disabled:opacity-30"
                >
                  <ArrowUp size={13} />
                </button>
                <button
                  type="button"
                  aria-label={`Move ${section.label} down`}
                  disabled={i === draft.sections.length - 1}
                  onClick={() => moveSection(i, 1)}
                  className="grid h-7 w-7 place-items-center rounded-[3px] text-[var(--ink-3)] hover:bg-[var(--surface-2)] hover:text-[var(--ink)] disabled:opacity-30"
                >
                  <ArrowDown size={13} />
                </button>
                <button
                  type="button"
                  aria-label={`${section.enabled ? "Hide" : "Show"} ${section.label}`}
                  aria-pressed={section.enabled}
                  onClick={() =>
                    patch((d) => ({
                      ...d,
                      sections: d.sections.map((s) =>
                        s.id === section.id ? { ...s, enabled: !s.enabled } : s,
                      ),
                    }))
                  }
                  className={cn(
                    "grid h-7 w-7 place-items-center rounded-[3px] transition-colors",
                    section.enabled
                      ? "text-[var(--success)] hover:bg-[var(--success)]/10"
                      : "text-[var(--ink-3)] hover:bg-[var(--surface-2)]",
                  )}
                >
                  {section.enabled ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-4 rounded-[3px] bg-[var(--surface-2)] p-3 text-[12.5px] leading-relaxed text-[var(--ink-2)]">
            The hero always renders first. Hidden sections are kept in the order you set, so
            re-enabling one puts it back exactly where it was.
          </div>
        </Panel>

        {/* featured products */}
        <Panel
          title="Featured products"
          description="Pinned first in the Trending row"
          className="xl:col-span-2"
        >
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {productPicker.map((product) => {
              const active = draft.featuredSlugs.includes(product.slug);
              const order = draft.featuredSlugs.indexOf(product.slug);
              return (
                <button
                  key={product.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() =>
                    patch((d) => ({
                      ...d,
                      featuredSlugs: active
                        ? d.featuredSlugs.filter((s) => s !== product.slug)
                        : [...d.featuredSlugs, product.slug],
                    }))
                  }
                  className={cn(
                    "relative overflow-hidden rounded-[3px] border p-2 text-left transition-colors",
                    active
                      ? "border-[var(--accent)] bg-[var(--accent-tint)]"
                      : "border-[var(--line)] hover:border-[var(--line-strong)]",
                  )}
                >
                  <span className="block aspect-4/5 overflow-hidden rounded-[2px] bg-[var(--surface-2)]">
                    <Img
                      src={product.images[0]?.src ?? ""}
                      alt=""
                      width={300}
                      height={375}
                      sizes="180px"
                      className="h-full w-full"
                    />
                  </span>
                  <span className="mt-2 block truncate text-[12.5px] font-medium text-[var(--ink)]">
                    {product.name}
                  </span>
                  <span className="block text-[11.5px] text-[var(--ink-3)]">{product.category}</span>
                  {active ? (
                    <span className="absolute left-1.5 top-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-[var(--accent)] px-1 text-[10px] font-semibold text-[var(--on-accent)]">
                      {order + 1}
                    </span>
                  ) : null}
                </button>
              );
            })}
          </div>
        </Panel>

        {/* newsletter */}
        <Panel title="Newsletter block">
          <div className="grid gap-4">
            <Field
              id="nl-h"
              label="Heading"
              value={draft.newsletter.heading}
              onChange={(v) => patch((d) => ({ ...d, newsletter: { ...d.newsletter, heading: v } }))}
            />
            <Field
              id="nl-b"
              label="Body"
              value={draft.newsletter.body}
              onChange={(v) => patch((d) => ({ ...d, newsletter: { ...d.newsletter, body: v } }))}
              area
              rows={3}
            />
            <Field
              id="nl-cta"
              label="Button label"
              value={draft.newsletter.cta}
              onChange={(v) => patch((d) => ({ ...d, newsletter: { ...d.newsletter, cta: v } }))}
            />
          </div>
        </Panel>

        {/* testimonials */}
        <Panel
          title="Testimonials"
          description="Quotes shown in the reviews carousel"
          className="xl:col-span-2"
          actions={
            <Button
              size="sm"
              variant="outline"
              icon={<Plus size={14} />}
              onClick={() =>
                patch((d) => ({
                  ...d,
                  testimonials: [
                    ...d.testimonials,
                    {
                      id: `t-${Date.now()}`,
                      quote: "Add a short, specific quote from a happy customer.",
                      name: "Customer name",
                      location: "City",
                      rating: 5,
                      product: "Product name",
                    },
                  ],
                }))
              }
            >
              Add quote
            </Button>
          }
        >
          <div className="space-y-4">
            {draft.testimonials.map((t, i) => (
              <div key={t.id} className="rounded-[3px] border border-[var(--line)] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.12em] text-[var(--ink-3)]">
                    <Type size={12} /> Quote {i + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <span className="inline-flex items-center gap-0.5 text-[12px] text-[var(--accent)]">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          size={12}
                          fill={s <= t.rating ? "currentColor" : "none"}
                          strokeWidth={1.5}
                        />
                      ))}
                    </span>
                    <button
                      type="button"
                      aria-label={`Delete quote ${i + 1}`}
                      onClick={() =>
                        patch((d) => ({
                          ...d,
                          testimonials: d.testimonials.filter((x) => x.id !== t.id),
                        }))
                      }
                      className="ml-2 grid h-7 w-7 place-items-center rounded-[3px] text-[var(--ink-3)] transition-colors hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid gap-3">
                  <Textarea
                    rows={2}
                    value={t.quote}
                    onChange={(e) =>
                      patch((d) => ({
                        ...d,
                        testimonials: d.testimonials.map((x) =>
                          x.id === t.id ? { ...x, quote: e.target.value } : x,
                        ),
                      }))
                    }
                  />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <Input
                      aria-label="Customer name"
                      value={t.name}
                      onChange={(e) =>
                        patch((d) => ({
                          ...d,
                          testimonials: d.testimonials.map((x) =>
                            x.id === t.id ? { ...x, name: e.target.value } : x,
                          ),
                        }))
                      }
                    />
                    <Input
                      aria-label="Location"
                      value={t.location}
                      onChange={(e) =>
                        patch((d) => ({
                          ...d,
                          testimonials: d.testimonials.map((x) =>
                            x.id === t.id ? { ...x, location: e.target.value } : x,
                          ),
                        }))
                      }
                    />
                    <Input
                      aria-label="Product"
                      value={t.product}
                      onChange={(e) =>
                        patch((d) => ({
                          ...d,
                          testimonials: d.testimonials.map((x) =>
                            x.id === t.id ? { ...x, product: e.target.value } : x,
                          ),
                        }))
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}

function structuredCloneSafe(value: CmsContent): CmsContent {
  return JSON.parse(JSON.stringify(value)) as CmsContent;
}
