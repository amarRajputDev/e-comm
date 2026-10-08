"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, Check } from "lucide-react";
import { useSession, useUi } from "@/lib/store/providers";
import { demoAccounts } from "@/lib/services/auth";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const inputCls =
  "h-12 w-full rounded-[2px] border border-[var(--line-strong)] bg-[var(--surface)] px-4 text-[15px] text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/40";

type Mode = "login" | "register" | "forgot";

export function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const { login, register } = useSession();
  const { toast } = useUi();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "register" && form.name.trim().length < 2) {
      setError("Tell us what to call you.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (mode !== "forgot" && form.password.length < 8) {
      setError("Use at least 8 characters for your password.");
      return;
    }

    setBusy(true);
    try {
      if (mode === "login") {
        const res = await login(form.email, form.password);
        if (res.ok === false) {
          setError(res.message ?? "Something went wrong.");
          return;
        }
        toast({ title: "Welcome back", tone: "success" });
        router.push("/account");
      } else if (mode === "register") {
        const res = await register(form);
        if (res.ok === false) {
          setError(res.message ?? "Something went wrong.");
          return;
        }
        toast({
          title: "Account created",
          description: "₹250 rewards credit added to your account.",
          tone: "success",
        });
        router.push("/account");
      } else {
        await new Promise((r) => setTimeout(r, 700));
        setSent(true);
      }
    } finally {
      setBusy(false);
    }
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-[var(--success)]/12 text-[var(--success)]">
          <Check size={26} strokeWidth={2} />
        </span>
        <h1 className="h2 mt-6">Check your inbox</h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-3)]">
          If an account exists for{" "}
          <span className="text-[var(--ink)]">{form.email}</span>, we’ve sent a link to reset
          your password. It expires in 30 minutes.
        </p>
        <Button href="/auth/login" className="mt-7" size="lg" fullWidth>
          Back to sign in
        </Button>
      </motion.div>
    );
  }

  const copy = {
    login: {
      title: "Welcome back",
      subtitle: "Sign in to track orders, save addresses and check out faster.",
      cta: "Sign in",
    },
    register: {
      title: "Create your account",
      subtitle: "Join for early access, order tracking and a ₹250 welcome credit.",
      cta: "Create account",
    },
    forgot: {
      title: "Reset your password",
      subtitle: "Enter the email you signed up with and we’ll send a reset link.",
      cta: "Send reset link",
    },
  }[mode];

  return (
    <div>
      <h1 className="h1 text-[var(--ink)]">{copy.title}</h1>
      <p className="mt-3 text-[15px] leading-relaxed text-[var(--ink-3)]">{copy.subtitle}</p>

      <form onSubmit={submit} noValidate className="mt-8 space-y-5">
        {mode === "register" ? (
          <div>
            <Label htmlFor="name">Full name</Label>
            <input
              id="name"
              autoComplete="name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Amar Verma"
              className={cn(inputCls, "mt-2")}
            />
          </div>
        ) : null}

        <div>
          <Label htmlFor="email">Email address</Label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="you@example.com"
            className={cn(inputCls, "mt-2")}
          />
        </div>

        {mode !== "forgot" ? (
          <div>
            <Label
              htmlFor="password"
              hint={
                mode === "login" ? (
                  <Link
                    href="/auth/forgot-password"
                    className="text-[var(--ink-2)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
                  >
                    Forgot password?
                  </Link>
                ) : undefined
              }
            >
              Password
            </Label>
            <input
              id="password"
              type="password"
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="At least 8 characters"
              className={cn(inputCls, "mt-2")}
            />
          </div>
        ) : null}

        {error ? (
          <p
            role="alert"
            className="flex items-start gap-2 rounded-[2px] border border-[var(--danger)]/30 bg-[var(--danger)]/8 px-3.5 py-3 text-[13.5px] text-[var(--danger)]"
          >
            <AlertCircle size={15} strokeWidth={1.75} className="mt-0.5 shrink-0" />
            {error}
          </p>
        ) : null}

        <Button type="submit" size="lg" fullWidth loading={busy} iconEnd={<ArrowRight size={15} />}>
          {copy.cta}
        </Button>
      </form>

      {mode !== "forgot" ? (
        <>
          <div className="my-7 flex items-center gap-4">
            <span className="h-px flex-1 bg-[var(--line)]" />
            <span className="text-[11px] uppercase tracking-[0.14em] text-[var(--ink-3)]">or</span>
            <span className="h-px flex-1 bg-[var(--line)]" />
          </div>

          <button
            type="button"
            onClick={() => {
              setForm({
                name: "",
                email: demoAccounts[0].email,
                password: "demo1234",
              });
              setError("");
            }}
            className="flex h-12 w-full items-center justify-center gap-3 rounded-[2px] border border-[var(--line-strong)] text-[14px] text-[var(--ink)] transition-colors hover:border-[var(--ink)] hover:bg-[var(--surface)]"
          >
            <GoogleGlyph /> Continue with Google
          </button>
        </>
      ) : null}

      <p className="mt-7 text-center text-[14px] text-[var(--ink-3)]">
        {mode === "login" ? (
          <>
            New here?{" "}
            <Link
              href="/auth/register"
              className="font-medium text-[var(--ink)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
            >
              Create an account
            </Link>
          </>
        ) : mode === "register" ? (
          <>
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-[var(--ink)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
            >
              Sign in
            </Link>
          </>
        ) : (
          <>
            Remembered it?{" "}
            <Link
              href="/auth/login"
              className="font-medium text-[var(--ink)] underline-offset-4 hover:text-[var(--accent)] hover:underline"
            >
              Sign in
            </Link>
          </>
        )}
      </p>

      {mode === "login" ? (
        <p className="mt-5 rounded-[2px] border border-dashed border-[var(--line-strong)] bg-[var(--surface-2)] px-4 py-3 text-center text-[12.5px] leading-relaxed text-[var(--ink-3)]">
          Demo customer: <span className="text-[var(--ink)]">{demoAccounts[0].email}</span> ·
          password <span className="text-[var(--ink)]">demo1234</span>
          <br />
          Admin: <span className="text-[var(--ink)]">{demoAccounts[1].email}</span> ·{" "}
          <span className="text-[var(--ink)]">admin1234</span>
        </p>
      ) : null}
    </div>
  );
}

function GoogleGlyph() {
  return (
    <svg viewBox="0 0 18 18" aria-hidden className="h-[18px] w-[18px]">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62Z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.33A9 9 0 0 0 9 18Z"
      />
      <path
        fill="#FBBC05"
        d="M3.97 10.72a5.4 5.4 0 0 1 0-3.44V4.95H.96a9 9 0 0 0 0 8.1l3.01-2.33Z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.9 11.43 0 9 0A9 9 0 0 0 .96 4.95l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58Z"
      />
    </svg>
  );
}
