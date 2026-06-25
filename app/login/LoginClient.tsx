'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'
import { GoogleButton } from '@/app/components/GoogleButton'

type View = 'login' | 'forgot' | 'forgot-sent'

export default function LoginClient() {
  const { signIn, resetPassword } = useAuth()
  const router = useRouter()

  const [view,      setView]      = useState<View>('login')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [showPwd,   setShowPwd]   = useState(false)
  const [error,     setError]     = useState('')
  const [loading,   setLoading]   = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim()) return setError('Ingresa tu correo electronico.')
    if (!password)     return setError('Ingresa tu contrasena.')
    setLoading(true)
    const err = await signIn(email.trim(), password)
    setLoading(false)
    if (err) return setError(err)
    router.push('/')
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim()) return setError('Ingresa tu correo electronico.')
    setLoading(true)
    const err = await resetPassword(email.trim())
    setLoading(false)
    if (err) return setError(err)
    setView('forgot-sent')
  }

  if (view === 'forgot-sent') {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
          <svg className="w-7 h-7 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 9v.906a2.25 2.25 0 01-1.183 1.981l-6.478 3.488M2.25 9v.906a2.25 2.25 0 001.183 1.981l6.478 3.488m8.839 2.51l-4.66-2.51m0 0l-1.023-.55a2.25 2.25 0 00-2.134 0l-1.022.55m0 0l-4.661 2.51m16.5 1.615a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V8.844a2.25 2.25 0 011.183-1.98l7.5-4.04a2.25 2.25 0 012.134 0l7.5 4.04a2.25 2.25 0 011.183 1.98V19.5z" />
          </svg>
        </div>
        <p className="text-[16px] font-bold text-[#1a1b1f]">Revisa tu correo</p>
        <p className="text-[13px] text-[#717786] max-w-xs">
          Enviamos un enlace a <strong>{email}</strong> para restablecer tu contrasena.
        </p>
        <button
          onClick={() => setView('login')}
          className="mt-2 text-[13px] font-semibold text-primary hover:opacity-75 transition-opacity cursor-pointer"
        >
          Volver al inicio de sesion
        </button>
      </div>
    )
  }

  if (view === 'forgot') {
    return (
      <form onSubmit={handleForgot} noValidate className="flex flex-col gap-4">
        <div className="mb-1">
          <h3 className="text-[15px] font-bold text-[#1a1b1f]">Restablecer contrasena</h3>
          <p className="text-[12px] text-[#717786] mt-1">
            Ingresa tu correo y te enviaremos un enlace.
          </p>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="email-forgot" className="text-[12px] font-semibold text-[#414755] tracking-wide">
            Correo electronico
          </label>
          <input
            id="email-forgot"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#c1c6d7]/60 text-[14px] text-[#1a1b1f] placeholder:text-[#c1c6d7] focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all"
          />
        </div>
        {error && <p className="text-[12px] text-red-500 font-medium -mt-1">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-tertiary text-white text-[14px] font-bold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 shadow-[0_4px_16px_rgba(0,88,188,0.25)]"
        >
          {loading ? 'Enviando...' : 'Enviar enlace'}
        </button>
        <button type="button" onClick={() => { setView('login'); setError('') }}
          className="text-[12px] text-[#717786] hover:text-primary transition-colors cursor-pointer text-center">
          Volver al inicio de sesion
        </button>
      </form>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <GoogleButton />

      {/* Divider */}
      <div className="flex items-center gap-3" aria-hidden="true">
        <div className="flex-1 h-px bg-[#c1c6d7]/50" />
        <span className="text-[11px] text-[#c1c6d7] font-medium">o</span>
        <div className="flex-1 h-px bg-[#c1c6d7]/50" />
      </div>

      <form onSubmit={handleLogin} noValidate className="flex flex-col gap-4">
      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-[12px] font-semibold text-[#414755] tracking-wide">
          Correo electronico
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@correo.com"
          className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#c1c6d7]/60 text-[14px] text-[#1a1b1f] placeholder:text-[#c1c6d7] focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all"
        />
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-[12px] font-semibold text-[#414755] tracking-wide">
            Contrasena
          </label>
          <button type="button" onClick={() => { setView('forgot'); setError('') }}
            className="text-[11px] text-primary font-semibold hover:opacity-75 transition-opacity cursor-pointer">
            Olvidaste tu contrasena?
          </button>
        </div>
        <div className="relative">
          <input
            id="password"
            type={showPwd ? 'text' : 'password'}
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 pr-11 rounded-xl bg-white/60 border border-[#c1c6d7]/60 text-[14px] text-[#1a1b1f] placeholder:text-[#c1c6d7] focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all"
          />
          <button type="button" onClick={() => setShowPwd(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c1c6d7] hover:text-[#717786] transition-colors cursor-pointer"
            aria-label={showPwd ? 'Ocultar' : 'Mostrar'}>
            {showPwd
              ? <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
              : <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            }
          </button>
        </div>
      </div>

      {error && <p className="text-[12px] text-red-500 font-medium -mt-1">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-tertiary text-white text-[14px] font-bold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 shadow-[0_4px_16px_rgba(0,88,188,0.25)]">
        {loading ? 'Ingresando...' : 'Iniciar sesion'}
      </button>

      <p className="text-center text-[12px] text-[#717786] mt-1">
        No tienes cuenta?{' '}
        <Link href="/register" className="text-primary font-semibold hover:opacity-75 transition-opacity">
          Registrate gratis
        </Link>
      </p>
      </form>
    </div>
  )
}
