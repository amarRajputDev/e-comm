"use client";

import { Moon, Sun, Monitor } from "lucide-react";
import { useTheme } from "@/lib/store/providers";
import { cn } from "@/lib/utils";

const order = ["light", "dark", "system"] as const;

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const next = order[(order.indexOf(theme) + 1) % order.length];

  const Icon = theme === "light" ? Sun : theme === "dark" ? Moon : Monitor;

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch theme (currently ${theme})`}
      title={`Theme: ${theme}`}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full text-[var(--ink-2)] transition-colors duration-200 hover:bg-[var(--ink)]/[0.07] hover:text-[var(--ink)]",
        className,
      )}
    >
      <Icon size={17} strokeWidth={1.5} />
    </button>
  );
}
