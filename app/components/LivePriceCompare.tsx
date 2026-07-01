'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { PharmacyResult } from '@/app/types'
import { PharmacyLogo } from './PharmacyLogo'
import { RelativeTime } from './RelativeTime'
import { formatCOP } from '@/app/utils/format'

interface Props {
  /** normalized query (lowercase, no accents) */
  query: string
  /** human-readable medication name */
  ingredient: string
}

interface Row {
  pharmacy: string
  price: number
  url: string
}

type State = 'loading' | 'ok' | 'empty' | 'error'

// Real, on-load price comparison for the SEO landing pages. Fetches live prices
// from /api/search and shows the cheapest available option per pharmacy. Never
// renders invented numbers: on empty/error it points the user to the full search.
export function LivePriceCompare({ query, ingredient }: Props) {
  const [rows, setRows] = useState<Row[]>([])
  const [fetchedAt, setFetchedAt] = useState<string | null>(null)
  const [state, setState] = useState<State>('loading')

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
        setRows(list)
        setFetchedAt(data.fetchedAt ?? null)
        setState(list.length ? 'ok' : 'empty')
      })
      .catch((e) => { if (e?.name !== 'AbortError') setState('error') })
    return () => ctrl.abort()
  }, [query])

  const cheapest = rows[0]?.price

  return (
    <section className="bg-white/70 backdrop-blur-[20px] border border-white/50 rounded-2xl shadow-sm p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3 flex-wrap mb-4">
        <div>
          <h2 className="text-[17px] sm:text-[19px] font-bold text-[#1a1b1f]">
            Precio de {ingredient} hoy
          </h2>
          <p className="text-[12px] text-[#717786] mt-0.5">
            {state === 'ok'
              ? <>Precio más bajo por farmacia, consultado en vivo{fetchedAt ? <> · <RelativeTime iso={fetchedAt} prefix="actualizado" /></> : null}</>
              : 'Consultamos el precio directamente en cada farmacia'}
          </p>
        </div>
        {state === 'ok' && cheapest !== undefined && (
          <span className="text-[12px] font-bold px-3 py-1.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20 whitespace-nowrap">
            Desde {formatCOP(cheapest)}
          </span>
        )}
      </div>

      {state === 'loading' && (
        <div className="flex flex-col gap-2" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl bg-[#f5f6fa] h-12 animate-pulse" />
          ))}
          <p className="sr-only">Consultando precios...</p>
        </div>
      )}

      {state === 'ok' && (
        <>
          <div className="rounded-xl border border-white/50 overflow-hidden divide-y divide-[#f0f1f5]">
            {rows.map((r, i) => (
              <div key={r.pharmacy} className={`flex items-center gap-3 px-3.5 py-3 ${i === 0 ? 'bg-secondary/[0.05]' : 'bg-white/40'}`}>
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
            Precios de referencia tomados en tiempo real. Pueden variar por sede, presentación y promociones.
          </p>
        </>
      )}

      {(state === 'empty' || state === 'error') && (
        <div className="rounded-xl bg-[#f5f6fa] border border-white/40 p-5 text-center">
          <p className="text-[13px] text-[#717786] mb-3">
            {state === 'empty'
              ? `No encontramos precios de ${ingredient} en este momento.`
              : 'No pudimos cargar los precios ahora mismo.'}
          </p>
          <Link
            href={`/buscar?q=${encodeURIComponent(ingredient)}`}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-tertiary text-white text-[13px] font-semibold hover:opacity-90 transition-opacity"
          >
            Buscar {ingredient} en Farmi
          </Link>
        </div>
      )}

      {state === 'ok' && (
        <Link
          href={`/buscar?q=${encodeURIComponent(ingredient)}`}
          className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-primary to-tertiary text-white text-[13px] font-semibold hover:opacity-90 transition-opacity"
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
