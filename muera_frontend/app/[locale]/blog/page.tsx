import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { getBlogPosts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "blog" });
  const BLOGS = await getBlogPosts(locale);

  return (
    <>
      <section className="shop-hero" aria-label={t("heroTitle")}>
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

      <section className="section" style={{ background: "var(--color-off-white)", paddingTop: "4rem" }}>
        <div className="container">
          <div className="blog-grid" aria-label="Blog posts" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            {BLOGS.map((post) => (
              <Link href={`/blog/${post.slug}`} key={post.id} className="blog-card" aria-label={post.title} style={{ background: "#fff", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                <div className="blog-card__img-wrap" style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", display: "block" }}>
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    style={{ objectFit: "cover" }}
                  />
                  <div className="blog-card__category" style={{ position: "absolute", top: "1.5rem", left: "1.5rem", background: "var(--color-off-white)", padding: "0.5rem 1rem", fontFamily: "var(--font-sans)", fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-black)", zIndex: 2 }}>
                    {post.category}
                  </div>
                </div>
                <div className="blog-card__body" style={{ padding: "2.5rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                  <div className="blog-card__meta" style={{ fontSize: "0.75rem", color: "var(--color-mid-gray)", textTransform: "uppercase", letterSpacing: "0.05em", display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                    <span>{new Date(post.date).toLocaleDateString(locale === "de" ? "de-CH" : locale === "fr" ? "fr-CH" : locale === "it" ? "it-CH" : "en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
                    {post.readTime && <span>&bull;</span>}
                    {post.readTime && <span>{post.readTime}</span>}
                  </div>
                  <h2 className="blog-card__title" style={{ fontFamily: "var(--font-serif)", fontSize: "1.75rem", lineHeight: 1.3, marginBottom: "1rem", color: "var(--color-black)" }}>
                    {post.title}
                  </h2>
                  <p className="blog-card__excerpt" style={{ fontSize: "0.9375rem", color: "var(--color-mid-gray)", marginBottom: "2rem", lineHeight: 1.6, flexGrow: 1 }}>{post.excerpt}</p>
                  <div className="blog-card__link" style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-navy)", fontWeight: 500, display: "inline-flex", alignItems: "center" }}>
                    {t("readArticle")}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
