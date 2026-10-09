import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  const commonT = await getTranslations({ locale, namespace: "common" });

  const PHILOSOPHY_ITEMS = [
    {
      num: "01",
      title: t("philosophy1Title"),
      text: t("philosophy1Text"),
    },
    {
      num: "02",
      title: t("philosophy2Title"),
      text: t("philosophy2Text"),
    },
    {
      num: "03",
      title: t("philosophy3Title"),
      text: t("philosophy3Text"),
    },
  ];

  return (
    <>
      <section className="about-hero" aria-label={t("heroTitle")}>
        <div className="container">
          <p className="section-label">{t("heroLabel")}</p>
          <h1 className="section-title section-title--light" style={{ maxWidth: 600 }}>
            {t("heroTitle")}
          </h1>
          <div className="divider" style={{ background: "rgba(245,243,239,0.2)" }} />
          <p style={{ color: "rgba(245,243,239,0.65)", maxWidth: 520, fontSize: "1.0625rem" }}>
            {t("heroText")}
          </p>
        </div>
      </section>

      <section className="section" style={{ background: "var(--color-off-white)" }} aria-label={t("storyLabel1")}>
        <div className="container">
          <div className="about-story-grid">
            <div>
              <p className="section-label">{t("storyLabel1")}</p>
              <h2 className="section-title">{t("storyTitle1")}</h2>
              <div className="divider" />
              <p>{t("storyPara1")}</p>
              <br />
              <p>{t("storyPara2")}</p>
            </div>

            <div>
              <p className="section-label">{t("storyLabel2")}</p>
              <h2 className="section-title">{t("storyTitle2")}</h2>
              <div className="divider" />
              <p>{t("storyPara3")}</p>
              <br />
              <p>{t("storyPara4")}</p>
              <div style={{ marginTop: "2.5rem" }}>
                <Link href="/configurator" className="btn btn--primary" id="about-story-cta">
                  {commonT("createYourSuit")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ position: "relative", height: "380px", overflow: "hidden" }} aria-hidden="true">
        <Image
          src="/fabric-texture.png"
          alt=""
          fill
          sizes="100vw"
          style={{ objectFit: "cover", opacity: 0.8 }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(11,11,11,0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <blockquote
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.25rem, 2.5vw, 2rem)",
              color: "var(--color-off-white)",
              textAlign: "center",
              maxWidth: 640,
              padding: "0 2rem",
              fontStyle: "italic",
              lineHeight: 1.5,
            }}
            dangerouslySetInnerHTML={{ __html: t.raw("quote") }}
          />
        </div>
      </section>

      <section className="section" style={{ background: "var(--color-off-white)" }} aria-label={t("philosophyLabel")}>
        <div className="container">
          <p className="section-label">{t("philosophyLabel")}</p>
          <h2 className="section-title" style={{ maxWidth: 480 }}>
            {t("philosophyTitle")}
          </h2>
          <div className="divider" />

          <div className="philosophy-items" style={{ maxWidth: 680 }}>
            {PHILOSOPHY_ITEMS.map((item) => (
              <div className="philosophy-item" key={item.num}>
                <span className="philosophy-item__num" aria-hidden="true">{item.num}</span>
                <div>
                  <h3 className="philosophy-item__title">{item.title}</h3>
                  <p className="philosophy-item__text">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-banner" aria-label={t("ctaTitle")}>
        <div className="container">
          <p className="section-label" style={{ color: "var(--color-gold)", textAlign: "center" }}>
            {t("ctaLabel")}
          </p>
          <h2 className="cta-banner__title">{t("ctaTitle")}</h2>
          <p className="cta-banner__text">
            {t("ctaText")}
          </p>
          <Link href="/configurator" className="btn btn--primary-light" id="about-final-cta">
            {t("ctaButton")}
          </Link>
        </div>
      </section>
    </>
  );
}
