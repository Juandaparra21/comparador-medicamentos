import type { Metadata } from 'next'
import { Hanken_Grotesk } from 'next/font/google'
import Link from 'next/link'
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
        {/* Ambient mesh background — Level 0 */}
        <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
          <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full bg-secondary/15 blur-[100px]" />
          <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-tertiary/10 blur-[80px]" />
        </div>

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
              <Link
                href="/login"
                className="hidden sm:flex items-center gap-1.5 text-[12px] font-semibold text-[#414755] hover:text-primary transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                Ingresar
              </Link>
              <Link
                href="/register"
                className="text-[12px] font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary to-tertiary text-white hover:opacity-90 transition-opacity whitespace-nowrap"
              >
                Crear cuenta
              </Link>
              <WishlistNav />
            </div>
          </div>
        </header>

        <main className="flex-1">
          {children}
        </main>

        <footer className="border-t border-[#c1c6d7]/30 py-5 sm:py-6 text-center text-[12px] text-[#717786] px-4">
          Precios consultados directamente de las farmacias. Sujetos a cambios.
        </footer>
      </body>
    </html>
  )
}
