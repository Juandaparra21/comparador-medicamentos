import type { Metadata } from 'next'
import { Hanken_Grotesk } from 'next/font/google'
import Link from 'next/link'
import { AuthProvider } from '@/app/context/AuthContext'
import { NavAuth } from '@/app/components/NavAuth'
import { WishlistNav } from '@/app/components/WishlistNav'
import './globals.css'

const hanken = Hanken_Grotesk({
  variable: '--font-hanken',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MediCompara - Comparador de medicamentos en Colombia',
  description:
    'Compara precios de medicamentos en las principales farmacias de Colombia. Genericos y marcas.',
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
          {/* Header */}
          <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
            <div className="mx-auto px-4 sm:px-5 max-w-5xl h-14 flex items-center justify-between gap-4">
              <Link
                href="/"
                className="font-bold text-[17px] tracking-tight select-none hover:opacity-75 transition-opacity shrink-0"
              >
                <span className="text-[#1a1b1f]">Medi</span>
                <span className="text-primary">Compara</span>
              </Link>

              <div className="flex items-center gap-3">
                <span className="text-[11px] sm:text-[12px] font-semibold tracking-[0.05em] uppercase text-[#717786] hidden sm:block">
                  Farmacias de Colombia
                </span>
                <NavAuth />
                <WishlistNav />
              </div>
            </div>
          </header>

          <main className="flex-1">
            {children}
          </main>

          <footer className="border-t border-[#c1c6d7]/30 py-5 sm:py-6 px-4">
            <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-3 text-[12px] text-[#717786]">
              <p>Precios consultados directamente de las farmacias. Sujetos a cambios.</p>
              <div className="flex items-center gap-4">
                <Link href="/terminos" className="hover:text-primary transition-colors font-medium">
                  Condiciones del sitio
                </Link>
                <span className="text-[#c1c6d7]">&bull;</span>
                <span>MediCompara no vende medicamentos</span>
              </div>
            </div>
          </footer>
        </AuthProvider>
      </body>
    </html>
  )
}
