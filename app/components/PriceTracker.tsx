'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import type { PharmacyHistory } from '@/app/utils/priceHistoryTypes'
import { PriceHistoryChart } from './PriceHistoryChart'
import { formatCOP } from '@/app/utils/format'
import { useAuth } from '@/app/context/AuthContext'
import { getBrowserClient } from '@/app/lib/supabase/browser'

interface HistoryResponse {
  tracked: boolean
  label: string | null
  days: string[]
  histories: PharmacyHistory[]
  lastSnapshotAt: string | null
}

interface Props {
  /** normalized query (lowercase, no accents) */
  query: string
  /** human-readable label shown to the user */
  label: string
}

export function PriceTracker({ query, label }: Props) {
  const { user } = useAuth()
  const [data, setData]         = useState<HistoryResponse | null>(null)
  const [loading, setLoading]   = useState(true)
  const [tracking, setTracking] = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/history?q=${encodeURIComponent(query)}`)
      setData(await res.json())
    } catch {
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [query])

  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: show loading on (re)fetch
  useEffect(() => { load() }, [load])

  async function startTracking() {
    if (tracking || !user) return
    setTracking(true)
    setError(null)
    try {
      // Attach the user's access token so the server can verify the session.
      const sb = await getBrowserClient()
      const { data: { session } } = await sb.auth.getSession()
      const token = session?.access_token
      if (!token) { setError('Inicia sesión para rastrear precios.'); return }

      const res = await fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ query, label }),
      })
      if (res.status === 401) { setError('Inicia sesión para rastrear precios.'); return }
      const json = await res.json()
      if (!json.ok) throw new Error(json.error ?? 'error')
      await load()
    } catch {
      setError('No se pudo iniciar el rastreo. Intenta de nuevo en unos minutos.')
    } finally {
      setTracking(false)
    }
  }

  const histories = data?.histories ?? []
  const days      = data?.days.length ?? 0
  const hasChart  = histories.length > 0 && histories[0].data.length >= 2
  const isTracked = data?.tracked ?? false

  const allPrices = histories.flatMap((h) => h.data.map((p) => p.price))
  const allLow    = allPrices.length ? Math.min(...allPrices) : null
  const allHigh   = allPrices.length ? Math.max(...allPrices) : null

  // Latest price per pharmacy (used in the single-day "collecting" state)
  const latest = histories
    .map((h) => ({ pharmacy: h.pharmacy, color: h.color, price: h.data[h.data.length - 1].price }))
    .sort((a, b) => a.price - b.price)

  return (
    <section className="glass-card rounded-2xl p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3 mb-3 flex-wrap">
        <div>
          <h2 className="text-[16px] font-bold text-[#1a1b1f]">Historial de precios</h2>
          <p className="text-[12px] text-[#717786] mt-0.5">
            {days > 0
              ? `Datos reales · ${days} día${days !== 1 ? 's' : ''} registrado${days !== 1 ? 's' : ''}`
              : 'Construido con datos reales, día a día'}
          </p>
        </div>
        {hasChart && allLow !== null && allHigh !== null && (
          <div className="flex flex-wrap gap-2 shrink-0">
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20 whitespace-nowrap">
              Min: {formatCOP(allLow)}
            </span>
            <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-white/60 text-[#414755] border border-white/40 whitespace-nowrap">
              Max: {formatCOP(allHigh)}
            </span>
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center py-10">
          <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        </div>
      ) : hasChart ? (
        <>
          <p className="text-[11px] text-[#c1c6d7] mb-4">Pasa el cursor sobre el grafico para ver el detalle</p>
          <PriceHistoryChart histories={histories} />
        </>
      ) : days === 1 && latest.length > 0 ? (
        <div className="glass-row rounded-xl p-4">
          <p className="text-[13px] font-semibold text-[#1a1b1f] mb-1">Primer registro guardado</p>
          <p className="text-[12px] text-[#717786] mb-3">
            Tomamos el precio de hoy. Vuelve mañana para ver como evoluciona la grafica.
          </p>
          <div className="flex flex-col gap-2">
            {latest.map((r, i) => (
              <div key={r.pharmacy} className="flex items-center justify-between py-1.5">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: r.color }} />
                  <span className="text-[13px] text-[#414755]">{r.pharmacy}</span>
                  {i === 0 && (
                    <span className="text-[10px] font-bold text-secondary bg-secondary/10 border border-secondary/20 px-1.5 py-0.5 rounded-full">
                      min
                    </span>
                  )}
                </div>
                <span className="text-[14px] font-bold tabular-nums text-[#1a1b1f]">{formatCOP(r.price)}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="glass-row rounded-xl p-5 text-center">
          <p className="text-[14px] font-semibold text-[#1a1b1f] mb-1">Aún no hay historial</p>
          <p className="text-[12px] text-[#717786]">
            {isTracked
              ? 'Ya estamos rastreando este medicamento. El historial aparecera a medida que registremos el precio cada día.'
              : 'Rastrea este medicamento para empezar a guardar su precio cada día y construir la grafica de evolucion.'}
          </p>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-white/40 flex items-center justify-between gap-3 flex-wrap">
        <p className="text-[12px] text-[#717786] flex items-center gap-1.5 max-w-[60%] min-w-[180px]">
          {!user ? (
            'Inicia sesión para rastrear este medicamento y guardar su precio cada día.'
          ) : isTracked ? (
            <>
              <svg className="w-4 h-4 text-secondary shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold text-secondary">Rastreando.</span> Guardamos el precio cada día.
            </>
          ) : (
            'Guardaremos el precio cada día para construir el historial.'
          )}
        </p>
        {!user ? (
          <Link
            href="/login"
            className="text-[12px] font-bold px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-tertiary text-white hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            Inicia sesión para rastrear
          </Link>
        ) : (
          <button
            onClick={startTracking}
            disabled={tracking}
            className={`text-[12px] font-bold px-4 py-2 rounded-lg transition-all disabled:opacity-50 cursor-pointer whitespace-nowrap ${
              isTracked
                ? 'bg-white/70 border border-[#c1c6d7]/50 text-[#414755] hover:bg-white/90'
                : 'bg-gradient-to-r from-primary to-tertiary text-white hover:opacity-90'
            }`}
          >
            {tracking ? 'Guardando...' : isTracked ? 'Actualizar ahora' : 'Rastrear precio'}
          </button>
        )}
      </div>

      {error && <p className="text-[12px] text-red-500 mt-2">{error}</p>}
    </section>
  )
}
