"use client";

import { createContext, useContext, useReducer, useEffect, useState, type ReactNode } from "react";
import type { Product } from "@/data/products";

/* ── Types ─────────────────────────────────────────────────── */
export interface CartItem {
  product: Product;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  customized: boolean; // ordered via 3D configurator
  customPrice?: number;
  customImage?: string;
  lineKey: string; // unique per product+color+size+customized
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
  totalItems: number;
  subtotal: number;
}

/* ── Reducer ───────────────────────────────────────────────── */
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.findIndex((i) => i.lineKey === action.item.lineKey);
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

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [isHydrated, setIsHydrated] = useState(false);

  // Read from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as CartState;
        if (parsed.items && parsed.items.length > 0) {
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

  const addItem = (item: Omit<CartItem, "lineKey">) => {
    // Generate a unique line key based on product + config
    const uniqueSuffix = item.customized ? `__${Date.now()}` : "";
    const lineKey = `${item.product.id}__${item.selectedColor}__${item.selectedSize}__${item.customized}${uniqueSuffix}`;
    dispatch({ type: "ADD_ITEM", item: { ...item, lineKey } });
  };

  const removeItem = (lineKey: string) => dispatch({ type: "REMOVE_ITEM", lineKey });
  const updateQty = (lineKey: string, quantity: number) => dispatch({ type: "UPDATE_QTY", lineKey, quantity });
  const clearCart = () => dispatch({ type: "CLEAR" });

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0);
  const subtotal = state.items.reduce((s, i) => {
    const price = i.customPrice !== undefined ? i.customPrice : i.product.price;
    return s + price * i.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQty, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
