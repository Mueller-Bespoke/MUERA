import { NextResponse } from "next/server";
import { priceCart, sanitizeLines } from "@/lib/checkout";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { stripe, toMinor } from "@/lib/stripe";
import type { Json } from "@/lib/database.types";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

function readAddress(a: Record<string, unknown> | undefined) {
  return {
    first_name: str(a?.first_name, 80),
    last_name: str(a?.last_name, 80),
    phone: str(a?.phone, 40),
    line1: str(a?.line1),
    line2: str(a?.line2),
    city: str(a?.city, 100),
    postal_code: str(a?.postal_code, 20),
    country: str(a?.country, 2).toUpperCase(),
  };
}

/**
 * Creates a pending order from server-side prices and a matching Stripe PaymentIntent.
 * The order is only marked paid by the Stripe webhook.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid_request" }, { status: 400 });

  const email = str(body.email, 200).toLowerCase();
  const shipping = readAddress(body.shippingAddress);
  const billing = body.billingAddress ? readAddress(body.billingAddress) : null;
  const locale = ["de", "en", "fr", "it"].includes(body.locale) ? body.locale : "de";

  if (!EMAIL.test(email)) return NextResponse.json({ error: "invalid_email" }, { status: 400 });
  if (!shipping.first_name || !shipping.last_name || !shipping.line1 || !shipping.city || !shipping.postal_code || !shipping.country) {
    return NextResponse.json({ error: "invalid_address" }, { status: 400 });
  }

  const quote = await priceCart(sanitizeLines(body.items), body.couponCode);
  if (quote.issues.length) return NextResponse.json({ error: "cart_changed", issues: quote.issues }, { status: 409 });
  if (!quote.lines.length) return NextResponse.json({ error: "empty_cart" }, { status: 400 });
  if (body.couponCode && quote.couponError) {
    return NextResponse.json({ error: "coupon_invalid", couponError: quote.couponError }, { status: 409 });
  }

  const {
    data: { user },
  } = await (await createClient()).auth.getUser();

  const supabase = createAdminClient();
  const name = `${shipping.first_name} ${shipping.last_name}`;

  // Link the order to the shopper's saved cart, so paying closes it as recovered/converted.
  const cartToken = typeof body.cartToken === "string" && /^[0-9a-f]{32}$/.test(body.cartToken) ? body.cartToken : null;
  const cart = cartToken
    ? (await supabase.from("carts").select("id").eq("recovery_token", cartToken).is("completed_at", null).maybeSingle()).data
    : null;
  if (cart) await supabase.from("carts").update({ email, profile_id: user?.id ?? undefined }).eq("id", cart.id);

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      profile_id: user?.id ?? null,
      email,
      locale,
      cart_id: cart?.id ?? null,
      coupon_id: quote.coupon?.id ?? null,
      subtotal: quote.subtotal,
      discount_amount: quote.discount,
      shipping_amount: quote.shipping,
      tax_amount: quote.tax,
      total_amount: quote.total,
      currency: quote.currency,
      shipping_address: { ...shipping, name, email } as Json,
      billing_address: (billing ? { ...billing, name: `${billing.first_name} ${billing.last_name}` } : {}) as Json,
      notes: str(body.notes, 1000) || null,
    })
    .select("id, order_number")
    .single();
  if (orderError || !order) {
    console.error("order insert failed", orderError?.message);
    return NextResponse.json({ error: "order_failed" }, { status: 500 });
  }

  const { error: itemsError } = await supabase.from("order_items").insert(
    quote.lines.map((l) => ({
      order_id: order.id,
      product_id: l.productId,
      variant_id: l.variantId,
      quantity: l.quantity,
      unit_price: l.unitPrice,
      total_price: l.totalPrice,
      product_snapshot: l.snapshot,
      configuration: l.configuration,
      mirror_size_user_session_id: l.msSessionId,
    }))
  );
  if (itemsError) {
    await supabase.from("orders").delete().eq("id", order.id);
    console.error("order items insert failed", itemsError.message);
    return NextResponse.json({ error: "order_failed" }, { status: 500 });
  }

  // Remember MirrorSize configurations (measurements) against the customer
  for (const l of quote.lines.filter((x) => x.msSessionId)) {
    await supabase.from("mirror_size_sessions").upsert(
      {
        user_session_id: l.msSessionId!,
        session_token: l.msSessionId!,
        profile_id: user?.id ?? null,
        product_id: l.productId,
        sku: (l.configuration as { sku?: string })?.sku ?? null,
        payload: l.configuration,
        source: "checkout",
      },
      { onConflict: "user_session_id" }
    );
  }

  try {
    const intent = await stripe().paymentIntents.create(
      {
        amount: toMinor(quote.total),
        currency: quote.currency.toLowerCase(),
        automatic_payment_methods: { enabled: true },
        receipt_email: email,
        description: `Muera order ${order.order_number}`,
        metadata: { order_id: order.id, order_number: order.order_number },
      },
      { idempotencyKey: `order-${order.id}` }
    );

    await supabase
      .from("orders")
      .update({ stripe_payment_intent_id: intent.id, stripe_payment_status: intent.status })
      .eq("id", order.id);
    await supabase.from("order_events").insert({ order_id: order.id, type: "created", message: "Checkout started" });

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.order_number,
      clientSecret: intent.client_secret,
      total: quote.total,
    });
  } catch (e) {
    console.error("PaymentIntent creation failed", e);
    await supabase.from("orders").update({ status: "cancelled", cancelled_at: new Date().toISOString() }).eq("id", order.id);
    return NextResponse.json({ error: "payment_unavailable" }, { status: 502 });
  }
}
