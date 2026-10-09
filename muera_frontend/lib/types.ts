export type ProductCategory = string; // category slug, e.g. "suits"

export interface ProductVariant {
  color: string;
  colorHex: string;
  images: string[];
  stock: number;
  /** stock per size for this colour */
  sizeStock: Record<string, number>;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  price: number;
  comparePrice?: number;
  category: ProductCategory;
  categoryName: string;
  badge?: string;
  type: "standard" | "configurable";
  /** whether "Customize with 3D" is available (has a MirrorSize SKU) */
  hasConfigurator: boolean;
  mirrorSizeSku?: string;
  description: string;
  details: string[];
  fabricInfo?: string;
  sizes: string[];
  variants: ProductVariant[];
  images: string[];
  careInstructions?: string[];
  deliveryTime: string;
  sku: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
  readTime: string;
  metaTitle?: string;
  metaDescription?: string;
}
