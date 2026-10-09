import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/format";
import { linkGuestOrders } from "@/lib/account";
import AccountActions, { AddressForm } from "./AccountClient";

export const dynamic = "force-dynamic";

interface Snapshot {
  name?: string;
  color?: string;
  size?: string;
}

export default async function AccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return redirect({ href: "/account/login", locale });
  await linkGuestOrders(user);

  const [{ data: profile }, { data: orders }, { data: addresses }, { data: measurements }] = await Promise.all([
    supabase.from("profiles").select("full_name, phone").eq("id", user.id).single(),
    supabase
      .from("orders")
      .select("id, order_number, created_at, status, total_amount, paid_at, tracking_url, tracking_number, order_items(id, quantity, product_snapshot, mirror_size_user_session_id)")
      .order("created_at", { ascending: false }),
    supabase.from("addresses").select("*").eq("type", "shipping").order("is_default", { ascending: false }).limit(1),
    supabase.from("mirror_size_sessions").select("id, sku, created_at, measurements").order("created_at", { ascending: false }).limit(5),
  ]);

  // Hide checkout attempts that never got paid (abandoned or failed before payment).
  const visibleOrders = (orders ?? []).filter((o) => o.paid_at || !["pending", "cancelled"].includes(o.status));
  const dateFmt = new Intl.DateTimeFormat(locale === "en" ? "en-GB" : `${locale}-CH`, { dateStyle: "medium" });

  return (
    <section className="section" style={{ background: "var(--color-off-white)", paddingTop: "120px", minHeight: "80vh" }}>
      <div className="container" style={{ maxWidth: 960 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: "1rem", marginBottom: "2.5rem" }}>
          <div>
            <p className="section-label">{t("label")}</p>
            <h1 className="section-title">{t("hello", { name: profile?.full_name || user.email || "" })}</h1>
          </div>
          <AccountActions />
        </div>

        <div style={{ display: "grid", gap: "3rem" }}>
          <div>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", marginBottom: "1rem" }}>{t("orders")}</h2>
            {visibleOrders.length === 0 ? (
              <p style={{ color: "var(--color-mid-gray)" }}>{t("noOrders")}</p>
            ) : (
              <div style={{ display: "grid", gap: "1rem" }}>
                {visibleOrders.map((o) => (
                  <article key={o.id} style={{ background: "#fff", padding: "1.5rem", border: "1px solid var(--color-light-gray)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
                      <strong>{o.order_number}</strong>
                      <span style={{ fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--color-gold)" }}>
                        {t(`status.${o.status}`)}
                      </span>
                    </div>
                    <p style={{ fontSize: "0.8125rem", color: "var(--color-mid-gray)", margin: "0.25rem 0 0.75rem" }}>
                      {dateFmt.format(new Date(o.created_at))} · {formatPrice(Number(o.total_amount))}
                    </p>
                    <ul style={{ fontSize: "0.875rem", paddingLeft: "1rem" }}>
                      {o.order_items.map((i) => {
                        const s = (i.product_snapshot ?? {}) as Snapshot;
                        return (
                          <li key={i.id}>
                            {i.quantity} × {s.name}
                            {i.mirror_size_user_session_id ? ` — ${t("madeToMeasure")}` : [s.color, s.size].filter(Boolean).length ? ` — ${[s.color, s.size].filter(Boolean).join(" / ")}` : ""}
                          </li>
                        );
                      })}
                    </ul>
                    {o.tracking_number && (
                      <p style={{ fontSize: "0.8125rem", marginTop: "0.75rem" }}>
                        {t("tracking")}:{" "}
                        {o.tracking_url ? (
                          <a href={o.tracking_url} target="_blank" rel="noreferrer" style={{ textDecoration: "underline" }}>{o.tracking_number}</a>
                        ) : (
                          o.tracking_number
                        )}
                      </p>
                    )}
                  </article>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "2rem" }}>
            <div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", marginBottom: "1rem" }}>{t("address")}</h2>
              <AddressForm
                address={addresses?.[0] ?? null}
                defaultName={profile?.full_name ?? ""}
              />
            </div>
            <div>
              <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.5rem", marginBottom: "1rem" }}>{t("measurements")}</h2>
              {(measurements ?? []).length === 0 ? (
                <p style={{ color: "var(--color-mid-gray)" }}>{t("noMeasurements")}</p>
              ) : (
                (measurements ?? []).map((m) => {
                  const list = (Array.isArray(m.measurements) ? m.measurements : []) as { displayName?: string; valueIncm?: string }[];
                  return (
                    <details key={m.id} style={{ background: "#fff", padding: "1rem 1.25rem", border: "1px solid var(--color-light-gray)", marginBottom: "0.75rem" }}>
                      <summary style={{ cursor: "pointer" }}>
                        {m.sku ?? t("configuration")} · {dateFmt.format(new Date(m.created_at))}
                      </summary>
                      <ul style={{ fontSize: "0.8125rem", marginTop: "0.75rem", paddingLeft: "1rem" }}>
                        {list.map((x, i) => (
                          <li key={i}>{x.displayName}: {x.valueIncm}</li>
                        ))}
                      </ul>
                    </details>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
