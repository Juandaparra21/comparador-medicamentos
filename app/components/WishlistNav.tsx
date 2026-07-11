'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import { getWishlist, WISHLIST_EVENT, getWishlistDB } from '@/app/utils/wishlist'
import { useLang } from '@/app/i18n/LanguageProvider'

export function WishlistNav() {
  const { user } = useAuth()
  const { t } = useLang()
  const [count, setCount] = useState(0)
  const userRef = useRef(user)
  userRef.current = user

  useEffect(() => {
    async function refresh() {
      if (userRef.current) {
        const items = await getWishlistDB()
        setCount(items.length)
      } else {
        setCount(0)
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
      aria-label={t('menu.wishlist')}
      title={t('menu.wishlist')}
      className="relative flex items-center justify-center w-9 h-9 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
    >
      <svg
        className="w-[20px] h-[20px]"
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
      {count > 0 && (
        <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] rounded-full bg-red-500 text-white text-[9px] font-bold flex items-center justify-center px-1 ring-2 ring-white">
          {count > 99 ? '99+' : count}
        </span>
      )}
    </Link>
  )
}
