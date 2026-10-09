"use client";

import { createContext, useCallback, useContext, useReducer, useEffect, useRef, useState, type ReactNode } from "react";
import type { Product } from "@/lib/types";

/* ── Types ─────────────────────────────────────────────────── */
export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  customized: boolean; // ordered via 3D configurator
  customPrice?: number;
  customImage?: string;
  /** MirrorSize userSessionId — the server re-reads the configuration from it at checkout */
  msSessionId?: string;
  lineKey: string; // unique per product+color+size+customized
}

/** Shape the server APIs (/api/checkout, /api/checkout/quote) accept — ids only, no prices. */
export function toCheckoutLines(items: CartItem[]) {
  return items.map((i) => ({
    productId: i.product.id,
    color: i.customized ? undefined : i.selectedColor,
    size: i.customized ? undefined : i.selectedSize,
    quantity: i.quantity,
    msSessionId: i.msSessionId,
  }));
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; lineKey: string }
  | { type: "UPDATE_QTY"; lineKey: string; quantity: number }
  | { type: "CLEAR" };

interface CartContextValue extends CartState {
  addItem: (item: Omit<CartItem, "lineKey">) => void;
  removeItem: (lineKey: string) => void;
  updateQty: (lineKey: string, quantity: number) => void;
  clearCart: () => void;
  finishCart: () => void;
  totalItems: number;
  subtotal: number;
  /** true once the saved cart has been read from localStorage */
  hydrated: boolean;
  /** Server-side copy of this cart (abandoned-cart recovery); null until the first item. */
  cartToken: string | null;
  /** Attaches the shopper's email to the saved cart (checkout email field). */
  saveCartEmail: (email: string) => void;
}

/* ── Reducer ───────────────────────────────────────────────── */
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.findIndex((i) => i.lineKey === action.item.lineKey);
      // A configured garment is one specific session — never stack it twice
      if (existing >= 0 && action.item.msSessionId) return state;
      if (existing >= 0) {
        const updated = [...state.items];
        updated[existing] = {
          ...updated[existing],
          quantity: updated[existing].quantity + action.item.quantity,
        };
        return { items: updated };
      }
      return { items: [...state.items, action.item] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.lineKey !== action.lineKey) };
    case "UPDATE_QTY":
      return {
        items: state.items.map((i) =>
          i.lineKey === action.lineKey ? { ...i, quantity: Math.max(1, action.quantity) } : i
        ),
      };
    case "CLEAR":
      return { items: [] };
    default:
      return state;
  }
}

/* ── Context ───────────────────────────────────────────────── */
const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "muera_cart";
const TOKEN_KEY = "muera_cart_token";

const readToken = () => {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
};
const writeToken = (token: string | null) => {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    // ignore
  }
};
const pageLocale = () => {
  const first = window.location.pathname.split("/")[1];
  return ["en", "fr", "it"].includes(first) ? first : "de";
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [isHydrated, setIsHydrated] = useState(false);
  const [cartToken, setCartToken] = useState<string | null>(null);
  const tokenRef = useRef<string | null>(null);
  const skipSync = useRef(true);

  const syncCart = useCallback(async (items: CartItem[], email?: string) => {
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: tokenRef.current, lines: toCheckoutLines(items), email, locale: pageLocale() }),
        keepalive: true,
      });
      const data = await res.json().catch(() => null);
      if (data && "token" in data && data.token !== tokenRef.current) {
        tokenRef.current = data.token;
        setCartToken(data.token);
        writeToken(data.token);
      }
    } catch {
      // Saving the cart is best-effort; the local cart still works.
    }
  }, []);

  // Read from localStorage on mount
  useEffect(() => {
    tokenRef.current = readToken();
    setCartToken(tokenRef.current);

    // Recovery link from an abandoned-cart email: /cart?recover=<token>
    const recover = new URLSearchParams(window.location.search).get("recover");
    if (recover && /^[0-9a-f]{32}$/.test(recover)) {
      const url = new URL(window.location.href);
      url.searchParams.delete("recover");
      window.history.replaceState(null, "", url.toString());
      fetch(`/api/cart?token=${recover}&locale=${pageLocale()}`)
        .then((r) => (r.ok ? r.json() : null))
        .then((data) => {
          if (!data?.items) return;
          tokenRef.current = recover;
          setCartToken(recover);
          writeToken(recover);
          dispatch({ type: "CLEAR" });
          for (const item of data.items as Omit<CartItem, "lineKey">[]) {
            const suffix = item.customized ? `__${item.msSessionId}` : "";
            dispatch({
              type: "ADD_ITEM",
              item: { ...item, lineKey: `${item.product.id}__${item.selectedColor}__${item.selectedSize}__${item.customized}${suffix}` },
            });
          }
        })
        .catch(() => {});
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartState;
        // Drop carts saved before the catalog moved to Supabase (numeric ids)
        parsed.items = (parsed.items ?? []).filter((i) => /^[0-9a-f-]{36}$/i.test(i.product?.id ?? ""));
        if (parsed.items.length > 0) {
          // Initialize state
          parsed.items.forEach(item => dispatch({ type: "ADD_ITEM", item }));
        }
      }
    } catch {
      // ignore
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsHydrated(true);
  }, []);

  // Persist to localStorage
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        // ignore
      }
    }
  }, [state, isHydrated]);

  // Keep the server copy in step (debounced). Skips the initial load from localStorage.
  useEffect(() => {
    if (!isHydrated) return;
    if (skipSync.current) {
      skipSync.current = false;
      return;
    }
    const t = setTimeout(() => syncCart(state.items), 1500);
    return () => clearTimeout(t);
  }, [state, isHydrated, syncCart]);

  const saveCartEmail = useCallback(
    (email: string) => {
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) syncCart(state.items, email.trim());
    },
    [state.items, syncCart]
  );

  const addItem = (item: Omit<CartItem, "lineKey">) => {
    // Generate a unique line key based on product + config
    const uniqueSuffix = item.customized ? `__${item.msSessionId ?? Date.now()}` : "";
    const lineKey = `${item.product.id}__${item.selectedColor}__${item.selectedSize}__${item.customized}${uniqueSuffix}`;
    dispatch({ type: "ADD_ITEM", item: { ...item, lineKey } });
  };

  const removeItem = (lineKey: string) => dispatch({ type: "REMOVE_ITEM", lineKey });
  const updateQty = (lineKey: string, quantity: number) => dispatch({ type: "UPDATE_QTY", lineKey, quantity });
  const clearCart = () => dispatch({ type: "CLEAR" });
  /** After a successful order: empty the cart and start a new server copy next time. */
  const finishCart = () => {
    dispatch({ type: "CLEAR" });
    skipSync.current = true;
    tokenRef.current = null;
    setCartToken(null);
    writeToken(null);
  };

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = state.items.reduce((s, i) => {
    const price = i.customPrice !== undefined ? i.customPrice : i.product.price;
    return s + price * i.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQty, clearCart, finishCart, totalItems, subtotal, hydrated: isHydrated, cartToken, saveCartEmail }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
