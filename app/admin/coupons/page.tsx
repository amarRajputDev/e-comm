"use client";

import { useState } from "react";
import { Plus, Copy, Percent, IndianRupee } from "lucide-react";
import { coupons as seed } from "@/lib/data/coupons";
import type { Coupon } from "@/types";
import { money, formatDate } from "@/lib/format";
import { useUi } from "@/lib/store/providers";
import { StatusPill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Input, Label, Select } from "@/components/ui/input";
import { PageHeader, Panel } from "@/components/admin/panel";
import { DataTable, type Column } from "@/components/admin/data-table";

export default function AdminCouponsPage() {
  const { toast } = useUi();
  const [rows, setRows] = useState<Coupon[]>(seed);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    code: "",
    type: "percentage",
    value: "10",
    minOrder: "2999",
    maxDiscount: "1500",
    usageLimit: "500",
    expiresAt: "2026-12-31",
    description: "",
  });

  const create = () => {
    if (!draft.code.trim()) {
      toast({ title: "Coupon code is required", tone: "error" });
      return;
    }
    setRows((prev) => [
      {
        id: `cpn-${Date.now()}`,
        code: draft.code.trim().toUpperCase(),
        description: draft.description.trim() || "Custom promotion",
        type: draft.type as "percentage" | "fixed",
        value: Number(draft.value) || 0,
        minOrder: Number(draft.minOrder) || 0,
        maxDiscount: draft.maxDiscount ? Number(draft.maxDiscount) : null,
        used: 0,
        usageLimit: Number(draft.usageLimit) || 100,
        expiresAt: new Date(draft.expiresAt).toISOString(),
        active: true,
        scope: "all",
      },
      ...prev,
    ]);
    setOpen(false);
    setDraft({ ...draft, code: "", description: "" });
    toast({ title: "Coupon created", tone: "success" });
  };

  const columns: Column<Coupon>[] = [
    {
      key: "code",
      header: "Code",
      sortValue: (c) => c.code,
      render: (c) => (
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(c.code);
            toast({ title: "Copied", description: c.code, tone: "success" });
          }}
          className="group inline-flex items-center gap-2 font-mono text-[13.5px] font-medium tracking-[0.06em] text-[var(--ink)]"
        >
          {c.code}
          <Copy size={12} className="text-[var(--ink-3)] opacity-0 transition group-hover:opacity-100" />
        </button>
      ),
    },
    {
      key: "value",
      header: "Discount",
      sortValue: (c) => c.value,
      render: (c) => (
        <span className="inline-flex items-center gap-1.5 font-medium text-[var(--accent)]">
          {c.type === "percentage" ? <Percent size={13} /> : <IndianRupee size={13} />}
          {c.value}
          {c.type === "percentage" ? "%" : ""}
          <span className="font-normal text-[var(--ink-3)]">
            · min {money(c.minOrder)}
          </span>
        </span>
      ),
    },
    {
      key: "usage",
      header: "Usage",
      align: "right",
      hideBelow: "md",
      sortValue: (c) => c.used,
      render: (c) => (
        <div>
          <p className="tabular-nums text-[var(--ink)]">
            {c.used} / {c.usageLimit}
          </p>
          <div className="mt-1 h-1 w-24 overflow-hidden rounded-full bg-[var(--surface-2)]">
            <div
              className="h-full rounded-full bg-[var(--accent)]"
              style={{ width: `${Math.min(100, (c.used / c.usageLimit) * 100)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: "expires",
      header: "Expires",
      hideBelow: "lg",
      sortValue: (c) => c.expiresAt,
      render: (c) => <span className="tabular-nums text-[var(--ink-3)]">{formatDate(c.expiresAt)}</span>,
    },
    { key: "status", header: "Status", render: (c) => <StatusPill status={c.active ? "active" : "blocked"} /> },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (c) => (
        <button
          type="button"
          onClick={() => {
            setRows((prev) =>
              prev.map((x) => (x.id === c.id ? { ...x, active: !x.active } : x)),
            );
            toast({ title: c.active ? `${c.code} paused` : `${c.code} activated` });
          }}
          className="h-7 rounded-[3px] border border-[var(--line)] px-2.5 text-[12.5px] text-[var(--ink-3)] transition-colors hover:border-[var(--ink-3)] hover:text-[var(--ink)]"
        >
          {c.active ? "Pause" : "Activate"}
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Coupons"
        description="Discount codes, usage limits and expiry — synced to checkout."
        actions={
          <Button size="sm" icon={<Plus size={15} />} onClick={() => setOpen(true)}>
            New coupon
          </Button>
        }
      />

      <Panel padded={false}>
        <DataTable
          columns={columns}
          rows={rows}
          getRowId={(c) => c.id}
          searchable
          searchPlaceholder="Search a coupon code…"
          pageSize={8}
          empty={{ title: "No coupons yet", description: "Create your first promotion." }}
        />
      </Panel>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title="Create a coupon"
        description="Codes are case-insensitive and apply at checkout."
        size="lg"
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button size="sm" onClick={create}>
              Create coupon
            </Button>
          </>
        }
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor="cp-code">Code</Label>
            <div className="mt-2">
              <Input
                id="cp-code"
                value={draft.code}
                onChange={(e) => setDraft({ ...draft, code: e.target.value.toUpperCase() })}
                placeholder="FESTIVE20"
                className="font-mono uppercase"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cp-type">Discount type</Label>
            <div className="mt-2">
              <Select
                id="cp-type"
                value={draft.type}
                onChange={(e) => setDraft({ ...draft, type: e.target.value })}
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed amount (₹)</option>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="cp-value">{draft.type === "percentage" ? "Percentage off" : "Amount off (₹)"}</Label>
            <div className="mt-2">
              <Input
                id="cp-value"
                inputMode="numeric"
                value={draft.value}
                onChange={(e) => setDraft({ ...draft, value: e.target.value.replace(/\D/g, "") })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cp-min">Minimum order (₹)</Label>
            <div className="mt-2">
              <Input
                id="cp-min"
                inputMode="numeric"
                value={draft.minOrder}
                onChange={(e) => setDraft({ ...draft, minOrder: e.target.value.replace(/\D/g, "") })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cp-max" hint="Optional">
              Maximum discount (₹)
            </Label>
            <div className="mt-2">
              <Input
                id="cp-max"
                inputMode="numeric"
                value={draft.maxDiscount}
                onChange={(e) => setDraft({ ...draft, maxDiscount: e.target.value.replace(/\D/g, "") })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cp-limit">Usage limit</Label>
            <div className="mt-2">
              <Input
                id="cp-limit"
                inputMode="numeric"
                value={draft.usageLimit}
                onChange={(e) => setDraft({ ...draft, usageLimit: e.target.value.replace(/\D/g, "") })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cp-exp">Expires</Label>
            <div className="mt-2">
              <Input
                id="cp-exp"
                type="date"
                value={draft.expiresAt}
                onChange={(e) => setDraft({ ...draft, expiresAt: e.target.value })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="cp-desc" hint="Optional">
              Internal description
            </Label>
            <div className="mt-2">
              <Input
                id="cp-desc"
                value={draft.description}
                onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                placeholder="Festive campaign"
              />
            </div>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
