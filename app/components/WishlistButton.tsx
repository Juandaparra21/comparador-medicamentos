'use client'

import { useState, useEffect } from 'react'
import type { PharmacyResult } from '@/app/types'
import { useAuth } from '@/app/context/AuthContext'
import {
  addToWishlist, removeFromWishlist, isInWishlist, WISHLIST_EVENT,
  addToWishlistDB, removeFromWishlistDB, isInWishlistDB,
} from '@/app/utils/wishlist'

function dispatchWishlistEvent() {
  window.dispatchEvent(new Event(WISHLIST_EVENT()))
}

interface Props { result: PharmacyResult }

export function WishlistButton({ result }: Props) {
  const { user } = useAuth()
  const [saved,    setSaved]    = useState(false)
  const [pending,  setPending]  = useState(false)

  useEffect(() => {
    if (user) {
      isInWishlistDB(result.id).then(setSaved)
    } else {
      setSaved(isInWishlist(result.id))
      const sync = () => setSaved(isInWishlist(result.id))
      window.addEventListener(WISHLIST_EVENT(), sync)
      return () => window.removeEventListener(WISHLIST_EVENT(), sync)
    }
  }, [result.id, user])

  async function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (pending) return
    if (user) {
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
    } else {
      if (saved) {
        removeFromWishlist(result.id)
      } else {
        addToWishlist(result)
      }
      setSaved(!saved)
    }
  }

  return (
    <button
      onClick={toggle}
      disabled={pending}
      aria-label={saved ? 'Quitar de lista de deseos' : 'Agregar a lista de deseos'}
      className={`w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer shrink-0 disabled:opacity-50 ${
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
  )
}
