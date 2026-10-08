/**
 * Centralised, framework-agnostic design tokens.
 * CSS counterpart lives in `app/globals.css` — keep the two in sync.
 */

export const tokens = {
  duration: {
    micro: 0.18,
    ui: 0.3,
    large: 0.55,
    editorial: 0.8,
    marquee: 38,
  },
  ease: {
    expo: [0.22, 1, 0.36, 1] as const,
    soft: [0.4, 0, 0.2, 1] as const,
    inOut: [0.65, 0, 0.35, 1] as const,
  },
  breakpoint: {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    "2xl": 1536,
  },
  layout: {
    headerHeight: 64,
    announcementHeight: 34,
    adminSidebar: 280,
    adminSidebarCollapsed: 76,
    maxContent: 1560,
    maxNarrow: 1120,
    gutters: "clamp(1.25rem, 4vw, 3.5rem)",
  },
  radius: {
    none: 0,
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    pill: 999,
  },
  /** Above this many items the shop switches to paginated rendering. */
  pageSize: 12,
} as const;

export const breakpoints = tokens.breakpoint;

/** Free shipping threshold used by cart + checkout. */
export const FREE_SHIPPING_THRESHOLD = 999;
export const STANDARD_SHIPPING_FEE = 99;
export const EXPRESS_SHIPPING_FEE = 249;
export const GIFT_WRAP_FEE = 149;

export const SITE = {
  name: "ATELIER NOIR",
  tagline: "Premium essentials, built to last.",
  description:
    "ATELIER NOIR designs premium everyday essentials — considered silhouettes, honest materials and a fit that moves with you.",
  url: "https://ateliernoir.example.com",
  email: "care@ateliernoir.example.com",
  phone: "+91 80 4718 2200",
  address: "14 Craftsmen Lane, Indiranagar, Bengaluru 560038",
  social: {
    instagram: "https://instagram.com",
    facebook: "https://facebook.com",
    x: "https://x.com",
    pinterest: "https://pinterest.com",
  },
  announcement: "FREE SHIPPING ON ORDERS OVER ₹999",
  policies: {
    returns: "30-day returns on unworn items",
    support: "Mon–Sat, 10:00–19:00 IST",
  },
} as const;
