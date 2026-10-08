import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Mail, Phone, MapPin } from "lucide-react";
import { getOrder } from "@/lib/services/orders";
import { money, formatDate } from "@/lib/format";
import { Panel, PageHeader } from "@/components/admin/panel";
import { OrderTimeline } from "@/components/account/order-timeline";
import { OrderActions } from "@/components/admin/order-actions";
import { Avatar } from "@/components/admin/avatar";
import { SaveNoteButton } from "@/components/admin/save-note-button";
import { Img } from "@/components/ui/img";

export default async function AdminOrderDetailPage(props: PageProps<"/admin/orders/[id]">) {
  const { id } = await props.params;
  const order = await getOrder(id);
  if (!order) notFound();

  return (
    <div>
      <Link
        href="/admin/orders"
        className="mb-4 inline-flex items-center gap-2 text-[12.5px] text-[var(--ink-3)] transition-colors hover:text-[var(--ink)]"
      >
        <ArrowLeft size={14} /> All orders
      </Link>

      <PageHeader
        title={order.number}
        description={`Placed ${formatDate(order.placedAt, {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })} · ${order.itemCount} items · ETA ${order.eta}`}
        actions={<OrderActions order={order} />}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <Panel title="Items" padded={false}>
            <ul className="divide-y divide-[var(--line)]">
              {order.items.map((item) => (
                <li key={`${item.productId}-${item.variantLabel}`} className="flex gap-4 px-4 py-3.5">
                  <span className="h-16 w-14 shrink-0 overflow-hidden rounded-[2px] bg-[var(--surface-2)]">
                    <Img sizes="64px" width={128} height={160} src={item.image} alt="" className="h-full w-full object-cover" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={`/product/${item.productSlug}`}
                      className="text-[14px] font-medium text-[var(--ink)] hover:text-[var(--accent)]"
                    >
                      {item.name}
                    </Link>
                    <p className="text-[12.5px] text-[var(--ink-3)]">
                      {item.variantLabel} · Qty {item.quantity}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-[14px] font-medium tabular-nums text-[var(--ink)]">
                      {money(item.price * item.quantity)}
                    </p>
                    <p className="text-[12px] tabular-nums text-[var(--ink-3)]">
                      {money(item.price)} each
                    </p>
                  </div>
                </li>
              ))}
            </ul>

            <div className="space-y-2 border-t border-[var(--line)] px-4 py-4 text-[13.5px]">
              <div className="flex justify-between">
                <span className="text-[var(--ink-3)]">Subtotal</span>
                <span className="tabular-nums text-[var(--ink)]">{money(order.subtotal)}</span>
              </div>
              {order.discount > 0 ? (
                <div className="flex justify-between text-[var(--success)]">
                  <span>Discount {order.couponCode ? `(${order.couponCode})` : ""}</span>
                  <span className="tabular-nums">−{money(order.discount)}</span>
                </div>
              ) : null}
              <div className="flex justify-between">
                <span className="text-[var(--ink-3)]">Shipping</span>
                <span className="tabular-nums text-[var(--ink)]">
                  {order.shipping === 0 ? "Free" : money(order.shipping)}
                </span>
              </div>
              <div className="flex justify-between text-[12.5px]">
                <span className="text-[var(--ink-3)]">of which GST</span>
                <span className="tabular-nums text-[var(--ink-3)]">{money(order.tax)}</span>
              </div>
              <div className="flex justify-between border-t border-[var(--line)] pt-3 text-[15px] font-medium">
                <span className="text-[var(--ink)]">Total</span>
                <span className="tabular-nums text-[var(--ink)]">{money(order.total)}</span>
              </div>
            </div>
          </Panel>

          <Panel title="Timeline" description="Every state change on this order">
            <OrderTimeline entries={order.timeline} />
          </Panel>

          <Panel title="Internal notes">
            <textarea
              rows={3}
              defaultValue={order.internalNote ?? ""}
              placeholder="Add a note for the fulfilment team…"
              className="w-full rounded-[3px] border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2.5 text-[13.5px] text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-[var(--ink-3)] focus:outline-none"
            />
            <div className="mt-3 flex justify-end">
              <SaveNoteButton />
            </div>
          </Panel>
        </div>

        <div className="space-y-4">
          <Panel title="Customer">
            <div className="flex items-center gap-3">
              <Avatar name={order.customerName} size="lg" />
              <div className="min-w-0">
                <p className="text-[15px] font-medium text-[var(--ink)]">{order.customerName}</p>
                <p className="truncate text-[13px] text-[var(--ink-3)]">{order.customerEmail}</p>
              </div>
            </div>

            <ul className="mt-4 space-y-2.5 border-t border-[var(--line)] pt-4 text-[13.5px]">
              <li className="flex items-center gap-2.5 text-[var(--ink-2)]">
                <Mail size={14} strokeWidth={1.6} className="text-[var(--ink-3)]" />
                <a href={`mailto:${order.customerEmail}`} className="hover:text-[var(--accent)]">
                  {order.customerEmail}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-[var(--ink-2)]">
                <Phone size={14} strokeWidth={1.6} className="text-[var(--ink-3)]" />
                {order.address.phone}
              </li>
            </ul>

            <Link
              href="/admin/customers"
              className="mt-4 inline-block text-[12.5px] text-[var(--accent)] underline underline-offset-4"
            >
              View customer record
            </Link>
          </Panel>

          <Panel title="Shipping address">
            <p className="flex items-start gap-2.5 text-[14px] leading-relaxed text-[var(--ink-2)]">
              <MapPin size={15} strokeWidth={1.6} className="mt-0.5 shrink-0 text-[var(--ink-3)]" />
              <span>
                <span className="font-medium text-[var(--ink)]">{order.address.fullName}</span>
                <br />
                {order.address.line1}
                {order.address.line2 ? <>, {order.address.line2}</> : null}
                <br />
                {order.address.city}, {order.address.state} {order.address.pincode}
                <br />
                India
              </span>
            </p>
          </Panel>

          <Panel title="Payment">
            <dl className="space-y-3 text-[13.5px]">
              <div className="flex justify-between">
                <dt className="text-[var(--ink-3)]">Method</dt>
                <dd className="capitalize text-[var(--ink)]">{order.paymentMethod}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--ink-3)]">Status</dt>
                <dd className="capitalize text-[var(--ink)]">
                  {order.paymentStatus.replace("_", " ")}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-[var(--ink-3)]">Transaction</dt>
                <dd className="tabular-nums text-[var(--ink)]">TXN{order.number.slice(3)}91</dd>
              </div>
            </dl>
          </Panel>
        </div>
      </div>
    </div>
  );
}
