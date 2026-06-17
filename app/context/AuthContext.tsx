'use client'

import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { User } from '@supabase/supabase-js'
import { getBrowserClient } from '@/app/lib/supabase/browser'

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
  const sb = getBrowserClient()

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: { subscription } } = sb.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [sb])

  const signIn = useCallback(async (email: string, password: string) => {
    const { error } = await sb.auth.signInWithPassword({ email, password })
    return error ? translateError(error.message) : null
  }, [sb])

  const signUp = useCallback(async (email: string, password: string, name: string) => {
    const { error } = await sb.auth.signUp({
      email,
      password,
      options: { data: { full_name: name } },
    })
    return error ? translateError(error.message) : null
  }, [sb])

  const signOut = useCallback(async () => {
    await sb.auth.signOut()
  }, [sb])

  const signInWithGoogle = useCallback(async () => {
    await sb.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${location.origin}/auth/callback` },
    })
  }, [sb])

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await sb.auth.resetPasswordForEmail(email, {
      redirectTo: `${location.origin}/auth/callback?next=/login`,
    })
    return error ? translateError(error.message) : null
  }, [sb])

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
  if (msg.includes('rate limit'))                return 'Demasiados intentos. Espera unos minutos.'
  return 'Ocurrio un error. Intenta de nuevo.'
}
