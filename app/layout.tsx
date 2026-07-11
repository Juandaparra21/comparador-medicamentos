import type { Metadata } from 'next'
import { Hanken_Grotesk } from 'next/font/google'
import Link from 'next/link'
import { AuthProvider } from '@/app/context/AuthContext'
import { LanguageProvider } from '@/app/i18n/LanguageProvider'
import { NavAuth } from '@/app/components/NavAuth'
import { WishlistNav } from '@/app/components/WishlistNav'
import { CartNav } from '@/app/components/CartNav'
import { CercanasNavLink } from '@/app/components/CercanasNavLink'
import { SiteFooter } from '@/app/components/SiteFooter'
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
        <LanguageProvider>
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
                <CercanasNavLink />
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

          <SiteFooter />
        </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  )
}
