/**
 * Several products can share one MirrorSize garment (e.g. two suits on "2psuit"),
 * so remember which product the customer opened the configurator from. MirrorSize
 * redirects back with only ?userSessionId=…, and the server checks this hint against
 * the SKU it reads from MirrorSize before trusting it.
 */
const KEY = "muera_ms_pending";
const MAX_AGE_MS = 6 * 60 * 60 * 1000;

export function rememberConfiguratorProduct(productId: string, sku: string) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify({ productId, sku, at: Date.now() }));
  } catch {
    // storage unavailable — the server falls back to matching by SKU
  }
}

export function pendingConfiguratorProduct(): string | undefined {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return undefined;
    const { productId, at } = JSON.parse(raw) as { productId?: string; at?: number };
    return productId && at && Date.now() - at < MAX_AGE_MS ? productId : undefined;
  } catch {
    return undefined;
  }
}
