import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Información no disponible | Farmi',
  robots: { index: false, follow: false },
}

export default function InfoNoDisponiblePage() {
  return (
    <div className="mx-auto max-w-xl px-4 sm:px-5 py-16 text-center space-y-4">
      <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
        <svg className="w-7 h-7" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M18 10A8 8 0 112 10a8 8 0 0116 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9zm1-4a1.25 1.25 0 100 2.5A1.25 1.25 0 0010 5z" clipRule="evenodd" />
        </svg>
      </div>
      <h1 className="text-[22px] font-bold text-[#1a1b1f]">Todavía no tenemos información de este medicamento</h1>
      <p className="text-[14px] text-[#414755] leading-relaxed">
        Estamos ampliando poco a poco la ficha informativa de cada medicamento. Por ahora puedes
        seguir comparando su precio en tiempo real desde el buscador, aunque aún no tengamos la
        página con los detalles.
      </p>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-[13px] font-semibold vitality-gradient text-white hover:opacity-90 transition-opacity"
      >
        Volver al buscador
      </Link>
    </div>
  )
}
