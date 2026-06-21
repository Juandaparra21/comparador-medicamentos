import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getMedicationHistory } from '@/app/utils/priceHistory'
import { PriceHistoryChart } from '@/app/components/PriceHistoryChart'
import { formatCOP } from '@/app/utils/format'

interface Props {
  params: Promise<{ ingredient: string }>
}

export async function generateMetadata({ params }: Props) {
  const { ingredient } = await params
  const history = getMedicationHistory(ingredient)
  return {
    title: history
      ? `Historial de ${history.ingredient} - Farmi`
      : 'Historial - Farmi',
  }
}

export default async function HistorialPage({ params }: Props) {
  const { ingredient } = await params
  const history = getMedicationHistory(ingredient)
  if (!history) notFound()

  const allPrices = history.histories.flatMap((h) => h.data.map((p) => p.price))
  const allLow = Math.min(...allPrices)
  const allHigh = Math.max(...allPrices)

  const lastPrices = history.histories
    .map((h) => ({ pharmacy: h.pharmacy, color: h.color, price: h.data[h.data.length - 1].price }))
    .sort((a, b) => a.price - b.price)

  return (
    <section className="mx-auto px-4 sm:px-5 max-w-4xl pt-8 pb-16">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-[12px] text-[#717786] mb-6">
        <Link href="/" className="hover:text-primary transition-colors">Inicio</Link>
        <span>/</span>
        <Link
          href={`/buscar?q=${encodeURIComponent(history.ingredient)}`}
          className="hover:text-primary transition-colors"
        >
          {history.ingredient}
        </Link>
        <span>/</span>
        <span className="text-[#1a1b1f] font-medium">Historial de precios</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[24px] sm:text-[30px] font-bold text-[#1a1b1f] tracking-tight leading-tight">
          Historial de precios
        </h1>
        <p className="text-[15px] text-[#717786] mt-1">{history.label}</p>

        {/* Stats row */}
        <div className="flex flex-wrap gap-3 mt-4">
          <span className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
            Minimo historico: {formatCOP(allLow)}
          </span>
          <span className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-white/60 text-[#414755] border border-white/40">
            Maximo: {formatCOP(allHigh)}
          </span>
          <span className="text-[12px] font-semibold px-3 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20">
            Diferencia: {formatCOP(allHigh - allLow)}
          </span>
        </div>
      </div>

      {/* Chart card */}
      <div className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm p-5 sm:p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[14px] font-bold text-[#1a1b1f]">Evolucion de precios — 2025</h2>
          <span className="text-[11px] text-[#c1c6d7] font-medium">Pasa el cursor para ver detalles</span>
        </div>
        <PriceHistoryChart histories={history.histories} unit={history.unit} />
      </div>

      {/* Current prices table */}
      <div className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm p-5 sm:p-6 mb-6">
        <h2 className="text-[14px] font-bold text-[#1a1b1f] mb-4">Precio actual por farmacia</h2>
        <div className="flex flex-col gap-2">
          {lastPrices.map((row, i) => (
            <div
              key={row.pharmacy}
              className="flex items-center justify-between py-2.5 px-3 rounded-xl bg-white/50 border border-white/40"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-[12px] font-bold text-[#c1c6d7] w-5 tabular-nums">
                  {i + 1}
                </span>
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: row.color }}
                />
                <span className="text-[13px] font-semibold text-[#1a1b1f]">{row.pharmacy}</span>
                {i === 0 && (
                  <span className="text-[10px] font-bold bg-secondary text-white px-2 py-0.5 rounded-full">
                    Mas barato
                  </span>
                )}
              </div>
              <span className="text-[15px] font-bold text-[#1a1b1f] tabular-nums">
                {formatCOP(row.price)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-wrap gap-3">
        <Link
          href={`/buscar?q=${encodeURIComponent(history.ingredient)}`}
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
