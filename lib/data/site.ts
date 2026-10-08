import type { Banner } from "@/types";

export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: { heading: string; links: NavChild[] }[];
  featured?: { image: string; title: string; subtitle: string; href: string };
  promo?: { eyebrow: string; title: string; href: string };
}

export const primaryNav: NavItem[] = [
  {
    label: "Shop",
    href: "/shop",
    children: [
      {
        heading: "Men",
        links: [
          { label: "All Men", href: "/shop?category=men" },
          { label: "Shirts", href: "/shop?category=men&q=shirt" },
          { label: "Knitwear", href: "/shop?category=men&q=knit" },
          { label: "Trousers", href: "/shop?category=men&q=trouser" },
          { label: "Jackets", href: "/shop?category=men&q=jacket" },
          { label: "Outerwear", href: "/shop?category=men&q=coat" },
        ],
      },
      {
        heading: "Women",
        links: [
          { label: "All Women", href: "/shop?category=women" },
          { label: "Dresses", href: "/shop?category=women&q=dress" },
          { label: "Knitwear", href: "/shop?category=women&q=knit" },
          { label: "Shirts & Tops", href: "/shop?category=women&q=shirt" },
          { label: "Trousers", href: "/shop?category=women&q=trouser" },
          { label: "Coats", href: "/shop?category=women&q=coat" },
        ],
      },
      {
        heading: "Accessories",
        links: [
          { label: "All Accessories", href: "/shop?category=accessories" },
          { label: "Bags", href: "/shop?category=accessories&q=bag" },
          { label: "Watches", href: "/shop?category=accessories&q=watch" },
          { label: "Eyewear", href: "/shop?category=accessories&q=sunglasses" },
          { label: "Footwear", href: "/shop?category=accessories&q=sneaker" },
          { label: "Belts & Scarves", href: "/shop?category=accessories&q=leather" },
        ],
      },
    ],
    featured: {
      image: "/img/mega/featured.jpg",
      title: "The Autumn Edit",
      subtitle: "24 new silhouettes for the season ahead",
      href: "/collections/new-arrivals",
    },
    promo: {
      eyebrow: "Members",
      title: "Free express shipping on every order",
      href: "/account",
    },
  },
  {
    label: "Collections",
    href: "/collections/new-arrivals",
    children: [
      {
        heading: "Edits",
        links: [
          { label: "New Arrivals", href: "/collections/new-arrivals" },
          { label: "Best Sellers", href: "/collections/best-sellers" },
          { label: "The Essentials", href: "/collections/essentials" },
          { label: "Archive Sale", href: "/collections/sale" },
        ],
      },
      {
        heading: "By Category",
        links: [
          { label: "Men", href: "/shop?category=men" },
          { label: "Women", href: "/shop?category=women" },
          { label: "Accessories", href: "/shop?category=accessories" },
        ],
      },
      {
        heading: "Stories",
        links: [
          { label: "Fabric Library", href: "/story#fabric" },
          { label: "How We Make It", href: "/story#make" },
          { label: "Repair Programme", href: "/story#repair" },
        ],
      },
    ],
    featured: {
      image: "/img/mega/collections.jpg",
      title: "Archive Sale",
      subtitle: "Up to 30% off previous seasons",
      href: "/collections/sale",
    },
    promo: {
      eyebrow: "Limited",
      title: "Café racer jacket — only 18 made",
      href: "/product/cafe-racer-jacket",
    },
  },
  {
    label: "New Arrivals",
    href: "/collections/new-arrivals",
  },
  {
    label: "Best Sellers",
    href: "/collections/best-sellers",
  },
];

export const banners: Banner[] = [
  {
    id: "bnr-hero",
    title: "THE NEW STANDARD",
    subtitle: "Designed for everyday icons.",
    image: "/img/hero.jpg",
    cta: "Shop collection",
    href: "/collections/new-arrivals",
    placement: "hero",
    active: true,
  },
  {
    id: "bnr-promo",
    title: "UP TO 30% OFF SELECTED STYLES",
    subtitle: "Archive pieces from the last three seasons, while stock lasts.",
    image: "/img/promo.jpg",
    cta: "Shop sale",
    href: "/collections/sale",
    placement: "promo",
    active: true,
  },
];

export const popularSearches = [
  "Heavyweight tee",
  "Trench coat",
  "Merino knit",
  "Leather tote",
  "Café racer jacket",
  "Wide trouser",
  "Automatic watch",
];

export const footerLinks = {
  Shop: [
    { label: "New Arrivals", href: "/collections/new-arrivals" },
    { label: "Best Sellers", href: "/collections/best-sellers" },
    { label: "The Essentials", href: "/collections/essentials" },
    { label: "Archive Sale", href: "/collections/sale" },
    { label: "Gift Cards", href: "/shop" },
  ],
  Company: [
    { label: "Our Story", href: "/story" },
    { label: "Materials", href: "/story#fabric" },
    { label: "Repair Programme", href: "/story#repair" },
    { label: "Stores", href: "/story#stores" },
    { label: "Careers", href: "/story" },
  ],
  Help: [
    { label: "Shipping", href: "/help#shipping" },
    { label: "Returns & Exchanges", href: "/help#returns" },
    { label: "Track Your Order", href: "/account/orders" },
    { label: "Size Guide", href: "/help#size" },
    { label: "FAQ", href: "/help" },
    { label: "Contact", href: "/help#contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/help#privacy" },
    { label: "Terms of Service", href: "/help#terms" },
    { label: "Cookie Preferences", href: "/help#cookies" },
    { label: "Accessibility", href: "/help#a11y" },
  ],
};

export const instagramPosts = [
  { id: "ig1", src: "/img/social/1.jpg", alt: "Studio rail of neutral knitwear", likes: 1284 },
  { id: "ig2", src: "/img/social/2.jpg", alt: "Detail of a stitched leather edge", likes: 942 },
  { id: "ig3", src: "/img/social/3.jpg", alt: "Model in an overshirt on a rooftop", likes: 2110 },
  { id: "ig4", src: "/img/social/4.jpg", alt: "Folded tees in bone and black", likes: 867 },
  { id: "ig5", src: "/img/social/5.jpg", alt: "Watch resting on folded fabric", likes: 1533 },
  { id: "ig6", src: "/img/social/6.jpg", alt: "Trench coat in motion on a city street", likes: 1906 },
  { id: "ig7", src: "/img/social/7.jpg", alt: "Canvas sneakers on polished concrete", likes: 1120 },
  { id: "ig8", src: "/img/social/8.jpg", alt: "Accessory flat-lay in warm light", likes: 998 },
];

export const marqueeItems = [
  "Premium Quality",
  "Free Shipping over ₹999",
  "30-Day Returns",
  "Secure Checkout",
  "Carbon-Neutral Delivery",
  "Repair, Don’t Replace",
];

export const adminNotifications = [
  { id: "n1", title: "5 orders awaiting confirmation", time: "12 min ago", tone: "info" as const },
  { id: "n2", title: "Structured Trench Coat is low on stock (14)", time: "1 h ago", tone: "warning" as const },
  { id: "n3", title: "3 reviews pending approval", time: "3 h ago", tone: "default" as const },
  { id: "n4", title: "Payout of ₹2,84,110 settled", time: "Yesterday", tone: "success" as const },
];
