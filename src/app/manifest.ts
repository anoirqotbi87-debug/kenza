import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Kenza — Apprendre le Darija',
    short_name: 'Kenza',
    description: 'Plateforme interactive d\'apprentissage de la Darija',
    start_url: '/fr',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#FFFFFF',
    theme_color: '#0B2545',
    dir: 'auto',
    // `purpose` n'accepte qu'UNE valeur ici : le type `MetadataRoute.Manifest` de Next est plus
    // strict que la spec W3C, qui autorise « any maskable ». La valeur combinee est declaree
    // dans public/manifest.json, que Bubblewrap lit (webManifestUrl).
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
