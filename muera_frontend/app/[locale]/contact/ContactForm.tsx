"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

export default function ContactForm() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState("sending");
    const data = Object.fromEntries(new FormData(e.currentTarget));
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, locale }),
    });
    setState(res.ok ? "sent" : "error");
  }

  if (state === "sent") {
    return (
      <div role="status" style={{ padding: "2rem", border: "1px solid var(--color-light-gray)" }}>
        <p style={{ fontFamily: "var(--font-serif)", fontSize: "1.25rem", marginBottom: "0.5rem" }}>{t("sentTitle")}</p>
        <p style={{ color: "var(--color-mid-gray)" }}>{t("sentText")}</p>
      </div>
    );
  }

  return (
    <form className="contact-form" aria-label={t("formTitle")} onSubmit={submit}>
      {/* honeypot — hidden from people, filled by bots */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" style={{ position: "absolute", left: "-9999px" }} aria-hidden="true" />
      <div className="form-group">
        <label htmlFor="contact-name" className="form-label">{t("formNameLabel")}</label>
        <input type="text" id="contact-name" name="name" className="form-input" placeholder={t("formNamePlaceholder")} required autoComplete="name" maxLength={120} />
      </div>

      <div className="form-group">
        <label htmlFor="contact-email-input" className="form-label">{t("formEmailLabel")}</label>
        <input type="email" id="contact-email-input" name="email" className="form-input" placeholder={t("formEmailPlaceholder")} required autoComplete="email" />
      </div>

      <div className="form-group">
        <label htmlFor="contact-subject" className="form-label">{t("formSubjectLabel")}</label>
        <input type="text" id="contact-subject" name="subject" className="form-input" placeholder={t("formSubjectPlaceholder")} maxLength={200} />
      </div>

      <div className="form-group">
        <label htmlFor="contact-message" className="form-label">{t("formMessageLabel")}</label>
        <textarea id="contact-message" name="message" className="form-textarea" placeholder={t("formMessagePlaceholder")} required maxLength={5000} />
      </div>

      {state === "error" && <p role="alert" style={{ color: "#c0392b", fontSize: "0.875rem" }}>{t("sendError")}</p>}

      <button type="submit" className="btn btn--primary" id="contact-submit" style={{ alignSelf: "flex-start" }} disabled={state === "sending"}>
        {state === "sending" ? t("sending") : t("formSubmit")}
      </button>
    </form>
  );
}
