"use client";

import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type ButtonVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "link"
  | "danger"
  | "dark";
export type ButtonSize = "sm" | "md" | "lg" | "icon" | "icon-sm";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  icon?: ReactNode;
  iconEnd?: ReactNode;
  fullWidth?: boolean;
  href?: string;
}

const base =
  "relative inline-flex select-none items-center justify-center gap-2 whitespace-nowrap rounded-[2px] font-medium tracking-[0.06em] uppercase transition-[background-color,color,border-color,transform,opacity] duration-200 ease-out disabled:pointer-events-none disabled:opacity-45 active:scale-[0.985]";

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--accent)] text-[var(--on-accent)] hover:bg-[var(--accent-hover)] shadow-[0_1px_0_rgba(0,0,0,0.06)]",
  secondary: "bg-[var(--ink)] text-[var(--bg)] hover:bg-[var(--ink-2)]",
  outline:
    "border border-[var(--line-strong)] bg-transparent text-[var(--ink)] hover:border-[var(--ink)] hover:bg-[var(--ink)]/[0.04]",
  ghost: "bg-transparent text-[var(--ink-2)] hover:bg-[var(--ink)]/[0.06] hover:text-[var(--ink)]",
  link: "bg-transparent text-[var(--ink)] underline-offset-4 hover:underline px-0 uppercase tracking-[0.1em]",
  danger: "bg-[var(--danger)] text-white hover:opacity-90",
  dark: "bg-[var(--ink)] text-[var(--bg)] hover:bg-[var(--ink-2)]",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-9 px-4 text-[11px]",
  md: "h-11 px-6 text-[11.5px]",
  lg: "h-[52px] px-8 text-[12px]",
  icon: "h-11 w-11 text-[13px]",
  "icon-sm": "h-9 w-9 text-[12px]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = "primary",
    size = "md",
    loading = false,
    icon,
    iconEnd,
    fullWidth,
    className,
    children,
    disabled,
    type = "button",
    href,
    onClick,
    ...props
  },
  ref,
) {
  const classes = cn(
    base,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className,
  );

  const inner = (
    <>
      {loading ? (
        <span
          aria-hidden
          className="h-3.5 w-3.5 animate-spin rounded-full border-[1.5px] border-current border-t-transparent"
        />
      ) : (
        icon
      )}
      {children}
      {!loading && iconEnd}
    </>
  );

  if (href && !disabled && !loading) {
    return (
      <Link
        href={href}
        onClick={onClick as never}
        className={classes}
        {...(props as Record<string, unknown>)}
      >
        {inner}
      </Link>
    );
  }

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      onClick={onClick}
      className={classes}
      {...props}
    >
      {inner}
    </button>
  );
});
