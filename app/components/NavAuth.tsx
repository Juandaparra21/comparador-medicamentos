'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'

export function NavAuth() {
  const { user, loading, signOut } = useAuth()
  const router = useRouter()

  if (loading) {
    return <div className="w-20 h-6 rounded-lg bg-white/40 animate-pulse" />
  }

  if (user) {
    const name = (user.user_metadata?.full_name as string | undefined)?.split(' ')[0]
      ?? user.email?.split('@')[0]
      ?? 'Usuario'
    const initial = name.charAt(0).toUpperCase()

    return (
      <div className="flex items-center gap-1.5">
        <Link
          href="/lista"
          title={`Hola, ${name}`}
          className="flex items-center gap-2 pl-1 pr-1 sm:pr-2.5 py-1 rounded-full bg-white/70 border border-[#e5e7eb] hover:border-primary/40 hover:bg-white transition-colors"
        >
          <span className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-tertiary text-white text-[12px] font-bold flex items-center justify-center shrink-0">
            {initial}
          </span>
          <span className="hidden sm:block text-[12px] font-semibold text-[#414755] leading-none max-w-[90px] truncate">
            <span className="text-[#9ca3af] font-medium">Hola,</span> {name}
          </span>
        </Link>
        <button
          onClick={async () => { await signOut(); router.push('/') }}
          title="Cerrar sesión"
          className="flex items-center gap-1.5 h-8 px-2 sm:px-2.5 rounded-full text-[#717786] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
          aria-label="Salir"
        >
          <svg className="w-[18px] h-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
          </svg>
          <span className="hidden sm:inline text-[12px] font-semibold">Salir</span>
        </button>
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
        Ingresar
      </Link>
      <Link
        href="/register"
        className="text-[12px] font-bold px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary to-tertiary text-white hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        Crear cuenta
      </Link>
    </>
  )
}
