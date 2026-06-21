'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { QUICK_SEARCHES } from '@/app/utils/search'

const HISTORY_KEY = 'farmi_search_history'
const MAX_HISTORY = 5

export function saveSearchHistory(query: string) {
  if (typeof window === 'undefined') return
  try {
    const raw  = localStorage.getItem(HISTORY_KEY)
    const prev = raw ? (JSON.parse(raw) as string[]) : []
    const next = [query, ...prev.filter(q => q !== query)].slice(0, MAX_HISTORY)
    localStorage.setItem(HISTORY_KEY, JSON.stringify(next))
  } catch {
    // localStorage unavailable in some private browsing modes
  }
}

export function useSearchHistory() {
  const [history, setHistory] = useState<string[]>([])
  useEffect(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY)
      if (raw) setHistory(JSON.parse(raw) as string[])
    } catch {
      // ignore
    }
  }, [])
  return history
}

export function QuickChips() {
  const router  = useRouter()
  const history = useSearchHistory()

  function go(term: string) {
    saveSearchHistory(term)
    router.push(`/buscar?q=${encodeURIComponent(term)}`)
  }

  return (
    <div className="mt-5 flex flex-col gap-3">
      {history.length > 0 && (
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#c1c6d7] text-center mb-2">
            Busquedas recientes
          </p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {history.map((term) => (
              <button
                key={`h-${term}`}
                type="button"
                onClick={() => go(term)}
                className="flex items-center gap-1.5 text-[12px] font-semibold px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"
              >
                <svg className="w-3 h-3 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-13a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" clipRule="evenodd" />
                </svg>
                {term}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        {history.length > 0 && (
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#c1c6d7] text-center mb-2">
            Mas buscados
          </p>
        )}
        <div className="flex flex-wrap justify-center gap-2">
          {QUICK_SEARCHES.map((med) => (
            <button
              key={med}
              type="button"
              onClick={() => go(med)}
              className="text-[12px] font-semibold tracking-wide px-3.5 py-1.5 rounded-full bg-white/60 backdrop-blur-sm border border-[#c1c6d7]/60 text-[#414755] hover:bg-white/80 hover:border-primary/40 hover:text-primary transition-all cursor-pointer"
            >
              {med}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
