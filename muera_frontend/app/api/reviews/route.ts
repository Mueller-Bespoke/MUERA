import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Signed-in customers can review a product once; reviews wait for approval in the admin. */
export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Please sign in to write a review." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const productId = String(body?.productId ?? "");
  const rating = Math.round(Number(body?.rating));
  if (!UUID.test(productId) || !(rating >= 1 && rating <= 5)) {
    return NextResponse.json({ error: "Invalid review." }, { status: 400 });
  }

  // Verified purchase = a paid order containing this product
  const admin = createAdminClient();
  const { data: bought } = await admin
    .from("order_items")
    .select("id, orders!inner(profile_id, paid_at)")
    .eq("product_id", productId)
    .eq("orders.profile_id", user.id)
    .not("orders.paid_at", "is", null)
    .limit(1);

  // Written with the service role so customers can't self-assign "verified purchase".
  const { error } = await admin.from("reviews").insert({
    product_id: productId,
    profile_id: user.id,
    rating,
    title: typeof body?.title === "string" ? body.title.slice(0, 120) || null : null,
    body: typeof body?.body === "string" ? body.body.slice(0, 2000) || null : null,
    is_verified_purchase: !!bought?.length,
    is_approved: false,
  });
  if (error?.code === "23505") return NextResponse.json({ error: "You have already reviewed this product." }, { status: 409 });
  if (error) return NextResponse.json({ error: "Could not save review." }, { status: 500 });
  return NextResponse.json({ ok: true });
}
