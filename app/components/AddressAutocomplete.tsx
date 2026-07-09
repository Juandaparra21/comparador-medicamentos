'use client'

import { useEffect, useRef, useState } from 'react'

export interface AddressSuggestion {
  label: string
  lat:   number
  lng:   number
}

interface Props {
  onSelect:     (s: AddressSuggestion) => void
  placeholder?: string
  disabled?:    boolean
  // Visual variant: 'primary' shows a blue "Buscar" button (used standalone),
  // 'plain' renders just the input (button lives elsewhere).
}

// Shorten Nominatim's long display_name (which ends with ", Colombia" and a
// postcode) to the first few meaningful parts for the input value.
function shortLabel(label: string): string {
  return label.split(',').slice(0, 3).map((s) => s.trim()).join(', ')
}

/**
 * Address field with live suggestions from /api/geocode (OpenStreetMap).
 * Debounces typing, shows a dropdown, and calls onSelect with coordinates when
 * the user picks one. No <form> — submission is via clicking a suggestion or
 * pressing Enter (selects the highlighted / first match).
 */
export function AddressAutocomplete({ onSelect, placeholder, disabled }: Props) {
  const [value,       setValue]       = useState('')
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([])
  const [open,        setOpen]        = useState(false)
  const [loading,     setLoading]     = useState(false)
  const [active,      setActive]      = useState(-1)

  const boxRef      = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Debounced suggestion fetch. All state updates happen inside the timeout
  // (asynchronously), never synchronously in the effect body.
  useEffect(() => {
    const q = value.trim()
    if (debounceRef.current) clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(async () => {
      if (q.length < 3) { setSuggestions([]); setOpen(false); return }
      setLoading(true)
      try {
        const res  = await fetch(`/api/geocode?q=${encodeURIComponent(q)}`)
        const data = (await res.json()) as { suggestions?: AddressSuggestion[] }
        setSuggestions(data.suggestions ?? [])
        setActive(-1)
        setOpen(true)
      } catch {
        setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, 350)

    return () => { if (debounceRef.current) clearTimeout(debounceRef.current) }
  }, [value])

  // Close the dropdown when clicking outside.
  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [])

  function choose(s: AddressSuggestion) {
    setValue(shortLabel(s.label))
    setSuggestions([])
    setOpen(false)
    setActive(-1)
    onSelect(s)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((i) => (i <= 0 ? suggestions.length - 1 : i - 1))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      choose(suggestions[active >= 0 ? active : 0])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={boxRef} className="relative w-full">
      <input
        type="text"
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={() => { if (suggestions.length) setOpen(true) }}
        placeholder={placeholder ?? 'Escribe tu dirección'}
        aria-label="Dirección"
        autoComplete="off"
        className="w-full px-3.5 py-2.5 bg-white border border-[#e5e7eb] rounded-lg text-[14px] text-[#1a1b1f] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-0 disabled:opacity-60"
      />

      {open && (suggestions.length > 0 || loading) && (
        <ul className="absolute z-[1100] left-0 right-0 mt-1 bg-white border border-[#e5e7eb] rounded-lg shadow-lg overflow-hidden max-h-72 overflow-y-auto">
          {loading && suggestions.length === 0 && (
            <li className="px-3.5 py-2.5 text-[13px] text-[#9ca3af]">Buscando direcciones...</li>
          )}
          {suggestions.map((s, i) => (
            <li key={`${s.lat},${s.lng}`}>
              <button
                type="button"
                onMouseDown={(e) => { e.preventDefault(); choose(s) }}
                onMouseEnter={() => setActive(i)}
                className={`w-full text-left px-3.5 py-2.5 text-[13px] leading-snug transition-colors cursor-pointer ${
                  i === active ? 'bg-primary/8 text-primary' : 'text-[#414755] hover:bg-black/[0.03]'
                }`}
              >
                {shortLabel(s.label)}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
