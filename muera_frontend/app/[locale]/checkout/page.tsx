"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { Link, useRouter } from "@/i18n/navigation";
import { toCheckoutLines, useCart } from "@/context/CartContext";
import { useQuote } from "@/context/useQuote";
import { formatPrice } from "@/lib/format";
import { createClient } from "@/lib/supabase/client";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

const COUNTRIES = ["CH", "DE", "AT", "FR", "IT", "GB"] as const;

interface Address {
  first_name: string;
  last_name: string;
  phone: string;
  line1: string;
  line2: string;
  postal_code: string;
  city: string;
  country: string;
}

const emptyAddress: Address = {
  first_name: "",
  last_name: "",
  phone: "",
  line1: "",
  line2: "",
  postal_code: "",
  city: "",
  country: "CH",
};

function CheckoutForm({
  total,
  couponCode,
  onCouponChange,
  couponError,
  appliedCoupon,
}: {
  total: number;
  couponCode: string;
  onCouponChange: (code: string) => void;
  couponError: string | null;
  appliedCoupon: string | null;
}) {
  const { items, cartToken, saveCartEmail } = useCart();
  const t = useTranslations("checkout");
  const locale = useLocale();
  const stripe = useStripe();
  const elements = useElements();

  const [email, setEmail] = useState("");
  const [address, setAddress] = useState<Address>(emptyAddress);
  const [notes, setNotes] = useState("");
  const [couponInput, setCouponInput] = useState(couponCode);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Prefill for signed-in customers
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(async ({ data }) => {
      if (!data.user) return;
      setEmail((e) => e || data.user!.email || "");
      const { data: saved } = await supabase
        .from("addresses")
        .select("*")
        .eq("type", "shipping")
        .order("is_default", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (saved) {
        const [first, ...rest] = saved.full_name.split(" ");
        setAddress((a) =>
          a.line1
            ? a
            : {
                first_name: first ?? "",
                last_name: rest.join(" "),
                phone: saved.phone ?? "",
                line1: saved.line1,
                line2: saved.line2 ?? "",
                postal_code: saved.postal_code,
                city: saved.city,
                country: saved.country,
              }
        );
      }
    });
  }, []);

  const set = (k: keyof Address) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setAddress((a) => ({ ...a, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setErrorMessage(null);

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return setErrorMessage(t("errors.email"));
    if (!address.first_name || !address.last_name || !address.line1 || !address.postal_code || !address.city) {
      return setErrorMessage(t("errors.address"));
    }

    setSubmitting(true);
    const { error: submitError } = await elements.submit();
    if (submitError) {
      setErrorMessage(submitError.message ?? t("errors.payment"));
      setSubmitting(false);
      return;
    }

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: toCheckoutLines(items),
        email,
        shippingAddress: address,
        couponCode: appliedCoupon ?? undefined,
        notes,
        locale,
        cartToken,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setErrorMessage(
        data.error === "cart_changed"
          ? t("errors.cartChanged")
          : data.error === "coupon_invalid"
            ? t("errors.coupon")
            : t("errors.generic")
      );
      setSubmitting(false);
      return;
    }

    const prefix = locale === "de" ? "" : `/${locale}`;
    const { error } = await stripe.confirmPayment({
      elements,
      clientSecret: data.clientSecret,
      confirmParams: {
        return_url: `${window.location.origin}${prefix}/checkout/confirmation?order=${data.orderId}`,
        receipt_email: email,
        payment_method_data: {
          billing_details: {
            name: `${address.first_name} ${address.last_name}`,
            email,
            phone: address.phone || undefined,
            address: {
              line1: address.line1,
              line2: address.line2 || "",
              postal_code: address.postal_code,
              city: address.city,
              state: "",
              country: address.country,
            },
          },
        },
      },
    });
    // Only reached when confirmation fails immediately (otherwise Stripe redirects)
    setErrorMessage(error?.message ?? t("errors.payment"));
    setSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit} noValidate aria-label={t("title")}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", marginBottom: "2.5rem" }}>
        {t("title")}
      </h1>

      <div className="checkout-section">
        <h2 className="checkout-section__title">{t("contact")}</h2>
        <div className="form-group">
          <label htmlFor="co-email" className="form-label">{t("emailAddress")}</label>
          <input type="email" id="co-email" className="form-input" placeholder="your@email.com" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={() => saveCartEmail(email)} />
        </div>
        <p style={{ fontSize: "0.8125rem", color: "var(--color-mid-gray)", marginTop: "0.75rem" }}>
          {t.rich("haveAccount", {
            link: (chunks) => <Link href="/account/login?next=/checkout" style={{ textDecoration: "underline" }}>{chunks}</Link>,
          })}
        </p>
      </div>

      <div className="checkout-section">
        <h2 className="checkout-section__title">{t("shippingAddress")}</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="co-first-name" className="form-label">{t("firstName")}</label>
            <input type="text" id="co-first-name" className="form-input" placeholder="Max" required autoComplete="given-name" value={address.first_name} onChange={set("first_name")} />
          </div>
          <div className="form-group">
            <label htmlFor="co-last-name" className="form-label">{t("lastName")}</label>
            <input type="text" id="co-last-name" className="form-input" placeholder="Müller" required autoComplete="family-name" value={address.last_name} onChange={set("last_name")} />
          </div>
        </div>
        <div className="form-group" style={{ marginTop: "1rem" }}>
          <label htmlFor="co-address" className="form-label">{t("address")}</label>
          <input type="text" id="co-address" className="form-input" placeholder="Bahnhofstrasse 1" required autoComplete="address-line1" value={address.line1} onChange={set("line1")} />
        </div>
        <div className="form-group" style={{ marginTop: "1rem" }}>
          <label htmlFor="co-address2" className="form-label">{t("address2")}</label>
          <input type="text" id="co-address2" className="form-input" autoComplete="address-line2" value={address.line2} onChange={set("line2")} />
        </div>
        <div className="form-row" style={{ marginTop: "1rem" }}>
          <div className="form-group">
            <label htmlFor="co-postal" className="form-label">{t("postalCode")}</label>
            <input type="text" id="co-postal" className="form-input" placeholder="8001" required autoComplete="postal-code" value={address.postal_code} onChange={set("postal_code")} />
          </div>
          <div className="form-group">
            <label htmlFor="co-city" className="form-label">{t("city")}</label>
            <input type="text" id="co-city" className="form-input" placeholder="Zürich" required autoComplete="address-level2" value={address.city} onChange={set("city")} />
          </div>
        </div>
        <div className="form-row" style={{ marginTop: "1rem" }}>
          <div className="form-group">
            <label htmlFor="co-country" className="form-label">{t("country")}</label>
            <select id="co-country" className="form-input" required autoComplete="country" value={address.country} onChange={set("country")}>
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{t(`countries.${c}`)}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="co-phone" className="form-label">{t("phone")}</label>
            <input type="tel" id="co-phone" className="form-input" autoComplete="tel" value={address.phone} onChange={set("phone")} />
          </div>
        </div>
        <div className="form-group" style={{ marginTop: "1rem" }}>
          <label htmlFor="co-notes" className="form-label">{t("notes")}</label>
          <textarea id="co-notes" className="form-textarea" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} maxLength={1000} />
        </div>
      </div>

      <div className="checkout-section">
        <h2 className="checkout-section__title">{t("discountCode")}</h2>
        <div style={{ display: "flex", gap: "0.75rem" }}>
          <input
            type="text"
            className="form-input"
            value={couponInput}
            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            placeholder={t("discountPlaceholder")}
            aria-label={t("discountCode")}
          />
          <button type="button" className="btn btn--outline-dark" onClick={() => onCouponChange(couponInput.trim())}>
            {t("apply")}
          </button>
        </div>
        {couponCode && couponError && (
          <p style={{ color: "#c0392b", fontSize: "0.8125rem", marginTop: "0.5rem" }}>{t(`couponErrors.${couponError}`)}</p>
        )}
        {appliedCoupon && (
          <p style={{ color: "var(--color-navy)", fontSize: "0.8125rem", marginTop: "0.5rem" }}>
            {t("couponApplied", { code: appliedCoupon })}{" "}
            <button type="button" onClick={() => { setCouponInput(""); onCouponChange(""); }} style={{ background: "none", border: 0, textDecoration: "underline", cursor: "pointer" }}>
              {t("remove")}
            </button>
          </p>
        )}
      </div>

      <div className="checkout-section">
        <h2 className="checkout-section__title">{t("payment")}</h2>
        <PaymentElement
          options={{
            layout: "accordion",
            // Name, email and address come from our own form (passed in confirmPayment)
            fields: { billingDetails: { name: "never", email: "never", address: "never" } },
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.75rem" }}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--color-mid-gray)" strokeWidth="1.3" aria-hidden="true">
            <rect x="2" y="5" width="10" height="7" rx="1" />
            <path d="M4 5V4a3 3 0 016 0v1" />
          </svg>
          <span style={{ fontSize: "0.75rem", color: "var(--color-mid-gray)" }}>{t("securedByStripe")}</span>
        </div>
      </div>

      {errorMessage && (
        <div role="alert" style={{ color: "#9e2146", fontSize: "0.875rem", marginBottom: "1rem" }}>{errorMessage}</div>
      )}

      <button
        type="submit"
        className="btn btn--primary"
        id="co-submit"
        disabled={submitting || !stripe}
        style={{ width: "100%", justifyContent: "center", opacity: submitting ? 0.7 : 1 }}
      >
        {submitting ? t("processing") : t("placeOrder", { total: formatPrice(total) })}
      </button>

      <p style={{ fontSize: "0.75rem", color: "var(--color-mid-gray)", marginTop: "1rem", textAlign: "center" }}>
        {t.rich("agreement", {
          privacyPolicy: (chunks) => <Link href="/privacy" style={{ color: "var(--color-black)", textDecoration: "underline" }} key="pp">{chunks}</Link>,
          termsOfService: (chunks) => <Link href="/terms" style={{ color: "var(--color-black)", textDecoration: "underline" }} key="tos">{chunks}</Link>,
        })}
      </p>
    </form>
  );
}

export default function CheckoutPage() {
  const { items, subtotal, hydrated } = useCart();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("checkout");
  const [couponCode, setCouponCode] = useState("");
  const { quote } = useQuote(items, couponCode);

  useEffect(() => {
    if (hydrated && items.length === 0) router.push("/shop");
  }, [hydrated, items.length, router]);

  const total = quote?.total ?? subtotal;
  const amount = Math.max(50, Math.round(total * 100)); // Stripe minimum is CHF 0.50

  const elementsOptions = useMemo(
    () => ({
      mode: "payment" as const,
      amount,
      currency: "chf",
      locale: locale as "de" | "en" | "fr" | "it",
      appearance: {
        theme: "flat" as const,
        variables: { fontFamily: "Inter, system-ui, sans-serif", borderRadius: "0px", colorPrimary: "#1a1628" },
      },
    }),
    [amount, locale]
  );

  if (!hydrated || items.length === 0) return null;

  return (
    <div className="container">
      <div className="checkout-layout">
        <Elements stripe={stripePromise} options={elementsOptions}>
          <CheckoutForm
            total={total}
            couponCode={couponCode}
            onCouponChange={setCouponCode}
            couponError={quote?.couponError ?? null}
            appliedCoupon={quote?.coupon ?? null}
          />
        </Elements>

        <aside className="checkout-order-summary" aria-label={t("yourOrder")}>
          <h2 className="checkout-order-summary__title">{t("yourOrder")}</h2>

          {items.map((item) => (
            <div key={item.lineKey} className="checkout-summary-item">
              <div className="checkout-summary-item__img">
                <Image
                  src={item.customImage || item.product.variants[0]?.images[0] || item.product.images[0]}
                  alt={item.product.name}
                  fill
                  sizes="64px"
                  style={{ objectFit: "cover" }}
                />
                {item.quantity > 1 && (
                  <span style={{
                    position: "absolute", top: -6, right: -6,
                    background: "var(--color-black)", color: "#fff",
                    fontSize: "0.625rem", width: 18, height: 18,
                    borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center"
                  }}>
                    {item.quantity}
                  </span>
                )}
              </div>
              <div>
                <p className="checkout-summary-item__name">{item.product.name}</p>
                <p className="checkout-summary-item__meta">
                  {item.selectedColor} · {item.selectedSize}
                  {item.customized && ` · ${t("custom3d")}`}
                </p>
              </div>
              <p className="checkout-summary-item__price">
                {formatPrice((item.customPrice ?? item.product.price) * item.quantity)}
              </p>
            </div>
          ))}

          <div className="checkout-totals">
            <div className="checkout-total-row">
              <span>{t("subtotal")}</span>
              <span>{formatPrice(quote?.subtotal ?? subtotal)}</span>
            </div>
            {!!quote?.discount && (
              <div className="checkout-total-row">
                <span>{t("discount")}{quote.coupon ? ` (${quote.coupon})` : ""}</span>
                <span>− {formatPrice(quote.discount)}</span>
              </div>
            )}
            <div className="checkout-total-row">
              <span>{t("shipping")}</span>
              <span>{quote ? (quote.shipping === 0 ? t("free") : formatPrice(quote.shipping)) : "—"}</span>
            </div>
            <div className="checkout-total-row checkout-total-row--grand">
              <span>{t("total")}</span>
              <span>{formatPrice(total)}</span>
            </div>
            {!!quote?.tax && (
              <p style={{ fontSize: "0.75rem", color: "var(--color-mid-gray)", marginTop: "0.5rem" }}>
                {t("vatIncluded", { amount: formatPrice(quote.tax) })}
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
