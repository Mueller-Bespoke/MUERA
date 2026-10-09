import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getStoreSettings } from "@/lib/settings";
import { getLegalContent, LEGAL_UPDATED, type LegalDoc } from "@/lib/legal";

/** Legal entity behind the MUERA brand, used in the privacy policy and terms. */
const LEGAL_ENTITY = "Mueller Bespoke";

export default async function LegalPage({ doc, locale }: { doc: LegalDoc; locale: string }) {
  const content = getLegalContent(doc, locale);
  const store = await getStoreSettings();
  const contactT = await getTranslations({ locale, namespace: "contact" });
  const footerT = await getTranslations({ locale, namespace: "footer" });

  const fill = (text: string) =>
    text
      .replaceAll("{company}", LEGAL_ENTITY)
      .replaceAll("{email}", store.email || "info@muera.ch")
      .replaceAll("{address}", store.address || contactT("locationValue"));

  const updated = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : `${locale}-CH`, { dateStyle: "long" }).format(
    new Date(LEGAL_UPDATED)
  );
  const other: LegalDoc = doc === "privacy" ? "terms" : "privacy";

  return (
    <article className="legal-page">
      <div className="container legal-page__inner">
        <header className="legal-page__header">
          <h1 className="legal-page__title">{content.title}</h1>
          <p className="legal-page__updated">
            {content.updatedLabel}: {updated}
          </p>
          <p className="legal-page__intro">{fill(content.intro)}</p>
        </header>

        {content.sections.map((s) => (
          <section key={s.heading} className="legal-page__section">
            <h2>{s.heading}</h2>
            {s.paragraphs?.map((p, i) => (
              <p key={i}>{fill(p)}</p>
            ))}
            {s.list && (
              <ul>
                {s.list.map((item, i) => (
                  <li key={i}>{fill(item)}</li>
                ))}
              </ul>
            )}
          </section>
        ))}

        <p className="legal-page__related">
          <Link href={`/${other}`}>{footerT(other)}</Link>
          {" · "}
          <Link href="/contact">{contactT("title")}</Link>
        </p>
      </div>
    </article>
  );
}
