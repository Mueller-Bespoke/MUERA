import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { linkGuestOrders } from "@/lib/account";

/** Email confirmation / password recovery links land here (PKCE code exchange). */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const next = url.searchParams.get("next") ?? "/account";
  const safeNext = next.startsWith("/") && !next.startsWith("//") ? next : "/account";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error && data.user) {
      await linkGuestOrders(data.user);
      return NextResponse.redirect(new URL(safeNext, url.origin));
    }
  }
  return NextResponse.redirect(new URL("/account/login?error=link", url.origin));
}
