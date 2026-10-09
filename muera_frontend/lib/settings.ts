import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";

export interface StoreSettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  flatRate: number;
  freeThreshold: number;
  taxRate: number;
  pricesIncludeTax: boolean;
}

export async function getStoreSettings(): Promise<StoreSettings> {
  const supabase = createAdminClient();
  const { data } = await supabase.from("settings").select("key, value");
  const v = Object.fromEntries((data ?? []).map((r) => [r.key, r.value])) as Record<string, unknown>;
  return {
    name: (v["store.name"] as string) ?? "Muera",
    email: (v["store.email"] as string) ?? "",
    phone: (v["store.phone"] as string) ?? "",
    address: (v["store.address"] as string) ?? "",
    currency: (v["store.currency"] as string) ?? "CHF",
    flatRate: Number(v["shipping.flat_rate"] ?? 25),
    freeThreshold: Number(v["shipping.free_threshold"] ?? 500),
    taxRate: Number(v["tax.rate_percent"] ?? 8.1),
    pricesIncludeTax: v["tax.prices_include_tax"] !== false,
  };
}
