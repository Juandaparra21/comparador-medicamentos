import type { MetadataRoute } from 'next'

// Manifest PWA: habilita "Agregar a pantalla de inicio" en Android (80%+ del
// trafico). Sin service worker por ahora; el manifest solo ya permite instalar.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Farmi - Comparador de medicamentos en Colombia',
    short_name: 'Farmi',
    description:
      'Compara precios de medicamentos en las principales farmacias de Colombia. Gratis y en tiempo real.',
    start_url: '/',
    display: 'standalone',
    lang: 'es-CO',
    background_color: '#faf9fe',
    theme_color: '#0058bc',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
