'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { getCartDB, CART_EVENT } from '@/app/utils/cart'
import { getWishlistDB, WISHLIST_EVENT } from '@/app/utils/wishlist'
import { useLang } from '@/app/i18n/LanguageProvider'

/* Barra de navegacion inferior (solo movil), como en el diseno de
   referencia: vidrio con blur fuerte, borde superior blanco y la
   pestana activa en azul con icono relleno. En escritorio se oculta
   porque la barra superior ya tiene los mismos accesos. */

function useBadgeCount(getItems: () => Promise<unknown[]>, eventName: string) {
  const { user } = useAuth()
  const [count, setCount] = useState(0)
  const userRef = useRef(user)
  userRef.current = user

  useEffect(() => {
    async function refresh() {
      if (userRef.current) {
        const items = await getItems()
        setCount(items.length)
      } else {
        setCount(0)
      }
    }
    refresh()
    window.addEventListener(eventName, refresh)
    window.addEventListener('storage', refresh)
    return () => {
      window.removeEventListener(eventName, refresh)
      window.removeEventListener('storage', refresh)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return count
}

function Badge({ count }: { count: number }) {
  if (count <= 0) return null
  return (
    <span className="absolute -top-1 -right-2.5 min-w-[16px] h-[16px] rounded-full bg-secondary text-white text-[9px] font-bold flex items-center justify-center px-1 ring-2 ring-white/80">
      {count > 99 ? '99+' : count}
    </span>
  )
}

export function BottomNav() {
  const pathname = usePathname()
  const { t } = useLang()
  const cartCount = useBadgeCount(getCartDB, CART_EVENT())
  const wishCount = useBadgeCount(getWishlistDB, WISHLIST_EVENT())

  const isSearch = pathname === '/' || pathname.startsWith('/buscar') || pathname.startsWith('/precio') || pathname.startsWith('/historial')
  const isCercanas = pathname.startsWith('/cercanas')
  const isLista = pathname.startsWith('/lista')
  const isCarrito = pathname.startsWith('/carrito')

  const itemClass = (active: boolean) =>
    `relative flex flex-col items-center gap-1 flex-1 py-0.5 transition-colors active:scale-95 duration-200 ${
      active ? 'text-primary' : 'text-[#717786] hover:text-primary'
    }`

  return (
    <nav
      aria-label="Navegación inferior"
      className="fixed bottom-0 inset-x-0 z-40 md:hidden flex justify-around items-center px-4 pt-2.5 pb-[calc(0.625rem+env(safe-area-inset-bottom))] bg-white/70 backdrop-blur-2xl border-t border-white/30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-xl"
    >
      <Link href="/" className={itemClass(isSearch)}>
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill={isSearch ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isSearch ? 0 : 2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {isSearch ? (
            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 1 0 0 13.5 6.75 6.75 0 0 0 0-13.5ZM2.25 10.5a8.25 8.25 0 1 1 14.59 5.28l4.69 4.69a.75.75 0 1 1-1.06 1.06l-4.69-4.69A8.25 8.25 0 0 1 2.25 10.5Z" clipRule="evenodd" />
          ) : (
            <>
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.35-4.35" />
            </>
          )}
        </svg>
        <span className="text-[10px] font-semibold uppercase tracking-wider">{t('bottomNav.search')}</span>
      </Link>

      <Link href="/cercanas" className={itemClass(isCercanas)}>
        <svg className="w-6 h-6" viewBox="0 0 24 24" fill={isCercanas ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isCercanas ? 0 : 2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {isCercanas ? (
            <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 0 0 .723 0l.028-.015.071-.041a16.975 16.975 0 0 0 1.144-.742 19.58 19.58 0 0 0 2.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 0 0-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 0 0 2.682 2.282 16.975 16.975 0 0 0 1.145.742ZM12 13.5a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" clipRule="evenodd" />
          ) : (
            <>
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </>
          )}
        </svg>
        <span className="text-[10px] font-semibold uppercase tracking-wider">{t('nav.cercanasShort')}</span>
      </Link>

      <Link href="/lista" className={itemClass(isLista)}>
        <span className="relative">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill={isLista ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={isLista ? 0 : 2} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <Badge count={wishCount} />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider">{t('bottomNav.list')}</span>
      </Link>

      <Link href="/carrito" className={itemClass(isCarrito)}>
        <span className="relative">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" fill={isCarrito ? 'currentColor' : 'none'} fillOpacity={isCarrito ? 0.15 : 0} />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <Badge count={cartCount} />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider">{t('bottomNav.cart')}</span>
      </Link>
    </nav>
  )
}
