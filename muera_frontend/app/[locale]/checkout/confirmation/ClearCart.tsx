"use client";

import { useEffect } from "react";
import { useCart } from "@/context/CartContext";

/** Empties the cart once the order is confirmed; the next cart gets a fresh server copy. */
export default function ClearCart() {
  const { finishCart, hydrated } = useCart();
  useEffect(() => {
    if (hydrated) finishCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated]);
  return null;
}
