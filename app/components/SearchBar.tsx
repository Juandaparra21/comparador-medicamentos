'use client'

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import type { Suggestion } from '@/app/api/suggestions/route'
import { saveSearchHistory } from '@/app/components/QuickChips'
import { suggestCorrection, capitalizeFirst } from '@/app/utils/spellCorrect'
import { useLang } from '@/app/i18n/LanguageProvider'

interface Props {
  initialValue?: string
  compact?: boolean
}

export function SearchBar({ initialValue = '', compact = false }: Props) {
  const { t } = useLang()
  const [query,       setQuery]       = useState(initialValue)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [activeIdx,   setActiveIdx]   = useState(-1)
  const [open,        setOpen]        = useState(false)
  const [fetching,    setFetching]    = useState(false)
  const router   = useRouter()
  const wrapRef  = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sync when initialValue changes (back/forward nav)
  useEffect(() => {
    setQuery(initialValue)
    setSuggestions([])
    setOpen(false)
    setActiveIdx(-1)
  }, [initialValue])

  // Close on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onDown)
    return () => document.removeEventListener('mousedown', onDown)
  }, [])

  function fetchSuggestions(val: string) {
    if (debounce.current) clearTimeout(debounce.current)
    if (val.trim().length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }
    debounce.current = setTimeout(async () => {
      setFetching(true)
      try {
        const res = await fetch(`/api/suggestions?q=${encodeURIComponent(val.trim())}`)
        const data = await res.json() as { suggestions: Suggestion[] }
        const list = data.suggestions ?? []
        setSuggestions(list)
        // Open the panel when there are hits, or when there's a spell suggestion to
        // offer even though the index returned nothing (likely a typo).
        setOpen(list.length > 0 || suggestCorrection(val) !== null)
        setActiveIdx(-1)
      } catch {
        setSuggestions([])
        setOpen(false)
      } finally {
        setFetching(false)
      }
    }, 280)
  }

  function navigate(q: string) {
    setOpen(false)
    setQuery(q)
    if (q.trim()) saveSearchHistory(q.trim())
    router.push(`/buscar?q=${encodeURIComponent(q)}`)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const selected = activeIdx >= 0 ? suggestions[activeIdx] : null
    navigate(selected ? selected.query : query.trim())
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIdx((i) => Math.min(i + 1, suggestions.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIdx((i) => Math.max(i - 1, -1))
    } else if (e.key === 'Escape') {
      setOpen(false)
      setActiveIdx(-1)
    }
  }

  const ingredientSuggestions = suggestions.filter((s) => s.type === 'ingredient')
  const productSuggestions    = suggestions.filter((s) => s.type === 'product')

  // Spell suggestion, shown only when the index returned no hits (likely a typo).
  const correction = useMemo(() => suggestCorrection(query), [query])
  const showCorrection = suggestions.length === 0 && correction !== null

  const globalIdx = useCallback(
    (type: 'ingredient' | 'product', localIdx: number) => {
      if (type === 'ingredient') return localIdx
      return ingredientSuggestions.length + localIdx
    },
    [ingredientSuggestions.length]
  )

  return (
    <div ref={wrapRef} className="relative">
      <form
        onSubmit={handleSubmit}
        className={`flex items-stretch glass-card overflow-hidden shadow-[0_2px_24px_rgba(0,88,188,0.10)] ${compact ? 'rounded-2xl' : 'rounded-[24px]'}`}
      >
        <input
          ref={inputRef}
          id="search-input"
          type="search"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded={open}
          aria-label={t('search.aria')}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            fetchSuggestions(e.target.value)
          }}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={compact ? t('search.placeholderCompact') : t('search.placeholder')}
          autoComplete="off"
          className="flex-1 py-3.5 pl-5 pr-2.5 sm:pr-3 bg-transparent text-[14px] sm:text-[15px] text-[#1a1b1f] placeholder:text-[#8e8e93] focus:outline-none min-w-0"
        />
        <button
          type="submit"
          disabled={!query.trim()}
          aria-label={t('search.button')}
          className="m-1.5 px-4 sm:px-5 py-2.5 vitality-gradient text-white rounded-full shrink-0 flex items-center justify-center shadow-lg disabled:opacity-40 hover:opacity-90 hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          {fetching ? (
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
      </form>

      {/* Autocomplete dropdown */}
      {open && (suggestions.length > 0 || showCorrection) && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 glass-card-opaque rounded-2xl shadow-[0_8px_32px_rgba(0,88,188,0.14)] overflow-hidden">
          {/* ¿Quisiste decir…? — solo cuando no hubo resultados del índice */}
          {showCorrection && correction && (
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => navigate(correction)}
              className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[#f5f6fa] transition-colors cursor-pointer"
            >
              <div className="w-7 h-7 rounded-lg bg-tertiary/10 flex items-center justify-center shrink-0">
                <svg className="w-4 h-4 text-tertiary" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] text-[#717786]">
                  ¿Quisiste decir <span className="font-semibold text-primary">{capitalizeFirst(correction)}</span>?
                </p>
              </div>
            </button>
          )}

          {/* Principios activos */}
          {ingredientSuggestions.length > 0 && (
            <>
              <div className="px-4 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#717786]">
                Principios activos
              </div>
              {ingredientSuggestions.map((s, i) => {
                const gi = globalIdx('ingredient', i)
                return (
                  <button
                    key={`ing-${s.query}`}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => navigate(s.query)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                      activeIdx === gi ? 'bg-primary/[0.08]' : 'hover:bg-[#f5f6fa]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-secondary" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="3" y="7" width="14" height="6" rx="3" />
                        <line x1="10" y1="7" x2="10" y2="13" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold text-[#1a1b1f] truncate">{s.label}</p>
                      <p className="text-[11px] text-[#717786]">{s.sublabel}</p>
                    </div>
                    <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                      {s.badge}
                    </span>
                  </button>
                )
              })}
            </>
          )}

          {/* Medicamentos */}
          {productSuggestions.length > 0 && (
            <>
              <div className={`px-4 pb-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#717786] ${ingredientSuggestions.length > 0 ? 'pt-3 border-t border-[#f0f1f5] mt-1' : 'pt-2.5'}`}>
                Medicamentos
              </div>
              {productSuggestions.map((s, i) => {
                const gi = globalIdx('product', i)
                return (
                  <button
                    key={`prod-${s.query}`}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => navigate(s.query)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors cursor-pointer ${
                      activeIdx === gi ? 'bg-primary/[0.08]' : 'hover:bg-[#f5f6fa]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-primary" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-2.012C4.045 12.455 2 9.93 2 6.5a4.5 4.5 0 018-2.826A4.5 4.5 0 0118 6.5c0 3.43-2.045 5.955-3.885 7.708a22.049 22.049 0 01-3.744 2.694l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold text-[#1a1b1f] truncate">{s.label}</p>
                      <p className="text-[11px] text-[#717786] truncate">{s.sublabel}</p>
                    </div>
                    <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      s.badge === 'Marca'
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'bg-secondary/10 text-secondary border border-secondary/20'
                    }`}>
                      {s.badge}
                    </span>
                  </button>
                )
              })}
            </>
          )}

          {suggestions.length > 0 && (
            <div className="px-4 py-2 border-t border-[#f0f1f5] text-[10px] text-[#c1c6d7] text-right">
              &uarr;&darr; navegar &middot; Enter buscar &middot; Esc cerrar
            </div>
          )}
        </div>
      )}
    </div>
  )
}
