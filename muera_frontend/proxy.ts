import { type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { routing } from "./i18n/routing";
import { SUPABASE_ANON_KEY, SUPABASE_URL } from "./lib/supabase/env";

const intl = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const response = intl(request);

  // Keep the customer's Supabase session fresh (rotates the auth cookie when needed).
  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  await supabase.auth.getUser();

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)"],
};
