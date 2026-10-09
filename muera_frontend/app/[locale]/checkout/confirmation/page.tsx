import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { stripe } from "@/lib/stripe";
import ClearCart from "./ClearCart";

export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function ConfirmationPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string; payment_intent?: string; session_id?: string }>;
}) {
  const { locale } = await params;
  const { order: orderId, payment_intent: piParam, session_id: sessionId } = await searchParams;
  const t = await getTranslations({ locale, namespace: "confirmation" });

  // Stripe appends ?payment_intent=… to the return URL; requiring both ids to match
  // means order numbers can't be enumerated.
  let orderNumber: string | null = null;
  let status: "succeeded" | "processing" | "failed" = "failed";

  // Payment links sent from the admin (Stripe Checkout) return ?session_id=… instead.
  let paymentIntentId = piParam;
  if (!paymentIntentId && sessionId?.startsWith("cs_") && orderId && UUID.test(orderId)) {
    const session = await stripe().checkout.sessions.retrieve(sessionId).catch(() => null);
    if (session?.metadata?.order_id === orderId && typeof session.payment_intent === "string") {
      paymentIntentId = session.payment_intent;
      // The webhook may not have arrived yet — link the payment so the lookup below matches.
      await createAdminClient()
        .from("orders")
        .update({ stripe_payment_intent_id: paymentIntentId })
        .eq("id", orderId)
        .is("paid_at", null);
    }
  }
  if (orderId && UUID.test(orderId) && paymentIntentId) {
    const { data: order } = await createAdminClient()
      .from("orders")
      .select("order_number, paid_at")
      .eq("id", orderId)
      .eq("stripe_payment_intent_id", paymentIntentId)
      .maybeSingle();
    if (order) {
      orderNumber = order.order_number;
      if (order.paid_at) status = "succeeded";
      else {
        const pi = await stripe().paymentIntents.retrieve(paymentIntentId).catch(() => null);
        status = pi?.status === "succeeded" ? "succeeded" : pi?.status === "processing" ? "processing" : "failed";
      }
    }
  }

  if (!orderNumber || status === "failed") {
    return (
      <section className="confirmation-hero" aria-label={t("failedTitle")}>
        <div style={{ maxWidth: 560 }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3rem)", marginBottom: "1rem" }}>
            {t("failedTitle")}
          </h1>
          <p style={{ color: "var(--color-mid-gray)", marginBottom: "2rem" }}>{t("failedText")}</p>
          <Link href="/checkout" className="btn btn--primary">{t("tryAgain")}</Link>
        </div>
      </section>
    );
  }

  const STEPS = [
    { step: "01", title: t("step1Title"), desc: t("step1Desc") },
    { step: "02", title: t("step2Title"), desc: t("step2Desc") },
    { step: "03", title: t("step3Title"), desc: t("step3Desc") },
    { step: "04", title: t("step4Title"), desc: t("step4Desc") },
  ];

  return (
    <section className="confirmation-hero" aria-label={t("title")}>
      <ClearCart />
      <div style={{ maxWidth: 560 }}>
        <div className="confirmation-icon" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M5 14l6 6 12-12" />
          </svg>
        </div>

        <p className="confirmation-order-no">{t("title")}</p>
        <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(2rem, 4vw, 3rem)", color: "var(--color-black)", marginBottom: "1rem", lineHeight: 1.2 }}>
          {t("heading")}
        </h1>

        <div className="divider divider--center" />

        <p style={{ color: "var(--color-mid-gray)", marginBottom: "0.625rem", fontSize: "1rem" }}>
          {t("orderNumber", { number: orderNumber })}
        </p>
        <p style={{ color: "var(--color-mid-gray)", maxWidth: 420, marginInline: "auto", fontSize: "0.9375rem", lineHeight: 1.65, marginBottom: "2.5rem" }}>
          {status === "processing" ? t("processingText") : t("confirmationText")}
        </p>

        <div style={{ border: "1px solid var(--color-light-gray)", padding: "1.5rem 2rem", marginBottom: "2.5rem", textAlign: "left" }}>
          <p style={{ fontSize: "0.6875rem", letterSpacing: "0.15em", textTransform: "uppercase", color: "var(--color-mid-gray)", marginBottom: "1.25rem" }}>
            {t("whatHappensNext")}
          </p>
          {STEPS.map((s) => (
            <div key={s.step} style={{ display: "flex", gap: "1.25rem", paddingBlock: "0.875rem", borderBottom: "1px solid var(--color-light-gray)" }}>
              <span style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", color: "var(--color-beige)", flexShrink: 0, lineHeight: 1 }}>
                {s.step}
              </span>
              <div>
                <p style={{ fontFamily: "var(--font-serif)", fontSize: "0.9375rem", color: "var(--color-black)", marginBottom: "0.2rem" }}>{s.title}</p>
                <p style={{ fontSize: "0.8125rem", color: "var(--color-mid-gray)" }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/shop" className="btn btn--primary" id="confirmation-shop-btn">
            {t("continueShopping")}
          </Link>
          <Link href="/contact" className="btn btn--outline-dark" id="confirmation-contact-btn">
            {t("haveAQuestion")}
          </Link>
        </div>
      </div>
    </section>
  );
}
