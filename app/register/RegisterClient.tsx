'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/app/context/AuthContext'

interface Criterion { label: string; met: boolean }
interface StrengthResult { score: number; label: string; color: string; criteria: Criterion[] }

function analyzePassword(pwd: string): StrengthResult {
  const criteria: Criterion[] = [
    { label: 'Al menos 8 caracteres',       met: pwd.length >= 8 },
    { label: 'Letra mayuscula (A-Z)',        met: /[A-Z]/.test(pwd) },
    { label: 'Letra minuscula (a-z)',        met: /[a-z]/.test(pwd) },
    { label: 'Numero (0-9)',                 met: /[0-9]/.test(pwd) },
    { label: 'Caracter especial (!@#$...)', met: /[^A-Za-z0-9]/.test(pwd) },
  ]
  const score = pwd.length === 0 ? 0 : criteria.filter((c) => c.met).length
  const labels = ['', 'Muy debil', 'Debil', 'Regular', 'Fuerte', 'Muy fuerte']
  const colors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a']
  return { score, label: labels[score] ?? '', color: colors[score] ?? '', criteria }
}

export default function RegisterClient() {
  const { signUp } = useAuth()
  const router = useRouter()

  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirm,  setConfirm]  = useState('')
  const [showPwd,  setShowPwd]  = useState(false)
  const [showConf, setShowConf] = useState(false)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const [done,     setDone]     = useState(false)
  const [sentTo,   setSentTo]   = useState('')

  const strength = analyzePassword(password)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!name.trim())        return setError('Ingresa tu nombre.')
    if (!email.trim())       return setError('Ingresa tu correo electronico.')
    if (strength.score < 3)  return setError('La contrasena es demasiado debil.')
    if (password !== confirm) return setError('Las contrasenas no coinciden.')
    setLoading(true)
    const err = await signUp(email.trim(), password, name.trim())
    setLoading(false)
    if (err) return setError(err)
    setSentTo(email.trim())
    setDone(true)
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="w-14 h-14 rounded-2xl bg-secondary/10 flex items-center justify-center">
          <svg className="w-7 h-7 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-[16px] font-bold text-[#1a1b1f]">Revisa tu correo</p>
        <p className="text-[13px] text-[#717786] max-w-xs">
          Enviamos un enlace de confirmacion a <strong>{sentTo}</strong>. Haz clic en el para activar tu cuenta.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="mt-2 px-5 py-2.5 bg-gradient-to-r from-primary to-tertiary text-white text-[14px] font-semibold rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
        >
          Ir a iniciar sesion
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
      {/* Name */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="text-[12px] font-semibold text-[#414755] tracking-wide">
          Nombre completo
        </label>
        <input
          id="name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Juan Perez"
          className="w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#c1c6d7]/60 text-[14px] text-[#1a1b1f] placeholder:text-[#c1c6d7] focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all"
        />
      </div>

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
        <label htmlFor="password" className="text-[12px] font-semibold text-[#414755] tracking-wide">
          Contrasena
        </label>
        <div className="relative">
          <input
            id="password"
            type={showPwd ? 'text' : 'password'}
            autoComplete="new-password"
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

        {password.length > 0 && (
          <div className="mt-2 flex flex-col gap-2">
            <div className="flex items-center gap-1.5">
              {[1, 2, 3, 4, 5].map((level) => (
                <div key={level} className="flex-1 h-1.5 rounded-full transition-all duration-300"
                  style={{ backgroundColor: strength.score >= level ? strength.color : '#e5e7eb' }} />
              ))}
              <span className="text-[11px] font-bold ml-1 whitespace-nowrap transition-colors duration-300"
                style={{ color: strength.color || '#c1c6d7' }}>
                {strength.label}
              </span>
            </div>
            <div className="grid grid-cols-1 gap-1">
              {strength.criteria.map((c) => (
                <div key={c.label} className="flex items-center gap-1.5">
                  {c.met
                    ? <svg className="w-3.5 h-3.5 text-secondary shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z" clipRule="evenodd" /></svg>
                    : <svg className="w-3.5 h-3.5 text-[#c1c6d7] shrink-0" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" /></svg>
                  }
                  <span className="text-[11px] transition-colors duration-200" style={{ color: c.met ? '#414755' : '#c1c6d7' }}>
                    {c.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirm password */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="confirm" className="text-[12px] font-semibold text-[#414755] tracking-wide">
          Confirmar contrasena
        </label>
        <div className="relative">
          <input
            id="confirm"
            type={showConf ? 'text' : 'password'}
            autoComplete="new-password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="••••••••"
            className={`w-full px-4 py-2.5 pr-11 rounded-xl bg-white/60 border text-[14px] text-[#1a1b1f] placeholder:text-[#c1c6d7] focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all ${
              confirm && confirm !== password ? 'border-red-300 focus:ring-red-200' : 'border-[#c1c6d7]/60'
            }`}
          />
          <button type="button" onClick={() => setShowConf(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#c1c6d7] hover:text-[#717786] transition-colors cursor-pointer"
            aria-label={showConf ? 'Ocultar' : 'Mostrar'}>
            {showConf
              ? <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" /></svg>
              : <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            }
          </button>
        </div>
        {confirm && confirm !== password && (
          <p className="text-[11px] text-red-400 font-medium">Las contrasenas no coinciden</p>
        )}
      </div>

      {error && <p className="text-[12px] text-red-500 font-medium -mt-1">{error}</p>}

      <button type="submit" disabled={loading}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-tertiary text-white text-[14px] font-bold hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-60 shadow-[0_4px_16px_rgba(0,88,188,0.25)] mt-1">
        {loading ? 'Creando cuenta...' : 'Crear cuenta'}
      </button>

      <p className="text-center text-[12px] text-[#717786] mt-1">
        Ya tienes cuenta?{' '}
        <Link href="/login" className="text-primary font-semibold hover:opacity-75 transition-opacity">
          Inicia sesion
        </Link>
      </p>
    </form>
  )
}
