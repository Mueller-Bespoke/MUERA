import "server-only";
import { createClient } from "@/lib/supabase/server";
import type { BlogPost, Product, ProductVariant } from "@/lib/types";
import type { Database } from "@/lib/database.types";

type Tables = Database["public"]["Tables"];
type ProductTranslation = Tables["product_translations"]["Row"];
type PostTranslation = Tables["blog_post_translations"]["Row"];
type NameTranslation = { language_code: string; name: string };

const FALLBACK = "en";
const PLACEHOLDER_IMAGE = "/products/navy-suit.png";

type Translated = { language_code: string };
/** Pick the row for `locale`, falling back to English, then anything. */
function pick<T extends Translated>(rows: T[] | null | undefined, locale: string): T | undefined {
  if (!rows?.length) return undefined;
  return rows.find((r) => r.language_code === locale) ?? rows.find((r) => r.language_code === FALLBACK) ?? rows[0];
}

const PRODUCT_SELECT = `
  id, slug, sku, type, base_price, compare_at_price, badge, sizes, mirror_size_product_id, is_featured, created_at,
  product_translations(language_code, name, short_description, description, details, fabric_info, care_instructions, delivery_time, meta_title, meta_description),
  product_images(url, sort_order, variant_color),
  product_variants(id, stock_quantity, attributes, is_active, price),
  categories(slug, category_translations(language_code, name))
`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapProduct(p: any, locale: string): Product {
  const t = pick<ProductTranslation>(p.product_translations, locale);
  const images: { url: string; sort_order: number; variant_color: string | null }[] = [...(p.product_images ?? [])].sort(
    (a, b) => a.sort_order - b.sort_order
  );
  const allImages = images.map((i) => i.url);

  const byColour = new Map<string, ProductVariant>();
  for (const v of p.product_variants ?? []) {
    if (!v.is_active) continue;
    const a = (v.attributes ?? {}) as Record<string, string>;
    const color = a.color ?? "";
    const entry =
      byColour.get(color) ??
      ({ color, colorHex: a.color_hex ?? "#1A2230", images: [], stock: 0, sizeStock: {} } as ProductVariant);
    entry.stock += v.stock_quantity;
    if (a.size) entry.sizeStock[a.size] = (entry.sizeStock[a.size] ?? 0) + v.stock_quantity;
    byColour.set(color, entry);
  }
  for (const entry of byColour.values()) {
    const own = images.filter((i) => i.variant_color === entry.color).map((i) => i.url);
    const shared = images.filter((i) => !i.variant_color).map((i) => i.url);
    entry.images = own.length ? [...own, ...shared] : shared.length ? shared : allImages;
    if (!entry.images.length) entry.images = [PLACEHOLDER_IMAGE];
  }
  let variants = [...byColour.values()];
  if (!variants.length) {
    // Made-to-measure products have no stock variants
    variants = [{ color: "", colorHex: "#1A2230", images: allImages.length ? allImages : [PLACEHOLDER_IMAGE], stock: 0, sizeStock: {} }];
  }

  const sizes: string[] = p.sizes?.length
    ? p.sizes
    : [...new Set(variants.flatMap((v) => Object.keys(v.sizeStock)))];

  return {
    id: p.id,
    slug: p.slug,
    sku: p.sku,
    name: t?.name ?? p.slug,
    tagline: t?.short_description ?? "",
    description: t?.description ?? "",
    details: t?.details ?? [],
    fabricInfo: t?.fabric_info ?? undefined,
    careInstructions: t?.care_instructions ?? [],
    deliveryTime: t?.delivery_time ?? "",
    price: Number(p.base_price),
    comparePrice: p.compare_at_price ? Number(p.compare_at_price) : undefined,
    badge: p.badge ?? undefined,
    type: p.type,
    hasConfigurator: !!p.mirror_size_product_id,
    mirrorSizeSku: p.mirror_size_product_id ?? undefined,
    category: p.categories?.slug ?? "",
    categoryName: pick<NameTranslation>(p.categories?.category_translations, locale)?.name ?? p.categories?.slug ?? "",
    sizes,
    variants,
    images: allImages.length ? allImages : [PLACEHOLDER_IMAGE],
  };
}

export async function getProducts(locale: string): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("is_active", true)
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: true });
  if (error) throw error;
  return (data ?? []).map((p) => mapProduct(p, locale));
}

export async function getProductBySlug(locale: string, slug: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select(PRODUCT_SELECT).eq("slug", slug).eq("is_active", true).maybeSingle();
  if (!data) return null;
  const t = pick(data.product_translations, locale);
  return { product: mapProduct(data, locale), metaTitle: t?.meta_title ?? undefined, metaDescription: t?.meta_description ?? undefined };
}

export async function getRelatedProducts(locale: string, product: Product, count = 3): Promise<Product[]> {
  const all = await getProducts(locale);
  return all
    .filter((p) => p.id !== product.id && p.category === product.category)
    .concat(all.filter((p) => p.id !== product.id && p.category !== product.category))
    .slice(0, count);
}

export async function getConfigurableProducts(locale: string): Promise<Product[]> {
  return (await getProducts(locale)).filter((p) => p.hasConfigurator);
}

export async function getCategories(locale: string): Promise<{ value: string; label: string }[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("categories")
    .select("slug, sort_order, category_translations(language_code, name)")
    .eq("is_active", true)
    .order("sort_order");
  return (data ?? []).map((c) => ({ value: c.slug, label: pick(c.category_translations, locale)?.name ?? c.slug }));
}

const BLOG_SELECT = `
  id, slug, featured_image_url, published_at, author_name, read_time_minutes,
  blog_post_translations(language_code, title, excerpt, content, meta_title, meta_description),
  blog_categories(slug, blog_category_translations(language_code, name))
`;

const READ_TIME: Record<string, string> = { en: "min read", de: "Min. Lesezeit", fr: "min de lecture", it: "min di lettura" };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapPost(b: any, locale: string): BlogPost {
  const t = pick<PostTranslation>(b.blog_post_translations, locale);
  return {
    id: b.id,
    slug: b.slug,
    title: t?.title ?? b.slug,
    excerpt: t?.excerpt ?? "",
    content: t?.content ?? "",
    author: b.author_name ?? "Muera",
    date: b.published_at ?? new Date().toISOString(),
    category: pick<NameTranslation>(b.blog_categories?.blog_category_translations, locale)?.name ?? "",
    image: b.featured_image_url ?? "/hero-suit.png",
    readTime: b.read_time_minutes ? `${b.read_time_minutes} ${READ_TIME[locale] ?? READ_TIME.en}` : "",
    metaTitle: t?.meta_title ?? undefined,
    metaDescription: t?.meta_description ?? undefined,
  };
}

export async function getBlogPosts(locale: string): Promise<BlogPost[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .select(BLOG_SELECT)
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((b) => mapPost(b, locale));
}

export async function getBlogPostBySlug(locale: string, slug: string): Promise<BlogPost | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select(BLOG_SELECT).eq("slug", slug).eq("is_published", true).maybeSingle();
  return data ? mapPost(data, locale) : null;
}

export interface PublicReview {
  id: string;
  rating: number;
  title: string | null;
  body: string | null;
  author: string;
  verified: boolean;
  date: string;
}

export async function getProductReviews(productId: string): Promise<PublicReview[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("reviews")
    .select("id, rating, title, body, is_verified_purchase, created_at, profile_id")
    .eq("product_id", productId)
    .eq("is_approved", true)
    .order("created_at", { ascending: false });
  return (data ?? []).map((r) => ({
    id: r.id,
    rating: r.rating,
    title: r.title,
    body: r.body,
    author: "Verified customer",
    verified: r.is_verified_purchase,
    date: r.created_at,
  }));
}

export async function getProductByMirrorSizeSku(locale: string, msSku: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select(PRODUCT_SELECT)
    .ilike("mirror_size_product_id", msSku.trim())
    .eq("is_active", true)
    .order("type", { ascending: true }) // prefer 'configurable' over 'standard'
    .limit(1);
  return data?.[0] ? mapProduct(data[0], locale) : null;
}

export async function getProductById(locale: string, id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select(PRODUCT_SELECT).eq("id", id).eq("is_active", true).maybeSingle();
  return data ? mapProduct(data, locale) : null;
}
