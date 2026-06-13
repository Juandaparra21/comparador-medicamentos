'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { MOCK_DATA, normalize } from '@/app/utils/search'

interface Suggestion {
  label: string
  sublabel: string
  type: 'ingredient' | 'product'
  query: string
  badge: string
  badgeStyle: string
}

function computeSuggestions(input: string): Suggestion[] {
  if (input.trim().length === 0) return []
  const q = normalize(input.trim())

  const seenIngredients = new Set<string>()
  const seenProducts = new Set<string>()
  const list: Suggestion[] = []

  // Principios activos primero
  for (const r of MOCK_DATA) {
    if (normalize(r.activeIngredient).includes(q) && !seenIngredients.has(r.activeIngredient)) {
      seenIngredients.add(r.activeIngredient)
      list.push({
        label: r.activeIngredient,
        sublabel: 'Principio activo',
        type: 'ingredient',
        query: r.activeIngredient,
        badge: 'Genérico',
        badgeStyle: 'bg-secondary/10 text-secondary border border-secondary/20',
      })
    }
  }

  // Luego marcas y genericos por nombre de producto
  for (const r of MOCK_DATA) {
    if (normalize(r.productName).includes(q) && !seenProducts.has(r.productName)) {
      seenProducts.add(r.productName)
      list.push({
        label: r.productName,
        sublabel: r.activeIngredient,
        type: 'product',
        query: r.productName,
        badge: r.type === 'brand' ? 'Marca' : 'Genérico',
        badgeStyle:
          r.type === 'brand'
            ? 'bg-primary/10 text-primary border border-primary/20'
            : 'bg-secondary/10 text-secondary border border-secondary/20',
      })
    }
  }

  return list.slice(0, 8)
}

interface Props {
  initialValue?: string
  compact?: boolean
}

export function SearchBar({ initialValue = '', compact = false }: Props) {
  const [query, setQuery] = useState(initialValue)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [activeIdx, setActiveIdx] = useState(-1)
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const wrapRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Sync when initialValue changes (back/forward nav)
  useEffect(() => {
    setQuery(initialValue)
  }, [initialValue])

  // Update suggestions when query changes
  useEffect(() => {
    const next = computeSuggestions(query)
    setSuggestions(next)
    setActiveIdx(-1)
    setOpen(next.length > 0)
  }, [query])

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

  function navigate(q: string) {
    setOpen(false)
    setQuery(q)
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
  const productSuggestions = suggestions.filter((s) => s.type === 'product')

  // Global index helper
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
        className="flex items-stretch bg-white/70 backdrop-blur-[30px] rounded-xl border border-white/50 shadow-[0_2px_24px_rgba(0,88,188,0.08)] overflow-hidden"
      >
        <div className="flex items-center pl-3.5 sm:pl-4 text-[#717786] shrink-0" aria-hidden="true">
          <svg className="w-5 h-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => suggestions.length > 0 && setOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={compact ? 'Buscar medicamento...' : 'Ej: acetaminofén, Dolex, ibuprofeno...'}
          autoComplete="off"
          className="flex-1 py-3.5 px-2.5 sm:px-3 bg-transparent text-[14px] sm:text-[15px] text-[#1a1b1f] placeholder:text-[#8e8e93] focus:outline-none min-w-0"
        />
        <button
          type="submit"
          disabled={!query.trim()}
          className="m-1.5 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-primary to-tertiary text-white text-[14px] sm:text-[15px] font-semibold rounded-lg shrink-0 disabled:opacity-40 hover:opacity-90 transition-opacity cursor-pointer whitespace-nowrap"
        >
          Buscar
        </button>
      </form>

      {/* Autocomplete dropdown */}
      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white/95 backdrop-blur-xl border border-white/60 rounded-xl shadow-[0_8px_32px_rgba(0,88,188,0.14)] overflow-hidden">
          {/* Principios activos group */}
          {ingredientSuggestions.length > 0 && (
            <>
              <div className="px-4 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#717786]">
                Principios activos
              </div>
              {ingredientSuggestions.map((s, i) => {
                const gi = globalIdx('ingredient', i)
                return (
                  <button
                    key={s.query}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => navigate(s.query)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      activeIdx === gi ? 'bg-primary/8' : 'hover:bg-[#f5f6fa]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-secondary" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M9.653 16.915l-.005-.003-.019-.01a20.759 20.759 0 01-1.162-.682 22.045 22.045 0 01-2.582-2.012C4.045 12.455 2 9.93 2 6.5a4.5 4.5 0 018-2.826A4.5 4.5 0 0118 6.5c0 3.43-2.045 5.955-3.885 7.708a22.049 22.049 0 01-3.744 2.694l-.019.01-.005.003h-.002a.739.739 0 01-.69.001l-.002-.001z" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold text-[#1a1b1f] truncate">{s.label}</p>
                      <p className="text-[11px] text-[#717786]">{s.sublabel}</p>
                    </div>
                    <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.badgeStyle}`}>
                      {s.badge}
                    </span>
                  </button>
                )
              })}
            </>
          )}

          {/* Medicamentos group */}
          {productSuggestions.length > 0 && (
            <>
              <div className={`px-4 pb-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#717786] ${ingredientSuggestions.length > 0 ? 'pt-3 border-t border-[#f0f1f5] mt-1' : 'pt-2.5'}`}>
                Medicamentos
              </div>
              {productSuggestions.map((s, i) => {
                const gi = globalIdx('product', i)
                return (
                  <button
                    key={s.query}
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => navigate(s.query)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                      activeIdx === gi ? 'bg-primary/8' : 'hover:bg-[#f5f6fa]'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-primary" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <rect x="3" y="7" width="14" height="6" rx="3" />
                        <line x1="10" y1="7" x2="10" y2="13" />
                      </svg>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] font-semibold text-[#1a1b1f] truncate">{s.label}</p>
                      <p className="text-[11px] text-[#717786]">{s.sublabel}</p>
                    </div>
                    <span className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${s.badgeStyle}`}>
                      {s.badge}
                    </span>
                  </button>
                )
              })}
            </>
          )}

          <div className="px-4 py-2 border-t border-[#f0f1f5] text-[10px] text-[#c1c6d7] text-right">
            &uarr;&darr; navegar &middot; Enter seleccionar &middot; Esc cerrar
          </div>
        </div>
      )}
    </div>
  )
}
