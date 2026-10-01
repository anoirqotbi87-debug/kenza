import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

import path from "path";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

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
  { key: 'Content-Security-Policy-Report-Only', value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' wss: https:; frame-src 'self' https://js.stripe.com https://hooks.stripe.com; report-uri /api/csp-report;" }
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
