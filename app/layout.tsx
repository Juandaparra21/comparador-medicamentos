import type { Metadata } from 'next'
import { Hanken_Grotesk } from 'next/font/google'
import Link from 'next/link'
import { AuthProvider } from '@/app/context/AuthContext'
import { NavAuth } from '@/app/components/NavAuth'
import { WishlistNav } from '@/app/components/WishlistNav'
import { CartNav } from '@/app/components/CartNav'
import { MedDisclaimer } from '@/app/components/MedDisclaimer'
import './globals.css'

const hanken = Hanken_Grotesk({
  variable: '--font-hanken',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://medicompara.co'

export const metadata: Metadata = {
  title: {
    default: 'MediCompara - Comparador de medicamentos en Colombia',
    template: '%s | MediCompara',
  },
  description:
    'Compara precios de medicamentos en las principales farmacias de Colombia: La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam y mas. Genericos y marcas.',
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: 'website',
    siteName: 'MediCompara',
    title: 'MediCompara - Comparador de medicamentos en Colombia',
    description:
      'Encuentra el mejor precio en medicamentos en las farmacias de Colombia. Gratis, sin registro y en tiempo real.',
    url: SITE_URL,
    locale: 'es_CO',
  },
  twitter: {
    card: 'summary',
    title: 'MediCompara - Comparador de medicamentos en Colombia',
    description:
      'Compara precios de medicamentos en La Rebaja, Cruz Verde, Colsubsidio, Farmatodo y mas.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${hanken.variable} h-full`}>
      <body className="min-h-full flex flex-col relative">
        {/* Ambient mesh background */}
        <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-secondary/15 blur-[100px]" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-tertiary/10 blur-[80px]" />
        </div>

        <AuthProvider>
          {/* Medical disclaimer — dismissible, shown once per browser */}
          <MedDisclaimer />

          {/* Header */}
          <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
            <div className="mx-auto px-4 sm:px-5 max-w-5xl h-14 flex items-center justify-between gap-4">
              <Link
                href="/"
                className="font-bold text-[17px] tracking-tight select-none hover:opacity-75 transition-opacity shrink-0"
                aria-label="MediCompara - Inicio"
              >
                <span className="text-[#1a1b1f]">Medi</span>
                <span className="text-primary">Compara</span>
              </Link>

              <nav aria-label="Navegacion principal" className="flex items-center gap-3">
                <span className="text-[11px] sm:text-[12px] font-semibold tracking-[0.05em] uppercase text-[#717786] hidden sm:block">
                  Farmacias de Colombia
                </span>
                <NavAuth />
                <CartNav />
                <WishlistNav />
              </nav>
            </div>
          </header>

          <main className="flex-1" id="main-content">
            {children}
          </main>

          {/* Footer */}
          <footer className="border-t border-[#c1c6d7]/30 py-8 px-4" aria-label="Pie de pagina">
            <div className="mx-auto max-w-5xl">
              {/* Top row: brand + nav links */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
                <div>
                  <p className="font-bold text-[16px] tracking-tight">
                    <span className="text-[#1a1b1f]">Medi</span>
                    <span className="text-primary">Compara</span>
                  </p>
                  <p className="text-[12px] text-[#717786] mt-1">
                    Comparador gratuito de precios de medicamentos en Colombia.
                  </p>
                </div>

                <nav aria-label="Enlaces del pie de pagina" className="flex flex-wrap gap-x-5 gap-y-2 text-[12px]">
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
                  <strong className="text-[#414755]">Aviso legal:</strong> MediCompara es una plataforma de comparacion de precios y no sustituye la asesoria medica o farmaceutica profesional. Los precios mostrados son referenciales, obtenidos de fuentes publicas, y pueden variar. MediCompara no vende medicamentos ni interviene en ningun proceso de compra. Conforme a la Ley 1581 de 2012 puedes ejercer tus derechos de Habeas Data escribiendo a contacto@medicompara.co.
                </p>
                <p className="text-[11px] text-[#c1c6d7] mt-3">
                  &copy; {new Date().getFullYear()} MediCompara. Colombia.
                </p>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
