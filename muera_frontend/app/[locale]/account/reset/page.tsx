"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const t = useTranslations("account");
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await createClient().auth.updateUser({ password });
    setBusy(false);
    if (error) setError(error.message);
    else router.replace("/account");
  }

  return (
    <section className="section" style={{ background: "var(--color-off-white)", paddingTop: "140px", minHeight: "70vh" }}>
      <div className="container" style={{ maxWidth: 440 }}>
        <h1 className="section-title" style={{ marginBottom: "2rem" }}>{t("newPasswordTitle")}</h1>
        <form onSubmit={submit} className="contact-form">
          <div className="form-group">
            <label htmlFor="new-password" className="form-label">{t("password")}</label>
            <input id="new-password" type="password" minLength={8} required className="form-input" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" />
          </div>
          {error && <p role="alert" style={{ color: "#c0392b", fontSize: "0.875rem" }}>{error}</p>}
          <button className="btn btn--primary" type="submit" disabled={busy}>{t("savePassword")}</button>
        </form>
      </div>
    </section>
  );
}
