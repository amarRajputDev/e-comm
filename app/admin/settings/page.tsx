"use client";

import { useState } from "react";
import { Building2, CreditCard, Globe, Truck, Users2, KeyRound, Check } from "lucide-react";
import { SITE, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE, EXPRESS_SHIPPING_FEE } from "@/lib/tokens";
import { useUi } from "@/lib/store/providers";
import { usePersistentState } from "@/lib/store/persistent";
import { Button } from "@/components/ui/button";

interface StoreSettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  gst: string;
  freeShip: string;
  standardShip: string;
  expressShip: string;
}
import { Input, Label, Select } from "@/components/ui/input";
import { PageHeader, Panel } from "@/components/admin/panel";
import { cn } from "@/lib/utils";

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-3">
      <div>
        <p className="text-[13.5px] font-medium text-[var(--ink)]">{label}</p>
        {hint ? <p className="mt-0.5 text-[12.5px] text-[var(--ink-3)]">{hint}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className="relative mt-0.5 h-5 w-9 shrink-0 rounded-full transition-colors"
        style={{ backgroundColor: checked ? "var(--accent)" : "var(--line-strong)" }}
      >
        <span
          className={cn(
            "absolute top-0.5 h-4 w-4 rounded-full bg-white transition-transform",
            checked ? "translate-x-4.5" : "translate-x-0.5",
          )}
        />
      </button>
    </div>
  );
}

export default function AdminSettingsPage() {
  const { toast } = useUi();
  /* Persisted to this device so a reload shows exactly what you saved. */
  const [store, setStore] = usePersistentState<StoreSettings>("an.adminSettings.store", {
    name: SITE.name,
    email: SITE.email,
    phone: SITE.phone,
    address: SITE.address,
    currency: "INR",
    gst: "18",
    freeShip: String(FREE_SHIPPING_THRESHOLD),
    standardShip: String(STANDARD_SHIPPING_FEE),
    expressShip: String(EXPRESS_SHIPPING_FEE),
  });
  const [payments, setPayments] = usePersistentState("an.adminSettings.payments", {
    upi: true,
    card: true,
    netbanking: true,
    cod: true,
    codFee: false,
  });
  const [saved, setSaved] = useState(false);

  const save = () => {
    setStore((prev) => ({ ...prev }));
    setPayments((prev) => ({ ...prev }));
    setSaved(true);
    toast({
      title: "Settings saved",
      description: "Store configuration persisted to this device.",
      tone: "success",
    });
    window.setTimeout(() => setSaved(false), 2400);
  };

  return (
    <div>
      <PageHeader
        title="Settings"
        description="Store configuration, payments, shipping and team access."
        actions={
          <Button size="sm" onClick={save} icon={saved ? <Check size={14} /> : undefined}>
            {saved ? "Saved" : "Save changes"}
          </Button>
        }
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <Panel title="Store details" description="Shown on invoices and the footer">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[3px] bg-[var(--surface-2)] text-[var(--ink-3)]">
              <Building2 size={16} strokeWidth={1.6} />
            </span>
            <div className="grid flex-1 gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="s-name">Store name</Label>
                <div className="mt-2">
                  <Input id="s-name" value={store.name} onChange={(e) => setStore({ ...store, name: e.target.value })} />
                </div>
              </div>
              <div>
                <Label htmlFor="s-email">Support email</Label>
                <div className="mt-2">
                  <Input
                    id="s-email"
                    type="email"
                    value={store.email}
                    onChange={(e) => setStore({ ...store, email: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="s-phone">Support phone</Label>
                <div className="mt-2">
                  <Input
                    id="s-phone"
                    value={store.phone}
                    onChange={(e) => setStore({ ...store, phone: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="s-currency">Currency</Label>
                <div className="mt-2">
                  <Select
                    id="s-currency"
                    value={store.currency}
                    onChange={(e) => setStore({ ...store, currency: e.target.value })}
                  >
                    <option value="INR">INR — Indian Rupee</option>
                    <option value="USD">USD — US Dollar</option>
                    <option value="AED">AED — UAE Dirham</option>
                  </Select>
                </div>
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="s-addr">Business address</Label>
                <div className="mt-2">
                  <Input
                    id="s-addr"
                    value={store.address}
                    onChange={(e) => setStore({ ...store, address: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Tax" description="GST handling for Indian orders">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="s-gst">GST rate (%)</Label>
              <div className="mt-2">
                <Input
                  id="s-gst"
                  inputMode="numeric"
                  value={store.gst}
                  onChange={(e) => setStore({ ...store, gst: e.target.value.replace(/\D/g, "") })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="s-taxmode">Price display</Label>
              <div className="mt-2">
                <Select id="s-taxmode" defaultValue="inclusive">
                  <option value="inclusive">Inclusive of tax</option>
                  <option value="exclusive">Added at checkout</option>
                </Select>
              </div>
            </div>
          </div>
          <p className="mt-4 rounded-[3px] bg-[var(--surface-2)] p-3 text-[12.5px] leading-relaxed text-[var(--ink-2)]">
            Product prices are currently shown inclusive of GST. Order summaries show the tax
            portion separately so customers can see exactly what they are paying.
          </p>
        </Panel>

        <Panel title="Shipping" description="Rates applied at checkout">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[3px] bg-[var(--surface-2)] text-[var(--ink-3)]">
              <Truck size={16} strokeWidth={1.6} />
            </span>
            <div className="grid flex-1 gap-4 sm:grid-cols-3">
              <div>
                <Label htmlFor="s-free">Free over (₹)</Label>
                <div className="mt-2">
                  <Input
                    id="s-free"
                    inputMode="numeric"
                    value={store.freeShip}
                    onChange={(e) => setStore({ ...store, freeShip: e.target.value.replace(/\D/g, "") })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="s-std">Standard (₹)</Label>
                <div className="mt-2">
                  <Input
                    id="s-std"
                    inputMode="numeric"
                    value={store.standardShip}
                    onChange={(e) => setStore({ ...store, standardShip: e.target.value.replace(/\D/g, "") })}
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="s-exp">Express (₹)</Label>
                <div className="mt-2">
                  <Input
                    id="s-exp"
                    inputMode="numeric"
                    value={store.expressShip}
                    onChange={(e) => setStore({ ...store, expressShip: e.target.value.replace(/\D/g, "") })}
                  />
                </div>
              </div>
            </div>
          </div>
        </Panel>

        <Panel title="Payments" description="Methods customers can use">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[3px] bg-[var(--surface-2)] text-[var(--ink-3)]">
              <CreditCard size={16} strokeWidth={1.6} />
            </span>
            <div className="flex-1 divide-y divide-[var(--line)]">
              <Toggle label="UPI" hint="GPay, PhonePe, Paytm and more" checked={payments.upi} onChange={(v) => setPayments({ ...payments, upi: v })} />
              <Toggle label="Cards" hint="Visa, Mastercard, Amex" checked={payments.card} onChange={(v) => setPayments({ ...payments, card: v })} />
              <Toggle label="Net banking" hint="All major Indian banks" checked={payments.netbanking} onChange={(v) => setPayments({ ...payments, netbanking: v })} />
              <Toggle label="Cash on delivery" hint="Charge a handling fee" checked={payments.cod} onChange={(v) => setPayments({ ...payments, cod: v })} />
            </div>
          </div>
        </Panel>

        <Panel title="Team" description="Staff with console access">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[3px] bg-[var(--surface-2)] text-[var(--ink-3)]">
              <Users2 size={16} strokeWidth={1.6} />
            </span>
            <ul className="flex-1 divide-y divide-[var(--line)]">
              {[
                ["Nisha Kulkarni", "Owner", "nisha@ateliernoir.example.com"],
                ["Ravi Menon", "Fulfilment manager", "ravi@ateliernoir.example.com"],
                ["Priya Das", "Support lead", "priya@ateliernoir.example.com"],
              ].map(([name, role, email]) => (
                <li key={email} className="flex items-center gap-3 py-3">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[var(--surface-2)] text-[11px] font-semibold text-[var(--ink-2)]">
                    {name.split(" ").map((n) => n[0]).join("")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13.5px] font-medium text-[var(--ink)]">{name}</p>
                    <p className="truncate text-[12.5px] text-[var(--ink-3)]">{email}</p>
                  </div>
                  <span className="shrink-0 rounded-[3px] border border-[var(--line)] px-2 py-0.5 text-[11.5px] text-[var(--ink-3)]">
                    {role}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="mt-3"
            onClick={() => toast({ title: "Invite sent", description: "They’ll get an email shortly.", tone: "success" })}
          >
            Invite teammate
          </Button>
        </Panel>

        <Panel title="API keys & integrations" description="Used by the storefront and services">
          <div className="flex items-start gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[3px] bg-[var(--surface-2)] text-[var(--ink-3)]">
              <KeyRound size={16} strokeWidth={1.6} />
            </span>
            <ul className="flex-1 space-y-3 text-[13px]">
              {[
                ["Supabase URL", "https://ateliernoir.supabase.co"],
                ["Store API key", "an_live_••••••••••••4f2a"],
                ["Payment gateway", "Razorpay · rk_live_••••••8d1"],
                ["Email provider", "Resend · connected"],
              ].map(([k, v]) => (
                <li key={k} className="flex items-center justify-between gap-4">
                  <span className="text-[var(--ink-3)]">{k}</span>
                  <span className="truncate font-mono text-[12.5px] text-[var(--ink)]">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-[3px] border border-[var(--danger)]/30 bg-[var(--danger)]/6 p-5">
        <div>
          <p className="flex items-center gap-2 text-[14px] font-medium text-[var(--danger)]">
            <Globe size={15} /> Pause storefront
          </p>
          <p className="mt-1 max-w-2xl text-[13px] text-[var(--ink-2)]">
            Temporarily hide the storefront while you fix stock or content. Orders cannot be
            placed during this time.
          </p>
        </div>
        <Button
          variant="outline"
          className="border-[var(--danger)]/40 text-[var(--danger)] hover:bg-[var(--danger)]/10"
          onClick={() =>
            toast({
              title: "Action blocked",
              description: "Store pausing requires owner confirmation.",
              tone: "error",
            })
          }
        >
          Pause store
        </Button>
      </div>
    </div>
  );
}
