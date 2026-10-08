"use client";

import { useState } from "react";
import { Check, Camera } from "lucide-react";
import { useSession, useUi } from "@/lib/store/providers";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { formatDate } from "@/lib/format";

export default function ProfilePage() {
  const { user, update } = useSession();
  const { toast } = useUi();
  const [form, setForm] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    birthday: "",
    preferredSize: "M",
  });
  const [saved, setSaved] = useState(false);

  if (!user) return null;

  const save = () => {
    if (form.name.trim().length < 2) {
      toast({ title: "Please enter your full name", tone: "error" });
      return;
    }
    update({ name: form.name.trim(), phone: form.phone });
    setSaved(true);
    toast({ title: "Profile updated", tone: "success" });
    window.setTimeout(() => setSaved(false), 2400);
  };

  return (
    <div>
      <header className="border-b border-[var(--line)] pb-7">
        <p className="eyebrow text-[var(--accent)]">Account</p>
        <h1 className="h1 mt-3 text-[var(--ink)]">Profile</h1>
        <p className="mt-3 text-[15px] text-[var(--ink-3)]">
          Member since {formatDate(user.joinedAt)} ·{" "}
          <span className="text-[var(--ink)]">₹{user.rewards.toLocaleString("en-IN")}</span>{" "}
          rewards balance
        </p>
      </header>

      <div className="mt-9 grid gap-10 lg:grid-cols-[1fr_300px]">
        <div className="space-y-7">
          {/* avatar */}
          <div className="flex items-center gap-5">
            <div className="relative">
              <span className="grid h-20 w-20 place-items-center rounded-full bg-[var(--ink)] text-[24px] font-medium text-[var(--bg)]">
                {user.initials}
              </span>
              <button
                type="button"
                aria-label="Change profile photo"
                onClick={() =>
                  toast({
                    title: "Photo upload",
                    description: "Connect storage to enable profile photos.",
                  })
                }
                className="absolute -bottom-1 -right-1 grid h-8 w-8 place-items-center rounded-full border-2 border-[var(--bg)] bg-[var(--surface)] text-[var(--ink-2)] transition-colors hover:text-[var(--accent)]"
              >
                <Camera size={14} strokeWidth={1.6} />
              </button>
            </div>
            <div>
              <p className="text-[17px] font-medium text-[var(--ink)]">{user.name}</p>
              <p className="text-[14px] text-[var(--ink-3)]">{user.email}</p>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <Label htmlFor="pf-name">Full name</Label>
              <div className="mt-2">
                <Input
                  id="pf-name"
                  value={form.name}
                  autoComplete="name"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="pf-email">Email address</Label>
              <div className="mt-2">
                <Input
                  id="pf-email"
                  type="email"
                  value={form.email}
                  autoComplete="email"
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="pf-phone">Phone</Label>
              <div className="mt-2">
                <Input
                  id="pf-phone"
                  type="tel"
                  value={form.phone}
                  autoComplete="tel"
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="pf-birthday">Birthday (optional)</Label>
              <div className="mt-2">
                <Input
                  id="pf-birthday"
                  type="date"
                  value={form.birthday}
                  onChange={(e) => setForm({ ...form, birthday: e.target.value })}
                />
              </div>
            </div>
            <div>
              <Label htmlFor="pf-size">Usual size</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {["XS", "S", "M", "L", "XL"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={form.preferredSize === s}
                    onClick={() => setForm({ ...form, preferredSize: s })}
                    className={`h-11 min-w-11 rounded-[2px] border px-3 text-[14px] transition-colors ${
                      form.preferredSize === s
                        ? "border-[var(--ink)] bg-[var(--ink)] text-[var(--bg)]"
                        : "border-[var(--line-strong)] text-[var(--ink-2)] hover:border-[var(--ink)]"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-t border-[var(--line)] pt-6">
            <Button onClick={save} size="lg" icon={saved ? <Check size={15} /> : undefined}>
              {saved ? "Saved" : "Save changes"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              href="/auth/forgot-password"
            >
              Change password
            </Button>
          </div>
        </div>

        {/* side card */}
        <aside className="h-fit border border-[var(--line)] bg-[var(--surface)] p-6">
          <p className="eyebrow text-[var(--ink-3)]">Noir rewards</p>
          <p className="mt-3 text-[34px] font-medium leading-none tracking-[-0.03em] tabular-nums text-[var(--ink)]">
            ₹{user.rewards.toLocaleString("en-IN")}
          </p>
          <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--ink-3)]">
            Earn 1 point per ₹100 spent. 500 points = ₹500 off. Points never expire while your
            account is active.
          </p>
          <div className="mt-5 h-1.5 w-full overflow-hidden rounded-full bg-[var(--surface-2)]">
            <div
              className="h-full rounded-full bg-[var(--accent)]"
              style={{ width: `${Math.min(100, (user.rewards / 5000) * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-[12.5px] text-[var(--ink-3)]">
            {Math.max(0, 5000 - user.rewards).toLocaleString("en-IN")} to your next ₹500 credit
          </p>
        </aside>
      </div>
    </div>
  );
}
