"use client";

import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { useUi } from "@/lib/store/providers";

const KEY = "an.orderNotes";

function readNotes(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(window.localStorage.getItem(KEY) ?? "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

/** Internal order notes — persisted per order so they survive a reload. */
export function InternalNote({ orderNumber }: { orderNumber: string }) {
  const { toast } = useUi();
  const [value, setValue] = useState("");
  const [hydrated, setHydrated] = useState(false);
  const [state, setState] = useState<"idle" | "saving" | "saved">("idle");

  useEffect(() => {
    setValue(readNotes()[orderNumber] ?? "");
    setHydrated(true);
  }, [orderNumber]);

  const save = () => {
    setState("saving");
    window.setTimeout(() => {
      try {
        const notes = readNotes();
        if (value.trim()) notes[orderNumber] = value;
        else delete notes[orderNumber];
        window.localStorage.setItem(KEY, JSON.stringify(notes));
        setState("saved");
        toast({
          title: "Note saved",
          description: `Visible to your team on ${orderNumber}.`,
          tone: "success",
        });
        window.setTimeout(() => setState("idle"), 2000);
      } catch {
        setState("idle");
        toast({ title: "Could not save the note", tone: "error" });
      }
    }, 350);
  };

  return (
    <>
      <textarea
        rows={3}
        value={value}
        disabled={!hydrated}
        onChange={(e) => {
          setValue(e.target.value);
          setState("idle");
        }}
        placeholder="Add a note for the fulfilment team — packing requests, gift messages, courier instructions…"
        className="w-full rounded-[3px] border border-[var(--line)] bg-[var(--surface-2)] px-3 py-2.5 text-[13.5px] text-[var(--ink)] placeholder:text-[var(--ink-3)] focus:border-[var(--ink-3)] focus:outline-none"
      />
      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-[12.5px] text-[var(--ink-3)]">
          {value.trim() ? `${value.trim().length} characters` : "Notes are saved to this order."}
        </p>
        <button
          type="button"
          onClick={save}
          disabled={!hydrated || state === "saving"}
          className="inline-flex h-8 items-center gap-2 rounded-[3px] border border-[var(--line-strong)] px-3.5 text-[12.5px] text-[var(--ink-2)] transition-colors hover:border-[var(--ink)] hover:text-[var(--ink)] disabled:opacity-50"
        >
          {state === "saving" ? (
            <Loader2 size={13} className="animate-spin" />
          ) : state === "saved" ? (
            <Check size={13} strokeWidth={2} className="text-[var(--success)]" />
          ) : null}
          {state === "saved" ? "Saved" : "Save note"}
        </button>
      </div>
    </>
  );
}
