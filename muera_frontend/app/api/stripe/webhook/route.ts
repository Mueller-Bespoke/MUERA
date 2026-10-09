import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import type { Json } from "@/lib/database.types";

/**
 * Stripe → Dashboard → Developers → Webhooks → add endpoint
 *   https://<storefront>/api/stripe/webhook
 * events: payment_intent.succeeded, payment_intent.payment_failed, charge.refunded
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  const signature = request.headers.get("stripe-signature");
  if (!secret || !signature) return NextResponse.json({ error: "not_configured" }, { status: 400 });

  const payload = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(payload, signature, secret);
  } catch (e) {
    console.error("Stripe signature verification failed", e);
    return NextResponse.json({ error: "bad_signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Idempotency: Stripe retries; process each event once.
  const { error: dupError } = await supabase
    .from("stripe_events")
    .insert({ stripe_event_id: event.id, type: event.type, payload: event as unknown as Json });
  if (dupError?.code === "23505") return NextResponse.json({ received: true, duplicate: true });

  try {
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as Stripe.PaymentIntent;
      const method = pi.payment_method_types?.[0] ?? null;
      // Payment links from the admin (Stripe Checkout) carry the order id instead.
      const linkedOrder = pi.metadata?.order_id;
      if (linkedOrder && /^[0-9a-f-]{36}$/i.test(linkedOrder)) {
        await supabase
          .from("orders")
          .update({ stripe_payment_intent_id: pi.id })
          .eq("id", linkedOrder)
          .is("paid_at", null);
      }
      const { error } = await supabase.rpc("mark_order_paid", {
        p_payment_intent_id: pi.id,
        p_payment_method: method ?? undefined,
      });
      if (error) throw error;
    } else if (event.type === "payment_intent.payment_failed") {
      const pi = event.data.object as Stripe.PaymentIntent;
      const { data: order } = await supabase
        .from("orders")
        .update({ stripe_payment_status: "failed" })
        .eq("stripe_payment_intent_id", pi.id)
        .select("id")
        .maybeSingle();
      if (order) {
        await supabase.from("order_events").insert({
          order_id: order.id,
          type: "payment_failed",
          message: `Payment failed: ${pi.last_payment_error?.message ?? "unknown reason"}`,
        });
      }
    } else if (event.type === "charge.refunded") {
      const charge = event.data.object as Stripe.Charge;
      const piId = typeof charge.payment_intent === "string" ? charge.payment_intent : charge.payment_intent?.id;
      if (piId) {
        await supabase
          .from("orders")
          .update({ stripe_payment_status: charge.refunded ? "refunded" : "partially_refunded" })
          .eq("stripe_payment_intent_id", piId);
      }
    }

    await supabase.from("stripe_events").update({ processed: true }).eq("stripe_event_id", event.id);
    return NextResponse.json({ received: true });
  } catch (e) {
    console.error("Stripe webhook processing failed", e);
    // Let Stripe retry: remove the idempotency marker
    await supabase.from("stripe_events").delete().eq("stripe_event_id", event.id);
    return NextResponse.json({ error: "processing_failed" }, { status: 500 });
  }
}
