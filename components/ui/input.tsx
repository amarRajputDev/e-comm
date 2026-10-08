"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const fieldBase =
  "w-full rounded-[2px] border border-[var(--line-strong)] bg-[var(--surface)] px-3.5 text-[15px] text-[var(--ink)] placeholder:text-[var(--ink-3)] transition-[border-color,box-shadow] duration-200 hover:border-[var(--ink-3)] focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]/40 disabled:opacity-50";

export function Label({
  children,
  htmlFor,
  hint,
  className,
}: {
  children: ReactNode;
  htmlFor?: string;
  hint?: ReactNode;
  className?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className={cn(
        "flex items-baseline justify-between text-[11px] font-medium uppercase tracking-[0.14em] text-[var(--ink-3)]",
        className,
      )}
    >
      <span>{children}</span>
      {hint ? <span className="normal-case tracking-normal text-[11px]">{hint}</span> : null}
    </label>
  );
}

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null;
  return (
    <p role="alert" className="text-[12.5px] text-[var(--danger)]">
      {children}
    </p>
  );
}

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, error, leftIcon, rightIcon, ...props },
  ref,
) {
  return (
    <div className="relative">
      {leftIcon ? (
        <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-3)]">
          {leftIcon}
        </span>
      ) : null}
      <input
        ref={ref}
        aria-invalid={error ? true : undefined}
        className={cn(
          fieldBase,
          "h-11",
          leftIcon && "pl-10",
          rightIcon && "pr-10",
          error && "border-[var(--danger)] focus:border-[var(--danger)] focus:ring-[var(--danger)]/30",
          className,
        )}
        {...props}
      />
      {rightIcon ? (
        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--ink-3)]">
          {rightIcon}
        </span>
      ) : null}
      {error ? <FieldError>{error}</FieldError> : null}
    </div>
  );
});

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement>>(
  function Textarea({ className, ...props }, ref) {
    return (
      <textarea
        ref={ref}
        className={cn(fieldBase, "min-h-28 resize-y py-3 leading-relaxed", className)}
        {...props}
      />
    );
  },
);

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement>>(
  function Select({ className, children, ...props }, ref) {
    return (
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            fieldBase,
            "h-11 cursor-pointer appearance-none pr-9 text-[14px]",
            className,
          )}
          {...props}
        >
          {children}
        </select>
        <svg
          aria-hidden
          viewBox="0 0 12 8"
          className="pointer-events-none absolute right-3.5 top-1/2 h-2 w-3 -translate-y-1/2 text-[var(--ink-3)]"
        >
          <path d="M1 1.5 6 6.5 11 1.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      </div>
    );
  },
);
