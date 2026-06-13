'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Props {
  initialValue?: string
  compact?: boolean
}

export function SearchBar({ initialValue = '', compact = false }: Props) {
  const [query, setQuery] = useState(initialValue)
  const router = useRouter()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    router.push(`/buscar?q=${encodeURIComponent(q)}`)
  }

  return (
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
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={compact ? 'Buscar medicamento...' : 'Ej: acetaminofén, ibuprofeno...'}
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
  )
}
