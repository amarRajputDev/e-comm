import Link from "next/link";
import { notFound } from "next/navigation";
import { connection } from "next/server";
import { ArrowLeft, Mail, Phone, MapPin, ShoppingBag, Star, Calendar } from "lucide-react";
import { getCustomer } from "@/lib/services/customers";
import { ordersForCustomer } from "@/lib/data/orders";
import { money, formatDate, timeAgo } from "@/lib/format";
import { StatusPill } from "@/components/ui/badge";
import { PageHeader, Panel } from "@/components/admin/panel";
import { Avatar } from "@/components/admin/avatar";

export default async function AdminCustomerDetailPage(
  props: PageProps<"/admin/customers/[id]">,
) {
  // Admin data is live (relative dates) — render per request.
  await connection();

  const { id } = await props.params;
  const customer = await getCustomer(id);
  if (!customer) notFound();

  const orders = ordersForCustomer(customer.id)
    .slice()
    .sort((a, b) => +new Date(b.placedAt) - +new Date(a.placedAt));

  const stats = [
    { k: "Orders", v: String(customer.orderCount), icon: ShoppingBag },
    { k: "Total spent", v: money(customer.totalSpent), icon: ShoppingBag },
    { k: "Lifetime value", v: money(customer.lifetimeValue), icon: Star },
    { k: "Member since", v: formatDate(customer.joinedAt), icon: Calendar },
  ];

  return (
    <div>
      <Link
        href="/admin/customers"
        className="mb-4 inline-flex items-center gap-2 text-[12.5px] text-[var(--ink-3)] transition-colors hover:text-[var(--ink)]"
      >
        <ArrowLeft size={14} /> All customers
      </Link>

      <PageHeader
        title={customer.name}
        description={`${customer.email} · ${customer.city} · joined ${formatDate(customer.joinedAt)}`}
        actions={
          <>
            <StatusPill status={customer.status} />
            <button
              type="button"
              className="inline-flex h-8 items-center rounded-[3px] border border-[var(--line-strong)] px-3 text-[12.5px] text-[var(--ink-2)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)]"
            >
              <Mail size={13} className="mr-1.5" /> Email
            </button>
          </>
        }
      />

      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {stats.map((s) => (
          <div key={s.k} className="border border-[var(--line)] bg-[var(--surface)] p-4">
            <p className="text-[11.5px] uppercase tracking-[0.12em] text-[var(--ink-3)]">{s.k}</p>
            <p className="mt-2 text-[20px] font-semibold tracking-[-0.02em] text-[var(--ink)]">
              {s.v}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 grid gap-4 xl:grid-cols-3">
        <Panel title="Order history" className="xl:col-span-2" padded={false}>
          {orders.length ? (
            <ul className="divide-y divide-[var(--line)]">
              {orders.map((o) => (
                <li key={o.id}>
                  <Link
                    href={`/admin/orders/${o.number}`}
                    className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-[var(--surface-2)]/60"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-medium text-[var(--ink)]">{o.number}</p>
                      <p className="truncate text-[12.5px] text-[var(--ink-3)]">
                        {o.items.map((i) => i.name).join(", ")}
                      </p>
                    </div>
                    <StatusPill status={o.status} />
                    <p className="w-24 text-right text-[14px] font-medium tabular-nums text-[var(--ink)]">
                      {money(o.total)}
                    </p>
                    <p className="hidden w-24 text-right text-[12.5px] text-[var(--ink-3)] sm:block">
                      {formatDate(o.placedAt)}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-8 text-center text-[13.5px] text-[var(--ink-3)]">
              No orders yet.
            </p>
          )}
        </Panel>

        <div className="space-y-4">
          <Panel title="Contact">
            <div className="flex items-center gap-3">
              <Avatar name={customer.name} size="lg" />
              <div className="min-w-0">
                <p className="text-[15px] font-medium text-[var(--ink)]">{customer.name}</p>
                <p className="truncate text-[13px] text-[var(--ink-3)]">{customer.email}</p>
              </div>
            </div>
            <ul className="mt-4 space-y-2.5 border-t border-[var(--line)] pt-4 text-[13.5px] text-[var(--ink-2)]">
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-[var(--ink-3)]" /> {customer.email}
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-[var(--ink-3)]" /> {customer.phone}
              </li>
              <li className="flex items-center gap-2.5">
                <MapPin size={14} className="text-[var(--ink-3)]" /> {customer.city}
              </li>
            </ul>
          </Panel>

          <Panel title="Addresses">
            {customer.addresses.length ? (
              <ul className="space-y-4">
                {customer.addresses.map((a) => (
                  <li key={a.id} className="text-[13.5px] leading-relaxed">
                    <p className="font-medium text-[var(--ink)]">
                      {a.label} {a.isDefault ? "· default" : ""}
                    </p>
                    <p className="text-[var(--ink-2)]">
                      {a.line1}
                      {a.line2 ? `, ${a.line2}` : ""}
                      <br />
                      {a.city}, {a.state} {a.pincode}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-[13.5px] text-[var(--ink-3)]">No saved addresses.</p>
            )}
          </Panel>

          <Panel title="Recent activity">
            <ul className="space-y-3 text-[13px]">
              <li className="flex justify-between gap-3">
                <span className="text-[var(--ink-3)]">Last order</span>
                <span className="text-[var(--ink)]">
                  {customer.lastOrderAt ? timeAgo(customer.lastOrderAt) : "—"}
                </span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-[var(--ink-3)]">Average order value</span>
                <span className="tabular-nums text-[var(--ink)]">
                  {money(Math.round(customer.totalSpent / Math.max(customer.orderCount, 1)))}
                </span>
              </li>
              <li className="flex justify-between gap-3">
                <span className="text-[var(--ink-3)]">Status</span>
                <span className="capitalize text-[var(--ink)]">{customer.status}</span>
              </li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
