"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Download, Mail } from "lucide-react";
import { queryCustomers } from "@/lib/services/customers";
import type { Customer } from "@/types";
import { money, formatDate } from "@/lib/format";
import { StatusPill } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUi } from "@/lib/store/providers";
import { PageHeader, Panel } from "@/components/admin/panel";
import { DataTable, SelectMenu, type Column } from "@/components/admin/data-table";
import { Avatar } from "@/components/admin/avatar";

export default function AdminCustomersPage() {
  const router = useRouter();
  const { toast } = useUi();
  const [status, setStatus] = useState("all");
  const [rows, setRows] = useState<Customer[]>([]);

  useEffect(() => {
    let cancelled = false;
    queryCustomers({ perPage: 100 }).then((res) => {
      if (!cancelled) setRows(res.items);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const filtered = rows.filter((c) => status === "all" || c.status === status);

  const columns: Column<Customer>[] = [
    {
      key: "name",
      header: "Customer",
      sortValue: (c) => c.name,
      render: (c) => (
        <div className="flex items-center gap-3">
          <Avatar name={c.name} />
          <div className="min-w-0">
            <p className="truncate font-medium text-[var(--ink)]">{c.name}</p>
            <p className="truncate text-[12px] text-[var(--ink-3)]">{c.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "orders",
      header: "Orders",
      align: "right",
      hideBelow: "md",
      sortValue: (c) => c.orderCount,
      render: (c) => <span className="tabular-nums text-[var(--ink-2)]">{c.orderCount}</span>,
    },
    {
      key: "spent",
      header: "Total spent",
      align: "right",
      sortValue: (c) => c.totalSpent,
      render: (c) => (
        <span className="font-medium tabular-nums text-[var(--ink)]">{money(c.totalSpent)}</span>
      ),
    },
    {
      key: "last",
      header: "Last order",
      hideBelow: "lg",
      sortValue: (c) => c.lastOrderAt ?? "",
      render: (c) => (
        <span className="tabular-nums text-[var(--ink-3)]">
          {c.lastOrderAt ? formatDate(c.lastOrderAt) : "—"}
        </span>
      ),
    },
    { key: "status", header: "Status", render: (c) => <StatusPill status={c.status} /> },
    {
      key: "city",
      header: "City",
      hideBelow: "lg",
      render: (c) => <span className="text-[var(--ink-3)]">{c.city}</span>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (c) => (
        <button
          type="button"
          aria-label={`Email ${c.name}`}
          onClick={(e) => {
            e.stopPropagation();
            toast({ title: "Draft created", description: `Email to ${c.email}` });
          }}
          className="grid h-7 w-7 place-items-center rounded-[3px] text-[var(--ink-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
        >
          <Mail size={14} strokeWidth={1.6} />
        </button>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Customers"
        description="8,942 accounts · 12.4% of them placed an order this month"
        actions={
          <Button
            variant="outline"
            size="sm"
            icon={<Download size={14} />}
            onClick={() => toast({ title: "Customers exported", tone: "success" })}
          >
            Export
          </Button>
        }
      />

      <Panel padded={false}>
        <DataTable
          columns={columns}
          rows={filtered}
          getRowId={(c) => c.id}
          searchable
          searchPlaceholder="Search name, email or city…"
          pageSize={10}
          onRowClick={(c) => router.push(`/admin/customers/${c.id}`)}
          toolbar={
            <SelectMenu
              className="ml-auto"
              value={status}
              onChange={setStatus}
              label="Filter by status"
              options={[
                { value: "all", label: "All customers" },
                { value: "new", label: "New" },
                { value: "active", label: "Active" },
                { value: "vip", label: "VIP" },
                { value: "blocked", label: "Blocked" },
              ]}
            />
          }
          empty={{
            title: rows.length ? "No customers match" : "Loading customers…",
            description: "Try a different status filter.",
          }}
        />
      </Panel>
    </div>
  );
}
