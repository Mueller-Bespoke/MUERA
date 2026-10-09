"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { formatPrice } from "@/lib/format";
import { pendingConfiguratorProduct } from "@/lib/mirrorsize-pending";

function SuccessContent() {
  const searchParams = useSearchParams();
  const userSessionId = searchParams.get("userSessionId");
  const locale = useLocale();
  const t = useTranslations("configuratorSuccess");
  const commonT = useTranslations("common");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userSessionId) {
      setLoading(false);
      return;
    }

    const fetchDetails = async () => {
      try {
        const res = await fetch('/api/configurator/details', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userSessionId, locale, productId: pendingConfiguratorProduct() }),
        });

        const result = await res.json();

        if (res.ok) {
          setData({ ...result.session, productName: result.product?.name, price: result.price });
        } else {
          setError(result.error || "Failed to fetch details.");
        }
      } catch {
        setError("An error occurred while fetching details.");
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [userSessionId, locale]);

  if (loading) {
    return <div style={{ padding: "4rem", textAlign: "center" }}>{t("loading")}</div>;
  }

  if (error || !userSessionId) {
    return (
      <div style={{ padding: "4rem", textAlign: "center" }}>
        <h2>{t("errorTitle")}</h2>
        <p>{error || t("errorNoSession")}</p>
        <Link href="/configurator" className="btn btn--outline" style={{ marginTop: "1rem" }}>
          {commonT("tryAgain")}
        </Link>
      </div>
    );
  }

  return (
    <div style={{ padding: "4rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontFamily: "var(--font-serif)", fontSize: "2rem", marginBottom: "2rem" }}>
        {t("successTitle")}
      </h1>

      {data && (
        <div style={{ background: "white", padding: "2rem", borderRadius: "8px", color: "#333" }}>
          <h2>{data.apparelName}</h2>
          {data.productName && <p>{data.productName}</p>}
          {data.price != null && <p style={{ fontSize: "1.25rem", margin: "0.5rem 0" }}><strong>{formatPrice(data.price)}</strong></p>}

          <h3 style={{ marginTop: "2rem", marginBottom: "1rem" }}>{t("pieces")}</h3>
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {data.pieces?.map((piece: any, idx: number) => (
            <div key={idx} style={{ marginBottom: "2rem", padding: "1rem", border: "1px solid #eaeaea" }}>
              <h4>{piece.pieceName}</h4>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {piece.image && <img src={piece.image} alt={piece.pieceName} style={{ maxWidth: "200px" }} />}
              {piece.fabric && <p><strong>{t("fabric")}:</strong> {piece.fabric}</p>}

              <h5 style={{ marginTop: "1rem" }}>{t("styleChoices")}</h5>
              <ul style={{ paddingLeft: "1.5rem" }}>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {piece.styleChoices?.map((choice: any, cIdx: number) => (
                  <li key={cIdx}>{choice.attributeName}: {choice.styleName}</li>
                ))}
              </ul>

              <h5 style={{ marginTop: "1rem" }}>{t("measurements")}</h5>
              <ul style={{ paddingLeft: "1.5rem" }}>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {piece.measurements?.map((measure: any, mIdx: number) => (
                  <li key={mIdx}>{measure.displayName}: {measure.valueIncm} / {measure.valueIninch}</li>
                ))}
              </ul>
            </div>
          ))}

          <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
            <Link href={`/cart?userSessionId=${encodeURIComponent(userSessionId)}`} className="btn btn--primary">
              {t("addToCart")}
            </Link>
            <Link href="/configurator" className="btn btn--outline-dark">
              {commonT("configureAnother")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ConfiguratorSuccessPage() {
  return (
    <main style={{ paddingTop: "80px", backgroundColor: "var(--color-off-white)", minHeight: "100vh" }}>
      <div className="container">
        <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center" }}>Loading...</div>}>
          <SuccessContent />
        </Suspense>
      </div>
    </main>
  );
}
