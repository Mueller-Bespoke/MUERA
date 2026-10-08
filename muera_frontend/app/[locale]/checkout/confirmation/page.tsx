import { getTranslations } from "next-intl/server";
import Link from "next/link";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "confirmation" });

  const orderNumber = "MR-84729";

  const STEPS = [
    { step: "01", title: t("step1Title"), desc: t("step1Desc") },
    { step: "02", title: t("step2Title"), desc: t("step2Desc") },
    { step: "03", title: t("step3Title"), desc: t("step3Desc") },
    { step: "04", title: t("step4Title"), desc: t("step4Desc") },
  ];

  return (
    <section className="confirmation-hero" aria-label={t("title")}>
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
          {t("confirmationText")}
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
