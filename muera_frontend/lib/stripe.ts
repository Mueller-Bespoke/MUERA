import "server-only";
import Stripe from "stripe";

let client: Stripe | null = null;

export function stripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY is not configured");
  client ??= new Stripe(key);
  return client;
}

/** CHF 12.35 → 1235 */
export const toMinor = (amount: number) => Math.round(amount * 100);
