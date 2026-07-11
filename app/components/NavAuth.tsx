'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { useLang } from '@/app/i18n/LanguageProvider'
import { ThemeToggle } from '@/app/components/ThemeToggle'

export function NavAuth() {
  const { user, loading, signOut } = useAuth()
  const { t } = useLang()
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
    }
  }, [])

  if (loading) {
    return <div className="w-9 h-9 rounded-full bg-white/40 animate-pulse" />
  }

  if (user) {
    const name = (user.user_metadata?.full_name as string | undefined)?.split(' ')[0]
      ?? user.email?.split('@')[0]
      ?? 'Usuario'
    const initial = name.charAt(0).toUpperCase()
    const email = user.email ?? ''

    async function doLogout() {
      setOpen(false)
      await signOut()
      router.push('/')
    }

    return (
      <div className="relative" ref={ref}>
        <button
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-haspopup="menu"
          title={`Mi cuenta · ${name}`}
          className="flex items-center gap-2 pl-1 pr-1 sm:pr-2 py-1 rounded-full bg-white/70 border border-[#e5e7eb] hover:border-primary/40 hover:bg-white transition-colors cursor-pointer"
        >
          <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-tertiary text-white text-[12px] font-bold flex items-center justify-center shrink-0">
            {initial}
          </span>
          <span className="hidden sm:block text-[12px] font-semibold text-[#414755] leading-none max-w-[90px] truncate">
            <span className="text-[#9ca3af] font-medium">{t('nav.hello')}</span> {name}
          </span>
          <svg className={`hidden sm:block w-3.5 h-3.5 text-[#9ca3af] transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z" clipRule="evenodd" />
          </svg>
        </button>

        {open && (
          <div
            role="menu"
            className="absolute right-0 top-full mt-2 w-60 glass-card-opaque rounded-2xl shadow-[0_12px_32px_rgba(0,88,188,0.14)] overflow-hidden z-50 animate-in fade-in slide-in-from-top-1 duration-150"
          >
            {/* Cabecera */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#f0f1f5]">
              <span className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-tertiary text-white text-[14px] font-bold flex items-center justify-center shrink-0">
                {initial}
              </span>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-[#1a1b1f] truncate">{name}</p>
                <p className="text-[11px] text-[#717786] truncate">{email}</p>
              </div>
            </div>

            {/* Opciones */}
            <div className="py-1.5">
              <MenuLink href="/cuenta" onClick={() => setOpen(false)} label={t('menu.account')}
                icon={<path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />} />
              <MenuLink href="/carrito" onClick={() => setOpen(false)} label={t('menu.cart')}
                icon={<><path strokeLinecap="round" strokeLinejoin="round" d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18M16 10a4 4 0 01-8 0" /></>} />
              <MenuLink href="/lista" onClick={() => setOpen(false)} label={t('menu.wishlist')}
                icon={<path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />} />
            </div>

            {/* Apariencia */}
            <div className="border-t border-[#f0f1f5] px-4 py-3 flex items-center justify-between gap-3">
              <span className="text-[13px] font-semibold text-[#414755]">{t('menu.appearance')}</span>
              <ThemeToggle />
            </div>

            <div className="border-t border-[#f0f1f5] py-1.5">
              <button
                onClick={doLogout}
                role="menuitem"
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-[#717786] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
                </svg>
                {t('menu.logout')}
              </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <Link
        href="/login"
        className="hidden sm:flex items-center gap-1.5 text-[12px] font-semibold text-[#414755] hover:text-primary transition-colors"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
        </svg>
        {t('nav.login')}
      </Link>
      <Link
        href="/register"
        className="text-[12px] font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary to-tertiary text-white hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        {t('nav.register')}
      </Link>
    </>
  )
}

function MenuLink({ href, label, onClick, icon }: { href: string; label: string; onClick: () => void; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      role="menuitem"
      className="flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold text-[#414755] hover:bg-black/[0.03] hover:text-primary transition-colors"
    >
      <svg className="w-[18px] h-[18px] shrink-0 text-[#9ca3af]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        {icon}
      </svg>
      {label}
    </Link>
  )
}
