/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, CacheFirst, NetworkOnly, ExpirationPlugin, RangeRequestsPlugin } from "serwist";
import { OFFLINE_FALLBACK_ROUTE } from "@/lib/offline/routes";
import {
  SW_CACHE_LIMITS,
  SW_CACHE_NAMES,
  getActiveOwnCacheNames,
  getPrecacheRevision,
  isAudioAsset,
  isDocumentRequest,
  isFontAsset,
  isRoleplayApiRequest,
  isTtsApiRequest,
  shouldDeleteCache,
} from "@/lib/offline/swPolicy";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope & SerwistGlobalConfig;

const manifest = self.__SW_MANIFEST ?? [];

/**
 * `révision` du précache dérivée du manifeste de build : la page de repli est
 * re-téléchargée à chaque déploiement, jamais servie avec des chunks périmés.
 */
const precacheEntries: (PrecacheEntry | string)[] = [
  ...manifest,
  { url: OFFLINE_FALLBACK_ROUTE, revision: getPrecacheRevision(manifest) },
];

const serwist = new Serwist({
  precacheEntries,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  disableDevLogs: true,
  // Une navigation non mise en cache retombe sur /offline (précachée).
  fallbacks: {
    entries: [
      {
        url: OFFLINE_FALLBACK_ROUTE,
        matcher: (options) => isDocumentRequest(options.request),
      },
    ],
  },
  runtimeCaching: [
    {
      // Le roleplay IA dépend du serveur (quota, personas) : jamais de réponse
      // en cache. Le prédicat teste le `pathname`, un motif ancré sur
      // `/api/...` ne matcherait jamais une URL absolue.
      matcher: ({ url }) => isRoleplayApiRequest(url),
      handler: new NetworkOnly(),
    },
    {
      matcher: ({ url }) => isTtsApiRequest(url),
      handler: new CacheFirst({
        cacheName: SW_CACHE_NAMES.tts,
        plugins: [
          new ExpirationPlugin({
            maxEntries: SW_CACHE_LIMITS.tts.maxEntries,
            maxAgeSeconds: SW_CACHE_LIMITS.tts.maxAgeSeconds,
          }),
        ],
      }),
    },
    {
      // `RangeRequestsPlugin` est requis : sans lui, une requête `Range` d'un
      // `<audio>` reçoit la réponse complète en 200 et la lecture/le déplacement
      // dans la piste se figent sur les fichiers servis depuis le cache.
      matcher: ({ url }) => isAudioAsset(url),
      handler: new CacheFirst({
        cacheName: SW_CACHE_NAMES.audio,
        plugins: [
          new ExpirationPlugin({
            maxEntries: SW_CACHE_LIMITS.audio.maxEntries,
            maxAgeSeconds: SW_CACHE_LIMITS.audio.maxAgeSeconds,
          }),
          new RangeRequestsPlugin(),
        ],
      }),
    },
    {
      matcher: ({ url }) => isFontAsset(url),
      handler: new CacheFirst({
        cacheName: SW_CACHE_NAMES.fonts,
        plugins: [
          new ExpirationPlugin({
            maxEntries: SW_CACHE_LIMITS.fonts.maxEntries,
            maxAgeSeconds: SW_CACHE_LIMITS.fonts.maxAgeSeconds,
          }),
        ],
      }),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();

/**
 * Ne purge que les caches possédés par Kenza d'une version antérieure. Les
 * caches Serwist (`pages`, `others`, assets…) portent le mode hors-ligne :
 * les effacer à chaque activation vidait le cache de navigation.
 */
self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames: string[]) => {
      const active = getActiveOwnCacheNames();
      return Promise.all(
        cacheNames
          .filter((name) => shouldDeleteCache(name, active))
          .map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url || '/?tab=srs',
    self.location.origin
  ).href;

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(async (clients) => {
        const windowClients = clients as WindowClient[];
        for (const client of windowClients) {
          if (new URL(client.url).origin === self.location.origin) {
            if (client.url !== targetUrl && 'navigate' in client) {
              await client.navigate(targetUrl);
            }
            return client.focus();
          }
        }

        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});
