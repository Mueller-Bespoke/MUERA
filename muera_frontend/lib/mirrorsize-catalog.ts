import "server-only";

/**
 * MirrorSize is the source of truth for made-to-measure garments: name, base price,
 * pieces and option add-on prices all come from the MirrorSize dashboard. This reads
 * the same garment data the 3D configurator loads (auth → iframe → 3d/apparel).
 *
 * Keep in sync with muera-admin/lib/mirrorsize-catalog.ts.
 */

const API = "https://api.services.mirrorsize.com/v1/configurator";
const CACHE_MS = 5 * 60 * 1000;

export interface MsOption {
  name: string;
  code: string | null;
  price: number;
}

export interface MsStyle {
  name: string;
  price: number;
  choices: MsOption[];
}

export interface MsGarmentPiece {
  name: string;
  sku: string;
  description: string;
  fabrics: MsOption[];
  linings: MsOption[];
  styles: MsStyle[];
  accents: MsStyle[];
}

export interface MsGarment {
  apparelId: string;
  sku: string;
  name: string;
  price: number;
  currency: string;
  pieces: MsGarmentPiece[];
}

/** Compact copy stored on products.mirror_size_data — enough to show the admin what MirrorSize holds. */
export interface MsGarmentSummary {
  apparelId: string;
  sku: string;
  name: string;
  price: number;
  currency: string;
  pieces: {
    name: string;
    sku: string;
    description: string;
    fabricCount: number;
    liningCount: number;
    styles: { name: string; choices: string[] }[];
    accents: string[];
  }[];
  /** Options that cost extra, e.g. premium fabrics. */
  addOns: { piece: string; kind: "fabric" | "lining" | "style" | "accent"; name: string; price: number }[];
}

const num = (v: unknown) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};
const norm = (s: unknown) => String(s ?? "").trim().toLowerCase();

function credentials() {
  const merchantId = process.env.MIRRORSIZE_MERCHANT_ID || process.env.merchant_id;
  const apiKey = process.env.MIRRORSIZE_API_KEY || process.env.apiKey;
  if (!merchantId || !apiKey) throw new Error("MirrorSize is not configured (MIRRORSIZE_MERCHANT_ID / MIRRORSIZE_API_KEY)");
  return { merchantId, apiKey };
}

async function post(path: string, body: unknown, token?: string) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  return res.json().catch(() => ({}));
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function parseGarment(d: any): MsGarment {
  const options = (list: any[], nameKey: string): MsOption[] =>
    (list ?? []).map((o) => ({ name: String(o?.[nameKey] ?? o?.name ?? ""), code: o?.styleNo || null, price: num(o?.price) }));
  return {
    apparelId: String(d.apparelId ?? ""),
    sku: String(d.sku ?? ""),
    name: String(d.apparelName ?? d.sku ?? ""),
    price: num(d.price),
    currency: String(d.otherConfig?.currency ?? "CHF"),
    pieces: (d.productDetails ?? [])
      .slice()
      .sort((a: any, b: any) => num(a?.pieceOrder) - num(b?.pieceOrder))
      .map((p: any) => ({
        name: String(p?.pieceName ?? ""),
        sku: String(p?.pieceSku ?? ""),
        description: String(p?.pieceDescription ?? ""),
        fabrics: options(p?.fabrics, "name"),
        linings: options(p?.linings, "liningName"),
        styles: (p?.styles ?? []).map((s: any) => ({
          name: String(s?.name ?? ""),
          price: 0,
          choices: options(s?.styleChoices, "name"),
        })),
        accents: (p?.accents ?? []).map((a: any) => ({
          name: String(a?.name ?? ""),
          price: num(a?.price),
          choices: options(a?.accentChoices, "name"),
        })),
      })),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

const cache = new Map<string, { at: number; garment: MsGarment | null }>();

// MirrorSize issues one token per merchant login and a new login can invalidate the
// previous token, so calls share a token and run one at a time.
let token: { value: string; at: number } | null = null;
const TOKEN_MS = 10 * 60 * 1000;
let queue: Promise<unknown> = Promise.resolve();

function serial<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

async function authToken(fresh = false): Promise<string> {
  if (!fresh && token && Date.now() - token.at < TOKEN_MS) return token.value;
  const { merchantId, apiKey } = credentials();
  const auth = await post("/auth", { merchantId, apiKey });
  const value = auth?.data?.token;
  if (!value) throw new Error(auth?.message || "MirrorSize authentication failed");
  token = { value, at: Date.now() };
  return value;
}

/**
 * MirrorSize answers every failure with status 1001, so the message tells them apart:
 * an unknown SKU says it "couldn't retrieve the apparel details"; a stale or replaced
 * token says "Invalid email or password".
 */
const isUnknownSku = (r: { status?: number; message?: string }) =>
  r?.status === 1001 && /retrieve the apparel/i.test(r?.message ?? "");

async function loadGarment(sku: string, retried = false): Promise<MsGarment | null> {
  const iframe = await post("/iframe", { sku: sku.trim() }, await authToken(retried));
  if (isUnknownSku(iframe)) return null;
  if (iframe?.status !== 1000 || !iframe?.data?.configuratorUrl) {
    // Most likely an expired/replaced token — log in again once.
    if (!retried) return loadGarment(sku, true);
    throw new Error(iframe?.message || "MirrorSize did not return a configurator for this SKU");
  }
  const url = new URL(iframe.data.configuratorUrl);
  const apparelId = url.pathname.split("/").pop();
  const apparelToken = url.searchParams.get("token");
  if (!apparelId || !apparelToken) throw new Error("Unexpected MirrorSize configurator URL");

  const res = await fetch(`${API}/3d/apparel/${encodeURIComponent(apparelId)}`, {
    headers: { Authorization: `Bearer ${apparelToken}` },
    cache: "no-store",
  });
  const json = await res.json().catch(() => ({}));
  if (json?.status !== 1000 || !json?.data) throw new Error(json?.message || `MirrorSize garment error ${res.status}`);
  return parseGarment(json.data);
}

/**
 * Live garment data for a MirrorSize 3D product SKU. `null` = no such SKU.
 * Throws when MirrorSize can't be reached or credentials are missing.
 */
export async function fetchMirrorSizeGarment(sku: string, { fresh = false } = {}): Promise<MsGarment | null> {
  const key = norm(sku);
  if (!key) return null;
  const hit = cache.get(key);
  if (!fresh && hit && Date.now() - hit.at < CACHE_MS) return hit.garment;

  const garment = await serial(() => loadGarment(sku));
  cache.set(key, { at: Date.now(), garment });
  return garment;
}

export function summarizeGarment(g: MsGarment): MsGarmentSummary {
  const addOns: MsGarmentSummary["addOns"] = [];
  for (const p of g.pieces) {
    for (const f of p.fabrics) if (f.price > 0) addOns.push({ piece: p.name, kind: "fabric", name: f.name, price: f.price });
    for (const l of p.linings) if (l.price > 0) addOns.push({ piece: p.name, kind: "lining", name: l.name, price: l.price });
    for (const s of p.styles)
      for (const c of s.choices) if (c.price > 0) addOns.push({ piece: p.name, kind: "style", name: `${s.name}: ${c.name}`, price: c.price });
    for (const a of p.accents) {
      if (a.price > 0) addOns.push({ piece: p.name, kind: "accent", name: a.name, price: a.price });
      for (const c of a.choices) if (c.price > 0) addOns.push({ piece: p.name, kind: "accent", name: `${a.name}: ${c.name}`, price: c.price });
    }
  }
  return {
    apparelId: g.apparelId,
    sku: g.sku,
    name: g.name,
    price: g.price,
    currency: g.currency,
    pieces: g.pieces.map((p) => ({
      name: p.name,
      sku: p.sku,
      description: p.description,
      fabricCount: p.fabrics.length,
      liningCount: p.linings.length,
      styles: p.styles.map((s) => ({ name: s.name, choices: s.choices.map((c) => c.name) })),
      accents: p.accents.map((a) => a.name),
    })),
    addOns,
  };
}

/** The selections MirrorSize returns for a submitted configurator session (product-details). */
export interface MsSelection {
  pieces?: {
    pieceName?: string;
    sku?: string;
    fabrics?: { fabricName?: string; styleNo?: string | null } | null;
    linings?: { liningName?: string; styleNo?: string | null } | null;
    styleChoices?: { attributeName?: string; styleName?: string; styleNo?: string | null }[];
    accentChoices?: { accentName?: string; choiceName?: string | null; inputValue?: string | null }[];
  }[];
}

const pick = (list: MsOption[], name?: string, code?: string | null) =>
  (code && list.find((o) => o.code && norm(o.code) === norm(code))) || list.find((o) => norm(o.name) === norm(name));

/**
 * Price MirrorSize shows the customer: garment price + add-ons of the chosen fabric,
 * lining, styles and accents. Options that can't be matched count as 0.
 */
export function priceConfiguration(g: MsGarment, selection: MsSelection): { base: number; addOns: number; total: number } {
  let addOns = 0;
  for (const sp of selection.pieces ?? []) {
    const gp =
      g.pieces.find((p) => sp.sku && norm(p.sku) === norm(sp.sku)) ?? g.pieces.find((p) => norm(p.name) === norm(sp.pieceName));
    if (!gp) continue;
    if (sp.fabrics) addOns += pick(gp.fabrics, sp.fabrics.fabricName, sp.fabrics.styleNo)?.price ?? 0;
    if (sp.linings) addOns += pick(gp.linings, sp.linings.liningName, sp.linings.styleNo)?.price ?? 0;
    for (const sc of sp.styleChoices ?? []) {
      const style = gp.styles.find((s) => norm(s.name) === norm(sc.attributeName));
      if (style) addOns += pick(style.choices, sc.styleName, sc.styleNo)?.price ?? 0;
    }
    for (const ac of sp.accentChoices ?? []) {
      const accent = gp.accents.find((a) => norm(a.name) === norm(ac.accentName));
      if (!accent) continue;
      const used = ac.inputValue || ac.choiceName;
      if (!used) continue;
      addOns += accent.price + (ac.choiceName ? pick(accent.choices, ac.choiceName)?.price ?? 0 : 0);
    }
  }
  const round = (n: number) => Math.round(n * 100) / 100;
  return { base: g.price, addOns: round(addOns), total: round(g.price + addOns) };
}
