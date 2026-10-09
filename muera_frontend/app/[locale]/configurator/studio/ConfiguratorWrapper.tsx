"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import MirrorsizeConfigurator from "@/components/MirrorsizeConfigurator";
import { formatPrice } from "@/lib/format";

export interface Garment {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  image: string;
  msSku: string;
}

export default function ConfiguratorWrapper({
  merchantId,
  apiKey,
  garments,
  initialSlug,
  userId,
  locale,
}: {
  merchantId: string;
  apiKey: string;
  garments: Garment[];
  initialSlug: string | null;
  userId: string;
  locale: string;
}) {
  const t = useTranslations("configuratorStudio");
  const [selected, setSelected] = useState<Garment | null>(
    garments.find((g) => g.slug === initialSlug) ?? (garments.length === 1 ? garments[0] : null)
  );

  if (!selected) {
    return (
      <div style={{
        minHeight: "calc(100vh - 80px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "3rem 1rem",
      }}>
        <div style={{ maxWidth: 960, width: "100%", textAlign: "center" }}>
          <p className="section-label">{t("label")}</p>
          <h1 className="section-title">{t("selectTitle")}</h1>
          <p style={{ marginBottom: "2.5rem", color: "var(--color-mid-gray)" }}>{t("selectText")}</p>
          {garments.length === 0 ? (
            <p style={{ color: "var(--color-mid-gray)" }}>{t("noGarments")}</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.5rem" }}>
              {garments.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setSelected(g)}
                  className="product-card"
                  style={{ textAlign: "left", border: 0, padding: 0, cursor: "pointer", background: "#fff" }}
                  id={`garment-${g.slug}`}
                >
                  <div className="product-card__img-wrap">
                    <Image src={g.image} alt={g.name} fill sizes="(max-width: 768px) 100vw, 33vw" style={{ objectFit: "cover" }} />
                  </div>
                  <div className="product-card__body">
                    <h2 className="product-card__name">{g.name}</h2>
                    {g.tagline && <p className="product-card__tagline">{g.tagline}</p>}
                    <p className="product-card__price">{t("from", { price: formatPrice(g.price) })}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      {garments.length > 1 && (
        <div className="container" style={{ height: 52, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "0.875rem" }}>{selected.name}</span>
          <button onClick={() => setSelected(null)} className="btn btn--outline-dark" style={{ padding: "6px 14px", fontSize: "0.75rem" }}>
            {t("change")}
          </button>
        </div>
      )}
      <MirrorsizeConfigurator
        key={selected.id}
        merchantId={merchantId}
        apiKey={apiKey}
        sku={selected.msSku}
        productId={selected.id}
        userId={userId}
        language={locale}
      />
    </>
  );
}
