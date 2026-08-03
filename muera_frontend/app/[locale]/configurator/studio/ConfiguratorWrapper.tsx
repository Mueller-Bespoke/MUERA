"use client";

import { useState } from "react";
import MirrorsizeConfigurator from "@/components/MirrorsizeConfigurator";

export default function ConfiguratorWrapper({
  merchantId,
  apiKey,
  skus,
  locale
}: {
  merchantId: string;
  apiKey: string;
  skus: { shirt: string; suit2p: string; suit3p: string };
  locale: string;
}) {
  const [selectedSku, setSelectedSku] = useState<string | null>(null);

  if (!selectedSku) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 50,
        backgroundColor: 'rgba(26, 22, 40, 0.4)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '1rem'
      }}>
        <div style={{
          backgroundColor: 'var(--color-off-white)',
          padding: '4rem 3rem',
          maxWidth: '500px',
          width: '100%',
          textAlign: 'center',
          border: '1px solid var(--color-light-gray)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
        }}>
          <p className="section-label">Configurator Studio</p>
          <h2 className="section-title">Select a Garment</h2>
          <p style={{ marginBottom: '2.5rem', color: 'var(--color-mid-gray)' }}>
            Choose the garment you would like to customize in the 3D studio.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button 
              onClick={() => setSelectedSku(skus.shirt)}
              className="btn btn--outline-dark"
              style={{ justifyContent: 'center', width: '100%' }}
            >
              Dress Shirt
            </button>
            <button 
              onClick={() => setSelectedSku(skus.suit2p)}
              className="btn btn--outline-dark"
              style={{ justifyContent: 'center', width: '100%' }}
            >
              2 Piece Suit
            </button>
            <button 
              onClick={() => setSelectedSku(skus.suit3p)}
              className="btn btn--outline-dark"
              style={{ justifyContent: 'center', width: '100%' }}
            >
              3 Piece Suit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <MirrorsizeConfigurator
      merchantId={merchantId}
      apiKey={apiKey}
      sku={selectedSku}
      language={locale}
    />
  );
}
