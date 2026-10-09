"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

export default function ShopClient({
  products,
  categories,
  allLabel,
}: {
  products: Product[];
  categories: { value: string; label: string }[];
  allLabel: string;
}) {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const t = useTranslations("shop");
  const CATEGORIES = [{ value: "all", label: allLabel }, ...categories.filter((c) => products.some((p) => p.category === c.value))];

  const filtered = activeCategory === "all"
    ? products
    : products.filter((p) => p.category === activeCategory);

  return (
    <>
      <section className="shop-hero" aria-label="MUERA Shop">
        <div className="container">
          <p className="section-label" style={{ color: "var(--color-gold)" }}>{t("heroLabel")}</p>
          <h1 className="section-title section-title--light" style={{ maxWidth: 560 }}>
            {t("heroTitle")}
          </h1>
          <div className="divider" style={{ background: "rgba(245,243,239,0.2)" }} />
          <p style={{ color: "rgba(245,243,239,0.6)", maxWidth: 480, fontSize: "1.0625rem" }}>
            {t("heroText")}
          </p>
        </div>
      </section>

      <section className="section" style={{ background: "var(--color-off-white)", paddingTop: "3rem" }} aria-label={t("heroTitle")}>
        <div className="container">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
            <div className="category-filter" role="group" aria-label="Filter by category">
              {CATEGORIES.map(({ value, label }) => (
                <button
                  key={value}
                  className={`category-filter__btn${activeCategory === value ? " category-filter__btn--active" : ""}`}
                  onClick={() => setActiveCategory(value)}
                  id={`filter-${value}`}
                  aria-pressed={activeCategory === value}
                >
                  {label}
                </button>
              ))}
            </div>
            <p style={{ fontSize: "0.8125rem", color: "var(--color-mid-gray)" }}>
              {filtered.length} {filtered.length === 1 ? t("piece") : t("pieces")}
            </p>
          </div>

          <div className="product-grid" aria-label="Products">
            {filtered.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.slug}`}
                className="product-card"
                id={`product-card-${product.id}`}
                aria-label={`${product.name} — ${formatPrice(product.price)}`}
              >
                <div className="product-card__img-wrap">
                  <Image
                    src={product.variants[0]?.images[0] ?? product.images[0]}
                    alt={product.name}
                    fill
                    sizes="(max-width: 540px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  {product.badge && (
                    <span className="product-card__badge">{product.badge}</span>
                  )}
                  {product.hasConfigurator && (
                    <span className="product-card__configurator-tag">
                      <svg viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.2" aria-hidden="true">
                        <circle cx="5" cy="5" r="4" />
                        <path d="M3 5h4M5 3v4" />
                      </svg>
                      {t("configuratorTag")}
                    </span>
                  )}
                </div>
                <div className="product-card__body">
                  <p className="product-card__cat">{product.categoryName}</p>
                  <h2 className="product-card__name">{product.name}</h2>
                  <p className="product-card__tagline">{product.tagline}</p>
                  <div className="product-card__price-row">
                    <span className="product-card__price">{formatPrice(product.price)}</span>
                    {product.comparePrice && (
                      <span className="product-card__compare">{formatPrice(product.comparePrice)}</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner" aria-label={t("bannerTitle")}>
        <div className="container">
          <p className="section-label" style={{ color: "var(--color-gold)", textAlign: "center" }}>{t("bannerLabel")}</p>
          <h2 className="cta-banner__title">{t("bannerTitle")}</h2>
          <p className="cta-banner__text">
            {t("bannerText")}
          </p>
          <Link href="/configurator" className="btn btn--primary-light" id="shop-config-cta">
            {t("bannerCta")}
          </Link>
        </div>
      </section>
    </>
  );
}
