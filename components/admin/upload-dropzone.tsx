"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ImagePlus, Trash2, Star, GripVertical, Check } from "lucide-react";
import { cn } from "@/lib/utils";

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  progress: number;
}

let mediaSeq = 0;

export function UploadDropzone({
  value,
  onChange,
}: {
  value: MediaItem[];
  onChange: (next: MediaItem[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<MediaItem[]>(value);
  const [dragging, setDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const commit = (next: MediaItem[]) => {
    listRef.current = next;
    onChange(next);
  };

  const addFiles = (files: FileList | File[]) => {
    const next: MediaItem[] = Array.from(files).map((file) => ({
      id: `media-${++mediaSeq}`,
      name: file.name,
      url: URL.createObjectURL(file),
      progress: 4,
    }));
    if (!next.length) return;
    commit([...listRef.current, ...next]);

    next.forEach((item) => {
      let p = 4;
      const timer = window.setInterval(() => {
        p = Math.min(100, p + 18 + Math.random() * 22);
        commit(
          listRef.current.map((m) =>
            m.id === item.id ? { ...m, progress: Math.round(p) } : m,
          ),
        );
        if (p >= 100) window.clearInterval(timer);
      }, 220);
    });
  };

  const move = (from: number, to: number) => {
    const copy = [...listRef.current];
    if (to < 0 || to >= copy.length) return;
    const [item] = copy.splice(from, 1);
    copy.splice(to, 0, item);
    commit(copy);
  };

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-[3px] border border-dashed px-6 py-9 text-center transition-colors",
          dragging
            ? "border-[var(--accent)] bg-[var(--accent-tint)]"
            : "border-[var(--line-strong)] bg-[var(--surface-2)]/60 hover:border-[var(--ink-3)]",
        )}
      >
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[var(--surface)] text-[var(--ink-3)]">
          <ImagePlus size={18} strokeWidth={1.5} />
        </span>
        <p className="mt-3 text-[14px] font-medium text-[var(--ink)]">
          Drop images here or click to browse
        </p>
        <p className="mt-1 text-[12.5px] text-[var(--ink-3)]">
          JPG, PNG or WebP · up to 2400px · first image is the primary
        </p>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          className="sr-only"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {value.length ? (
        <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-5">
          <AnimatePresence initial={false}>
            {value.map((item, i) => (
              <motion.li
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
                draggable
                onDragStart={() => setDragIndex(i)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => {
                  if (dragIndex !== null && dragIndex !== i) move(dragIndex, i);
                  setDragIndex(null);
                }}
                className={cn(
                  "group relative aspect-square overflow-hidden rounded-[3px] border bg-[var(--surface-2)]",
                  dragIndex === i ? "opacity-50" : "border-[var(--line)]",
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.url} alt={item.name} className="h-full w-full object-cover" />

                {item.progress < 100 ? (
                  <div className="absolute inset-0 grid place-items-center bg-black/55">
                    <div className="text-center">
                      <p className="text-[13px] font-medium tabular-nums text-white">
                        {item.progress}%
                      </p>
                      <div className="mt-1.5 h-1 w-16 overflow-hidden rounded-full bg-white/25">
                        <div
                          className="h-full rounded-full bg-[var(--accent)] transition-[width] duration-300"
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                ) : null}

                {i === 0 ? (
                  <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-[2px] bg-[var(--accent)] px-1.5 py-0.5 text-[9.5px] font-semibold uppercase tracking-[0.08em] text-[var(--on-accent)]">
                    <Check size={9} strokeWidth={3} /> Primary
                  </span>
                ) : null}

                <span className="absolute right-1.5 top-1.5 text-white opacity-0 transition-opacity group-hover:opacity-100">
                  <GripVertical size={14} />
                </span>

                <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-1 bg-black/65 px-1.5 py-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                  <div className="flex gap-1">
                    <button
                      type="button"
                      aria-label="Make primary"
                      disabled={i === 0}
                      onClick={() => move(i, 0)}
                      className="grid h-6 w-6 place-items-center rounded-[2px] bg-white/15 text-white transition hover:bg-white/30 disabled:opacity-40"
                    >
                      <Star size={12} fill="currentColor" strokeWidth={0} />
                    </button>
                    <button
                      type="button"
                      aria-label="Move earlier"
                      disabled={i === 0}
                      onClick={() => move(i, i - 1)}
                      className="grid h-6 w-6 place-items-center rounded-[2px] bg-white/15 text-white transition hover:bg-white/30 disabled:opacity-40"
                    >
                      ←
                    </button>
                    <button
                      type="button"
                      aria-label="Move later"
                      disabled={i === value.length - 1}
                      onClick={() => move(i, i + 1)}
                      className="grid h-6 w-6 place-items-center rounded-[2px] bg-white/15 text-white transition hover:bg-white/30 disabled:opacity-40"
                    >
                      →
                    </button>
                  </div>
                  <button
                    type="button"
                    aria-label={`Remove ${item.name}`}
                    onClick={() => commit(listRef.current.filter((m) => m.id !== item.id))}
                    className="grid h-6 w-6 place-items-center rounded-[2px] bg-white/15 text-white transition hover:bg-[var(--danger)]"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      ) : null}
    </div>
  );
}
