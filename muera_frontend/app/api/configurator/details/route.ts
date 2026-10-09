import { NextResponse } from "next/server";
import { fetchMirrorSizeSession, mirrorSizeImage, mirrorSizePrice } from "@/lib/mirrorsize";
import { getProductById, getProductByMirrorSizeSku } from "@/lib/catalog";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/lib/database.types";

/**
 * Called when MirrorSize redirects back with ?userSessionId=…
 * Reads the configuration server-side (the API key never reaches the browser here),
 * matches it to our product by MirrorSize SKU and prices it the way MirrorSize does.
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const userSessionId = typeof body?.userSessionId === "string" ? body.userSessionId : "";
  const locale = ["de", "en", "fr", "it"].includes(body?.locale) ? body.locale : "de";
  if (!userSessionId) return NextResponse.json({ error: "userSessionId is required" }, { status: 400 });

  let data;
  try {
    data = await fetchMirrorSizeSession(userSessionId);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Session not found" }, { status: 404 });
  }

  // Prefer the product the customer started from (hint from the browser, or echoed back by
  // MirrorSize), but only if it really is linked to the garment MirrorSize returned.
  const sameSku = (sku?: string) => !!sku && sku.trim().toLowerCase() === String(data.sku ?? "").trim().toLowerCase();
  const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  let product = null;
  for (const hint of [body?.productId, (data as Record<string, unknown>).productId]) {
    if (typeof hint === "string" && UUID.test(hint)) {
      const candidate = await getProductById(locale, hint);
      if (candidate && sameSku(candidate.mirrorSizeSku)) {
        product = candidate;
        break;
      }
    }
  }
  product ??= await getProductByMirrorSizeSku(locale, data.sku);
  if (!product) {
    return NextResponse.json({ error: `No product is linked to MirrorSize SKU "${data.sku}"` }, { status: 404 });
  }

  const {
    data: { user },
  } = await (await createClient()).auth.getUser();
  await createAdminClient()
    .from("mirror_size_sessions")
    .upsert(
      {
        user_session_id: userSessionId,
        session_token: userSessionId,
        profile_id: user?.id ?? null,
        product_id: product.id,
        sku: data.sku,
        payload: data as unknown as Json,
        measurements: (data.pieces ?? []).flatMap((p) => p.measurements ?? []) as unknown as Json,
        source: "storefront",
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      { onConflict: "user_session_id" }
    );

  const msPrice = await mirrorSizePrice(data.sku, data, product.price);

  return NextResponse.json({
    product,
    price: msPrice.unit,
    image: mirrorSizeImage(data) ?? product.images[0],
    session: {
      apparelName: data.apparelName,
      sku: data.sku,
      pieces: (data.pieces ?? []).map((p) => ({
        pieceName: p.pieceName,
        image: p.image ?? p.frontImage,
        fabric: p.fabrics?.fabricName ?? null,
        styleChoices: p.styleChoices ?? [],
        accentChoices: p.accentChoices ?? [],
        measurements: p.measurements ?? [],
      })),
    },
  });
}
