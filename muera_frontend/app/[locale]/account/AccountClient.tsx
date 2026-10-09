"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/database.types";

type AddressRow = Database["public"]["Tables"]["addresses"]["Row"];

export default function AccountActions() {
  const t = useTranslations("account");
  const router = useRouter();
  return (
    <button
      className="btn btn--outline-dark"
      onClick={async () => {
        await createClient().auth.signOut();
        router.replace("/");
        router.refresh();
      }}
    >
      {t("signOut")}
    </button>
  );
}

export function AddressForm({ address, defaultName }: { address: AddressRow | null; defaultName: string }) {
  const t = useTranslations("account");
  const tc = useTranslations("checkout");
  const router = useRouter();
  const [form, setForm] = useState({
    full_name: address?.full_name ?? defaultName,
    phone: address?.phone ?? "",
    line1: address?.line1 ?? "",
    line2: address?.line2 ?? "",
    postal_code: address?.postal_code ?? "",
    city: address?.city ?? "",
    country: address?.country ?? "CH",
  });
  const [state, setState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setState("saving");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return setState("error");
    const row = { ...form, line2: form.line2 || null, phone: form.phone || null, profile_id: user.id, type: "shipping", is_default: true };
    const { error } = address
      ? await supabase.from("addresses").update(row).eq("id", address.id)
      : await supabase.from("addresses").insert(row);
    setState(error ? "error" : "saved");
    router.refresh();
  }

  return (
    <form onSubmit={save} className="contact-form" style={{ background: "#fff", padding: "1.5rem", border: "1px solid var(--color-light-gray)" }}>
      <div className="form-group">
        <label className="form-label" htmlFor="ad-name">{t("fullName")}</label>
        <input id="ad-name" className="form-input" value={form.full_name} onChange={set("full_name")} required />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="ad-line1">{tc("address")}</label>
        <input id="ad-line1" className="form-input" value={form.line1} onChange={set("line1")} required />
      </div>
      <div className="form-group">
        <label className="form-label" htmlFor="ad-line2">{tc("address2")}</label>
        <input id="ad-line2" className="form-input" value={form.line2} onChange={set("line2")} />
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="ad-postal">{tc("postalCode")}</label>
          <input id="ad-postal" className="form-input" value={form.postal_code} onChange={set("postal_code")} required />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="ad-city">{tc("city")}</label>
          <input id="ad-city" className="form-input" value={form.city} onChange={set("city")} required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label className="form-label" htmlFor="ad-country">{tc("country")}</label>
          <select id="ad-country" className="form-input" value={form.country} onChange={set("country")}>
            {["CH", "DE", "AT", "FR", "IT", "GB"].map((c) => (
              <option key={c} value={c}>{tc(`countries.${c}`)}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="ad-phone">{tc("phone")}</label>
          <input id="ad-phone" className="form-input" value={form.phone} onChange={set("phone")} />
        </div>
      </div>
      <button className="btn btn--primary" type="submit" disabled={state === "saving"} style={{ alignSelf: "flex-start" }}>
        {state === "saved" ? t("saved") : t("saveAddress")}
      </button>
      {state === "error" && <p role="alert" style={{ color: "#c0392b", fontSize: "0.875rem" }}>{t("saveError")}</p>}
    </form>
  );
}
