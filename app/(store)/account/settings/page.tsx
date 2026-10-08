"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, Moon, Sun, Monitor, Download, Trash2 } from "lucide-react";
import { useSession, useTheme, useUi } from "@/lib/store/providers";
import { usePersistentState } from "@/lib/store/persistent";
import { ThemeMode } from "@/types";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const OPTIONS: { id: ThemeMode; label: string; icon: typeof Sun }[] = [
  { id: "light", label: "Light", icon: Sun },
  { id: "dark", label: "Dark", icon: Moon },
  { id: "system", label: "System", icon: Monitor },
];

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-4">
      <div>
        <p className="text-[14.5px] font-medium text-[var(--ink)]">{label}</p>
        <p className="mt-1 text-[13.5px] leading-relaxed text-[var(--ink-3)]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className="relative mt-1 h-6 w-11 shrink-0 rounded-full transition-colors duration-200"
        style={{ backgroundColor: checked ? "var(--accent)" : "var(--line-strong)" }}
      >
        <span
          className={cn(
            "absolute top-1 h-4 w-4 rounded-full bg-white transition-transform duration-200",
            checked ? "translate-x-6" : "translate-x-1",
          )}
        />
      </button>
    </div>
  );
}

export default function SettingsPage() {
  const { user, logout } = useSession();
  const { theme, setTheme } = useTheme();
  const { toast } = useUi();
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  /* Persisted — toggles survive a reload. */
  const [prefs, setPrefs] = usePersistentState("an.customerPrefs", {
    orderUpdates: true,
    shippingAlerts: true,
    backInStock: true,
    priceDrops: false,
    newsletter: true,
  });

  if (!user) return null;

  const setPref = (key: keyof typeof prefs) => (v: boolean) => {
    setPrefs((p) => ({ ...p, [key]: v }));
    toast({ title: "Preference saved", description: `${key} ${v ? "on" : "off"}` });
  };

  return (
    <div>
      <header className="border-b border-[var(--line)] pb-7">
        <p className="eyebrow text-[var(--accent)]">Preferences</p>
        <h1 className="h1 mt-3 text-[var(--ink)]">Settings</h1>
        <p className="mt-3 text-[15px] text-[var(--ink-3)]">
          Tune how ATELIER NOIR looks and talks to you.
        </p>
      </header>

      <div className="mt-9 grid gap-10 lg:grid-cols-2">
        <section>
          <h2 className="text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--ink)]">
            Appearance
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-3">
            {OPTIONS.map((option) => {
              const active = theme === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setTheme(option.id)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-[2px] border px-4 py-5 transition-colors",
                    active
                      ? "border-[var(--ink)] bg-[var(--surface)] text-[var(--ink)]"
                      : "border-[var(--line-strong)] text-[var(--ink-3)] hover:border-[var(--ink-3)]",
                  )}
                >
                  <option.icon size={19} strokeWidth={1.5} />
                  <span className="text-[13px]">{option.label}</span>
                </button>
              );
            })}
          </div>

          <h2 className="mt-10 text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--ink)]">
            Notifications
          </h2>
          <div className="mt-2 divide-y divide-[var(--line)] border-y border-[var(--line)]">
            <Toggle
              label="Order updates"
              description="Confirmation, packing and delivery status."
              checked={prefs.orderUpdates}
              onChange={setPref("orderUpdates")}
            />
            <Toggle
              label="Shipping alerts"
              description="Tracking links and delivery-window changes."
              checked={prefs.shippingAlerts}
              onChange={setPref("shippingAlerts")}
            />
            <Toggle
              label="Back in stock"
              description="Alert me when something I saved returns."
              checked={prefs.backInStock}
              onChange={setPref("backInStock")}
            />
            <Toggle
              label="Price drops"
              description="Tell me when a saved piece goes on sale."
              checked={prefs.priceDrops}
              onChange={setPref("priceDrops")}
            />
            <Toggle
              label="Newsletter"
              description="New drops and offers, roughly twice a month."
              checked={prefs.newsletter}
              onChange={setPref("newsletter")}
            />
          </div>
        </section>

        <section>
          <h2 className="text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--ink)]">
            Account data
          </h2>
          <div className="mt-4 space-y-3 border border-[var(--line)] bg-[var(--surface)] p-5">
            <p className="text-[14px] leading-relaxed text-[var(--ink-2)]">
              Download a copy of your order history, addresses and preferences at any time.
            </p>
            <Button
              variant="outline"
              icon={<Download size={15} />}
              onClick={() =>
                toast({
                  title: "Export requested",
                  description: "We’ll email you a CSV within a few minutes.",
                  tone: "success",
                })
              }
            >
              Export my data
            </Button>
          </div>

          <h2 className="mt-10 text-[13px] font-medium uppercase tracking-[0.14em] text-[var(--ink)]">
            Session
          </h2>
          <div className="mt-4 space-y-3">
            <Button
              fullWidth
              variant="outline"
              icon={<LogOut size={15} />}
              onClick={() => {
                logout();
                router.push("/");
              }}
            >
              Sign out of this device
            </Button>
            <Button
              fullWidth
              variant="ghost"
              className="text-[var(--danger)] hover:bg-[var(--danger)]/10"
              icon={<Trash2 size={15} />}
              onClick={() => setConfirm(true)}
            >
              Delete my account
            </Button>
          </div>

          <p className="mt-6 text-[13px] leading-relaxed text-[var(--ink-3)]">
            Deleting your account removes your order history and saved details permanently. Orders
            already shipped remain valid for returns.
          </p>
        </section>
      </div>

      <Dialog
        open={confirm}
        onClose={() => setConfirm(false)}
        title="Delete your account?"
        description="This cannot be undone. Any active orders will still be fulfilled."
        footer={
          <>
            <Button variant="ghost" onClick={() => setConfirm(false)}>
              Keep my account
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setConfirm(false);
                toast({
                  title: "Request received",
                  description: "Our team will confirm within 24 hours.",
                  tone: "error",
                });
              }}
            >
              Yes, delete
            </Button>
          </>
        }
      >
        Enter your password on the next screen to confirm. For this demo, no data is actually
        removed.
      </Dialog>
    </div>
  );
}
