import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn("h-[18px] w-[18px]", className)}
      fill="none"
    >
      <rect x="1" y="1" width="22" height="22" stroke="currentColor" strokeWidth="1.5" />
      <path d="M1 23 23 1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="7.5" y="7.5" width="9" height="9" fill="currentColor" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex items-center gap-2.5 text-[15px] font-medium uppercase leading-none tracking-[0.26em]",
        className,
      )}
    >
      <LogoMark className="h-[15px] w-[15px] transition-transform duration-500 ease-out group-hover:rotate-90" />
      <span>Atelier&nbsp;Noir</span>
    </span>
  );
}
