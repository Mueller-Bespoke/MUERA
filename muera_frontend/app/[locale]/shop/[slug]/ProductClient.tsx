"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import type { PublicReview } from "@/lib/catalog";
import { useCart } from "@/context/CartContext";
import ProductReviews from "./ProductReviews";

function Accordion({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="pdp-accordion__item">
      <button
        className="pdp-accordion__trigger"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {title}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <path d="M7 2v10M2 7h10" />
        </svg>
      </button>
      {open && <div className="pdp-accordion__body">{children}</div>}
    </div>
  );
}

function Toast({ visible, t }: { visible: boolean; t: (key: string) => string }) {
  if (!visible) return null;
  return (
    <div className="toast" role="status" aria-live="polite">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
        <path d="M3 9l4 4 8-8" />
      </svg>
      <p className="toast__text">{t("addedToCart")}</p>
      <Link href="/cart" className="toast__link">{t("viewCart")}</Link>
    </div>
  );
}

export default function ProductClient({
  product,
  related,
  reviews,
}: {
  product: Product;
  related: Product[];
  reviews: PublicReview[];
}) {
  const { addItem } = useCart();
  const router = useRouter();
  const t = useTranslations("product");

  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [toast, setToast] = useState(false);

  const madeToMeasureOnly = product.type === "configurable";
  const configuratorHref = `/configurator/studio?product=${encodeURIComponent(product.slug)}`;
  const colour = product.variants[selectedColor];
  const stockFor = (size: string) => colour?.sizeStock[size] ?? 0;
  const soldOut = !madeToMeasureOnly && (colour?.stock ?? 0) <= 0;

  const addToCart = () => {
    if (!selectedSize) { setSizeError(true); return false; }
    addItem({
      product,
      selectedColor: colour.color,
      selectedSize,
      quantity: 1,
      customized: false,
    });
    return true;
  };

  const handleAddToCart = () => {
    if (!addToCart()) return;
    setToast(true);
    setTimeout(() => setToast(false), 3500);
  };

  const handleBuyNow = () => {
    if (addToCart()) router.push("/checkout");
  };

  return (
    <>
      <div className="container">
        <div className="pdp-grid">
          <div className="pdp-gallery">
            <div className="pdp-gallery__main">
              <Image
                src={colour?.images[0] ?? product.images[0]}
                alt={colour?.color ? `${product.name} in ${colour.color}` : product.name}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover" }}
              />
              {product.hasConfigurator && (
                <div className="pdp-gallery__configurator-overlay">
                  <span style={{ color: "var(--color-gold)", fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>
                    {t("customisable3d")}
                  </span>
                  <Link
                    href={configuratorHref}
                    className="btn btn--primary-light"
                    style={{ padding: "10px 18px", fontSize: "0.75rem" }}
                  >
                    {t("customise")}
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div>
            <nav className="pdp-info__breadcrumb" aria-label="Breadcrumb">
              <Link href="/shop">{t("breadcrumbShop")}</Link>
              <span aria-hidden="true">›</span>
              <Link href="/shop">{product.categoryName}</Link>
              <span aria-hidden="true">›</span>
              <span style={{ color: "var(--color-black)" }}>{product.name}</span>
            </nav>

            {product.badge && (
              <span className="product-card__badge" style={{ position: "static", display: "inline-block", marginBottom: "1rem" }}>
                {product.badge}
              </span>
            )}

            <h1 className="pdp-info__name">{product.name}</h1>
            <p className="pdp-info__tagline">{product.tagline}</p>

            <div className="pdp-info__price-row">
              <span className="pdp-info__price">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <span className="pdp-info__compare">{formatPrice(product.comparePrice)}</span>
              )}
            </div>

            {product.deliveryTime && (
            <p className="pdp-info__delivery">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
                <rect x="1" y="4" width="9" height="7" rx="1" />
                <path d="M10 6h2l1 2v3h-3V6z" />
                <circle cx="3.5" cy="12" r="1" />
                <circle cx="10.5" cy="12" r="1" />
              </svg>
              {t("delivery", { time: product.deliveryTime })}
            </p>
            )}

            <div className="divider" />

            {madeToMeasureOnly ? (
              <div className="pdp-cta-row">
                <Link href={configuratorHref} className="btn btn--primary" id="pdp-configure">
                  {t("open3dConfigurator")}
                </Link>
              </div>
            ) : (
            <>
            {product.variants.some((v) => v.color) && (
            <>
            <p className="pdp-selector-label">
              {t("colour")} <span>— {colour?.color}</span>
            </p>
            <div className="pdp-swatches" role="radiogroup" aria-label={t("colour")}>
              {product.variants.map((v, i) => (
                <button
                  key={v.color}
                  className={`pdp-swatch${selectedColor === i ? " pdp-swatch--active" : ""}`}
                  style={{ background: v.colorHex }}
                  onClick={() => setSelectedColor(i)}
                  aria-label={v.color}
                  aria-pressed={selectedColor === i}
                  title={v.color}
                />
              ))}
            </div>
            </>
            )}

            <p className="pdp-selector-label" style={sizeError ? { color: "#c0392b" } : {}}>
              {t("size")} {sizeError && <span style={{ color: "#c0392b" }}>— {t("sizeError")}</span>}
            </p>
            <div className="pdp-sizes" role="radiogroup" aria-label={t("size")}>
              {product.sizes.map((size) => (
                <button
                  key={size}
                  className={`pdp-size-btn${selectedSize === size ? " pdp-size-btn--active" : ""}`}
                  onClick={() => { setSelectedSize(size); setSizeError(false); }}
                  aria-label={t("sizeLabel", { size })}
                  aria-pressed={selectedSize === size}
                  disabled={stockFor(size) <= 0}
                  style={stockFor(size) <= 0 ? { opacity: 0.35, textDecoration: "line-through", cursor: "not-allowed" } : undefined}
                >
                  {size}
                </button>
              ))}
            </div>

            <div className="pdp-cta-row">
              <button className="btn btn--primary" id="pdp-add-to-cart" onClick={handleAddToCart} disabled={soldOut}>
                {soldOut ? t("soldOut") : t("addToCart")}
              </button>
              <button className="btn btn--outline-dark" id="pdp-buy-now" onClick={handleBuyNow} disabled={soldOut}>
                {t("buyNow")}
              </button>
            </div>
            </>
            )}

            {product.hasConfigurator && !madeToMeasureOnly && (
              <div className="pdp-configurator-card">
                <div className="pdp-configurator-card__icon">
                  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
                    <path d="M11 2a9 9 0 100 18A9 9 0 0011 2z" />
                    <path d="M11 7v4l3 3" />
                  </svg>
                </div>
                <div>
                  <h3 className="pdp-configurator-card__title">{t("configuratorCardTitle")}</h3>
                  <p className="pdp-configurator-card__text">
                    {t("configuratorCardText")}
                  </p>
                  <Link
                    href={configuratorHref}
                    className="pdp-configurator-card__link"
                    id="pdp-configurator-link"
                  >
                    {t("open3dConfigurator")}
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                      <path d="M2 6h8M6 2l4 4-4 4" />
                    </svg>
                  </Link>
                </div>
              </div>
            )}

            <div className="pdp-accordion">
              <Accordion title={t("productDetails")}>
                <ul>
                  {product.details.map((d) => <li key={d}>{d}</li>)}
                </ul>
              </Accordion>
              {product.fabricInfo && (
                <Accordion title={t("fabricMaterial")}>
                  <p>{product.fabricInfo}</p>
                </Accordion>
              )}
              {product.careInstructions && product.careInstructions.length > 0 && (
                <Accordion title={t("careInstructions")}>
                  <ul>
                    {product.careInstructions.map((c) => <li key={c}>{c}</li>)}
                  </ul>
                </Accordion>
              )}
              <Accordion title={t("deliveryReturns")}>
                <p>{t("deliveryReturnsText", { deliveryTime: product.deliveryTime })}</p>
              </Accordion>
            </div>
          </div>
        </div>
      </div>

      <ProductReviews productId={product.id} reviews={reviews} />

      {related.length > 0 && (
        <section className="section" style={{ background: "var(--color-off-white)", paddingTop: "3rem" }} aria-label={t("relatedLabel")}>
          <div className="container">
            <p className="section-label">{t("relatedLabel")}</p>
            <h2 className="section-title" style={{ marginBottom: "2rem" }}>{t("relatedTitle")}</h2>
            <div className="related-grid">
              {related.map((rp) => (
                <Link key={rp.id} href={`/shop/${rp.slug}`} className="product-card" id={`related-${rp.id}`}>
                  <div className="product-card__img-wrap">
                    <Image
                      src={rp.variants[0]?.images[0] ?? rp.images[0]}
                      alt={rp.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 33vw"
                      style={{ objectFit: "cover" }}
                    />
                    {rp.hasConfigurator && (
                      <span className="product-card__configurator-tag">
                        <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2"><circle cx="5" cy="5" r="4" /><path d="M3 5h4M5 3v4" /></svg>
                        3D
                      </span>
                    )}
                  </div>
                  <div className="product-card__body">
                    <h3 className="product-card__name">{rp.name}</h3>
                    <p className="product-card__price">{formatPrice(rp.price)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <Toast visible={toast} t={t} />
    </>
  );
}
