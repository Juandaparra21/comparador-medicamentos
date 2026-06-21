'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import type { PharmacyResult } from '@/app/types'
import { useAuth } from '@/app/context/AuthContext'
import { addToCart, removeFromCart, isInCart, CART_EVENT } from '@/app/utils/cart'

interface Props { result: PharmacyResult }

export function CartButton({ result }: Props) {
  const { user }  = useAuth()
  const router    = useRouter()
  const [inCart,    setInCart]    = useState(false)
  const [showHint,  setShowHint]  = useState(false)

  useEffect(() => {
    if (!user) { setInCart(false); return }
    function sync() { setInCart(isInCart(result.id)) }
    sync()
    window.addEventListener(CART_EVENT(), sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(CART_EVENT(), sync)
      window.removeEventListener('storage', sync)
    }
  }, [result.id, user])

  function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      setShowHint(true)
      setTimeout(() => setShowHint(false), 2200)
      return
    }

    if (inCart) {
      removeFromCart(result.id)
    } else {
      addToCart(result)
    }
    setInCart(!inCart)
  }

  return (
    <div className="relative shrink-0">
      <button
        onClick={toggle}
        aria-label={inCart ? 'Quitar del carrito' : 'Agregar al carrito'}
        title={inCart ? 'Quitar del carrito' : 'Agregar al carrito'}
        className={`w-8 h-8 flex items-center justify-center rounded-full transition-all cursor-pointer ${
          inCart
            ? 'text-secondary bg-secondary/10'
            : 'text-[#c1c6d7] hover:text-secondary hover:bg-secondary/10'
        }`}
      >
        <svg className="w-[17px] h-[17px]" viewBox="0 0 24 24" fill={inCart ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <path d="M16 10a4 4 0 01-8 0" />
        </svg>
      </button>

      {showHint && (
        <div className="absolute bottom-full right-0 mb-2 z-50 animate-in fade-in slide-in-from-bottom-1 duration-150">
          <div className="bg-[#1a1b1f] text-white text-[11px] font-semibold px-3 py-2 rounded-xl whitespace-nowrap shadow-lg">
            Inicia sesion para agregar
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
