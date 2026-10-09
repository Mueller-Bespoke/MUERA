import "server-only";
import { fetchMirrorSizeGarment, priceConfiguration, type MsSelection } from "@/lib/mirrorsize-catalog";

const API = "https://api.services.mirrorsize.com/api/sdk/configurator/product-details";

export interface MsPiece {
  pieceName?: string;
  sku?: string;
  comment?: string;
  image?: string;
  frontImage?: string;
  fabrics?: { fabricName?: string; fabricImage?: string; colorName?: string; materialType?: string } | null;
  styleChoices?: { attributeName: string; styleName: string; styleImage?: string }[];
  accentChoices?: { accentName: string; choiceName: string; inputValue?: string | null }[];
  measurements?: { displayName: string; valueIncm?: string; valueIninch?: string }[];
  [key: string]: unknown;
}

export interface MsSession {
  apparelName: string;
  sku: string;
  pieces: MsPiece[];
  [key: string]: unknown;
}

export function mirrorSizeCredentials() {
  return {
    merchantId: process.env.MIRRORSIZE_MERCHANT_ID || process.env.merchant_id || "",
    apiKey: process.env.MIRRORSIZE_API_KEY || process.env.apiKey || "",
  };
}

/** Authoritative read of what the customer configured. Server-side only. */
export async function fetchMirrorSizeSession(userSessionId: string): Promise<MsSession> {
  const { merchantId, apiKey } = mirrorSizeCredentials();
  if (!merchantId || !apiKey) throw new Error("MirrorSize is not configured");
  if (!/^[A-Za-z0-9_-]{4,100}$/.test(userSessionId)) throw new Error("Invalid configurator session");

  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey, merchantId, userSessionId }),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`MirrorSize API error ${res.status}`);
  const json = await res.json();
  if (json.status !== 1000 || !json.data) throw new Error(json.message || "Configurator session not found");
  return json.data as MsSession;
}

/**
 * What the customer pays for a submitted configuration: the garment price set in the
 * MirrorSize dashboard plus the add-ons of the options they chose (MirrorSize is the
 * source of truth). Falls back to the last synced price if MirrorSize can't be reached.
 */
export async function mirrorSizePrice(
  sku: string,
  session: MsSession,
  fallback: number
): Promise<{ unit: number; base: number; addOns: number; source: "mirrorsize" | "synced" }> {
  try {
    const garment = await fetchMirrorSizeGarment(sku);
    if (garment && garment.price > 0) {
      const p = priceConfiguration(garment, session as MsSelection);
      return { unit: p.total, base: p.base, addOns: p.addOns, source: "mirrorsize" };
    }
  } catch {
    // fall through to the synced price
  }
  return { unit: fallback, base: fallback, addOns: 0, source: "synced" };
}

export function mirrorSizeImage(data: MsSession): string | undefined {
  const p = data.pieces?.[0];
  return (p?.frontImage as string) || p?.image || undefined;
}
