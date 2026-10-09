import { getTranslations } from "next-intl/server";
import { getCategories, getProducts } from "@/lib/catalog";
import ShopClient from "./ShopClient";

export const dynamic = "force-dynamic";

export default async function ShopPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [products, categories, t] = await Promise.all([
    getProducts(locale),
    getCategories(locale),
    getTranslations({ locale, namespace: "shop" }),
  ]);
  return <ShopClient products={products} categories={categories} allLabel={t.has("all") ? t("all") : "All"} />;
}
