import { getTranslations } from "next-intl/server";
import Image from "next/image";
import type { Metadata } from "next";
import { sanitizeArticleHtml } from "@/lib/sanitize";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(locale, slug);
  if (!post) return {};
  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    openGraph: { images: [post.image] },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const post = await getBlogPostBySlug(locale, slug);
  const t = await getTranslations({ locale, namespace: "blog" });

  if (!post) {
    notFound();
  }

  const recentBlogs = (await getBlogPosts(locale)).filter((b) => b.id !== post.id).slice(0, 2);

  return (
    <>
      <article className="blog-post">
        <header className="blog-post__hero" style={{ position: "relative", minHeight: "70vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", paddingTop: "72px" }}>
          <div className="blog-post__hero-bg" style={{ position: "absolute", inset: 0, zIndex: 1 }}>
            <Image
              src={post.image}
              alt={post.title}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
            <div className="hero__overlay" aria-hidden="true" style={{ position: "absolute", inset: 0, background: "var(--color-black)", opacity: 0.5, zIndex: 1 }} />
          </div>

          <div className="container" style={{ position: "relative", zIndex: 2 }}>
            <div className="blog-post__header-content" style={{ maxWidth: "800px", margin: "0 auto" }}>
              <Link href="/blog" className="blog-post__back" style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "var(--color-gold)", textDecoration: "none", display: "inline-block", marginBottom: "2rem" }}>
                {t("backToJournal")}
              </Link>
              <div className="blog-post__meta-hero animate-fade-up animate-delay-1" style={{ fontFamily: "var(--font-sans)", fontSize: "0.8125rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(245, 243, 239, 0.8)", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
                <span>{post.category}</span>
                <span className="dot">&bull;</span>
                <span>{new Date(post.date).toLocaleDateString(locale === "de" ? "de-CH" : locale === "fr" ? "fr-CH" : locale === "it" ? "it-CH" : "en-US", { month: "long", day: "numeric", year: "numeric" })}</span>
              </div>
              <h1 className="blog-post__title animate-fade-up animate-delay-2" style={{ color: "var(--color-off-white)", fontSize: "clamp(2.5rem, 5vw, 4rem)", marginBottom: "1.5rem", lineHeight: 1.1, fontFamily: "var(--font-serif)" }}>{post.title}</h1>
              <p className="blog-post__author animate-fade-up animate-delay-3" style={{ fontSize: "0.9375rem", color: "rgba(245, 243, 239, 0.6)" }}>
                {t("by", { author: post.author })} &bull; {post.readTime}
              </p>
            </div>
          </div>
        </header>

        <div className="container">
          <div className="blog-post__body" style={{ maxWidth: "760px", margin: "0 auto", paddingBlock: "5rem" }}>
            <div
              className="blog-post__content"
              style={{ fontSize: "1.125rem", lineHeight: 1.8, color: "#4A4A4A" }}
              dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(post.content) }}
            />
          </div>
        </div>
      </article>

      {recentBlogs.length > 0 && (
        <section className="section" style={{ background: "var(--color-off-white)" }}>
          <div className="container">
            <h2 className="section-title" style={{ textAlign: "center", marginBottom: "3rem" }}>
              {t("keepReading")}
            </h2>
            <div className="blog-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem", maxWidth: "800px", margin: "0 auto" }}>
              {recentBlogs.map((relatedPost) => (
                <Link href={`/blog/${relatedPost.slug}`} key={relatedPost.id} className="blog-card" style={{ background: "#fff", display: "flex", flexDirection: "column", overflow: "hidden" }}>
                  <div className="blog-card__img-wrap" style={{ position: "relative", aspectRatio: "4/3", overflow: "hidden", display: "block" }}>
                    <Image
                      src={relatedPost.image}
                      alt={relatedPost.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      style={{ objectFit: "cover" }}
                    />
                    <div className="blog-card__category" style={{ position: "absolute", top: "1.5rem", left: "1.5rem", background: "var(--color-off-white)", padding: "0.5rem 1rem", fontFamily: "var(--font-sans)", fontSize: "0.6875rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-black)", zIndex: 2 }}>{relatedPost.category}</div>
                  </div>
                  <div className="blog-card__body" style={{ padding: "2.5rem", display: "flex", flexDirection: "column", flexGrow: 1 }}>
                    <h3 className="blog-card__title" style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", lineHeight: 1.3, marginBottom: "1rem", color: "var(--color-black)" }}>
                      {relatedPost.title}
                    </h3>
                    <div className="blog-card__link" style={{ fontFamily: "var(--font-sans)", fontSize: "0.75rem", letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--color-navy)", fontWeight: 500, display: "inline-flex", alignItems: "center", marginTop: "auto" }}>
                      {t("readArticle")}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
