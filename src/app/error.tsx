'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Collecteur d'erreur pour l'observabilité
    console.error('[Kenza App Error]:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    });
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#f7f5ef] text-[#15253b]">
      <div className="max-w-md w-full bg-[#fffefa] border border-[#e7e3d9] rounded-2xl p-8 shadow-sm text-center">
        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[#fceeed] flex items-center justify-center text-[#b65d4b] font-bold text-xl">
          !
        </div>
        <h1 className="text-xl font-bold font-serif mb-2">Une erreur inattendue est survenue</h1>
        <p className="text-sm text-[#6b7174] mb-6">
          Nous avons enregistré le problème. Vous pouvez recharger la page ou réessayer.
        </p>
        {error.digest && (
          <p className="text-[11px] font-mono text-[#6b7174] bg-[#f0eee8] py-1 px-2 rounded mb-6 inline-block">
            Code incident : {error.digest}
          </p>
        )}
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-[#315a7d] text-[#fffefa] font-medium text-sm hover:bg-[#254662] transition-colors"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl border border-[#e7e3d9] text-[#15253b] font-medium text-sm hover:bg-[#f0eee8] transition-colors"
          >
            Accueil
          </Link>
        </div>
      </div>
    </div>
  );
}
