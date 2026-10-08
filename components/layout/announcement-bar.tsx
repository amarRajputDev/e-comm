"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { marqueeItems, popularSearches } from "@/lib/data/site";
import { SITE } from "@/lib/tokens";

const KEY = "an.announce.dismissed";

export function AnnouncementBar() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const setHeight = (show: boolean) => {
      document.documentElement.style.setProperty("--header-h", show ? "98px" : "64px");
    };
    let dismissed = false;
    try {
      dismissed = window.localStorage.getItem(KEY) === "1";
    } catch {
      dismissed = false;
    }
    setVisible(!dismissed);
    setHeight(!dismissed);
  }, []);

  const dismiss = () => {
    setVisible(false);
    document.documentElement.style.setProperty("--header-h", "64px");
    try {
      window.localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <AnimatePresence initial={false}>
      {visible ? (
        <motion.div
          key="announce"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 34, opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden bg-[var(--ink)] text-[var(--bg)]"
        >
          <div className="group flex h-[34px] items-center justify-center gap-6 px-10">
            <div className="relative flex-1 overflow-hidden">
              <div
                className="flex w-max animate-[marquee_38s_linear_infinite] gap-0 group-hover:[animation-play-state:paused]"
                aria-hidden
              >
                {[0, 1].map((dup) => (
                  <span key={dup} className="flex shrink-0 items-center gap-0">
                    {marqueeItems.map((item) => (
                      <span
                        key={`${dup}-${item}`}
                        className="flex items-center whitespace-nowrap text-[10.5px] font-medium uppercase tracking-[0.22em]"
                      >
                        {item}
                        <span className="mx-6 opacity-40">—</span>
                      </span>
                    ))}
                  </span>
                ))}
              </div>
            </div>
            <span className="sr-only">{SITE.announcement}</span>
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss announcement"
              className="absolute right-3 top-1/2 grid h-6 w-6 -translate-y-1/2 place-items-center rounded-full text-[var(--bg)]/60 transition-colors hover:text-[var(--bg)]"
            >
              <X size={13} strokeWidth={1.75} />
            </button>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export { popularSearches };
