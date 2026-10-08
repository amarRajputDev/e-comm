/* ---------------------------------------------------------------------------
   ATELIER NOIR — domain model.
   Mirrors the intended Postgres/Supabase schema so services can be swapped
   for real API calls without touching the UI layer.
--------------------------------------------------------------------------- */

export type ID = string;
export type Currency = "INR";
export type ThemeMode = "light" | "dark" | "system";

export type ProductStatus = "active" | "draft" | "archived";
export type StockStatus = "in_stock" | "low_stock" | "out_of_stock";

export type OrderStatus =
  | "processing"
  | "confirmed"
  | "packed"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "returned";

export type PaymentStatus = "paid" | "pending" | "refunded" | "failed";
export type PaymentMethod = "card" | "upi" | "netbanking" | "cod";

export type CustomerStatus = "new" | "active" | "vip" | "blocked";
export type ReviewStatus = "pending" | "approved" | "rejected";

export interface ColorOption {
  name: string;
  /** Hex used for the swatch dot. */
  hex: string;
  /** Tailwind-safe class name is derived at render time from `hex`. */
  available: boolean;
}

export interface SizeOption {
  label: string;
  available: boolean;
  note?: string;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductVariant {
  id: ID;
  color: string;
  size?: string | null;
  sku: string;
  price: number;
  compareAt?: number | null;
  stock: number;
}

export interface ProductDetailRow {
  label: string;
  value: string;
}

export interface Product {
  id: ID;
  slug: string;
  name: string;
  brand: string;
  /** Category slug (see lib/data/categories.ts). */
  category: ID;
  collections: string[];
  price: number;
  compareAt?: number | null;
  cost?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  sold: number;
  status: ProductStatus;
  colors: ColorOption[];
  sizes: SizeOption[];
  images: ProductImage[];
  hoverIndex?: number;
  shortDescription: string;
  description: string;
  highlights: string[];
  details: ProductDetailRow[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  featured?: boolean;
  trending?: boolean;
  isNew?: boolean;
  seo: { title: string; description: string };
}

export interface Category {
  id: ID;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image: ProductImage;
  order: number;
  featured?: boolean;
  subcategories: string[];
}

export interface Collection {
  slug: string;
  name: string;
  description: string;
  image: string;
  filter: (products: Product[]) => Product[];
}

export interface CartLine {
  id: string;
  productId: ID;
  productSlug: string;
  variantId: ID;
  name: string;
  image: string;
  variantLabel: string;
  color: string;
  size?: string | null;
  price: number;
  compareAt?: number | null;
  quantity: number;
  maxStock: number;
}

export interface Address {
  id: ID;
  label: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface OrderItem {
  productId: ID;
  productSlug: string;
  name: string;
  image: string;
  variantLabel: string;
  price: number;
  quantity: number;
}

export interface OrderTimelineEntry {
  status: OrderStatus;
  label: string;
  at: string;
  note?: string;
}

export interface Order {
  id: ID;
  number: string;
  customerId: ID;
  customerName: string;
  customerEmail: string;
  placedAt: string;
  items: OrderItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  address: Address;
  couponCode?: string | null;
  eta: string;
  timeline: OrderTimelineEntry[];
  internalNote?: string;
}

export interface Customer {
  id: ID;
  name: string;
  email: string;
  phone?: string;
  initials: string;
  status: CustomerStatus;
  orderCount: number;
  totalSpent: number;
  lastOrderAt: string | null;
  joinedAt: string;
  city: string;
  addresses: Address[];
  lifetimeValue: number;
}

export interface Coupon {
  id: ID;
  code: string;
  description: string;
  type: "percentage" | "fixed";
  value: number;
  minOrder: number;
  maxDiscount?: number | null;
  used: number;
  usageLimit: number;
  expiresAt: string;
  active: boolean;
  scope: "all" | "products" | "categories";
}

export interface Review {
  id: ID;
  productId: ID;
  productName: string;
  productSlug: string;
  customerName: string;
  customerInitials: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
  status: ReviewStatus;
  verified: boolean;
  helpful: number;
}

export interface Testimonial {
  id: ID;
  quote: string;
  name: string;
  location: string;
  rating: number;
  product: string;
}

export interface Banner {
  id: ID;
  eyebrow?: string;
  title: string;
  subtitle: string;
  image: string;
  cta: string;
  href: string;
  placement: "hero" | "promo" | "strip";
  active: boolean;
}

export interface UserProfile {
  id: ID;
  name: string;
  email: string;
  role: "customer" | "admin";
  phone?: string;
  initials: string;
  joinedAt: string;
  rewards: number;
}

export interface AdminUser {
  id: ID;
  name: string;
  email: string;
  role: "owner" | "manager" | "support";
  lastActive: string;
}

export interface AnalyticsPoint {
  date: string;
  revenue: number;
  orders: number;
  visitors: number;
}

export interface DashboardStats {
  revenue: number;
  revenueDelta: number;
  orders: number;
  ordersDelta: number;
  customers: number;
  customersDelta: number;
  conversion: number;
  conversionDelta: number;
  aov: number;
  aovDelta: number;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  action?: { label: string; href?: string; onClick?: () => void };
  tone?: "default" | "success" | "error" | "info";
}

export type SortKey =
  | "featured"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "best-selling";

export interface Filters {
  categories: string[];
  price: [number, number] | null;
  sizes: string[];
  colors: string[];
  rating: number | null;
  inStock: boolean;
  maxDiscount: number | null;
}

export const EMPTY_FILTERS: Filters = {
  categories: [],
  price: null,
  sizes: [],
  colors: [],
  rating: null,
  inStock: false,
  maxDiscount: null,
};
