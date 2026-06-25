import Link from 'next/link'
import { normalize } from '@/app/utils/search'
import { PriceTracker } from '@/app/components/PriceTracker'

interface Props {
  params: Promise<{ ingredient: string }>
}

function toLabel(slug: string): string {
  const s = decodeURIComponent(slug).trim()
  return s.charAt(0).toUpperCase() + s.slice(1)
}

export async function generateMetadata({ params }: Props) {
  const { ingredient } = await params
  return { title: `Historial de ${toLabel(ingredient)} - Farmi` }
}

export default async function HistorialPage({ params }: Props) {
  const { ingredient } = await params
  const label = toLabel(ingredient)
  const query = normalize(decodeURIComponent(ingredient))

  return (
    <section className="mx-auto px-4 sm:px-5 max-w-4xl pt-8 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-[#717786] mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
        <span>/</span>
        <Link
          href={`/buscar?q=${encodeURIComponent(label)}`}
          className="hover:text-primary transition-colors"
        >
          {label}
        </Link>
        <span>/</span>
        <span className="text-[#1a1b1f] font-medium">Historial de precios</span>
      </div>

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-[24px] sm:text-[30px] font-bold text-[#1a1b1f] tracking-tight leading-tight">
          Historial de precios
        </h1>
        <p className="text-[15px] text-[#717786] mt-1">{label}</p>
      </div>

      {/* Real history + tracking */}
      <PriceTracker query={query} label={label} />

      {/* CTA */}
      <div className="flex flex-wrap gap-3 mt-6">
        <Link
          href={`/buscar?q=${encodeURIComponent(label)}`}
          className="px-5 py-2.5 bg-gradient-to-r from-primary to-tertiary text-white text-[14px] font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Ver precios actuales
        </Link>
        <Link
          href="/"
          className="px-5 py-2.5 bg-white/70 border border-white/50 text-[#414755] text-[14px] font-semibold rounded-xl hover:bg-white/90 transition-all"
        >
          Buscar otro medicamento
        </Link>
      </div>
    </section>
  )
}
