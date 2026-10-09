import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const FOOTER_LINKS = [
  { labelKey: "shop", ns: "nav" as const, href: "/shop" },
  { labelKey: "journal", ns: "nav" as const, href: "/blog" },
  { labelKey: "about", ns: "nav" as const, href: "/about" },
  { labelKey: "contact", ns: "nav" as const, href: "/contact" },
  { labelKey: "configurator", ns: "nav" as const, href: "/configurator" },
  { labelKey: "privacy", ns: "footer" as const, href: "/privacy" },
  { labelKey: "terms", ns: "footer" as const, href: "/terms" },
];

export default async function Footer() {
  const t = await getTranslations("footer");
  const navT = await getTranslations("nav");

  const links = FOOTER_LINKS.map((link) => ({
    label: link.ns === "nav" ? navT(link.labelKey) : t(link.labelKey),
    href: link.href,
  }));

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__inner">
          <Link href="/" className="footer__logo" aria-label="MUERA — Home">
            MUERA
          </Link>

          <nav aria-label={t("footerNav")}>
            <ul className="footer__links" role="list">
              {links.map(({ label, href }) => (
                <li key={href}>
                  <Link href={href} className="footer__link">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <p className="footer__copy">
            {t("copyright", { year: new Date().getFullYear() })}
          </p>
        </div>
      </div>
    </footer>
  );
}
