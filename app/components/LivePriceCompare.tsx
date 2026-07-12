'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { PharmacyResult } from '@/app/types'
import { PharmacyLogo } from './PharmacyLogo'
import { RelativeTime } from './RelativeTime'
import { formatCOP } from '@/app/utils/format'
import { trackOutboundClick } from '@/app/utils/analytics'

export interface SnapshotInitial {
  /** YYYY-MM-DD del último registro diario disponible */
  day: string
  rows: { pharmacy: string; price: number }[]
}

interface Props {
  /** normalized query (lowercase, no accents) */
  query: string
  /** human-readable medication name */
  ingredient: string
  /** last daily snapshot, server-rendered so crawlers see real prices */
  initial?: SnapshotInitial | null
}

interface Row {
  pharmacy: string
  price: number
  url: string
}

type State = 'loading' | 'snapshot' | 'ok' | 'empty' | 'error'

const MONTHS = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

function formatDay(iso: string): string {
  const [, m, d] = iso.split('-')
  return `${parseInt(d, 10)} de ${MONTHS[parseInt(m, 10) - 1] ?? ''}`
}

// Real, on-load price comparison for the SEO landing pages. Starts from the
// latest daily snapshot (rendered on the server, so crawlers index real prices
// with their date), then refreshes with live prices from /api/search. Never
// renders invented numbers: with no snapshot and no live data it points the
// user to the full search.
export function LivePriceCompare({ query, ingredient, initial }: Props) {
  const hasSnapshot = Boolean(initial && initial.rows.length)
  const [rows, setRows] = useState<Row[]>(
    hasSnapshot ? initial!.rows.map((r) => ({ ...r, url: '' })) : [],
  )
  const [fetchedAt, setFetchedAt] = useState<string | null>(null)
  const [state, setState] = useState<State>(hasSnapshot ? 'snapshot' : 'loading')
  const [liveFailed, setLiveFailed] = useState(false)

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(`/api/search?q=${encodeURIComponent(query)}`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('http'))))
      .then((data) => {
        const results = (data.results ?? []) as PharmacyResult[]
        const best = new Map<string, Row>()
        for (const r of results) {
          if (r.availability === 'unavailable') continue
          const cur = best.get(r.pharmacy)
          if (!cur || r.price < cur.price) best.set(r.pharmacy, { pharmacy: r.pharmacy, price: r.price, url: r.url })
        }
        const list = [...best.values()].sort((a, b) => a.price - b.price)
        if (list.length) {
          setRows(list)
          setFetchedAt(data.fetchedAt ?? null)
          setState('ok')
        } else {
          // sin datos en vivo: conserva el snapshot si existe
          setLiveFailed(true)
          setState((prev) => (prev === 'snapshot' ? 'snapshot' : 'empty'))
        }
      })
      .catch((e) => {
        if (e?.name === 'AbortError') return
        setLiveFailed(true)
        setState((prev) => (prev === 'snapshot' ? 'snapshot' : 'error'))
      })
    return () => ctrl.abort()
  }, [query])

  const showTable = state === 'ok' || state === 'snapshot'
  const cheapest = rows[0]?.price

  return (
    <section className="glass-card rounded-3xl p-5 sm:p-6 relative overflow-hidden">
      {/* Brillo interno, como la tarjeta de detalle del diseno de referencia */}
      <div aria-hidden="true" className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 blur-3xl rounded-full pointer-events-none" />
      <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
        <div>
          <h2 className="text-[17px] sm:text-[19px] font-bold text-[#1a1b1f]">
            Precio de {ingredient} hoy
          </h2>
          <p className="text-[12px] text-[#717786] mt-0.5">
            {state === 'ok' && (
              <>Precio más bajo por farmacia, consultado en vivo{fetchedAt ? <> · <RelativeTime iso={fetchedAt} prefix="actualizado" /></> : null}</>
            )}
            {state === 'snapshot' && initial && (
              <>Precio más bajo por farmacia · registro del {formatDay(initial.day)}{!liveFailed ? ' · actualizando en vivo…' : ''}</>
            )}
            {state !== 'ok' && state !== 'snapshot' && 'Consultamos el precio directamente en cada farmacia'}
          </p>
        </div>
        {showTable && cheapest !== undefined && (
          <span className="text-[12px] font-bold px-3 py-1.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 whitespace-nowrap">
            Desde {formatCOP(cheapest)}
          </span>
        )}
      </div>

      {state === 'loading' && (
        <div className="flex flex-col gap-2" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 glass-row rounded-xl h-12 animate-pulse" />
          ))}
          <p className="sr-only">Consultando precios...</p>
        </div>
      )}

      {showTable && (
        <>
          <div className="flex flex-col gap-1.5">
            {rows.map((r, i) => (
              <div key={r.pharmacy} className={`flex items-center gap-3 px-3.5 py-3 rounded-2xl ${i === 0 ? 'glass-card border-l-4 border-l-secondary' : 'glass-row'}`}>
                <PharmacyLogo name={r.pharmacy} size={30} />
                <span className="flex-1 min-w-0 text-[13px] font-semibold text-[#1a1b1f] truncate flex items-center gap-2">
                  {r.pharmacy}
                  {i === 0 && (
                    <span className="shrink-0 text-[9px] font-black tracking-wide bg-secondary text-white px-1.5 py-0.5 rounded-full">
                      MÁS BARATO
                    </span>
                  )}
                </span>
                <span className={`text-[15px] font-bold tabular-nums shrink-0 ${i === 0 ? 'text-secondary' : 'text-[#1a1b1f]'}`}>
                  {formatCOP(r.price)}
                </span>
                {r.url && (
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackOutboundClick({ pharmacy: r.pharmacy, product: ingredient, price: r.price, source: 'precio_page' })}
                    className={`shrink-0 text-[11px] font-bold px-2.5 py-1.5 rounded-lg transition-all ${
                      i === 0 ? 'bg-secondary text-white hover:opacity-90' : 'bg-white/80 border border-[#e5e7eb] text-[#414755] hover:text-primary hover:border-primary/30'
                    }`}
                  >
                    Ir
                  </a>
                )}
              </div>
            ))}
          </div>
          <p className="text-[11px] text-[#c1c6d7] mt-2.5">
            {state === 'ok'
              ? 'Precios de referencia tomados en tiempo real. Pueden variar por sede, presentación y promociones.'
              : `Precios de referencia de nuestro registro del ${initial ? formatDay(initial.day) : 'día'}. Pueden variar por sede, presentación y promociones.`}
          </p>
        </>
      )}

      {(state === 'empty' || state === 'error') && (
        <div className="glass-row rounded-xl p-5 text-center">
          <p className="text-[13px] text-[#717786] mb-3">
            {state === 'empty'
              ? `No encontramos precios de ${ingredient} en este momento.`
              : 'No pudimos cargar los precios ahora mismo.'}
          </p>
          <Link
            href={`/buscar?q=${encodeURIComponent(ingredient)}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl vitality-gradient text-white text-[13px] font-semibold hover:opacity-90 transition-opacity"
          >
            Buscar {ingredient} en Farmi
          </Link>
        </div>
      )}

      {showTable && (
        <Link
          href={`/buscar?q=${encodeURIComponent(ingredient)}`}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl vitality-gradient text-white text-[13px] font-semibold hover:opacity-90 transition-opacity"
        >
          Ver todas las presentaciones y precios de {ingredient}
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
          </svg>
        </Link>
      )}
    </section>
  )
}
