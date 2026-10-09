import { getConfigurableProducts } from "@/lib/catalog";
import { mirrorSizeCredentials } from "@/lib/mirrorsize";
import { createClient } from "@/lib/supabase/server";
import ConfiguratorWrapper from "./ConfiguratorWrapper";

export const dynamic = "force-dynamic";

export default async function ConfiguratorStudioPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ product?: string }>;
}) {
  const { locale } = await params;
  const { product: preselect } = await searchParams;

  // MirrorSize's embed script requires merchantId + apiKey in the browser (vendor design).
  const { merchantId, apiKey } = mirrorSizeCredentials();
  const [products, { data: auth }] = await Promise.all([
    getConfigurableProducts(locale),
    (await createClient()).auth.getUser(),
  ]);

  const garments = products.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    price: p.price,
    image: p.images[0],
    msSku: p.mirrorSizeSku!,
  }));

  return (
    <main style={{ paddingTop: "80px", backgroundColor: "var(--color-off-white)" }}>
      <ConfiguratorWrapper
        merchantId={merchantId}
        apiKey={apiKey}
        garments={garments}
        initialSlug={preselect ?? null}
        userId={auth.user?.id ?? ""}
        locale={locale}
      />
    </main>
  );
}
