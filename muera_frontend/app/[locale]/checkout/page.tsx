"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "");

type PaymentMethod = "card" | "twint" | "invoice";

function CheckoutContent() {
  const { items, subtotal, clearCart } = useCart();
  const router = useRouter();
  const t = useTranslations("checkout");

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (items.length === 0) router.push("/shop");
  }, [items.length, router]);

  const shipping = subtotal > 500 ? 0 : 25;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setSubmitting(true);
    setErrorMessage(null);

    if (paymentMethod === "card") {
      const cardElement = elements.getElement(CardElement);
      if (cardElement) {
        const { error, paymentMethod: stripePaymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: (document.getElementById("co-first-name") as HTMLInputElement)?.value + " " + (document.getElementById("co-last-name") as HTMLInputElement)?.value,
            email: (document.getElementById("co-email") as HTMLInputElement)?.value,
          },
        });

        if (error) {
          setErrorMessage(error.message || "An error occurred with your payment.");
          setSubmitting(false);
          return;
        }

        console.log("Payment successful, method ID:", stripePaymentMethod.id);

        try {
          await fetch('/api/orders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              total_amount: total,
              status: 'paid',
              payment_method: 'card',
              stripe_payment_id: stripePaymentMethod.id,
              items: items,
              shipping_address: {
                name: (document.getElementById("co-first-name") as HTMLInputElement)?.value + " " + (document.getElementById("co-last-name") as HTMLInputElement)?.value,
                email: (document.getElementById("co-email") as HTMLInputElement)?.value,
                address: (document.getElementById("co-address") as HTMLInputElement)?.value,
                city: (document.getElementById("co-city") as HTMLInputElement)?.value,
                postal: (document.getElementById("co-postal") as HTMLInputElement)?.value,
                country: (document.getElementById("co-country") as HTMLSelectElement)?.value,
              }
            })
          });
        } catch (e) {
          console.error("Failed to save order", e);
        }
      }
    } else {
      await new Promise((r) => setTimeout(r, 1800));

      try {
        await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            total_amount: total,
            status: 'pending',
            payment_method: paymentMethod,
            items: items,
            shipping_address: {
              name: (document.getElementById("co-first-name") as HTMLInputElement)?.value + " " + (document.getElementById("co-last-name") as HTMLInputElement)?.value,
              email: (document.getElementById("co-email") as HTMLInputElement)?.value,
              address: (document.getElementById("co-address") as HTMLInputElement)?.value,
              city: (document.getElementById("co-city") as HTMLInputElement)?.value,
              postal: (document.getElementById("co-postal") as HTMLInputElement)?.value,
              country: (document.getElementById("co-country") as HTMLSelectElement)?.value,
            }
          })
        });
      } catch (e) {
        console.error("Failed to save order", e);
      }
    }

    clearCart();
    router.push("/checkout/confirmation");
  };

  if (items.length === 0) return null;

  return (
    <div className="container">
      <div className="checkout-layout">
        <form onSubmit={handleSubmit} noValidate aria-label={t("title")}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.5rem, 2.5vw, 2rem)", marginBottom: "2.5rem" }}>
            {t("title")}
          </h1>

          <div className="checkout-section">
            <h2 className="checkout-section__title">{t("contact")}</h2>
            <div className="form-group">
              <label htmlFor="co-email" className="form-label">{t("emailAddress")}</label>
              <input type="email" id="co-email" name="email" className="form-input" placeholder="your@email.com" required autoComplete="email" />
            </div>
          </div>

          <div className="checkout-section">
            <h2 className="checkout-section__title">{t("shippingAddress")}</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="co-first-name" className="form-label">{t("firstName")}</label>
                <input type="text" id="co-first-name" name="firstName" className="form-input" placeholder="Max" required autoComplete="given-name" />
              </div>
              <div className="form-group">
                <label htmlFor="co-last-name" className="form-label">{t("lastName")}</label>
                <input type="text" id="co-last-name" name="lastName" className="form-input" placeholder="Müller" required autoComplete="family-name" />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label htmlFor="co-address" className="form-label">{t("address")}</label>
              <input type="text" id="co-address" name="address" className="form-input" placeholder="Bahnhofstrasse 1" required autoComplete="street-address" />
            </div>
            <div className="form-row" style={{ marginTop: "1rem" }}>
              <div className="form-group">
                <label htmlFor="co-postal" className="form-label">{t("postalCode")}</label>
                <input type="text" id="co-postal" name="postal" className="form-input" placeholder="8001" required autoComplete="postal-code" />
              </div>
              <div className="form-group">
                <label htmlFor="co-city" className="form-label">{t("city")}</label>
                <input type="text" id="co-city" name="city" className="form-input" placeholder="Zürich" required autoComplete="address-level2" />
              </div>
            </div>
            <div className="form-group" style={{ marginTop: "1rem" }}>
              <label htmlFor="co-country" className="form-label">{t("country")}</label>
              <select id="co-country" name="country" className="form-input" required autoComplete="country" defaultValue="CH">
                <option value="CH">{t("countries.CH")}</option>
                <option value="DE">{t("countries.DE")}</option>
                <option value="AT">{t("countries.AT")}</option>
                <option value="FR">{t("countries.FR")}</option>
                <option value="IT">{t("countries.IT")}</option>
                <option value="GB">{t("countries.GB")}</option>
              </select>
            </div>
          </div>

          <div className="checkout-section">
            <h2 className="checkout-section__title">{t("payment")}</h2>
            <div className="payment-methods" role="group" aria-label={t("payment")}>
              {(["card", "twint", "invoice"] as PaymentMethod[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  className={`payment-method-btn${paymentMethod === m ? " payment-method-btn--active" : ""}`}
                  onClick={() => setPaymentMethod(m)}
                  id={`payment-${m}`}
                  aria-pressed={paymentMethod === m}
                >
                  {m === "card" ? t("creditCard") : m === "twint" ? t("twint") : t("invoice")}
                </button>
              ))}
            </div>

            {paymentMethod === "card" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="form-group">
                  <label htmlFor="co-card-name" className="form-label">{t("nameOnCard")}</label>
                  <input type="text" id="co-card-name" className="stripe-input" placeholder="Max Müller" required autoComplete="cc-name" />
                </div>
                <div className="form-group" style={{ padding: "12px", border: "1px solid var(--color-light-gray)", backgroundColor: "#fafafa" }}>
                  <CardElement options={{
                    style: {
                      base: {
                        fontSize: "16px",
                        color: "#424770",
                        "::placeholder": {
                          color: "#aab7c4",
                        },
                      },
                      invalid: {
                        color: "#9e2146",
                      },
                    },
                  }} />
                </div>
                {errorMessage && (
                  <div style={{ color: "#9e2146", fontSize: "0.875rem" }}>{errorMessage}</div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginTop: "0.25rem" }}>
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="var(--color-mid-gray)" strokeWidth="1.3" aria-hidden="true">
                    <rect x="2" y="5" width="10" height="7" rx="1" />
                    <path d="M4 5V4a3 3 0 016 0v1" />
                  </svg>
                  <span style={{ fontSize: "0.75rem", color: "var(--color-mid-gray)" }}>{t("securedByStripe")}</span>
                </div>
              </div>
            )}

            {paymentMethod === "twint" && (
              <div style={{ padding: "2rem", border: "1px solid var(--color-light-gray)", textAlign: "center" }}>
                <p style={{ color: "var(--color-mid-gray)", fontSize: "0.9375rem" }}>
                  {t("twintRedirect")}
                </p>
              </div>
            )}

            {paymentMethod === "invoice" && (
              <div style={{ padding: "2rem", border: "1px solid var(--color-light-gray)" }}>
                <p style={{ color: "var(--color-mid-gray)", fontSize: "0.9375rem" }}>
                  {t("invoiceText")}
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn--primary"
            id="co-submit"
            disabled={submitting}
            style={{ width: "100%", justifyContent: "center", opacity: submitting ? 0.7 : 1 }}
          >
            {submitting ? t("processing") : t("placeOrder", { total: formatPrice(total) })}
          </button>

          <p style={{ fontSize: "0.75rem", color: "var(--color-mid-gray)", marginTop: "1rem", textAlign: "center" }}>
            {t.rich("agreement", {
              privacyPolicy: (chunks) => <Link href="/privacy" style={{ color: "var(--color-black)" }} key="pp">{chunks}</Link>,
              termsOfService: (chunks) => <Link href="/style-guide" style={{ color: "var(--color-black)" }} key="tos">{chunks}</Link>,
            })}
          </p>
        </form>

        <aside className="checkout-order-summary" aria-label={t("yourOrder")}>
          <h2 className="checkout-order-summary__title">{t("yourOrder")}</h2>

          {items.map((item) => (
            <div key={item.lineKey} className="checkout-summary-item">
              <div className="checkout-summary-item__img">
                <Image
                  src={item.product.variants[0].images[0]}
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
                  {item.customized && " · 3D Custom"}
                </p>
              </div>
              <p className="checkout-summary-item__price">{formatPrice(item.product.price * item.quantity)}</p>
            </div>
          ))}

          <div className="checkout-totals">
            <div className="checkout-total-row">
              <span>{t("subtotal")}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="checkout-total-row">
              <span>{t("shipping")}</span>
              <span>{shipping === 0 ? t("free") : formatPrice(shipping)}</span>
            </div>
            <div className="checkout-total-row checkout-total-row--grand">
              <span>{t("total")}</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutContent />
    </Elements>
  );
}
