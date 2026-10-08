"use client";

import { useState } from "react";
import { Check, Package, Truck, CheckCircle2, XCircle, RotateCcw } from "lucide-react";
import type { Order, OrderStatus, PaymentStatus } from "@/types";
import { useUi } from "@/lib/store/providers";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { StatusPill } from "@/components/ui/badge";

const FLOW: Record<string, { next: OrderStatus; label: string; icon: typeof Check }> = {
  processing: { next: "confirmed", label: "Confirm order", icon: Check },
  confirmed: { next: "packed", label: "Mark as packed", icon: Package },
  packed: { next: "shipped", label: "Mark as shipped", icon: Truck },
  shipped: { next: "out_for_delivery", label: "Out for delivery", icon: Truck },
  out_for_delivery: { next: "delivered", label: "Mark delivered", icon: CheckCircle2 },
};

export function OrderActions({ order }: { order: Order }) {
  const { toast } = useUi();
  const [dialog, setDialog] = useState<null | "cancel" | "refund">(null);
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [payment, setPayment] = useState<PaymentStatus>(order.paymentStatus);
  const step = FLOW[status];
  const terminal = ["delivered", "cancelled", "returned"].includes(status);

  const advance = () => {
    if (!step) return;
    setStatus(step.next);
    toast({
      title: `${order.number} updated`,
      description: `Now ${step.next.replace("_", " ")}. The customer has been notified.`,
      tone: "success",
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <StatusPill status={status} />
      <StatusPill status={payment} />

      <span className="hidden h-5 w-px bg-[var(--line-strong)] sm:block" />

      <div className="flex flex-wrap items-center gap-2">
        {step ? (
          <Button size="sm" icon={<step.icon size={14} />} onClick={advance}>
            {step.label}
          </Button>
        ) : null}

        <Button
          size="sm"
          variant="outline"
          icon={<Truck size={14} />}
          onClick={() =>
            toast({
              title: "Label sent to printer",
              description: `Shipping label for ${order.number} generated.`,
              tone: "success",
            })
          }
          disabled={terminal}
        >
          Print label
        </Button>

        {!terminal ? (
          <>
            <Button
              size="sm"
              variant="outline"
              icon={<XCircle size={14} />}
              onClick={() => setDialog("cancel")}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="outline"
              icon={<RotateCcw size={14} />}
              onClick={() => setDialog("refund")}
            >
              Refund
            </Button>
          </>
        ) : null}
      </div>

      <Dialog
        open={dialog !== null}
        onClose={() => setDialog(null)}
        title={dialog === "cancel" ? `Cancel ${order.number}?` : `Refund ${order.number}?`}
        description={
          dialog === "cancel"
            ? "The customer will be notified and any payment released within 3–5 working days."
            : `${order.total.toLocaleString("en-IN")} will be returned to the original payment method.`
        }
        footer={
          <>
            <Button variant="ghost" size="sm" onClick={() => setDialog(null)}>
              Keep order
            </Button>
            <Button
              variant={dialog === "cancel" ? "danger" : "primary"}
              size="sm"
              onClick={() => {
                if (dialog === "cancel") {
                  setStatus("cancelled");
                  setPayment("refunded");
                  toast({
                    title: "Order cancelled",
                    description: `${order.number} — refund queued.`,
                    tone: "error",
                  });
                } else {
                  setPayment("refunded");
                  toast({
                    title: "Refund initiated",
                    description: `${order.number} — funds release in 3–5 days.`,
                    tone: "success",
                  });
                }
                setDialog(null);
              }}
            >
              {dialog === "cancel" ? "Cancel order" : "Issue refund"}
            </Button>
          </>
        }
      >
        This demo updates the order state in this session only — the same flow drives the
        production API, including the customer notification.
      </Dialog>
    </div>
  );
}
