import "server-only";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStoreSettings } from "@/lib/settings";
import { fetchMirrorSizeSession, mirrorSizeImage, mirrorSizePrice, type MsSession } from "@/lib/mirrorsize";
import type { Json } from "@/lib/database.types";

/** What the browser sends — identifiers only, never prices. */
export interface CartLineInput {
  productId: string;
  color?: string;
  size?: string;
  quantity: number;
  msSessionId?: string;
}

export interface PricedLine {
  input: CartLineInput;
  productId: string;
  variantId: string | null;
  name: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  snapshot: Json;
  configuration: Json;
  msSessionId: string | null;
}

export interface LineIssue {
  index: number;
  code: "not_found" | "unavailable" | "out_of_stock" | "insufficient_stock" | "configuration_invalid";
  available?: number;
}

export interface Quote {
  lines: PricedLine[];
  issues: LineIssue[];
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  total: number;
  currency: string;
  coupon: { id: string; code: string } | null;
  couponError: string | null;
}

const round = (n: number) => Math.round(n * 100) / 100;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export function sanitizeLines(raw: unknown): CartLineInput[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .slice(0, 50)
    .map((l) => ({
      productId: String(l?.productId ?? ""),
      color: l?.color ? String(l.color).slice(0, 80) : undefined,
      size: l?.size ? String(l.size).slice(0, 40) : undefined,
      quantity: Math.min(20, Math.max(1, Math.floor(Number(l?.quantity) || 1))),
      msSessionId: l?.msSessionId ? String(l.msSessionId).slice(0, 100) : undefined,
    }))
    .filter((l) => UUID.test(l.productId));
}

export async function priceCart(lines: CartLineInput[], couponCode?: string | null): Promise<Quote> {
  const supabase = createAdminClient();
  const settings = await getStoreSettings();

  const ids = [...new Set(lines.map((l) => l.productId))];
  const { data: products } = ids.length
    ? await supabase
        .from("products")
        .select(
          "id, sku, slug, type, base_price, is_active, mirror_size_product_id, product_translations(language_code, name), product_images(url, sort_order, variant_color), product_variants(id, sku, price, stock_quantity, attributes, is_active)"
        )
        .in("id", ids)
    : { data: [] };

  const priced: PricedLine[] = [];
  const issues: LineIssue[] = [];
  const msCache = new Map<string, MsSession>();

  for (const [index, line] of lines.entries()) {
    const p = products?.find((x) => x.id === line.productId);
    if (!p) {
      issues.push({ index, code: "not_found" });
      continue;
    }
    if (!p.is_active) {
      issues.push({ index, code: "unavailable" });
      continue;
    }
    const name =
      p.product_translations.find((t) => t.language_code === "en")?.name ?? p.product_translations[0]?.name ?? p.slug;
    const images = [...p.product_images].sort((a, b) => a.sort_order - b.sort_order);

    if (line.msSessionId) {
      // Made-to-measure: re-read the configuration from MirrorSize and check it belongs to this product.
      let ms = msCache.get(line.msSessionId);
      if (!ms) {
        try {
          ms = await fetchMirrorSizeSession(line.msSessionId);
          msCache.set(line.msSessionId, ms);
        } catch {
          issues.push({ index, code: "configuration_invalid" });
          continue;
        }
      }
      if (!p.mirror_size_product_id || ms.sku?.trim().toLowerCase() !== p.mirror_size_product_id.trim().toLowerCase()) {
        issues.push({ index, code: "configuration_invalid" });
        continue;
      }
      // MirrorSize sets the price of made-to-measure garments.
      const msPrice = await mirrorSizePrice(p.mirror_size_product_id, ms, Number(p.base_price));
      const unit = round(msPrice.unit);
      priced.push({
        input: line,
        productId: p.id,
        variantId: null,
        name,
        quantity: line.quantity,
        unitPrice: unit,
        totalPrice: round(unit * line.quantity),
        snapshot: {
          name,
          sku: p.sku,
          slug: p.slug,
          type: "made_to_measure",
          image: mirrorSizeImage(ms) ?? images[0]?.url ?? null,
          color: ms.pieces?.[0]?.fabrics?.fabricName ?? null,
          size: "Made to measure",
          price_base: msPrice.base,
          price_add_ons: msPrice.addOns,
          price_source: msPrice.source,
        },
        configuration: ms as unknown as Json,
        msSessionId: line.msSessionId,
      });
      continue;
    }

    if (p.type === "configurable") {
      issues.push({ index, code: "configuration_invalid" });
      continue;
    }

    const variant = p.product_variants.find((v) => {
      const a = (v.attributes ?? {}) as Record<string, string>;
      return v.is_active && (a.color ?? "") === (line.color ?? "") && (a.size ?? "") === (line.size ?? "");
    });
    if (!variant) {
      issues.push({ index, code: "unavailable" });
      continue;
    }
    if (variant.stock_quantity <= 0) {
      issues.push({ index, code: "out_of_stock", available: 0 });
      continue;
    }
    if (variant.stock_quantity < line.quantity) {
      issues.push({ index, code: "insufficient_stock", available: variant.stock_quantity });
      continue;
    }
    const unit = Number(variant.price ?? p.base_price);
    const image =
      images.find((i) => i.variant_color === line.color)?.url ?? images.find((i) => !i.variant_color)?.url ?? images[0]?.url;
    priced.push({
      input: line,
      productId: p.id,
      variantId: variant.id,
      name,
      quantity: line.quantity,
      unitPrice: unit,
      totalPrice: round(unit * line.quantity),
      snapshot: { name, sku: variant.sku, slug: p.slug, type: "standard", image: image ?? null, color: line.color ?? null, size: line.size ?? null },
      configuration: {},
      msSessionId: null,
    });
  }

  const subtotal = round(priced.reduce((s, l) => s + l.totalPrice, 0));

  // Coupon
  let coupon: Quote["coupon"] = null;
  let couponError: string | null = null;
  let discount = 0;
  if (couponCode?.trim()) {
    const { data: c } = await supabase
      .from("coupons")
      .select("*")
      .eq("code", couponCode.trim().toUpperCase())
      .maybeSingle();
    if (!c || !c.is_active) couponError = "invalid";
    else if (c.expires_at && new Date(c.expires_at) < new Date()) couponError = "expired";
    else if (c.max_uses != null && c.used_count >= c.max_uses) couponError = "used_up";
    else if (c.min_order_amount != null && subtotal < Number(c.min_order_amount)) couponError = "minimum";
    else {
      coupon = { id: c.id, code: c.code };
      discount =
        c.type === "percentage" ? round((subtotal * Number(c.value)) / 100) : Math.min(subtotal, Number(c.value));
    }
  }

  const afterDiscount = subtotal - discount;
  const shipping = priced.length === 0 || afterDiscount >= settings.freeThreshold ? 0 : settings.flatRate;
  const gross = round(afterDiscount + shipping);
  const tax = settings.pricesIncludeTax
    ? round(gross - gross / (1 + settings.taxRate / 100))
    : round(gross * (settings.taxRate / 100));
  const total = settings.pricesIncludeTax ? gross : round(gross + tax);

  return {
    lines: priced,
    issues,
    subtotal,
    discount,
    shipping,
    tax,
    total,
    currency: settings.currency,
    coupon,
    couponError,
  };
}
