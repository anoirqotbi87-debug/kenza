import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

import path from "path";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

// Origine Supabase : le navigateur parle directement à Supabase (auth, sync,
// suivi — via des composants client), donc `connect-src` doit l'autoriser. Elle
// est dérivée de l'env plutôt que codée en dur ; repli sur le domaine générique
// si la variable manque au build, pour ne pas casser l'auth silencieusement.
const supabaseOrigin = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? '').origin;
  } catch {
    return 'https://*.supabase.co';
  }
})();

const contentSecurityPolicy = [
  "default-src 'self'",
  // `'unsafe-inline'` reste requis : Next.js injecte des scripts inline pour
  // l'hydratation. `'unsafe-eval'` a été retiré : aucun `eval`/`new Function`
  // dans le code (vérifié), et le build de production n'en a pas besoin.
  "script-src 'self' 'unsafe-inline' https://js.stripe.com",
  "style-src 'self' 'unsafe-inline'",
  // Les polices sont auto-hébergées par `next/font/google` (servies depuis
  // `/_next/static/media/`) : les domaines Google sont donc inutiles.
  "font-src 'self'",
  // `https:` retiré : il autorisait l'envoi de données vers n'importe quel
  // domaine. Le logo Google est désormais hébergé localement.
  "img-src 'self' data: blob:",
  `connect-src 'self' ${supabaseOrigin}`,
  "object-src 'none'",
  "base-uri 'self'",
  "frame-ancestors 'none'",
  'frame-src \'self\' https://js.stripe.com https://hooks.stripe.com',
  'report-uri /api/csp-report',
].join('; ') + ';';

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains' },
  // `report-uri` seul, sans `report-to` : quand les deux sont présents, Chrome
  // donne la priorité à la Reporting API, qui regroupe les rapports et diffère
  // leur envoi (vérifié : aucune livraison en 90 s, contre une livraison
  // immédiate avec `report-uri` seul). Pour une fenêtre d'observation, la
  // livraison immédiate prime. `report-to` pourra être ajouté une fois la
  // collecte validée en production.
  { key: 'Content-Security-Policy-Report-Only', value: contentSecurityPolicy }
];

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.resolve(__dirname),
  turbopack: {
    root: path.resolve(__dirname),
  },
  // `msedge-tts` ouvre un WebSocket via `ws`. Bundlé, `ws` ne résout plus ses
  // dépendances natives optionnelles et échoue à l'exécution sur
  // `bufferutil.mask` (`b.mask is not a function`) : /api/tts ne répondait
  // jamais. On garde ces paquets hors du bundle serveur.
  serverExternalPackages: ['msedge-tts', 'ws'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default withSerwist(nextConfig);
