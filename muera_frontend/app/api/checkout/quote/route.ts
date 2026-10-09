import { NextResponse } from "next/server";
import { priceCart, sanitizeLines } from "@/lib/checkout";

/** Server-side totals for the cart page / checkout summary (prices, stock, coupon, shipping). */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const lines = sanitizeLines(body?.items);
  const quote = await priceCart(lines, body?.couponCode);
  return NextResponse.json({
    lines: quote.lines.map((l) => ({
      productId: l.productId,
      color: l.input.color ?? null,
      size: l.input.size ?? null,
      msSessionId: l.msSessionId,
      quantity: l.quantity,
      unitPrice: l.unitPrice,
      totalPrice: l.totalPrice,
    })),
    issues: quote.issues,
    subtotal: quote.subtotal,
    discount: quote.discount,
    shipping: quote.shipping,
    tax: quote.tax,
    total: quote.total,
    currency: quote.currency,
    coupon: quote.coupon?.code ?? null,
    couponError: quote.couponError,
  });
}
