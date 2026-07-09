'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import { getCartDB, CART_EVENT } from '@/app/utils/cart'

export function CartNav() {
  const { user } = useAuth()
  const [count, setCount] = useState(0)
  const userRef = useRef(user)
  userRef.current = user

  useEffect(() => {
    async function refresh() {
      if (userRef.current) {
        const items = await getCartDB()
        setCount(items.length)
      } else {
        setCount(0)
      }
    }

    refresh()
    window.addEventListener(CART_EVENT(), refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(CART_EVENT(), refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [user])

  return (
    <Link
      href="/carrito"
      aria-label="Carrito de compra"
      title="Carrito de compra"
      className="relative flex items-center justify-center w-9 h-9 rounded-full bg-secondary/10 text-secondary hover:bg-secondary/20 transition-colors"
    >
      <svg className="w-[20px] h-[20px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] rounded-full bg-secondary text-white text-[9px] font-bold flex items-center justify-center px-1 ring-2 ring-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}
