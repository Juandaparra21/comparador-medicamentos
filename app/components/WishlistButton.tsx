'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { PharmacyResult } from '@/app/types'
import { useAuth } from '@/app/context/AuthContext'
import {
  addToWishlistDB, removeFromWishlistDB, isInWishlistDB,
} from '@/app/utils/wishlist'

function dispatchWishlistEvent() {
  window.dispatchEvent(new Event('farmi:wishlist'))
}

interface Props { result: PharmacyResult }

export function WishlistButton({ result }: Props) {
  const { user } = useAuth()
  const router   = useRouter()
  const [saved,      setSaved]      = useState(false)
  const [pending,    setPending]    = useState(false)
  const [showHint,   setShowHint]   = useState(false)

  useEffect(() => {
    if (!user) { setSaved(false); return }
    isInWishlistDB(result.id).then(setSaved)
  }, [result.id, user])

  async function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      setShowHint(true)
      setTimeout(() => setShowHint(false), 2200)
      return
    }

    if (pending) return
    setPending(true)
    if (saved) {
      await removeFromWishlistDB(result.id)
      setSaved(false)
    } else {
      await addToWishlistDB(result)
      setSaved(true)
    }
    dispatchWishlistEvent()
    setPending(false)
  }

  return (
    <div className="relative shrink-0">
      <button
        onClick={toggle}
        disabled={pending}
        aria-label={saved ? 'Quitar de lista de deseos' : 'Agregar a lista de deseos'}
        className={`btn-glass-icon w-8 h-8 flex items-center justify-center rounded-full cursor-pointer disabled:opacity-50 ${
          saved
            ? 'text-red-500 bg-red-50'
            : 'text-[#c1c6d7] hover:text-red-400 hover:bg-red-50/60'
        }`}
      >
        <svg
          className="w-[18px] h-[18px]"
          viewBox="0 0 24 24"
          fill={saved ? 'currentColor' : 'none'}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      </button>

      {/* Login hint tooltip */}
      {showHint && (
        <div className="absolute bottom-full right-0 mb-2 z-50 animate-in fade-in slide-in-from-bottom-1 duration-150">
          <div className="bg-[#1a1b1f] text-white text-[11px] font-semibold px-3 py-2 rounded-xl whitespace-nowrap shadow-lg">
            Inicia sesión para guardar
            <button
              onClick={(e) => { e.stopPropagation(); router.push('/login') }}
              className="ml-2 text-primary-300 underline cursor-pointer"
            >
              Entrar
            </button>
          </div>
          <div className="absolute top-full right-3 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-[#1a1b1f]" />
        </div>
      )}
    </div>
  )
}
