import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

import path from "path";

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

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
};

export default withSerwist(nextConfig);
