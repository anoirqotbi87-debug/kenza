import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: any;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  disableDevLogs: true,
  runtimeCaching: (
    {
      matcher: /^\/api\/roleplay\//i,
      handler: "NetworkOnly" as any,
    },
    {
      matcher: ({ url }) => url.pathname.startsWith('/api/tts'),
      handler: "CacheFirst" as any,
      options: {
        cacheName: "kenza-tts-cache",
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 30 * 24 * 60 * 60, // 30 jours
        },
      },
    },
    {
      matcher: /\.(?:mp3|wav|ogg|m4a)$/i,
      handler: "CacheFirst" as any,
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
      handler: "CacheFirst" as any,
      options: {
        cacheName: "kenza-fonts-cache",
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 365 * 24 * 60 * 60, // 1 an
        },
      },
    },
    ...defaultCache,
  ] as any,
});

serwist.addEventListeners();


self.addEventListener('notificationclick', (event: any) => {
  // 1. Fermer immédiatement la notification du volet système
  event.notification.close();

  // 2. Extraire l'URL cible (avec fallback)
  const targetUrl = new URL(
    event.notification.data?.url || '/?tab=srs',
    self.location.origin
  ).href;

  // 3. Encadrer l'opération dans waitUntil
  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(async (windowClients: any[]) => {
        // Rechercher si un onglet/fenêtre de l'application est déjà ouvert
        for (const client of windowClients) {
          if (new URL(client.url).origin === self.location.origin) {
            // Si la fenêtre est déjà sur la bonne URL, simplement lui donner le focus
            if (client.url !== targetUrl && 'navigate' in client) {
              await client.navigate(targetUrl);
            }
            return client.focus();
          }
        }

        // Si aucune fenêtre n'est ouverte, lancer l'application en standalone
        if (self.clients.openWindow) {
          return self.clients.openWindow(targetUrl);
        }
      })
  );
});
