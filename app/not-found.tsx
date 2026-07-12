import Link from 'next/link'
import { SearchBar } from '@/app/components/SearchBar'

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-4 sm:px-5 py-16 text-center space-y-5">
      <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
        <svg className="w-7 h-7" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="space-y-2">
        <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-[#717786]">Error 404</p>
        <h1 className="text-[22px] font-bold text-[#1a1b1f]">Esta página no existe</h1>
        <p className="text-[14px] text-[#414755] leading-relaxed">
          Puede que el enlace esté mal escrito o que la página se haya movido. Busca tu
          medicamento aquí mismo y sigue comparando precios.
        </p>
      </div>
      <div className="text-left">
        <SearchBar />
      </div>
      <Link
        href="/"
        className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-[13px] font-semibold vitality-gradient text-white hover:opacity-90 transition-opacity"
      >
        Volver al inicio
      </Link>
    </div>
  )
}
