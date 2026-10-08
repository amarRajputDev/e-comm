"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import type { CartLine, Product, ThemeMode, ToastMessage, UserProfile } from "@/types";
import { computeTotals, lineKey, type CartTotals, type ShippingMethod } from "@/lib/services/cart";
import { applyCoupon, type CouponResult } from "@/lib/data/coupons";
import * as authService from "@/lib/services/auth";

/* ------------------------------------------------------------------ theme */

type ThemeCtx = { theme: ThemeMode; setTheme: (t: ThemeMode) => void; toggle: () => void };
const ThemeContext = createContext<ThemeCtx | null>(null);

/* -------------------------------------------------------------------- ui */

type UiCtx = {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  navOpen: boolean;
  setNavOpen: (v: boolean) => void;
  toasts: ToastMessage[];
  toast: (t: Omit<ToastMessage, "id">) => void;
  dismissToast: (id: string) => void;
};
const UiContext = createContext<UiCtx | null>(null);

/* ------------------------------------------------------------------ cart */

type CartCtx = {
  lines: CartLine[];
  saved: CartLine[];
  totals: CartTotals;
  hydrated: boolean;
  coupon: CouponResult;
  couponCode: string;
  shippingMethod: ShippingMethod;
  setShippingMethod: (m: ShippingMethod) => void;
  add: (product: Product, color: string, size: string | null | undefined, qty?: number) => void;
  setQty: (lineId: string, qty: number) => void;
  remove: (lineId: string) => void;
  clear: () => void;
  saveForLater: (lineId: string) => void;
  moveToBag: (lineId: string) => void;
  removeSaved: (lineId: string) => void;
  applyCode: (code: string) => void;
  removeCode: () => void;
  variantFor: (product: Product, color: string, size?: string | null) => string | null;
};
const CartContext = createContext<CartCtx | null>(null);

/* -------------------------------------------------------------- wishlist */

type WishlistCtx = {
  ids: string[];
  has: (id: string) => boolean;
  toggle: (product: Product) => void;
  remove: (id: string) => void;
  hydrated: boolean;
};
const WishlistContext = createContext<WishlistCtx | null>(null);

/* --------------------------------------------------------------- session */

type SessionCtx = {
  user: UserProfile | null;
  hydrated: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  register: (input: { name: string; email: string; password: string }) => Promise<{ ok: boolean; message?: string }>;
  logout: () => void;
  update: (patch: Partial<UserProfile>) => void;
};
const SessionContext = createContext<SessionCtx | null>(null);

/* --------------------------------------------------------------- helpers */

function useStored<T>(key: string, fallback: T) {
  const [value, setValue] = useState<T>(fallback);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, [key]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved = typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* ignore */
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, set, hydrated] as const;
}

let toastSeq = 0;

/* -------------------------------------------------------------- provider */

export function StoreProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  /* theme */
  const [theme, setThemeRaw] = useState<ThemeMode>("system");
  const applyTheme = useCallback((mode: ThemeMode) => {
    const root = document.documentElement;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const resolved = mode === "system" ? (prefersDark ? "dark" : "light") : mode;
    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;
  }, []);

  useEffect(() => {
    let stored: ThemeMode = "system";
    try {
      stored = (window.localStorage.getItem("an.theme") as ThemeMode) || "system";
    } catch {
      /* ignore */
    }
    setThemeRaw(stored);
    applyTheme(stored);
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => stored === "system" && applyTheme("system");
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, [applyTheme]);

  const setTheme = useCallback(
    (mode: ThemeMode) => {
      setThemeRaw(mode);
      applyTheme(mode);
      try {
        window.localStorage.setItem("an.theme", mode);
      } catch {
        /* ignore */
      }
    },
    [applyTheme],
  );

  /* ui */
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (t: Omit<ToastMessage, "id">) => {
      const id = `toast-${++toastSeq}`;
      setToasts((prev) => [...prev.slice(-2), { ...t, id }]);
      window.setTimeout(() => dismissToast(id), 4600);
    },
    [dismissToast],
  );

  useEffect(() => {
    setCartOpen(false);
    setSearchOpen(false);
    setNavOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCartOpen(false);
        setSearchOpen(false);
        setNavOpen(false);
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    const locked = cartOpen || searchOpen || navOpen;
    document.body.style.overflow = locked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen, searchOpen, navOpen]);

  /* cart */
  const [lines, setLines] = useStored<CartLine[]>("an.cart", []);
  const [cartHydrated, setCartHydrated] = useState(false);
  useEffect(() => setCartHydrated(true), []);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [shippingMethod, setShippingMethod] = useState<ShippingMethod>("standard");
  const toastRef = useRef(toast);
  useEffect(() => {
    toastRef.current = toast;
  }, [toast]);

  const variantFor = useCallback(
    (product: Product, color: string, size?: string | null) => {
      const found =
        product.sizes.find((s) => s.label === (size ?? product.sizes[0]?.label)) ??
        product.sizes[0];
      return found ? `${color} / ${found.label}` : color;
    },
    [],
  );

  const add = useCallback(
    (product: Product, color: string, size?: string | null, qty = 1) => {
      const chosenSize =
        size ?? product.sizes.find((s) => s.available)?.label ?? product.sizes[0]?.label;
      const key = lineKey(product.id, color, chosenSize);

      setLines((prev) => {
        const existing = prev.find((l) => l.id === key);
        if (existing) {
          return prev.map((l) =>
            l.id === key
              ? { ...l, quantity: Math.min(l.quantity + qty, l.maxStock) }
              : l,
          );
        }
        const line: CartLine = {
          id: key,
          productId: product.id,
          productSlug: product.slug,
          variantId: `var-${key}`,
          name: product.name,
          image: product.images[0]?.src ?? "",
          variantLabel: [color, chosenSize].filter(Boolean).join(" / "),
          color,
          size: chosenSize,
          price: product.price,
          compareAt: product.compareAt ?? null,
          quantity: qty,
          maxStock: product.stock || 1,
        };
        return [...prev, line];
      });

      toastRef.current({
        title: "Added to cart",
        description: `${product.name} — ${[color, chosenSize].filter(Boolean).join(", ")}`,
        tone: "success",
        action: { label: "View cart", onClick: () => setCartOpen(true) },
      });
      setCartOpen(true);
    },
    [setLines],
  );

  const setQty = useCallback(
    (lineId: string, qty: number) => {
      setLines((prev) =>
        qty <= 0
          ? prev.filter((l) => l.id !== lineId)
          : prev.map((l) =>
              l.id === lineId ? { ...l, quantity: Math.min(qty, l.maxStock) } : l,
            ),
      );
    },
    [setLines],
  );

  const remove = useCallback(
    (lineId: string) => setLines((prev) => prev.filter((l) => l.id !== lineId)),
    [setLines],
  );

  const clear = useCallback(() => {
    setLines([]);
    setCouponCode("");
    setDiscount(0);
  }, [setLines]);

  const applyCode = useCallback(
    (code: string) => {
      const subtotal = lines.reduce((s, l) => s + l.price * l.quantity, 0);
      const result = applyCoupon(code, subtotal);
      setCouponCode(result.ok ? result.code ?? "" : "");
      setDiscount(result.discount);
      toastRef.current({
        title: result.ok ? "Coupon applied" : "Coupon not applied",
        description: result.message,
        tone: result.ok ? "success" : "error",
      });
    },
    [lines],
  );

  const removeCode = useCallback(() => {
    setCouponCode("");
    setDiscount(0);
  }, []);

  /* saved for later */
  const [saved, setSaved] = useStored<CartLine[]>("an.saved", []);

  const saveForLater = useCallback(
    (lineId: string) => {
      const line = lines.find((l) => l.id === lineId);
      if (!line) return;
      setLines((prev) => prev.filter((l) => l.id !== lineId));
      setSaved((prev) => [...prev.filter((l) => l.id !== lineId), line]);
      toastRef.current({ title: "Saved for later", description: line.name });
    },
    [lines, setLines, setSaved],
  );

  const moveToBag = useCallback(
    (lineId: string) => {
      const line = saved.find((l) => l.id === lineId);
      if (!line) return;
      setSaved((prev) => prev.filter((l) => l.id !== lineId));
      setLines((prev) => (prev.some((l) => l.id === lineId) ? prev : [...prev, line]));
      toastRef.current({ title: "Moved to bag", description: line.name, tone: "success" });
    },
    [saved, setLines, setSaved],
  );

  const removeSaved = useCallback(
    (lineId: string) => setSaved((prev) => prev.filter((l) => l.id !== lineId)),
    [setSaved],
  );

  const totals = useMemo(
    () => computeTotals(lines, { discount, shippingMethod }),
    [lines, discount, shippingMethod],
  );

  /* wishlist */
  const [wishlistIds, setWishlistIds] = useStored<string[]>("an.wishlist", []);
  const [wishlistHydrated, setWishlistHydrated] = useState(false);
  useEffect(() => setWishlistHydrated(true), []);

  const toggleWishlist = useCallback(
    (product: Product) => {
      let added = false;
      setWishlistIds((prev) => {
        if (prev.includes(product.id)) return prev.filter((id) => id !== product.id);
        added = true;
        return [...prev, product.id];
      });
      toastRef.current({
        title: added ? "Saved to wishlist" : "Removed from wishlist",
        description: product.name,
        tone: added ? "success" : "default",
        action: added ? { label: "View wishlist", href: "/wishlist" } : undefined,
      });
    },
    [setWishlistIds],
  );

  const removeWishlist = useCallback(
    (id: string) => setWishlistIds((prev) => prev.filter((x) => x !== id)),
    [setWishlistIds],
  );

  /* session */
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sessionHydrated, setSessionHydrated] = useState(false);
  useEffect(() => {
    setUser(authService.getSession());
    setSessionHydrated(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await authService.login(email, password);
    if (res.ok && res.user) setUser(res.user);
    return res.ok ? { ok: true } : { ok: false, message: res.message };
  }, []);

  const register = useCallback(
    async (input: { name: string; email: string; password: string }) => {
      const res = await authService.register(input);
      if (res.ok && res.user) setUser(res.user);
      return res.ok ? { ok: true } : { ok: false, message: res.message };
    },
    [],
  );

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    toastRef.current({ title: "Signed out", description: "See you soon." });
  }, []);

  const update = useCallback((patch: Partial<UserProfile>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      authService.setSession(next);
      return next;
    });
  }, []);

  const uiValue = useMemo<UiCtx>(
    () => ({
      cartOpen,
      openCart: () => setCartOpen(true),
      closeCart: () => setCartOpen(false),
      searchOpen,
      openSearch: () => setSearchOpen(true),
      closeSearch: () => setSearchOpen(false),
      navOpen,
      setNavOpen,
      toasts,
      toast,
      dismissToast,
    }),
    [cartOpen, searchOpen, navOpen, toasts, toast, dismissToast],
  );

  const cartValue = useMemo<CartCtx>(
    () => ({
      lines,
      saved,
      totals,
      hydrated: cartHydrated,
      coupon: {
        ok: Boolean(couponCode),
        code: couponCode || undefined,
        discount,
        message: couponCode ? `${couponCode} applied` : "",
      },
      couponCode,
      shippingMethod,
      setShippingMethod,
      add,
      setQty,
      remove,
      clear,
      saveForLater,
      moveToBag,
      removeSaved,
      applyCode,
      removeCode,
      variantFor,
    }),
    [
      lines,
      saved,
      totals,
      cartHydrated,
      couponCode,
      discount,
      shippingMethod,
      add,
      setQty,
      remove,
      clear,
      saveForLater,
      moveToBag,
      removeSaved,
      applyCode,
      removeCode,
      variantFor,
    ],
  );

  const wishlistValue = useMemo<WishlistCtx>(
    () => ({
      ids: wishlistIds,
      has: (id: string) => wishlistIds.includes(id),
      toggle: toggleWishlist,
      remove: removeWishlist,
      hydrated: wishlistHydrated,
    }),
    [wishlistIds, toggleWishlist, removeWishlist, wishlistHydrated],
  );

  const sessionValue = useMemo<SessionCtx>(
    () => ({ user, hydrated: sessionHydrated, login, register, logout, update }),
    [user, sessionHydrated, login, register, logout, update],
  );

  const themeValue = useMemo<ThemeCtx>(
    () => ({ theme, setTheme, toggle: () => setTheme(theme === "dark" ? "light" : "dark") }),
    [theme, setTheme],
  );

  return (
    <ThemeContext.Provider value={themeValue}>
      <UiContext.Provider value={uiValue}>
        <SessionContext.Provider value={sessionValue}>
          <CartContext.Provider value={cartValue}>
            <WishlistContext.Provider value={wishlistValue}>
              {children}
            </WishlistContext.Provider>
          </CartContext.Provider>
        </SessionContext.Provider>
      </UiContext.Provider>
    </ThemeContext.Provider>
  );
}

/* ------------------------------------------------------------------ hooks */

function useCtx<T>(ctx: React.Context<T | null>, name: string) {
  const value = useContext(ctx);
  if (!value) throw new Error(`use${name} must be used within <StoreProvider>`);
  return value;
}

export const useTheme = () => useCtx(ThemeContext, "Theme");
export const useUi = () => useCtx(UiContext, "Ui");
export const useCart = () => useCtx(CartContext, "Cart");
export const useWishlist = () => useCtx(WishlistContext, "Wishlist");
export const useSession = () => useCtx(SessionContext, "Session");
