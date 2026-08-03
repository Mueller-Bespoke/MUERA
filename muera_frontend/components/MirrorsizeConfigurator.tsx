"use client";

import { useEffect, useRef, useState } from "react";
import Script from "next/script";

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
    if (typeof window !== "undefined" && typeof (window as any).msConfigurator !== "undefined") {
      setIsScriptLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (isScriptLoaded && !configuratorInitialized.current && typeof window !== "undefined") {
      // @ts-ignore
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
        console.log("Initializing Mirrorsize Configurator with:", config);
        
        // Ensure the container exists before initializing
        const container = document.getElementById("ms-configurator-container");
        if (container) {
          // @ts-ignore
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
    <div className="ms-configurator-wrapper" style={{ width: "100%", height: "100vh", position: "relative" }}>
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
