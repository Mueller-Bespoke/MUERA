"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";
import { rememberConfiguratorProduct } from "@/lib/mirrorsize-pending";

interface MirrorsizeConfiguratorProps {
  merchantId: string;
  apiKey: string;
  sku?: string;
  productId?: string;
  variantId?: string;
  language?: string;
  userId?: string;
  apiUrl?: string;
}

export default function MirrorsizeConfigurator({
  merchantId,
  apiKey,
  sku = "",
  productId = "",
  variantId = "",
  language = "en",
  userId = "",
  apiUrl = "",
}: MirrorsizeConfiguratorProps) {
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const configuratorInitialized = useRef(false);

  useEffect(() => {
    // If the script is already loaded globally but state isn't updated
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (typeof window !== "undefined" && typeof (window as any).msConfigurator !== "undefined") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isScriptLoaded && !configuratorInitialized.current && typeof window !== "undefined") {
      // @ts-expect-error - msConfigurator is added to window by the external script
      if (typeof window.msConfigurator !== "undefined") {
        if (!sku) {
          console.warn("MirrorsizeConfigurator: SKU is missing or empty!");
        }
        
        const config = {
          merchantId,
          apiKey,
          sku,
          productId,
          variantId,
          language,
          userId,
          apiUrl,
          mobile: false,
        };
        // Ensure the container exists before initializing
        const container = document.getElementById("ms-configurator-container");
        if (container) {
          if (productId) rememberConfiguratorProduct(productId, sku);
          // @ts-expect-error - msConfigurator is added to window by the external script
          new window.msConfigurator(config);
          configuratorInitialized.current = true;
        } else {
          console.error("MirrorsizeConfigurator: Container #ms-configurator-container not found in DOM");
        }
      } else {
        console.error("Mirrorsize configurator script not loaded properly.");
      }
    }
  }, [isScriptLoaded, merchantId, apiKey, sku, productId, variantId, language, userId, apiUrl]);

  return (
    <div
      className="ms-configurator-wrapper"
      // Fill the screen below the site header (80px) and the garment bar so the
      // configurator's own Back / Next / Submit bar is always visible.
      style={{ width: "100%", height: "calc(100dvh - 80px - 52px)", minHeight: 560, position: "relative" }}
    >
      <Script
        src="https://ms-configurator.s3.amazonaws.com/scripts/integration/3d-configurator.js"
        strategy="afterInteractive"
        onLoad={() => setIsScriptLoaded(true)}
      />
      <div 
        id="ms-configurator-container" 
        style={{ width: "100%", height: "100%", backgroundColor: "white" }}
      />
    </div>
  );
}
