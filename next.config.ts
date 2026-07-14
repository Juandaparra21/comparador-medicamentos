import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ffmpeg-static no debe empaquetarse (el bundler rompe la ruta al binario);
  // se resuelve en node_modules en tiempo de ejecucion, y el rastreo de
  // archivos lo copia dentro de la funcion del cron que genera el video.
  serverExternalPackages: ['ffmpeg-static'],
  outputFileTracingIncludes: {
    '/api/cron/ig-story': ['./node_modules/ffmpeg-static/**'],
  },

  // La ficha informativa /medicamento/[slug] se consolido en la pagina de precios.
  // Redirigimos de forma permanente (308) para que el usuario llegue directo a la
  // comparacion y para traspasar el valor SEO ya ganado a /precio/[slug].
  async redirects() {
    return [
      {
        source: '/medicamento/:slug',
        destination: '/precio/:slug',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
