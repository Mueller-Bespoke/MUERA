import { NextResponse } from "next/server";
import { priceCart, sanitizeLines } from "@/lib/checkout";
import { getProductById } from "@/lib/catalog";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/database.types";

/**
 * Server copy of the shopper's cart, used for abandoned-cart recovery in the admin.
 * The browser holds a random token; it never sees other carts or any prices it could set.
 */
const TOKEN = /^[0-9a-f]{32}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOCALES = ["de", "en", "fr", "it"];

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  if (!body) return NextResponse.json({ error: "invalid_request" }, { status: 400 });

  const token = typeof body.token === "string" && TOKEN.test(body.token) ? body.token : null;
  const lines = sanitizeLines(body.lines);
  const email = typeof body.email === "string" && EMAIL.test(body.email.trim()) ? body.email.trim().toLowerCase().slice(0, 200) : null;
  const locale = LOCALES.includes(body.locale) ? body.locale : null;

  const supabase = createAdminClient();
  const {
    data: { user },
  } = await (await createClient()).auth.getUser();

  const existing = token
    ? (await supabase.from("carts").select("id, completed_at").eq("recovery_token", token).maybeSingle()).data
    : null;

  // Nothing worth remembering yet.
  if (!existing && !lines.length) return NextResponse.json({ token: null });

  const quote = lines.length ? await priceCart(lines) : null;
  const row = {
    lines: lines as unknown as Json,
    item_count: lines.reduce((s, l) => s + l.quantity, 0),
    subtotal: quote?.subtotal ?? 0,
    currency: quote?.currency ?? "CHF",
    ...(locale ? { locale } : {}),
    ...(email ? { email } : !existing && user?.email ? { email: user.email } : {}),
    ...(user ? { profile_id: user.id } : {}),
  };

  // A converted cart is history — start a fresh one for the next purchase.
  if (existing && !existing.completed_at) {
    await supabase.from("carts").update(row).eq("id", existing.id);
    return NextResponse.json({ token });
  }
  if (!lines.length) return NextResponse.json({ token: null });
  const { data, error } = await supabase.from("carts").insert(row).select("recovery_token").single();
  if (error) return NextResponse.json({ error: "save_failed" }, { status: 500 });
  return NextResponse.json({ token: data.recovery_token });
}

/** Rebuilds a saved cart from a recovery link (/cart?recover=<token>). */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") ?? "";
  const locale = LOCALES.includes(url.searchParams.get("locale") ?? "") ? url.searchParams.get("locale")! : "de";
  if (!TOKEN.test(token)) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const { data: cart } = await createAdminClient()
    .from("carts")
    .select("lines, completed_at, email")
    .eq("recovery_token", token)
    .maybeSingle();
  if (!cart) return NextResponse.json({ error: "not_found" }, { status: 404 });
  if (cart.completed_at) return NextResponse.json({ error: "completed" }, { status: 410 });

  const lines = sanitizeLines(cart.lines);
  const quote = await priceCart(lines);
  const items = [];
  for (const [i, line] of lines.entries()) {
    if (quote.issues.some((x) => x.index === i)) continue;
    const product = await getProductById(locale, line.productId);
    if (!product) continue;
    const priced = quote.lines.find((l) => l.input === line);
    items.push({
      product,
      selectedColor: line.color ?? "",
      selectedSize: line.size ?? "",
      quantity: line.quantity,
      customized: !!line.msSessionId,
      msSessionId: line.msSessionId,
      customPrice: line.msSessionId ? priced?.unitPrice : undefined,
      customImage: line.msSessionId ? ((priced?.snapshot as { image?: string } | undefined)?.image ?? undefined) : undefined,
    });
  }
  return NextResponse.json({ items, email: cart.email, token });
}
