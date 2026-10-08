"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * localStorage-backed state for admin/customer preferences.
 *
 * Same contract as the real API (read once, write on change) — swap the two
 * helpers for `GET/PUT /api/settings` when the backend lands.
 */
export function usePersistentState<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setValue({ ...fallback, ...(JSON.parse(raw) as T) } as T);
    } catch {
      /* corrupt storage — fall back to defaults */
    }
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const update = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* storage unavailable */
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, update, hydrated] as const;
}
