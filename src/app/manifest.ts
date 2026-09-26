import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'KENZA - Apprendre la Darija Marocaine',
    short_name: 'KENZA',
    description: 'Plateforme interactive d\'apprentissage de la Darija',
    start_url: '/',
    display: 'standalone',
    background_color: '#0F172A',
    theme_color: '#F97316',
    dir: 'auto',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
