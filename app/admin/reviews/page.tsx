"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Trash2, X, ExternalLink } from "lucide-react";
import { reviews as seed } from "@/lib/data/reviews";
import { moderateReview } from "@/lib/services/reviews";
import type { Review, ReviewStatus } from "@/types";
import { timeAgo, formatDate } from "@/lib/format";
import { useUi } from "@/lib/store/providers";
import { StatusPill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Stars } from "@/components/ui/rating";
import { PageHeader, Panel } from "@/components/admin/panel";
import { DataTable, SelectMenu, type Column } from "@/components/admin/data-table";
import { Avatar } from "@/components/admin/avatar";

export default function AdminReviewsPage() {
  const { toast } = useUi();
  const [rows, setRows] = useState<Review[]>(seed);
  const [status, setStatus] = useState("all");
  const [rating, setRating] = useState("all");

  const apply = (id: string, next: ReviewStatus, label: string) => {
    moderateReview(id, next);
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, status: next } : r)));
    toast({ title: label, tone: next === "rejected" ? "error" : "success" });
  };

  const filtered = rows.filter(
    (r) =>
      (status === "all" || r.status === status) &&
      (rating === "all" || r.rating === Number(rating)),
  );

  const pending = rows.filter((r) => r.status === "pending").length;

  const columns: Column<Review>[] = [
    {
      key: "customer",
      header: "Customer",
      sortValue: (r) => r.customerName,
      render: (r) => (
        <div className="flex items-center gap-3">
          <Avatar name={r.customerName} size="sm" />
          <div className="min-w-0">
            <p className="truncate font-medium text-[var(--ink)]">{r.customerName}</p>
            <p className="text-[12px] text-[var(--ink-3)]">
              {r.verified ? "Verified buyer" : "Unverified"}
            </p>
          </div>
        </div>
      ),
    },
    {
      key: "product",
      header: "Product",
      hideBelow: "lg",
      render: (r) => (
        <Link
          href={`/product/${r.productSlug}`}
          className="inline-flex items-center gap-1.5 text-[var(--ink-2)] hover:text-[var(--accent)]"
        >
          <span className="max-w-40 truncate">{r.productName}</span>
          <ExternalLink size={11} />
        </Link>
      ),
    },
    { key: "rating", header: "Rating", sortValue: (r) => r.rating, render: (r) => <Stars value={r.rating} size={12} /> },
    {
      key: "review",
      header: "Review",
      render: (r) => (
        <div className="max-w-md">
          <p className="truncate font-medium text-[var(--ink)]">{r.title}</p>
          <p className="truncate text-[12.5px] text-[var(--ink-3)]">{r.body}</p>
        </div>
      ),
    },
    {
      key: "date",
      header: "Date",
      align: "right",
      hideBelow: "md",
      sortValue: (r) => r.createdAt,
      render: (r) => (
        <span className="text-[12.5px] tabular-nums text-[var(--ink-3)]" title={formatDate(r.createdAt)}>
          {timeAgo(r.createdAt)}
        </span>
      ),
    },
    { key: "status", header: "Status", render: (r) => <StatusPill status={r.status} /> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <button
            type="button"
            aria-label="Approve review"
            disabled={r.status === "approved"}
            onClick={() => apply(r.id, "approved", "Review approved")}
            className="grid h-7 w-7 place-items-center rounded-[3px] text-[var(--ink-3)] transition-colors hover:bg-[var(--success)]/12 hover:text-[var(--success)] disabled:opacity-30"
          >
            <Check size={14} strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="Reject review"
            disabled={r.status === "rejected"}
            onClick={() => apply(r.id, "rejected", "Review rejected")}
            className="grid h-7 w-7 place-items-center rounded-[3px] text-[var(--ink-3)] transition-colors hover:bg-[var(--warning)]/14 hover:text-[var(--warning)] disabled:opacity-30"
          >
            <X size={14} strokeWidth={2} />
          </button>
          <button
            type="button"
            aria-label="Delete review"
            onClick={() => {
              setRows((prev) => prev.filter((x) => x.id !== r.id));
              toast({ title: "Review deleted", tone: "error" });
            }}
            className="grid h-7 w-7 place-items-center rounded-[3px] text-[var(--ink-3)] transition-colors hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
          >
            <Trash2 size={14} strokeWidth={1.7} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Reviews"
        description={`${rows.length} reviews · ${pending} awaiting moderation`}
        actions={
          <Button
            size="sm"
            onClick={() => {
              setRows((prev) => prev.map((r) => (r.status === "pending" ? { ...r, status: "approved" } : r)));
              toast({ title: `${pending} reviews approved`, tone: "success" });
            }}
            disabled={!pending}
          >
            Approve all pending
          </Button>
        }
      />

      <Panel padded={false}>
        <DataTable
          columns={columns}
          rows={filtered}
          getRowId={(r) => r.id}
          searchable
          searchPlaceholder="Search reviews or customers…"
          pageSize={8}
          toolbar={
            <div className="ml-auto flex items-center gap-2">
              <SelectMenu
                value={rating}
                onChange={setRating}
                label="Filter by rating"
                options={[
                  { value: "all", label: "All ratings" },
                  { value: "5", label: "5 stars" },
                  { value: "4", label: "4 stars" },
                  { value: "3", label: "3 stars" },
                ]}
              />
              <SelectMenu
                value={status}
                onChange={setStatus}
                label="Filter by status"
                options={[
                  { value: "all", label: "All statuses" },
                  { value: "pending", label: "Pending" },
                  { value: "approved", label: "Approved" },
                  { value: "rejected", label: "Rejected" },
                ]}
              />
            </div>
          }
          empty={{ title: "No reviews match", description: "Try a different filter." }}
        />
      </Panel>
    </div>
  );
}
