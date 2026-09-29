/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist, CacheFirst, NetworkOnly, ExpirationPlugin } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope & SerwistGlobalConfig;

const DAY = 24 * 60 * 60;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  disableDevLogs: true,
  runtimeCaching: [
    {
      matcher: /^\/api\/roleplay\//i,
      handler: new NetworkOnly(),
    },
    {
      matcher: ({ url }: { url: URL }) => url.pathname.startsWith('/api/tts'),
      handler: new CacheFirst({
        cacheName: "kenza-v2-tts-cache",
        plugins: [new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 30 * DAY })],
      }),
    },
    {
      matcher: /\.(?:mp3|wav|ogg|m4a)$/i,
      handler: new CacheFirst({
        cacheName: "kenza-v2-audio-cache",
        plugins: [new ExpirationPlugin({ maxEntries: 250, maxAgeSeconds: 30 * DAY })],
      }),
    },
    {
      matcher: /\.(?:woff|woff2|eot|ttf|otf)$/i,
      handler: new CacheFirst({
        cacheName: "kenza-v2-fonts-cache",
        plugins: [new ExpirationPlugin({ maxEntries: 50, maxAgeSeconds: 365 * DAY })],
      }),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();

self.addEventListener('activate', (event: ExtendableEvent) => {
  event.waitUntil(
    caches.keys().then((cacheNames: string[]) => {
      return Promise.all(
        cacheNames
          .filter((name) => !name.startsWith('kenza-v2-') && !name.includes('precache'))
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
