"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup" | "forgot";

function LoginForm() {
  const t = useTranslations("account");
  const locale = useLocale();
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/account";
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ kind: "error" | "info"; text: string } | null>(
    params.get("error") ? { kind: "error", text: t("linkExpired") } : null
  );

  const callback = (path: string) =>
    `${window.location.origin}/api/auth/callback?next=${encodeURIComponent(path)}`;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage(null);
    const supabase = createClient();

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage({ kind: "error", text: t("invalidLogin") });
      else {
        router.replace(next);
        router.refresh();
      }
    } else if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName, locale }, emailRedirectTo: callback("/account") },
      });
      if (error) setMessage({ kind: "error", text: error.message });
      else if (data.session) {
        router.replace(next);
        router.refresh();
      } else setMessage({ kind: "info", text: t("checkEmail") });
    } else {
      const prefix = locale === "de" ? "" : `/${locale}`;
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: callback(`${prefix}/account/reset`) });
      setMessage(error ? { kind: "error", text: error.message } : { kind: "info", text: t("resetSent") });
    }
    setBusy(false);
  }

  return (
    <section className="section" style={{ background: "var(--color-off-white)", paddingTop: "140px", minHeight: "80vh" }}>
      <div className="container" style={{ maxWidth: 440 }}>
        <p className="section-label">{t("label")}</p>
        <h1 className="section-title" style={{ marginBottom: "2rem" }}>
          {mode === "signin" ? t("signInTitle") : mode === "signup" ? t("signUpTitle") : t("forgotTitle")}
        </h1>

        <form onSubmit={submit} className="contact-form">
          {mode === "signup" && (
            <div className="form-group">
              <label htmlFor="acc-name" className="form-label">{t("fullName")}</label>
              <input id="acc-name" className="form-input" value={fullName} onChange={(e) => setFullName(e.target.value)} required autoComplete="name" />
            </div>
          )}
          <div className="form-group">
            <label htmlFor="acc-email" className="form-label">{t("email")}</label>
            <input id="acc-email" type="email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" />
          </div>
          {mode !== "forgot" && (
            <div className="form-group">
              <label htmlFor="acc-password" className="form-label">{t("password")}</label>
              <input
                id="acc-password"
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </div>
          )}

          {message && (
            <p role="alert" style={{ color: message.kind === "error" ? "#c0392b" : "var(--color-navy)", fontSize: "0.875rem" }}>
              {message.text}
            </p>
          )}

          <button className="btn btn--primary" type="submit" disabled={busy} style={{ width: "100%", justifyContent: "center" }}>
            {busy ? "…" : mode === "signin" ? t("signIn") : mode === "signup" ? t("createAccount") : t("sendReset")}
          </button>
        </form>

        <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.875rem" }}>
          {mode !== "signin" && (
            <button className="link-button" onClick={() => setMode("signin")} style={{ background: "none", border: 0, textDecoration: "underline", cursor: "pointer", textAlign: "left" }}>
              {t("haveAccount")}
            </button>
          )}
          {mode !== "signup" && (
            <button onClick={() => setMode("signup")} style={{ background: "none", border: 0, textDecoration: "underline", cursor: "pointer", textAlign: "left" }}>
              {t("noAccount")}
            </button>
          )}
          {mode === "signin" && (
            <button onClick={() => setMode("forgot")} style={{ background: "none", border: 0, textDecoration: "underline", cursor: "pointer", textAlign: "left" }}>
              {t("forgot")}
            </button>
          )}
          <Link href="/shop" style={{ color: "var(--color-mid-gray)" }}>{t("continueAsGuest")}</Link>
        </div>
      </div>
    </section>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
