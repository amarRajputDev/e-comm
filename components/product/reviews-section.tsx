"use client";

import { useEffect, useMemo, useState } from "react";
import { BadgeCheck, ThumbsUp, PenLine, Star, Check } from "lucide-react";
import type { Review } from "@/types";
import { Stars } from "@/components/ui/rating";
import { EmptyState } from "@/components/ui/empty-state";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input, Label, Textarea } from "@/components/ui/input";
import { useSession, useUi } from "@/lib/store/providers";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/utils";

export function ReviewsSection({
  reviews,
  product,
}: {
  reviews: Review[];
  product?: { id: string; name: string; slug: string };
}) {
  const { user } = useSession();
  const { toast } = useUi();
  const [ratingFilter, setRatingFilter] = useState<number | "all">("all");
  const [list, setList] = useState<Review[]>(reviews);
  const [helpful, setHelpful] = useState<Record<string, number>>({});
  const [open, setOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [draft, setDraft] = useState({ rating: 5, title: "", body: "", name: "" });

  useEffect(() => setList(reviews), [reviews]);

  useEffect(() => {
    if (open && user) setDraft((d) => ({ ...d, name: d.name || user.name }));
  }, [open, user]);

  const stats = useMemo(() => {
    const total = list.length;
    const avg = total ? list.reduce((n, r) => n + r.rating, 0) / total : 0;
    const dist = [5, 4, 3, 2, 1].map((star) => ({
      star,
      count: list.filter((r) => r.rating === star).length,
    }));
    return { total, avg, dist };
  }, [list]);

  const visible =
    ratingFilter === "all" ? list : list.filter((r) => r.rating === ratingFilter);

  const submit = () => {
    const next: Record<string, string> = {};
    if (draft.name.trim().length < 2) next.name = "Tell us your name.";
    if (draft.title.trim().length < 4) next.title = "Sum it up in a few words.";
    if (draft.body.trim().length < 15) next.body = "At least a sentence, please.";
    setErrors(next);
    if (Object.keys(next).length) return;

    const initials = draft.name
      .trim()
      .split(/\s+/)
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const created: Review = {
      id: `rev-local-${Date.now()}`,
      productId: product?.id ?? "unknown",
      productName: product?.name ?? "Product",
      productSlug: product?.slug ?? "",
      customerName: draft.name.trim(),
      customerInitials: initials,
      rating: draft.rating,
      title: draft.title.trim(),
      body: draft.body.trim(),
      createdAt: new Date().toISOString(),
      status: "approved",
      verified: Boolean(user),
      helpful: 0,
    };

    setList((prev) => [created, ...prev]);
    setOpen(false);
    setDraft({ rating: 5, title: "", body: "", name: draft.name });
    setRatingFilter("all");
    toast({
      title: "Review published",
      description: "Thanks — it helps other shoppers decide.",
      tone: "success",
    });
  };

  return (
    <section id="reviews" className="scroll-mt-32 border-t border-[var(--line)] pt-14">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <p className="eyebrow text-[var(--accent)]">Customer reviews</p>
          <h2 className="h2 mt-4 text-[var(--ink)]">What people say</h2>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex h-11 items-center gap-2 rounded-[2px] border border-[var(--line-strong)] px-5 text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--ink)] transition-colors hover:border-[var(--ink)] hover:bg-[var(--ink)] hover:text-[var(--bg)]"
        >
          <PenLine size={14} strokeWidth={1.6} /> Write a review
        </button>
      </div>

      <div className="mt-9 grid gap-10 lg:grid-cols-[280px_1fr]">
        {/* summary */}
        <div className="lg:border-r lg:border-[var(--line)] lg:pr-10">
          <div className="flex items-end gap-3">
            <span className="text-[56px] font-medium leading-none tracking-[-0.04em] text-[var(--ink)]">
              {stats.avg.toFixed(1)}
            </span>
            <div className="pb-1.5">
              <Stars value={stats.avg} size={15} />
              <p className="mt-1 text-[12.5px] text-[var(--ink-3)]">
                {stats.total} verified reviews
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-2">
            {stats.dist.map((d) => {
              const pct = stats.total ? (d.count / stats.total) * 100 : 0;
              return (
                <button
                  key={d.star}
                  type="button"
                  onClick={() =>
                    setRatingFilter(ratingFilter === d.star ? "all" : d.star)
                  }
                  className="flex w-full items-center gap-3 text-left"
                >
                  <span className="w-8 text-[12.5px] tabular-nums text-[var(--ink-3)]">
                    {d.star}★
                  </span>
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-[var(--surface-2)]">
                    <span
                      className={cn(
                        "block h-full rounded-full transition-all duration-500",
                        ratingFilter === d.star ? "bg-[var(--accent)]" : "bg-[var(--ink)]/70",
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                  <span className="w-6 text-right text-[12px] tabular-nums text-[var(--ink-3)]">
                    {d.count}
                  </span>
                </button>
              );
            })}
          </div>

          {ratingFilter !== "all" ? (
            <button
              type="button"
              onClick={() => setRatingFilter("all")}
              className="mt-5 text-[12px] uppercase tracking-[0.12em] text-[var(--accent)] underline-offset-4 hover:underline"
            >
              Clear filter
            </button>
          ) : null}
        </div>

        {/* list */}
        <div>
          {visible.length ? (
            <ul className="divide-y divide-[var(--line)]">
              {visible.map((r) => (
                <li key={r.id} className="py-7 first:pt-0">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[var(--surface-2)] text-[13px] font-medium text-[var(--ink-2)]">
                        {r.customerInitials}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                          <p className="text-[14.5px] font-medium text-[var(--ink)]">
                            {r.customerName}
                          </p>
                          {r.verified ? (
                            <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.1em] text-[var(--success)]">
                              <BadgeCheck size={13} strokeWidth={1.75} /> Verified buyer
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-2 flex items-center gap-3">
                          <Stars value={r.rating} size={13} />
                          <span className="text-[12.5px] text-[var(--ink-3)]">
                            {timeAgo(r.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <span className="rounded-[2px] bg-[var(--surface-2)] px-2.5 py-1 text-[11px] uppercase tracking-[0.1em] text-[var(--ink-3)]">
                      {r.productName}
                    </span>
                  </div>

                  <h3 className="mt-4 text-[15.5px] font-medium text-[var(--ink)]">{r.title}</h3>
                  <p className="mt-2 max-w-3xl text-[14.5px] leading-relaxed text-[var(--ink-2)]">
                    {r.body}
                  </p>

                  <button
                    type="button"
                    aria-pressed={Boolean(helpful[r.id])}
                    onClick={() =>
                      setHelpful((prev) => {
                        const next = { ...prev };
                        if (next[r.id]) delete next[r.id];
                        else next[r.id] = r.helpful + 1;
                        return next;
                      })
                    }
                    className={cn(
                      "mt-4 inline-flex items-center gap-2 text-[12.5px] transition-colors",
                      helpful[r.id]
                        ? "text-[var(--accent)]"
                        : "text-[var(--ink-3)] hover:text-[var(--ink)]",
                    )}
                  >
                    <ThumbsUp
                      size={13}
                      strokeWidth={1.6}
                      fill={helpful[r.id] ? "currentColor" : "none"}
                    />
                    Helpful ({helpful[r.id] ?? r.helpful})
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState
              compact
              title="No reviews at this rating yet"
              description="Pick another star rating, or be the first to review this piece."
              action={{ label: "Show all reviews", onClick: () => setRatingFilter("all") }}
            />
          )}
        </div>
      </div>

      {/* write a review */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Write a review"
        description={`Share how ${product?.name ?? "this piece"} has worn in. Only reviews from verified buyers are highlighted.`}
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={submit} icon={<Check size={15} />}>
              Publish review
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div>
            <Label>Your rating</Label>
            <div className="mt-2 flex gap-1.5">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  aria-label={`${star} star${star === 1 ? "" : "s"}`}
                  aria-pressed={draft.rating === star}
                  onClick={() => setDraft((d) => ({ ...d, rating: star }))}
                  className={cn(
                    "grid h-9 w-9 place-items-center rounded-[2px] border transition-colors",
                    star <= draft.rating
                      ? "border-[var(--accent)] bg-[var(--accent-tint)] text-[var(--accent)]"
                      : "border-[var(--line-strong)] text-[var(--ink-3)] hover:border-[var(--ink-3)]",
                  )}
                >
                  <Star
                    size={16}
                    strokeWidth={1.5}
                    fill={star <= draft.rating ? "currentColor" : "none"}
                  />
                </button>
              ))}
              <span className="ml-3 self-center text-[13.5px] text-[var(--ink-3)]">
                {["", "Poor", "Fair", "Good", "Great", "Excellent"][draft.rating]}
              </span>
            </div>
          </div>

          <div>
            <Label htmlFor="rv-name">Your name</Label>
            <div className="mt-2">
              <Input
                id="rv-name"
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                error={errors.name}
                placeholder="Amar Verma"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="rv-title">Headline</Label>
            <div className="mt-2">
              <Input
                id="rv-title"
                value={draft.title}
                onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                error={errors.title}
                placeholder="Worth every rupee"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="rv-body" hint={`${draft.body.length}/600`}>
              Your review
            </Label>
            <div className="mt-2">
              <Textarea
                id="rv-body"
                rows={5}
                maxLength={600}
                value={draft.body}
                onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
                placeholder="Fit, fabric, how it has worn in — the details other shoppers want."
              />
            </div>
            {errors.body ? (
              <p role="alert" className="mt-1.5 text-[12.5px] text-[var(--danger)]">
                {errors.body}
              </p>
            ) : null}
          </div>
        </div>
      </Dialog>
    </section>
  );
}
