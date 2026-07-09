import type { Metadata } from 'next'
import { Hanken_Grotesk } from 'next/font/google'
import Link from 'next/link'
import { AuthProvider } from '@/app/context/AuthContext'
import { NavAuth } from '@/app/components/NavAuth'
import { WishlistNav } from '@/app/components/WishlistNav'
import { CartNav } from '@/app/components/CartNav'
import { ChatAssistant } from '@/app/components/ChatAssistant'
import { SITE_URL } from '@/app/lib/siteUrl'
import './globals.css'

const hanken = Hanken_Grotesk({
  variable: '--font-hanken',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Farmi - Comparador de medicamentos en Colombia',
    template: '%s | Farmi',
  },
  description:
    'Compara precios de medicamentos en las principales farmacias de Colombia: La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam y más. Genéricos y marcas.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    siteName: 'Farmi',
    title: 'Farmi - Comparador de medicamentos en Colombia',
    description:
      'Encuentra el mejor precio en medicamentos en las farmacias de Colombia. Gratis, sin registro y en tiempo real.',
    url: SITE_URL,
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Farmi - Comparador de medicamentos en Colombia',
    description:
      'Compara precios de medicamentos en La Rebaja, Cruz Verde, Colsubsidio, Farmatodo y más.',
  },
  robots: {
    index: true,
    follow: true,
  },
  // Verificación de motores de búsqueda. Pega el token que te da cada herramienta
  // como variable de entorno en Vercel (GOOGLE_SITE_VERIFICATION / BING_SITE_VERIFICATION)
  // y se inserta la etiqueta <meta> automáticamente. Si no están, no se renderiza nada.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
    other: process.env.BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION }
      : {},
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Site-wide structured data: Organization (brand entity) + WebSite with a
  // search action so Google can show a sitelinks search box.
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        name: 'Farmi',
        url: SITE_URL,
        logo: `${SITE_URL}/farmi_logo.png`,
        description: 'Comparador gratuito de precios de medicamentos en Colombia.',
      },
      {
        '@type': 'WebSite',
        name: 'Farmi',
        url: SITE_URL,
        inLanguage: 'es-CO',
        potentialAction: {
          '@type': 'SearchAction',
          target: `${SITE_URL}/buscar?q={search_term_string}`,
          'query-input': 'required name=search_term_string',
        },
      },
    ],
  }

  return (
    <html lang="es" className={`${hanken.variable} h-full`}>
      <body className="min-h-full flex flex-col relative bg-[#fbfbfd]">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <AuthProvider>
          {/* Header */}
          <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
            <div className="mx-auto px-4 sm:px-5 max-w-5xl h-14 flex items-center justify-between gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 select-none hover:opacity-75 transition-opacity shrink-0"
                aria-label="Farmi - Inicio"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/farmi_mark.png" alt="" width={26} height={31} className="h-[30px] w-auto" />
                <span className="font-bold text-[17px] tracking-tight">
                  <span className="text-[#1a1b1f]">Far</span>
                  <span className="text-primary">mi</span>
                </span>
              </Link>

              <nav aria-label="Navegación principal" className="flex items-center gap-2 sm:gap-2.5">
                <Link
                  href="/cercanas"
                  className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 hover:bg-secondary/15 transition-colors"
                >
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                  </svg>
                  <span className="text-[12px] font-bold whitespace-nowrap">
                    <span className="hidden md:inline">¡Busca tu droguería más cercana!</span>
                    <span className="md:hidden">Cercanas</span>
                  </span>
                </Link>
                <NavAuth />
                <CartNav />
                <WishlistNav />
              </nav>
            </div>
          </header>

          <main className="flex-1" id="main-content">
            {children}
          </main>

          <ChatAssistant />

          {/* Footer */}
          <footer className="border-t border-[#c1c6d7]/30 py-8 px-4" aria-label="Pie de página">
            <div className="mx-auto max-w-5xl">
              {/* Top row: brand + nav links */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
                <div>
                  <p className="font-bold text-[16px] tracking-tight">
                    <span className="text-[#1a1b1f]">Far</span>
                    <span className="text-primary">mi</span>
                  </p>
                  <p className="text-[12px] text-[#717786] mt-1">
                    Comparador gratuito de precios de medicamentos en Colombia.
                  </p>
                </div>

                <nav aria-label="Enlaces del pie de página" className="flex flex-wrap gap-x-5 gap-y-2 text-[12px]">
                  <Link href="/sobre-nosotros" className="text-[#717786] hover:text-primary transition-colors font-medium">
                    Sobre nosotros
                  </Link>
                  <Link href="/contacto" className="text-[#717786] hover:text-primary transition-colors font-medium">
                    Contacto
                  </Link>
                  <Link href="/terminos" className="text-[#717786] hover:text-primary transition-colors font-medium">
                    Condiciones
                  </Link>
                  <Link href="/privacidad" className="text-[#717786] hover:text-primary transition-colors font-medium">
                    Privacidad
                  </Link>
                </nav>
              </div>

              {/* Disclaimer */}
              <div className="border-t border-[#c1c6d7]/30 pt-5">
                <p className="text-[11px] text-[#717786] leading-relaxed">
                  <strong className="text-[#414755]">Aviso legal:</strong> Farmi es una plataforma de comparación de precios y no sustituye la asesoría médica o farmacéutica profesional. Los precios mostrados son referenciales, obtenidos de fuentes públicas, y pueden variar. Farmi no vende medicamentos ni interviene en ningún proceso de compra. Las marcas y logos de las farmacias pertenecen a sus respectivos titulares; Farmi es un comparador independiente y no está afiliado ni patrocinado por ellas. Conforme a la Ley 1581 de 2012 puedes ejercer tus derechos de Habeas Data escribiendo a farmicolombia@gmail.com.
                </p>
                <p className="text-[11px] text-[#c1c6d7] mt-3">
                  &copy; {new Date().getFullYear()} Farmi. Colombia.
                </p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
