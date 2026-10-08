import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement> & { size?: number };

function base({ size = 16, strokeWidth = 1.5, ...props }: IconProps) {
  return {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    ...props,
  };
}

export function InstagramIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M17.5 3h-2.6A4.6 4.6 0 0 0 10.3 7.6V10H8v3.2h2.3V21h3.3v-7.8h2.5l.5-3.2h-3V7.7c0-.6.4-1 1-1h2.4V3Z" />
    </svg>
  );
}

export function XIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <path d="M4 4h4.2l4.1 5.6L16.8 4H20l-6.3 7.6L20.4 20h-4.2l-4.5-6.1L6.6 20H3.4l6.7-8L4 4Z" />
    </svg>
  );
}

export function PinterestIcon(props: IconProps) {
  return (
    <svg {...base(props)}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M10.4 17.8 12 11.2" />
      <path d="M9.6 13.4c-.5-1.8.4-3.7 2.3-4.4 1.9-.7 4 .1 4.6 2 .6 1.9-.4 3.9-2.3 4.5-1 .3-1.9 0-2.4-.8" />
    </svg>
  );
}
