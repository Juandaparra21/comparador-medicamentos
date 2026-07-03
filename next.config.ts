import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
