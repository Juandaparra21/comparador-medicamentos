'use client'

import Link from 'next/link'

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="mx-auto max-w-xl px-4 sm:px-5 py-16 text-center space-y-5">
      <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
        <svg className="w-7 h-7" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 6a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 6zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <div className="space-y-2">
        <h1 className="text-[22px] font-bold text-[#1a1b1f]">Algo salió mal</h1>
        <p className="text-[14px] text-[#414755] leading-relaxed">
          Tuvimos un problema cargando esta página. No es tu culpa. Intenta de nuevo y, si
          sigue fallando, vuelve al inicio.
        </p>
      </div>
      <div className="flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => reset()}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-[13px] font-semibold vitality-gradient text-white hover:opacity-90 transition-opacity cursor-pointer"
        >
          Reintentar
        </button>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-[13px] font-semibold text-primary bg-primary/10 hover:bg-primary/15 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
