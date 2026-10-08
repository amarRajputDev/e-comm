"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Eye, Plus, X, Sparkles } from "lucide-react";
import type { Product } from "@/types";
import { categories } from "@/lib/data/categories";
import { useUi } from "@/lib/store/providers";
import { Button } from "@/components/ui/button";
import { Input, Label, Select, Textarea } from "@/components/ui/input";
import { Panel } from "./panel";
import { UploadDropzone, type MediaItem } from "./upload-dropzone";
import { money } from "@/lib/format";
import { cn, unique } from "@/lib/utils";

const COLOUR_OPTIONS = [
  { name: "Black", hex: "#141210" },
  { name: "Bone", hex: "#EDE6DA" },
  { name: "Chalk", hex: "#F6F4F0" },
  { name: "Charcoal", hex: "#3C3A37" },
  { name: "Olive", hex: "#5A5B3F" },
  { name: "Rust", hex: "#A9522B" },
  { name: "Indigo", hex: "#2C3E63" },
  { name: "Stone", hex: "#B8AFA1" },
  { name: "Espresso", hex: "#40342B" },
  { name: "Sage", hex: "#A3AE97" },
];

const SIZE_OPTIONS = ["XS", "S", "M", "L", "XL", "XXL", "One Size", "6", "7", "8", "9", "10"];

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const { toast } = useUi();
  const editing = Boolean(product);

  const [form, setForm] = useState({
    name: product?.name ?? "",
    slug: product?.slug ?? "",
    description: product?.description ?? "",
    shortDescription: product?.shortDescription ?? "",
    category: product?.category ?? "men",
    brand: product?.brand ?? "ATELIER NOIR",
    tags: product?.tags.join(", ") ?? "",
    sku: product?.id.toUpperCase() ?? "",
    price: String(product?.price ?? ""),
    compareAt: String(product?.compareAt ?? ""),
    cost: String(product?.cost ?? ""),
    stock: String(product?.stock ?? ""),
    lowStock: "15",
    seoTitle: product?.seo.title ?? "",
    seoDescription: product?.seo.description ?? "",
    status: product?.status ?? "active",
    trackInventory: true,
    weight: "0.4",
    dimensions: "30 × 24 × 4 cm",
  });

  const [colors, setColors] = useState<string[]>(
    product?.colors.map((c) => c.name) ?? ["Black", "Bone"],
  );
  const [sizes, setSizes] = useState<string[]>(
    product?.sizes.map((s) => s.label) ?? ["S", "M", "L", "XL"],
  );
  const [tagDraft, setTagDraft] = useState("");
  const [media, setMedia] = useState<MediaItem[]>(
    product?.images.map((img, i) => ({
      id: `existing-${i}`,
      name: img.src.split("/").pop() ?? "image",
      url: img.src,
      progress: 100,
    })) ?? [],
  );
  const [saving, setSaving] = useState(false);

  const margin = useMemo(() => {
    const p = Number(form.price);
    const c = Number(form.cost);
    if (!p || !c) return null;
    return Math.round(((p - c) / p) * 100);
  }, [form.price, form.cost]);

  const set = (key: keyof typeof form, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const submit = async (publish: boolean) => {
    if (!form.name.trim()) {
      toast({ title: "Product name is required", tone: "error" });
      return;
    }
    if (!Number(form.price)) {
      toast({ title: "Set a price before saving", tone: "error" });
      return;
    }
    setSaving(true);
    await new Promise((r) => setTimeout(r, 900));
    setSaving(false);
    toast({
      title: editing ? "Product updated" : publish ? "Product published" : "Draft saved",
      description: `${form.name} — ${money(Number(form.price))}`,
      tone: "success",
    });
    router.push("/admin/products");
  };

  return (
    <>
    <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
      <div className="space-y-4">
        <Panel title="Basic information" description="What customers see on the product page">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Label htmlFor="p-name">Product name</Label>
              <div className="mt-2">
                <Input
                  id="p-name"
                  value={form.name}
                  onChange={(e) => {
                    set("name", e.target.value);
                    if (!editing && (!form.slug || form.slug === slugify(form.name)))
                      set("slug", slugify(e.target.value));
                  }}
                  placeholder="Heavyweight Box Tee"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="p-slug">Slug</Label>
              <div className="mt-2">
                <Input
                  id="p-slug"
                  value={form.slug}
                  onChange={(e) => set("slug", slugify(e.target.value))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="p-sku">SKU</Label>
              <div className="mt-2">
                <Input id="p-sku" value={form.sku} onChange={(e) => set("sku", e.target.value)} />
              </div>
            </div>

            <div>
              <Label htmlFor="p-category">Category</Label>
              <div className="mt-2">
                <Select
                  id="p-category"
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="p-brand">Brand</Label>
              <div className="mt-2">
                <Input
                  id="p-brand"
                  value={form.brand}
                  onChange={(e) => set("brand", e.target.value)}
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="p-short">Short description</Label>
              <div className="mt-2">
                <Input
                  id="p-short"
                  value={form.shortDescription}
                  onChange={(e) => set("shortDescription", e.target.value)}
                  placeholder="One line shown under the product title"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="p-desc">Description</Label>
              <div className="mt-2">
                <Textarea
                  id="p-desc"
                  rows={5}
                  value={form.description}
                  onChange={(e) => set("description", e.target.value)}
                  placeholder="Fabric, fit, construction and why it matters."
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="p-tags" hint="Comma separated">
                Tags
              </Label>
              <div className="mt-2">
                <Input
                  id="p-tags"
                  value={form.tags}
                  onChange={(e) => set("tags", e.target.value)}
                  placeholder="tee, basic, cotton"
                />
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Product media" description="Drag to reorder — the first image is primary">
          <UploadDropzone value={media} onChange={setMedia} />
        </Panel>

        <Panel title="Pricing">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="p-price">Price (₹)</Label>
              <div className="mt-2">
                <Input
                  id="p-price"
                  inputMode="numeric"
                  value={form.price}
                  onChange={(e) => set("price", e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="p-compare" hint="Optional">
                Compare-at (₹)
              </Label>
              <div className="mt-2">
                <Input
                  id="p-compare"
                  inputMode="numeric"
                  value={form.compareAt}
                  onChange={(e) => set("compareAt", e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="p-cost" hint="Admin only">
                Cost (₹)
              </Label>
              <div className="mt-2">
                <Input
                  id="p-cost"
                  inputMode="numeric"
                  value={form.cost}
                  onChange={(e) => set("cost", e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-6 rounded-[3px] bg-[var(--surface-2)] px-4 py-3 text-[13px]">
            <span className="text-[var(--ink-3)]">
              Margin{" "}
              <span className="ml-1 font-semibold tabular-nums text-[var(--ink)]">
                {margin === null ? "—" : `${margin}%`}
              </span>
            </span>
            <span className="text-[var(--ink-3)]">
              Discount{" "}
              <span className="ml-1 font-semibold tabular-nums text-[var(--accent)]">
                {form.compareAt && Number(form.compareAt) > Number(form.price)
                  ? `${Math.round(((Number(form.compareAt) - Number(form.price)) / Number(form.compareAt)) * 100)}%`
                  : "—"}
              </span>
            </span>
            <span className="text-[var(--ink-3)]">
              You earn{" "}
              <span className="ml-1 font-semibold tabular-nums text-[var(--ink)]">
                {margin === null || !form.price
                  ? "—"
                  : money(Number(form.price) - Number(form.cost))}
              </span>
            </span>
          </div>
        </Panel>

        <Panel title="Inventory">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <Label htmlFor="p-stock">Stock on hand</Label>
              <div className="mt-2">
                <Input
                  id="p-stock"
                  inputMode="numeric"
                  value={form.stock}
                  onChange={(e) => set("stock", e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="p-low">Low-stock alert at</Label>
              <div className="mt-2">
                <Input
                  id="p-low"
                  inputMode="numeric"
                  value={form.lowStock}
                  onChange={(e) => set("lowStock", e.target.value.replace(/\D/g, ""))}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="p-status">Status</Label>
              <div className="mt-2">
                <Select
                  id="p-status"
                  value={form.status}
                  onChange={(e) => set("status", e.target.value)}
                >
                  <option value="active">Active</option>
                  <option value="draft">Draft</option>
                  <option value="archived">Archived</option>
                </Select>
              </div>
            </div>
          </div>

          <label className="mt-4 flex cursor-pointer items-center gap-3 text-[13.5px] text-[var(--ink-2)]">
            <input
              type="checkbox"
              checked={form.trackInventory}
              onChange={(e) => set("trackInventory", e.target.checked)}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            Track inventory and stop selling when out of stock
          </label>
        </Panel>

        <Panel title="Variants" description="Colours and sizes available for this product">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <Label>Colours ({colors.length})</Label>
              <div className="mt-3 flex flex-wrap gap-2">
                {COLOUR_OPTIONS.map((c) => {
                  const active = colors.includes(c.name);
                  return (
                    <button
                      key={c.name}
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        setColors((prev) =>
                          active ? prev.filter((x) => x !== c.name) : [...prev, c.name],
                        )
                      }
                      className={cn(
                        "inline-flex items-center gap-2 rounded-full border py-1.5 pl-1.5 pr-3 text-[12.5px] transition-colors",
                        active
                          ? "border-[var(--ink)] text-[var(--ink)]"
                          : "border-[var(--line-strong)] text-[var(--ink-3)] hover:border-[var(--ink-3)]",
                      )}
                    >
                      <span
                        className="h-5 w-5 rounded-full border border-black/10"
                        style={{ backgroundColor: c.hex }}
                      />
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <Label>Sizes ({sizes.length})</Label>
              <div className="mt-3 flex flex-wrap gap-2">
                {SIZE_OPTIONS.map((s) => {
                  const active = sizes.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      aria-pressed={active}
                      onClick={() =>
                        setSizes((prev) =>
                          active ? prev.filter((x) => x !== s) : [...prev, s],
                        )
                      }
                      className={cn(
                        "min-w-10 rounded-[2px] border px-2.5 py-1.5 text-[12.5px] transition-colors",
                        active
                          ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]"
                          : "border-[var(--line-strong)] text-[var(--ink-3)] hover:border-[var(--ink-3)]",
                      )}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              <div className="mt-4 flex gap-2">
                <Input
                  value={tagDraft}
                  onChange={(e) => setTagDraft(e.target.value)}
                  placeholder="Add a custom size"
                  className="h-9 text-[13px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && tagDraft.trim()) {
                      e.preventDefault();
                      setSizes((prev) => unique([...prev, tagDraft.trim()]));
                      setTagDraft("");
                    }
                  }}
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    if (!tagDraft.trim()) return;
                    setSizes((prev) => unique([...prev, tagDraft.trim()]));
                    setTagDraft("");
                  }}
                >
                  <Plus size={14} /> Add
                </Button>
              </div>
            </div>
          </div>

          <p className="mt-4 text-[12.5px] text-[var(--ink-3)]">
            {colors.length * sizes.length} variant
            {colors.length * sizes.length === 1 ? "" : "s"} will be generated ·{" "}
            <button
              type="button"
              className="text-[var(--accent)] underline underline-offset-4"
              onClick={() =>
                toast({
                  title: "Variants generated",
                  description: `${colors.length * sizes.length} SKUs created from your selection.`,
                  tone: "success",
                })
              }
            >
              Generate SKUs
            </button>
          </p>
        </Panel>

        <Panel title="Shipping">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="p-weight">Weight (kg)</Label>
              <div className="mt-2">
                <Input
                  id="p-weight"
                  value={form.weight}
                  onChange={(e) => set("weight", e.target.value)}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="p-dims">Package dimensions</Label>
              <div className="mt-2">
                <Input
                  id="p-dims"
                  value={form.dimensions}
                  onChange={(e) => set("dimensions", e.target.value)}
                />
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Search engine optimisation">
          <div className="grid gap-4">
            <div>
              <Label htmlFor="p-seo-title" hint={`${form.seoTitle.length}/60`}>
                SEO title
              </Label>
              <div className="mt-2">
                <Input
                  id="p-seo-title"
                  value={form.seoTitle}
                  onChange={(e) => set("seoTitle", e.target.value)}
                  placeholder={form.name || "Product name"}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="p-seo-desc" hint={`${form.seoDescription.length}/160`}>
                Meta description
              </Label>
              <div className="mt-2">
                <Textarea
                  id="p-seo-desc"
                  rows={3}
                  value={form.seoDescription}
                  onChange={(e) => set("seoDescription", e.target.value)}
                />
              </div>
            </div>

            <div className="rounded-[3px] border border-[var(--line)] bg-[var(--surface-2)] p-4">
              <p className="text-[12px] text-[var(--ink-3)]">ateliernoir.example.com ›{" "}
                {form.slug || "product"}</p>
              <p className="mt-1 text-[16px] text-[var(--info)]">
                {form.seoTitle || form.name || "Product title"}
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-[var(--ink-2)]">
                {(form.seoDescription || form.shortDescription || form.description).slice(0, 160) ||
                  "Meta description preview…"}
              </p>
            </div>
          </div>
        </Panel>
      </div>

      {/* sidebar */}
      <div className="space-y-4">
        <Panel title="Status">
          <div className="space-y-3">
            {(
              [
                ["active", "Active", "Visible in the store"],
                ["draft", "Draft", "Hidden from customers"],
                ["archived", "Archived", "Hidden and read-only"],
              ] as const
            ).map(([value, label, hint]) => (
              <label
                key={value}
                className={cn(
                  "flex cursor-pointer items-start gap-3 rounded-[3px] border p-3 transition-colors",
                  form.status === value
                    ? "border-[var(--ink)] bg-[var(--surface-2)]"
                    : "border-[var(--line)] hover:border-[var(--line-strong)]",
                )}
              >
                <input
                  type="radio"
                  name="status"
                  className="mt-1 h-3.5 w-3.5 accent-[var(--accent)]"
                  checked={form.status === value}
                  onChange={() => set("status", value)}
                />
                <span>
                  <span className="block text-[13.5px] font-medium text-[var(--ink)]">
                    {label}
                  </span>
                  <span className="block text-[12.5px] text-[var(--ink-3)]">{hint}</span>
                </span>
              </label>
            ))}
          </div>
        </Panel>

        <Panel title="Organisation">
          <div className="space-y-4">
            <div>
              <Label>Colours</Label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {colors.length ? (
                  colors.map((name) => {
                    const hex = COLOUR_OPTIONS.find((c) => c.name === name)?.hex ?? "#999";
                    return (
                      <span
                        key={name}
                        className="inline-flex items-center gap-1.5 rounded-full border border-[var(--line)] py-1 pl-1 pr-2.5 text-[12px] text-[var(--ink-2)]"
                      >
                        <span
                          className="h-4 w-4 rounded-full border border-black/10"
                          style={{ backgroundColor: hex }}
                        />
                        {name}
                        <button
                          type="button"
                          aria-label={`Remove ${name}`}
                          onClick={() => setColors((prev) => prev.filter((x) => x !== name))}
                          className="text-[var(--ink-3)] hover:text-[var(--danger)]"
                        >
                          <X size={11} />
                        </button>
                      </span>
                    );
                  })
                ) : (
                  <span className="text-[13px] text-[var(--ink-3)]">No colours selected</span>
                )}
              </div>
            </div>

            <div>
              <Label>Sizes</Label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {sizes.length ? (
                  sizes.map((s) => (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 rounded-[2px] border border-[var(--line)] px-2 py-1 text-[12px] text-[var(--ink-2)]"
                    >
                      {s}
                      <button
                        type="button"
                        aria-label={`Remove size ${s}`}
                        onClick={() => setSizes((prev) => prev.filter((x) => x !== s))}
                        className="text-[var(--ink-3)] hover:text-[var(--danger)]"
                      >
                        <X size={11} />
                      </button>
                    </span>
                  ))
                ) : (
                  <span className="text-[13px] text-[var(--ink-3)]">No sizes selected</span>
                )}
              </div>
            </div>
          </div>
        </Panel>

        <div className="rounded-[3px] border border-dashed border-[var(--line-strong)] bg-[var(--accent-tint)] p-4">
          <p className="flex items-center gap-2 text-[13px] font-medium text-[var(--accent)]">
            <Sparkles size={14} /> Writing help
          </p>
          <p className="mt-2 text-[12.5px] leading-relaxed text-[var(--ink-2)]">
            Describe the fabric, the fit and one concrete detail — “280gsm commed cotton, boxy
            fit, taped shoulder seams” converts better than adjectives.
          </p>
          <button
            type="button"
            className="mt-3 text-[12.5px] font-medium text-[var(--accent)] underline underline-offset-4"
            onClick={() => {
              set(
                "shortDescription",
                form.shortDescription ||
                  "Premium construction with a considered fit, made to be worn on rotation.",
              );
              toast({ title: "Suggestion inserted", tone: "success" });
            }}
          >
            Insert a starter
          </button>
        </div>
      </div>
    </div>

    {/* sticky actions */}
    <div className="sticky bottom-0 z-20 mt-4 flex flex-wrap items-center gap-3 border-t border-[var(--line)] bg-[var(--bg)]/95 px-1 py-4 backdrop-blur">
      <p className="text-[12.5px] text-[var(--ink-3)]">
        {editing ? "Editing " : "Creating "}
        <span className="text-[var(--ink)]">{form.name || "untitled product"}</span>
      </p>
      <div className="ml-auto flex flex-wrap gap-2">
        <Button variant="ghost" onClick={() => router.push("/admin/products")}>
          Cancel
        </Button>
        <Button
          variant="outline"
          icon={<Eye size={15} />}
          onClick={() => {
            if (editing && product?.slug) {
              router.push(`/product/${product.slug}`);
              return;
            }
            if (!form.name.trim()) {
              toast({ title: "Give the product a name first", tone: "error" });
              return;
            }
            toast({
              title: "Preview after publishing",
              description: "New products appear on the storefront once published.",
            });
          }}
        >
          Preview
        </Button>
        <Button variant="outline" loading={saving} onClick={() => submit(false)}>
          Save draft
        </Button>
        <Button loading={saving} icon={<Check size={15} />} onClick={() => submit(true)}>
          {editing ? "Save changes" : "Publish product"}
        </Button>
      </div>
    </div>
    </>
  );
}
