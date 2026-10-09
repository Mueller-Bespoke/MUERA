import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProductBySlug, getProductReviews, getRelatedProducts } from "@/lib/catalog";
import ProductClient from "./ProductClient";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ locale: string; slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const found = await getProductBySlug(locale, slug);
  if (!found) return {};
  const { product, metaTitle, metaDescription } = found;
  return {
    title: metaTitle ?? product.name,
    description: metaDescription ?? product.tagline ?? product.description.slice(0, 160),
    openGraph: { images: product.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params;
  const found = await getProductBySlug(locale, slug);
  if (!found) notFound();

  const [related, reviews] = await Promise.all([
    getRelatedProducts(locale, found.product, 3),
    getProductReviews(found.product.id),
  ]);
  return <ProductClient product={found.product} related={related} reviews={reviews} />;
}
