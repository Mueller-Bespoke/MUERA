"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import type { PublicReview } from "@/lib/catalog";

function Stars({ value }: { value: number }) {
  return (
    <span aria-label={`${value}/5`} style={{ color: "var(--color-gold)", letterSpacing: "0.1em" }}>
      {"★".repeat(value)}
      <span style={{ opacity: 0.25 }}>{"★".repeat(5 - value)}</span>
    </span>
  );
}

export default function ProductReviews({ productId, reviews }: { productId: string; reviews: PublicReview[] }) {
  const t = useTranslations("reviews");
  const [signedIn, setSignedIn] = useState<boolean | null>(null);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    createClient()
      .auth.getUser()
      .then(({ data }) => setSignedIn(!!data.user));
  }, []);

  const average = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("sending");
    setError(null);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, title, body }),
    });
    if (res.ok) {
      setState("sent");
    } else {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? t("error"));
      setState("error");
    }
  }

  return (
    <section className="section" style={{ paddingTop: "3rem" }} aria-label={t("title")}>
      <div className="container" style={{ maxWidth: 820 }}>
        <p className="section-label">{t("label")}</p>
        <h2 className="section-title" style={{ marginBottom: "0.5rem" }}>{t("title")}</h2>
        {reviews.length > 0 ? (
          <p style={{ color: "var(--color-mid-gray)", marginBottom: "2rem" }}>
            <Stars value={Math.round(average)} /> {average.toFixed(1)} · {t("count", { count: reviews.length })}
          </p>
        ) : (
          <p style={{ color: "var(--color-mid-gray)", marginBottom: "2rem" }}>{t("empty")}</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginBottom: "2.5rem" }}>
          {reviews.map((r) => (
            <article key={r.id} style={{ borderBottom: "1px solid var(--color-light-gray)", paddingBottom: "1.25rem" }}>
              <Stars value={r.rating} />
              {r.title && <h3 style={{ fontSize: "1rem", margin: "0.5rem 0 0.25rem" }}>{r.title}</h3>}
              {r.body && <p style={{ color: "var(--color-dark-gray, #444)" }}>{r.body}</p>}
              <p style={{ fontSize: "0.75rem", color: "var(--color-mid-gray)", marginTop: "0.5rem" }}>
                {r.verified ? t("verified") : r.author} · {new Date(r.date).toLocaleDateString()}
              </p>
            </article>
          ))}
        </div>

        {signedIn === false && (
          <p style={{ fontSize: "0.875rem" }}>
            <Link href="/account/login" style={{ textDecoration: "underline" }}>{t("signInToReview")}</Link>
          </p>
        )}
        {signedIn && state === "sent" && <p>{t("thanks")}</p>}
        {signedIn && state !== "sent" && (
          <form onSubmit={submit} className="contact-form" style={{ gap: "1rem" }}>
            <div className="form-group">
              <label className="form-label">{t("rating")}</label>
              <div style={{ display: "flex", gap: "0.25rem" }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    type="button"
                    key={n}
                    onClick={() => setRating(n)}
                    aria-label={`${n}`}
                    style={{ fontSize: "1.5rem", color: n <= rating ? "var(--color-gold)" : "var(--color-light-gray)", background: "none", border: 0, cursor: "pointer" }}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="review-title">{t("reviewTitle")}</label>
              <input id="review-title" className="form-input" value={title} onChange={(e) => setTitle(e.target.value)} maxLength={120} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="review-body">{t("reviewBody")}</label>
              <textarea id="review-body" className="form-textarea" value={body} onChange={(e) => setBody(e.target.value)} maxLength={2000} required />
            </div>
            {error && <p style={{ color: "#c0392b", fontSize: "0.875rem" }}>{error}</p>}
            <button className="btn btn--primary" type="submit" disabled={state === "sending"} style={{ alignSelf: "flex-start" }}>
              {state === "sending" ? t("sending") : t("submit")}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
