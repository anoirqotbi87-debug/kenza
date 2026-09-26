import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  disableDevLogs: true,
  runtimeCaching: [
    {
      matcher: /^\/api\/roleplay\//i,
      handler: "NetworkOnly",
    },
    {
      matcher: /\.(?:mp3|wav|ogg|m4a)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "kenza-audio-cache",
        expiration: {
          maxEntries: 250,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
        },
      },
    },
    {
      matcher: /\.(?:woff|woff2|eot|ttf|otf)$/i,
      handler: "CacheFirst",
      options: {
        cacheName: "kenza-fonts-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 an
        },
      },
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();
