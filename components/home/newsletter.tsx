"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { useUi } from "@/lib/store/providers";
import { useCms } from "@/lib/store/cms";
import { Reveal } from "@/components/motion/reveal";

export function Newsletter() {
  const { toast } = useUi();
  const { content, hydrated } = useCms();
  const copy = hydrated
    ? content.newsletter
    : {
        heading: "STAY IN THE LOOP.",
        body: "New drops, exclusive offers and things worth knowing — roughly twice a month.",
        cta: "Join",
      };
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    setState("loading");
    await new Promise((r) => setTimeout(r, 700));
    setState("done");
    toast({
      title: "You’re on the list",
      description: "Look out for a welcome note in your inbox.",
      tone: "success",
    });
  };

  return (
    <section className="border-y border-[var(--line)] bg-[var(--surface-2)] py-20 md:py-24">
      <div className="container-narrow">
        <Reveal className="text-center">
          <p className="eyebrow mb-5 text-[var(--accent)]">Newsletter</p>
          <h2 className="display-lg text-[var(--ink)]">{copy.heading}</h2>
          <p className="mx-auto mt-5 max-w-md text-[15.5px] leading-relaxed text-[var(--ink-3)]">
            {copy.body}
          </p>

          <div className="mx-auto mt-9 max-w-xl">
            <AnimatePresence mode="wait">
              {state === "done" ? (
                <motion.div
                  key="done"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-center gap-3 rounded-[2px] border border-[var(--success)]/40 bg-[var(--success)]/10 px-5 py-4"
                >
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 420, damping: 16 }}
                    className="grid h-6 w-6 place-items-center rounded-full bg-[var(--success)] text-white"
                  >
                    <Check size={14} strokeWidth={2.5} />
                  </motion.span>
                  <p className="text-[14.5px] text-[var(--ink)]">
                    Welcome aboard — check your inbox for a 10% code.
                  </p>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={submit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col gap-3 sm:flex-row"
                >
                  <label htmlFor="newsletter-email" className="sr-only">
                    Email address
                  </label>
                  <input
                    id="newsletter-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError("");
                    }}
                    placeholder="you@example.com"
                    aria-invalid={Boolean(error)}
                    aria-describedby={error ? "newsletter-error" : undefined}
                    className="h-[52px] flex-1 rounded-[2px] border border-[var(--line-strong)] bg-[var(--surface)] px-4 text-[15px] text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/40"
                  />
                  <button
                    type="submit"
                    disabled={state === "loading"}
                    className="group inline-flex h-[52px] items-center justify-center gap-2.5 rounded-[2px] bg-[var(--ink)] px-8 text-[11.5px] font-medium uppercase tracking-[0.16em] text-[var(--bg)] transition-colors duration-200 hover:bg-[var(--accent)] hover:text-[var(--on-accent)] disabled:opacity-60"
                  >
                    {state === "loading" ? (
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-current border-t-transparent" />
                    ) : null}
                    {copy.cta}
                    <ArrowRight
                      size={14}
                      className="transition-transform duration-300 group-hover:translate-x-0.5"
                    />
                  </button>
                </motion.form>
              )}
            </AnimatePresence>

            {error ? (
              <p id="newsletter-error" role="alert" className="mt-3 text-[13px] text-[var(--danger)]">
                {error}
              </p>
            ) : (
              <p className="mt-3 text-[12.5px] text-[var(--ink-3)]">
                No spam. Unsubscribe with one click, anytime.
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
