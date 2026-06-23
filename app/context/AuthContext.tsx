'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import { getBrowserClient, isBrowserClientAvailable } from '@/app/lib/supabase/browser'

interface AuthCtx {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<string | null>
  signUp: (email: string, password: string, name: string) => Promise<string | null>
  signOut: () => Promise<void>
  signInWithGoogle: () => Promise<void>
  resetPassword: (email: string) => Promise<string | null>
}

const Ctx = createContext<AuthCtx | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user,    setUser]    = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    let unsub: (() => void) | undefined
    getBrowserClient().then((sb) => {
      if (!active) return
      sb.auth.getSession().then(({ data }) => {
        if (!active) return
        setUser(data.session?.user ?? null)
        setLoading(false)
      })
      const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null)
      })
      unsub = () => subscription.unsubscribe()
    })
    return () => { active = false; unsub?.() }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isBrowserClientAvailable()) return 'Autenticacion no configurada.'
    const sb = await getBrowserClient()
    const { error } = await sb.auth.signInWithPassword({ email, password })
    return error ? translateError(error.message) : null
  }, [])

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    if (!isBrowserClientAvailable()) return 'Autenticacion no configurada.'
    const sb = await getBrowserClient()
    const { error } = await sb.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    })
    if (error) console.error('[signUp] Supabase error:', error.message, error)
    return error ? translateError(error.message) : null
  }, [])

  const signOut = useCallback(async () => {
    if (!isBrowserClientAvailable()) return
    const sb = await getBrowserClient()
    await sb.auth.signOut()
  }, [])

  const signInWithGoogle = useCallback(async () => {
    if (!isBrowserClientAvailable()) return
    const sb = await getBrowserClient()
    await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    if (!isBrowserClientAvailable()) return 'Autenticacion no configurada.'
    const sb = await getBrowserClient()
    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/login`,
    })
    return error ? translateError(error.message) : null
  }, [])

  return (
    <Ctx.Provider value={{ user, loading, signIn, signUp, signOut, signInWithGoogle, resetPassword }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}

function translateError(msg: string): string {
  if (msg.includes('Invalid login credentials')) return 'Correo o contrasena incorrectos.'
  if (msg.includes('Email not confirmed'))       return 'Confirma tu correo antes de ingresar.'
  if (msg.includes('User already registered'))   return 'Ya existe una cuenta con ese correo.'
  if (msg.includes('Password should be'))        return 'La contrasena debe tener al menos 6 caracteres.'
  if (msg.includes('rate limit') || msg.includes('over_email_send_rate_limit'))
    return 'Demasiados intentos. Espera unos minutos.'
  if (msg.includes('signup_disabled'))           return 'El registro de nuevas cuentas esta desactivado temporalmente.'
  if (msg.includes('Database error'))            return 'Error interno. Intenta de nuevo en unos minutos.'
  if (msg.includes('invalid format'))            return 'El formato del correo no es valido.'
  if (msg.includes('network') || msg.includes('fetch'))
    return 'Error de conexion. Verifica tu internet.'
  return `Ocurrio un error. Intenta de nuevo. (${msg})`
}
