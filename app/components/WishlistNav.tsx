'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import { getWishlist, WISHLIST_EVENT, getWishlistDB } from '@/app/utils/wishlist'

export function WishlistNav() {
  const { user } = useAuth()
  const [count, setCount] = useState(0)
  const userRef = useRef(user)
  userRef.current = user

  useEffect(() => {
    async function refresh() {
      if (userRef.current) {
        const items = await getWishlistDB()
        setCount(items.length)
      } else {
        setCount(getWishlist().length)
      }
    }

    refresh()
    window.addEventListener(WISHLIST_EVENT(), refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(WISHLIST_EVENT(), refresh)
      window.removeEventListener('storage', refresh)
    }
  }, [user])

  return (
    <Link
      href="/lista"
      aria-label="Lista de deseos"
      className="relative flex items-center text-[#717786] hover:text-primary transition-colors"
    >
      <svg
        className="w-[22px] h-[22px]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center px-0.5">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}
