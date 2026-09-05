"use client";

import { useEffect, useState, Suspense, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCart } from "@/context/CartContext";
import { formatPrice, PRODUCTS } from "@/data/products";

function CartContent() {
  const { items, removeItem, updateQty, subtotal, clearCart, addItem } = useCart();
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("cart");
  const commonT = useTranslations("common");
  const userSessionId = searchParams.get("userSessionId");
  const [loadingConfig, setLoadingConfig] = useState(false);
  const processedSession = useRef<string | null>(null);

  useEffect(() => {
    if (userSessionId && processedSession.current !== userSessionId) {
      processedSession.current = userSessionId;
      setLoadingConfig(true);
      const fetchDetails = async () => {
        try {
          const res = await fetch('/api/configurator/details', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userSessionId }),
          });
          const result = await res.json();
          if (result.status === 1000 && result.data) {
            const msData = result.data;
            console.log(msData);
            const product = PRODUCTS.find((p) => p.sku === msData.sku) || PRODUCTS[0];
            const customPrice = msData.totalPrice ? parseFloat(msData.totalPrice) : (msData.price ? parseFloat(msData.price) : product.price);
            const customImage = msData.pieces?.[0]?.frontImage;

            addItem({
              product,
              selectedColor: msData.pieces?.[0]?.fabrics?.colorName || product.variants[0]?.color || "Custom",
              selectedSize: "Custom 3D Fit",
              quantity: 1,
              customized: true,
              customPrice,
              customImage,
            });

            router.replace('/cart');
          }
        } catch (error) {
          console.error("Failed to fetch custom product details", error);
        } finally {
          setLoadingConfig(false);
        }
      };

      fetchDetails();
    }
  }, [userSessionId, addItem, router]);

  const shipping = subtotal > 500 ? 0 : 25;
  const total = subtotal + shipping;

  if (loadingConfig) {
    return (
      <section className="section" style={{ background: "var(--color-off-white)", paddingTop: "140px", minHeight: "60vh" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2>{t("processingConfig")}</h2>
          <p style={{ color: "var(--color-mid-gray)", marginTop: "1rem" }}>{t("processingConfigText")}</p>
        </div>
      </section>
    );
  }

  if (items.length === 0) {
    return (
      <section className="section" style={{ background: "var(--color-off-white)", paddingTop: "140px", minHeight: "60vh" }}>
        <div className="container">
          <div className="cart-empty">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" stroke="var(--color-beige)" strokeWidth="1.3" style={{ margin: "0 auto 1.5rem", display: "block" }} aria-hidden="true">
              <path d="M4 4h6l5.6 24.4A2 2 0 0017.6 30h18.8a2 2 0 001.96-1.6L42 14H11" />
              <circle cx="20" cy="40" r="3" />
              <circle cx="36" cy="40" r="3" />
            </svg>
            <h2>{t("emptyTitle")}</h2>
            <p style={{ color: "var(--color-mid-gray)", marginBottom: "2rem" }}>
              {t("emptyText")}
            </p>
            <Link href="/shop" className="btn btn--primary" id="cart-empty-shop-link">
              {t("emptyCta")}
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" style={{ background: "var(--color-off-white)", paddingTop: "100px", minHeight: "60vh" }} aria-label={t("title")}>
      <div className="container">
        <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", marginBottom: "2rem", borderBottom: "1px solid var(--color-light-gray)", paddingBottom: "1.25rem" }}>
          <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>
            {t("title")}
          </h1>
          <button onClick={clearCart} style={{ background: "none", border: "none", fontSize: "0.75rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-mid-gray)", cursor: "pointer" }} id="cart-clear-btn">
            {t("clearAll")}
          </button>
        </div>

        <div className="cart-layout">
          <div>
            {items.filter(item => !item.customized).length > 0 && (
              <div style={{ marginBottom: "3rem" }}>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", marginBottom: "1rem" }}>{t("standardItems")}</h3>
                {items.filter(item => !item.customized).map((item) => (
                  <article key={item.lineKey} className="cart-item">
                    <div className="cart-item__img">
                      <Image
                        src={item.product.variants[0]?.images[0] || "/placeholder.jpg"}
                        alt={item.product.name}
                        fill
                        sizes="100px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>

                    <div>
                      <h2 className="cart-item__name">{item.product.name}</h2>
                      <p className="cart-item__meta">
                        {item.selectedColor} · {t("sizeLabel", { size: item.selectedSize })}
                      </p>
                      <div className="cart-qty">
                        <button className="cart-qty__btn" onClick={() => updateQty(item.lineKey, item.quantity - 1)} aria-label={t("decreaseQty")} id={`qty-dec-${item.lineKey}`}>−</button>
                        <input
                          type="number"
                          className="cart-qty__num"
                          value={item.quantity}
                          min={1}
                          onChange={(e) => updateQty(item.lineKey, parseInt(e.target.value) || 1)}
                          aria-label={t("quantity")}
                        />
                        <button className="cart-qty__btn" onClick={() => updateQty(item.lineKey, item.quantity + 1)} aria-label={t("increaseQty")} id={`qty-inc-${item.lineKey}`}>+</button>
                      </div>
                      <p className="cart-item__price">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>

                    <button className="cart-item__remove" onClick={() => removeItem(item.lineKey)} aria-label={t("remove", { name: item.product.name })} id={`remove-${item.lineKey}`}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                        <path d="M3 3l10 10M13 3L3 13" />
                      </svg>
                    </button>
                  </article>
                ))}
              </div>
            )}

            {items.filter(item => item.customized).length > 0 && (
              <div>
                <h3 style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", marginBottom: "1rem", color: "var(--color-gold)" }}>{t("customizedSuits")}</h3>
                {items.filter(item => item.customized).map((item) => (
                  <article key={item.lineKey} className="cart-item">
                    <div className="cart-item__img">
                      <Image
                        src={item.customImage || item.product.variants[0]?.images[0] || "/placeholder.jpg"}
                        alt={item.product.name}
                        fill
                        sizes="100px"
                        style={{ objectFit: "cover" }}
                      />
                    </div>

                    <div>
                      <h2 className="cart-item__name">{item.product.name}</h2>
                      <p className="cart-item__meta">
                        {t("color")}: <span style={{ textTransform: "capitalize" }}>{item.selectedColor}</span> · {item.selectedSize}
                      </p>
                      <span className="cart-item__customized" style={{ color: "var(--color-gold)", marginTop: "0.25rem", display: "inline-block" }}>
                        {t("madeToMeasure")}
                      </span>
                      <div className="cart-qty">
                        <button className="cart-qty__btn" onClick={() => updateQty(item.lineKey, item.quantity - 1)} aria-label={t("decreaseQty")} id={`qty-dec-${item.lineKey}`}>−</button>
                        <input
                          type="number"
                          className="cart-qty__num"
                          value={item.quantity}
                          min={1}
                          onChange={(e) => updateQty(item.lineKey, parseInt(e.target.value) || 1)}
                          aria-label={t("quantity")}
                        />
                        <button className="cart-qty__btn" onClick={() => updateQty(item.lineKey, item.quantity + 1)} aria-label={t("increaseQty")} id={`qty-inc-${item.lineKey}`}>+</button>
                      </div>
                      <p className="cart-item__price">{formatPrice((item.customPrice !== undefined ? item.customPrice : item.product.price) * item.quantity)}</p>
                    </div>

                    <button className="cart-item__remove" onClick={() => removeItem(item.lineKey)} aria-label={t("remove", { name: item.product.name })} id={`remove-${item.lineKey}`}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
                        <path d="M3 3l10 10M13 3L3 13" />
                      </svg>
                    </button>
                  </article>
                ))}
              </div>
            )}

            <div style={{ marginTop: "2rem" }}>
              <Link href="/shop" style={{ fontSize: "0.8125rem", letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-mid-gray)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
                {t("continueShopping")}
              </Link>
            </div>
          </div>

          <aside className="cart-summary" aria-label={t("orderSummary")}>
            <h2 className="cart-summary__title">{t("orderSummary")}</h2>

            <div className="cart-summary__row">
              <span>{t("subtotal")}</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="cart-summary__row">
              <span>{t("shipping")}</span>
              <span>{shipping === 0 ? t("free") : formatPrice(shipping)}</span>
            </div>
            <div className="cart-summary__row cart-summary__row--total">
              <span>{t("total")}</span>
              <span>{formatPrice(total)}</span>
            </div>

            <p className="cart-summary__shipping-note">
              {subtotal > 500
                ? t("freeShipping")
                : t("addForFreeShipping", { amount: formatPrice(500 - subtotal) })}
            </p>

            <Link href="/checkout" className="btn btn--primary-light" style={{ width: "100%", justifyContent: "center", marginBottom: "0.75rem" }} id="cart-checkout-btn">
              {t("proceedToCheckout")}
            </Link>

            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", justifyContent: "center", marginTop: "1rem" }}>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="rgba(245,243,239,0.4)" strokeWidth="1.3" aria-hidden="true">
                <rect x="2" y="5" width="10" height="7" rx="1" />
                <path d="M4 5V4a3 3 0 016 0v1" />
              </svg>
              <span style={{ fontSize: "0.6875rem", color: "rgba(245,243,239,0.35)", letterSpacing: "0.08em", textTransform: "uppercase" }}>{t("stripeSecure")}</span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export default function CartPage() {
  const t = useTranslations("cart");
  return (
    <Suspense fallback={
      <section className="section" style={{ background: "var(--color-off-white)", paddingTop: "140px", minHeight: "60vh" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <h2>{t("loading")}</h2>
        </div>
      </section>
    }>
      <CartContent />
    </Suspense>
  );
}
