import type { Metadata } from 'next'
import { Hanken_Grotesk } from 'next/font/google'
import Link from 'next/link'
import { AuthProvider } from '@/app/context/AuthContext'
import { LanguageProvider } from '@/app/i18n/LanguageProvider'
import { NavAuth } from '@/app/components/NavAuth'
import { WishlistNav } from '@/app/components/WishlistNav'
import { CartNav } from '@/app/components/CartNav'
import { CercanasNavLink } from '@/app/components/CercanasNavLink'
import { UserOptionsMenu } from '@/app/components/UserOptionsMenu'
import { BottomNav } from '@/app/components/BottomNav'
import { SiteFooter } from '@/app/components/SiteFooter'
import { ChatAssistant } from '@/app/components/ChatAssistant'
import { Analytics } from '@vercel/analytics/next'
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
        sameAs: [
          'https://www.instagram.com/farmi_col/',
          'https://www.facebook.com/profile.php?id=61591334621058',
          'https://www.tiktok.com/@farmi_col',
        ],
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
    <html lang="es" className={`${hanken.variable} h-full`} suppressHydrationWarning>
      <body className="min-h-full flex flex-col relative bg-[#faf9fe]">
        {/* Tema (claro/noche): se aplica ANTES del primer pintado para que no
           haya parpadeo. Prioridad: ?theme=dark|light en la URL (solo para
           esa carga, util para probar) > eleccion manual guardada en
           localStorage (farmi_theme) > preferencia del sistema operativo
           (prefers-color-scheme). Sin eleccion manual, sigue al dispositivo. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var p=new URLSearchParams(location.search).get('theme');var t=p||localStorage.getItem('farmi_theme');if(!t){t=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light'}if(t==='dark'){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {/* Fondo mesh + luces ambientales del sistema Luminous Health.
           Fijos y detras de todo el sitio; las tarjetas de vidrio los
           difuminan con su backdrop-filter. */}
        <div aria-hidden="true" className="mesh-bg" />
        <div aria-hidden="true" className="ambient-glow bg-primary -top-40 -left-20" />
        <div aria-hidden="true" className="ambient-glow bg-tertiary top-[40%] -right-32" />
        <div aria-hidden="true" className="ambient-glow bg-secondary -bottom-32 left-[20%]" />
        <LanguageProvider>
        <AuthProvider>
          {/* Header */}
          <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-white/30 shadow-sm">
            <div className="mx-auto px-4 sm:px-5 max-w-5xl h-14 flex items-center justify-between gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 select-none hover:opacity-75 transition-opacity shrink-0"
                aria-label="Farmi - Inicio"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/farmi_mark.png" alt="" width={26} height={31} className="h-[30px] w-auto" />
                <span className="font-bold text-[18px] tracking-tight brand-gradient-text">
                  Farmi
                </span>
              </Link>

              <nav aria-label="Navegación principal" className="flex items-center gap-2 sm:gap-2.5">
                <UserOptionsMenu />
                <CercanasNavLink />
                <NavAuth />
                <div className="hidden md:flex items-center gap-2 sm:gap-2.5">
                  <CartNav />
                  <WishlistNav />
                </div>
              </nav>
            </div>
          </header>

          <main className="flex-1 pb-20 md:pb-0" id="main-content">
            {children}
          </main>

          <ChatAssistant />

          <SiteFooter />
          <BottomNav />
        </AuthProvider>
        </LanguageProvider>
        {/* Analitica anonima de Vercel (visitas + eventos como outbound_click).
           No usa cookies ni guarda datos personales. */}
        <Analytics />
      </body>
    </html>
  )
}
