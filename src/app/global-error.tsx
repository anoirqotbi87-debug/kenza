'use client';

import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Kenza Global Root Error]:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  return (
    <html lang="fr">
      <body style={{ margin: 0, fontFamily: 'sans-serif', background: '#f7f5ef', color: '#15253b' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ maxWidth: '420px', width: '100%', background: '#fffefa', border: '1px solid #e7e3d9', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
            <h1 style={{ fontSize: '20px', marginBottom: '8px' }}>Incident technique</h1>
            <p style={{ fontSize: '14px', color: '#6b7174', marginBottom: '24px' }}>
              Une erreur critique a empêché l&apos;affichage de la page.
            </p>
            <button
              onClick={() => reset()}
              style={{ padding: '10px 20px', borderRadius: '12px', background: '#315a7d', color: '#fffefa', border: 'none', cursor: 'pointer', fontWeight: 600 }}
            >
              Recharger
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
