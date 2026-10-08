"use client";

import { useState } from "react";
import { MapPin, Plus, Star, Trash2, Pencil } from "lucide-react";
import type { Address } from "@/types";
import { useSession, useUi } from "@/lib/store/providers";
import { addresses as seedAddresses } from "@/lib/data/customers";
import { Dialog } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";
import { Label, Input } from "@/components/ui/input";

const EMPTY: Address = {
  id: "",
  label: "Home",
  fullName: "",
  phone: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  pincode: "",
  country: "India",
  isDefault: false,
};

export default function AddressesPage() {
  const { user } = useSession();
  const { toast } = useUi();
  const [list, setList] = useState<Address[]>(() =>
    user ? (seedAddresses[user.id] ?? []) : [],
  );
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Address>(EMPTY);

  if (!user) return null;

  const save = () => {
    if (!draft.fullName.trim() || !draft.line1.trim() || !draft.city.trim()) {
      toast({ title: "Fill in the required fields", tone: "error" });
      return;
    }
    const exists = list.some((a) => a.id === draft.id);
    const next: Address = {
      ...draft,
      id: draft.id || `addr-${Date.now()}`,
    };
    setList((prev) =>
      exists ? prev.map((a) => (a.id === next.id ? next : a)) : [...prev, next],
    );
    if (next.isDefault) {
      setList((prev) => prev.map((a) => ({ ...a, isDefault: a.id === next.id })));
    }
    setOpen(false);
    setDraft(EMPTY);
    toast({
      title: exists ? "Address updated" : "Address added",
      description: `${next.label} — ${next.city}`,
      tone: "success",
    });
  };

  const set = (patch: Partial<Address>) => setDraft((p) => ({ ...p, ...patch }));

  return (
    <div>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--line)] pb-7">
        <div>
          <p className="eyebrow text-[var(--accent)]">Delivery</p>
          <h1 className="h1 mt-3 text-[var(--ink)]">Saved addresses</h1>
          <p className="mt-3 text-[15px] text-[var(--ink-3)]">
            Manage where your orders land. One click at checkout.
          </p>
        </div>
        <Button
          icon={<Plus size={15} />}
          onClick={() => {
            setDraft({ ...EMPTY, fullName: user.name, phone: user.phone ?? "" });
            setOpen(true);
          }}
        >
          Add address
        </Button>
      </header>

      {list.length ? (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2">
          {list.map((address) => (
            <li
              key={address.id}
              className="flex flex-col border border-[var(--line)] bg-[var(--surface)] p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <MapPin size={15} strokeWidth={1.6} className="text-[var(--ink-3)]" />
                  <p className="text-[15px] font-medium text-[var(--ink)]">{address.label}</p>
                  {address.isDefault ? <Badge tone="accent">Default</Badge> : null}
                </div>

                <div className="flex gap-1">
                  <button
                    type="button"
                    aria-label={`Edit ${address.label} address`}
                    onClick={() => {
                      setDraft(address);
                      setOpen(true);
                    }}
                    className="grid h-8 w-8 place-items-center rounded-full text-[var(--ink-3)] transition-colors hover:bg-[var(--surface-2)] hover:text-[var(--ink)]"
                  >
                    <Pencil size={14} strokeWidth={1.6} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Delete ${address.label} address`}
                    onClick={() => {
                      setList((prev) => prev.filter((a) => a.id !== address.id));
                      toast({ title: "Address removed" });
                    }}
                    className="grid h-8 w-8 place-items-center rounded-full text-[var(--ink-3)] transition-colors hover:bg-[var(--danger)]/10 hover:text-[var(--danger)]"
                  >
                    <Trash2 size={14} strokeWidth={1.6} />
                  </button>
                </div>
              </div>

              <div className="mt-4 flex-1 text-[14px] leading-relaxed text-[var(--ink-2)]">
                <p className="font-medium text-[var(--ink)]">{address.fullName}</p>
                <p>
                  {address.line1}
                  {address.line2 ? `, ${address.line2}` : ""}
                </p>
                <p>
                  {address.city}, {address.state} {address.pincode}
                </p>
                <p className="text-[var(--ink-3)]">{address.phone}</p>
              </div>

              {!address.isDefault ? (
                <button
                  type="button"
                  onClick={() =>
                    setList((prev) =>
                      prev.map((a) => ({ ...a, isDefault: a.id === address.id })),
                    )
                  }
                  className="mt-5 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.12em] text-[var(--ink-2)] transition-colors hover:text-[var(--accent)]"
                >
                  <Star size={13} strokeWidth={1.6} /> Set as default
                </button>
              ) : null}
            </li>
          ))}
        </ul>
      ) : (
        <div className="mt-10">
          <EmptyState
            icon={<MapPin size={24} strokeWidth={1.4} />}
            title="No saved addresses"
            description="Add one now and checkout will take you fifteen seconds."
            action={{ label: "Add address", onClick: () => setOpen(true) }}
          />
        </div>
      )}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        title={draft.id ? "Edit address" : "Add a new address"}
        description="We only use this to deliver your order."
        size="lg"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={save}>Save address</Button>
          </>
        }
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <Label htmlFor="addr-label">Label</Label>
            <div className="mt-2 flex gap-2">
              {["Home", "Work", "Studio", "Other"].map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => set({ label: l })}
                  className={`h-9 rounded-[2px] border px-3 text-[13px] transition-colors ${
                    draft.label === l
                      ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]"
                      : "border-[var(--line-strong)] text-[var(--ink-2)] hover:border-[var(--ink)]"
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="addr-name">Full name</Label>
            <div className="mt-2">
              <Input
                id="addr-name"
                value={draft.fullName}
                onChange={(e) => set({ fullName: e.target.value })}
              />
            </div>
          </div>

          <div className="sm:col-span-2">
            <Label htmlFor="addr-line1">Address</Label>
            <div className="mt-2">
              <Input
                id="addr-line1"
                value={draft.line1}
                onChange={(e) => set({ line1: e.target.value })}
                placeholder="Flat / house number, street"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="addr-city">City</Label>
            <div className="mt-2">
              <Input id="addr-city" value={draft.city} onChange={(e) => set({ city: e.target.value })} />
            </div>
          </div>

          <div>
            <Label htmlFor="addr-state">State</Label>
            <div className="mt-2">
              <Input id="addr-state" value={draft.state} onChange={(e) => set({ state: e.target.value })} />
            </div>
          </div>

          <div>
            <Label htmlFor="addr-pincode">PIN code</Label>
            <div className="mt-2">
              <Input
                id="addr-pincode"
                inputMode="numeric"
                maxLength={6}
                value={draft.pincode}
                onChange={(e) => set({ pincode: e.target.value.replace(/\D/g, "") })}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="addr-phone">Phone</Label>
            <div className="mt-2">
              <Input
                id="addr-phone"
                type="tel"
                value={draft.phone}
                onChange={(e) => set({ phone: e.target.value })}
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-center gap-3 text-[14px] text-[var(--ink-2)] sm:col-span-2">
            <input
              type="checkbox"
              checked={draft.isDefault}
              onChange={(e) => set({ isDefault: e.target.checked })}
              className="h-4 w-4 accent-[var(--accent)]"
            />
            Set as my default address
          </label>
        </div>
      </Dialog>
    </div>
  );
}
