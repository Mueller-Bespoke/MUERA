import MirrorsizeConfigurator from "@/components/MirrorsizeConfigurator";
import { getTranslations } from "next-intl/server";

export default async function ConfiguratorStudioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "configuratorStudio" });

  const merchantId = process.env.merchant_id || "muellerbespoke@gmail.com";
  const apiKey = process.env.apiKey || "";
  const sku = process.env.MS_SKU || "test";

  return (
    <main
      style={{ paddingTop: "80px", backgroundColor: "var(--color-off-white)" }}
    >
      <MirrorsizeConfigurator
        merchantId={merchantId}
        apiKey={apiKey}
        sku={sku}
        language={locale}
      />
    </main>
  );
}
