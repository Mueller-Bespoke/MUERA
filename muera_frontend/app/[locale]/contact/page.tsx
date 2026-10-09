import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import ContactForm from "./ContactForm";
import { getStoreSettings } from "@/lib/settings";

function IconMail() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <rect x="2" y="5" width="18" height="13" rx="1.5" />
      <path d="M2 5l9 8 9-8" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d="M5 2h3l1.5 4.5-2 1.5a11 11 0 0 0 6.5 6.5l1.5-2L20 14v3a2 2 0 0 1-2 2A16 16 0 0 1 3 4a2 2 0 0 1 2-2z" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.3" aria-hidden="true">
      <path d="M11 2C7.68 2 5 4.68 5 8c0 5.25 6 12 6 12s6-6.75 6-12c0-3.32-2.68-6-6-6z" />
      <circle cx="11" cy="8" r="2.2" />
    </svg>
  );
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  const commonT = await getTranslations({ locale, namespace: "common" });
  // Store details are edited in Admin → Settings.
  const store = await getStoreSettings();
  const email = store.email || "info@muera.ch";

  return (
    <>
      <section className="contact-hero" aria-label={t("heroTitle")}>
        <div className="container">
          <p className="section-label">{t("heroLabel")}</p>
          <h1 className="section-title" style={{ maxWidth: 520 }}>
            {t("heroTitle")}
          </h1>
          <div className="divider" />
          <p style={{ fontSize: "1.0625rem" }}>
            {t("heroText")}
          </p>
        </div>
      </section>

      <section className="section" style={{ background: "var(--color-off-white)" }} aria-label={t("detailsTitle")}>
        <div className="container">
          <div className="contact-grid">
            <div>
              <p className="section-label">{t("detailsLabel")}</p>
              <h2 className="section-title" style={{ fontSize: "1.75rem" }}>
                {t("detailsTitle")}
              </h2>
              <div className="divider" />

              <div>
                <div className="contact-detail">
                  <span className="contact-detail__icon">
                    <IconMail />
                  </span>
                  <div>
                    <p className="contact-detail__label">{t("emailLabel")}</p>
                    <a href={`mailto:${email}`} className="contact-detail__value" id="contact-email">
                      {email}
                    </a>
                  </div>
                </div>

                {store.phone && (
                  <div className="contact-detail">
                    <span className="contact-detail__icon">
                      <IconPhone />
                    </span>
                    <div>
                      <p className="contact-detail__label">{t("phoneLabel")}</p>
                      <a href={`tel:${store.phone.replace(/\s+/g, "")}`} className="contact-detail__value" id="contact-phone">
                        {store.phone}
                      </a>
                    </div>
                  </div>
                )}

                <div className="contact-detail">
                  <span className="contact-detail__icon">
                    <IconPin />
                  </span>
                  <div>
                    <p className="contact-detail__label">{t("locationLabel")}</p>
                    <p className="contact-detail__value" style={{ fontFamily: "var(--font-serif)" }}>
                      {store.address || t("locationValue")}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "3rem", padding: "2rem", background: "var(--color-navy)", color: "var(--color-off-white)" }}>
                <p style={{ color: "rgba(245,243,239,0.55)", fontSize: "0.8125rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.75rem" }}>
                  {t("ctaLabel")}
                </p>
                <p style={{ color: "rgba(245,243,239,0.75)", marginBottom: "1.5rem", fontSize: "0.9375rem" }}>
                  {t("ctaText")}
                </p>
                <Link href="/configurator" className="btn btn--primary-light" id="contact-config-cta">
                  {t("ctaButton")}
                </Link>
              </div>
            </div>

            <div>
              <p className="section-label">{t("formLabel")}</p>
              <h2 className="section-title" style={{ fontSize: "1.75rem" }}>
                {t("formTitle")}
              </h2>
              <div className="divider" />

              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
