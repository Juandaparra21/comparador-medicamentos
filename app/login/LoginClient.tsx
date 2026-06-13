'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginClient() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd]   = useState(false)
  const [error, setError]       = useState('')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!email.trim()) return setError('Ingresa tu correo electronico.')
    if (!password)     return setError('Ingresa tu contrasena.')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
          <svg className="w-7 h-7 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <p className="text-[16px] font-bold text-[#1a1b1f]">Backend en desarrollo</p>
        <p className="text-[13px] text-[#717786] max-w-xs">
          La autenticacion estara disponible muy pronto. Mientras tanto puedes usar todas las funciones de busqueda.
        </p>
        <Link
          href="/"
          className="mt-2 px-5 py-2.5 bg-gradient-to-r from-primary to-tertiary text-white text-[14px] font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Volver al inicio
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
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
          <button
            type="button"
            className="text-[11px] text-primary font-semibold hover:opacity-75 transition-opacity cursor-pointer"
          >
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
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c1c6d7] hover:text-[#717786] transition-colors cursor-pointer"
            aria-label={showPwd ? 'Ocultar contrasena' : 'Mostrar contrasena'}
          >
            {showPwd ? (
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <p className="text-[12px] text-red-500 font-medium -mt-1">{error}</p>
      )}

      {/* Submit */}
      <button
        type="submit"
        className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-tertiary text-white text-[14px] font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-[0_4px_16px_rgba(0,88,188,0.25)]"
      >
        Iniciar sesion
      </button>

      {/* Divider */}
      <div className="flex items-center gap-3 my-1">
        <div className="flex-1 h-px bg-[#e5e7eb]" />
        <span className="text-[11px] text-[#c1c6d7] font-medium">o continua con</span>
        <div className="flex-1 h-px bg-[#e5e7eb]" />
      </div>

      {/* Google */}
      <button
        type="button"
        onClick={() => setSubmitted(true)}
        className="w-full flex items-center justify-center gap-3 py-2.5 rounded-xl bg-white/80 border border-[#e5e7eb] text-[14px] font-semibold text-[#1a1b1f] hover:bg-white hover:shadow-sm transition-all cursor-pointer"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
          <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
        </svg>
        Continuar con Google
      </button>

      <p className="text-center text-[12px] text-[#717786] mt-1">
        No tienes cuenta?{' '}
        <Link href="/register" className="text-primary font-semibold hover:opacity-75 transition-opacity">
          Registrate gratis
        </Link>
      </p>
    </form>
  )
}
