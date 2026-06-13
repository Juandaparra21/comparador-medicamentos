import { Suspense } from 'react'
import BuscarClient from './BuscarClient'

export const metadata = {
  title: 'Resultados - MediCompara',
}

function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4 text-[#717786]">
      <div className="w-10 h-10 border-4 border-white/50 border-t-primary rounded-full animate-spin" />
      <p className="text-[15px]">Buscando precios...</p>
    </div>
  )
}

export default function BuscarPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <BuscarClient />
    </Suspense>
  )
}
