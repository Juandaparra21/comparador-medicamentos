import type { Metadata } from 'next'
import { Hanken_Grotesk } from 'next/font/google'
import Link from 'next/link'
import { AuthProvider } from '@/app/context/AuthContext'
import { NavAuth } from '@/app/components/NavAuth'
import { WishlistNav } from '@/app/components/WishlistNav'
import { CartNav } from '@/app/components/CartNav'
import { MedDisclaimer } from '@/app/components/MedDisclaimer'
import { ChatAssistant } from '@/app/components/ChatAssistant'
import './globals.css'

const hanken = Hanken_Grotesk({
  variable: '--font-hanken',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://farmi.co'

export const metadata: Metadata = {
  title: {
    default: 'Farmi - Comparador de medicamentos en Colombia',
    template: '%s | Farmi',
  },
  description:
    'Compara precios de medicamentos en las principales farmacias de Colombia: La Rebaja, Cruz Verde, Colsubsidio, Farmatodo, Cafam y mas. Genericos y marcas.',
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
    card: 'summary',
    title: 'Farmi - Comparador de medicamentos en Colombia',
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
        {/* Ambient background — static gradients (no blur filter) so mobile GPUs
            don't recomposite large blurred layers on every scroll frame. */}
        <div
          className="fixed inset-0 -z-10"
          aria-hidden="true"
          style={{
            background:
              'radial-gradient(55% 45% at 12% -5%, rgba(0,88,188,0.13), transparent 70%),' +
              'radial-gradient(50% 45% at 105% 105%, rgba(0,110,40,0.11), transparent 70%),' +
              'radial-gradient(40% 40% at 78% 50%, rgba(76,74,202,0.07), transparent 72%)',
          }}
        />

        <AuthProvider>
          {/* Medical disclaimer — dismissible, shown once per browser */}
          <MedDisclaimer />

          {/* Header */}
          <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
            <div className="mx-auto px-4 sm:px-5 max-w-5xl h-14 flex items-center justify-between gap-4">
              <Link
                href="/"
                className="font-bold text-[17px] tracking-tight select-none hover:opacity-75 transition-opacity shrink-0"
                aria-label="Farmi - Inicio"
              >
                <span className="text-[#1a1b1f]">Farmi</span>
                <span className="text-primary">Ya</span>
              </Link>

              <nav aria-label="Navegacion principal" className="flex items-center gap-3">
                <Link
                  href="/cercanas"
                  className="flex items-center gap-1.5 text-[12px] font-semibold text-[#717786] hover:text-primary transition-colors"
                >
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z" clipRule="evenodd" />
                  </svg>
                  <span className="hidden sm:inline">Cercanas</span>
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
          <footer className="border-t border-[#c1c6d7]/30 py-8 px-4" aria-label="Pie de pagina">
            <div className="mx-auto max-w-5xl">
              {/* Top row: brand + nav links */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-6">
                <div>
                  <p className="font-bold text-[16px] tracking-tight">
                    <span className="text-[#1a1b1f]">Farmi</span>
                    <span className="text-primary">Ya</span>
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
                  <strong className="text-[#414755]">Aviso legal:</strong> Farmi es una plataforma de comparacion de precios y no sustituye la asesoria medica o farmaceutica profesional. Los precios mostrados son referenciales, obtenidos de fuentes publicas, y pueden variar. Farmi no vende medicamentos ni interviene en ningun proceso de compra. Las marcas y logos de las farmacias pertenecen a sus respectivos titulares; Farmi es un comparador independiente y no esta afiliado ni patrocinado por ellas. Conforme a la Ley 1581 de 2012 puedes ejercer tus derechos de Habeas Data escribiendo a farmiya001@gmail.com.
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
