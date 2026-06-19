'use client'

import { useState, useEffect } from 'react'
import type { PharmacyResult } from '@/app/types'
import { addToCart, removeFromCart, isInCart, CART_EVENT } from '@/app/utils/cart'

interface Props { result: PharmacyResult }

export function CartButton({ result }: Props) {
  const [inCart, setInCart] = useState(false)

  useEffect(() => {
    function sync() { setInCart(isInCart(result.id)) }
    sync()
    window.addEventListener(CART_EVENT(), sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(CART_EVENT(), sync)
      window.removeEventListener('storage', sync)
    }
  }, [result.id])

  function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (inCart) {
      removeFromCart(result.id)
    } else {
      addToCart(result)
    }
    setInCart(!inCart)
  }

  return (
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
  )
}
