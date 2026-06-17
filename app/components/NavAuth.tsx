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

    return (
      <div className="flex items-center gap-2.5">
        <Link
          href="/lista"
          className="hidden sm:flex items-center gap-1.5 text-[12px] font-semibold text-[#414755] hover:text-primary transition-colors"
        >
          Hola, {name}
        </Link>
        <button
          onClick={async () => { await signOut(); router.push('/') }}
          className="text-[12px] font-semibold text-[#717786] hover:text-red-500 transition-colors cursor-pointer"
        >
          Salir
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
