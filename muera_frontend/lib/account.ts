import "server-only";
import type { User } from "@supabase/supabase-js";
import { createAdminClient } from "@/lib/supabase/admin";

/**
 * Attach earlier guest orders placed with this customer's email. Only for a
 * confirmed email, so nobody can claim orders by signing up with someone else's
 * address. Safe to call repeatedly (only touches orders with no owner).
 */
export async function linkGuestOrders(user: Pick<User, "id" | "email" | "email_confirmed_at">) {
  if (!user.email || !user.email_confirmed_at) return;
  await createAdminClient()
    .from("orders")
    .update({ profile_id: user.id })
    .is("profile_id", null)
    .eq("email", user.email.toLowerCase());
}
