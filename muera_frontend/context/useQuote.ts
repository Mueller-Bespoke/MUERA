"use client";

import { useEffect, useState } from "react";
import { toCheckoutLines, type CartItem } from "@/context/CartContext";

export interface QuoteIssue {
  index: number;
  code: "not_found" | "unavailable" | "out_of_stock" | "insufficient_stock" | "configuration_invalid";
  available?: number;
}

export interface Quote {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  coupon: string | null;
  couponError: string | null;
  issues: QuoteIssue[];
}

/** Server-priced totals for the current cart (debounced). `null` while the first quote loads. */
export function useQuote(items: CartItem[], couponCode?: string) {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(false);
  const key = JSON.stringify([toCheckoutLines(items), couponCode ?? ""]);

  useEffect(() => {
    if (!items.length) return;
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/checkout/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ items: toCheckoutLines(items), couponCode: couponCode || undefined }),
          signal: controller.signal,
        });
        if (res.ok) setQuote(await res.json());
      } catch {
        // aborted / offline — keep previous quote
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return { quote: items.length ? quote : null, loading };
}
