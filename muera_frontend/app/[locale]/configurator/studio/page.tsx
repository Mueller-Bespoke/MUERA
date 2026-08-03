import { getTranslations } from "next-intl/server";
import ConfiguratorWrapper from "./ConfiguratorWrapper";

export default async function ConfiguratorStudioPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "configuratorStudio" });

  const merchantId = process.env.merchant_id || "muellerbespoke@gmail.com";
  const apiKey = process.env.apiKey || "";

  const skus = {
    shirt: process.env.MS_SKU_SHIRT || "shirt12",
    suit2p: process.env.MS_SKU_2PIECE || "2psuit",
    suit3p: process.env.MS_SKU_3PIECE || "3psuit",
  };

  return (
    <main
      style={{ paddingTop: "80px", backgroundColor: "var(--color-off-white)" }}
    >
      <ConfiguratorWrapper
        merchantId={merchantId}
        apiKey={apiKey}
        skus={skus}
        locale={locale}
      />
    </main>
  );
}
