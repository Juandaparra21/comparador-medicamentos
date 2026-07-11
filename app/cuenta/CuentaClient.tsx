'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/context/AuthContext'
import { getBrowserClient } from '@/app/lib/supabase/browser'

type Msg = { ok: boolean; text: string } | null

export default function CuentaClient() {
  const { user, loading: authLoading, signOut } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // Perfil (nombre)
  const [name,      setName]      = useState('')
  const [savingName, setSavingName] = useState(false)
  const [nameMsg,   setNameMsg]   = useState<Msg>(null)

  // Contrasena
  const [pwd,     setPwd]     = useState('')
  const [pwd2,    setPwd2]    = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [savingPwd, setSavingPwd] = useState(false)
  const [pwdMsg,  setPwdMsg]  = useState<Msg>(null)

  // Eliminar cuenta
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteText, setDeleteText] = useState('')
  const [deleting,   setDeleting]   = useState(false)
  const [deleteErr,  setDeleteErr]  = useState('')

  useEffect(() => {
    const current = (user?.user_metadata?.full_name as string | undefined) ?? ''
    setName(current)
  }, [user])

  if (!mounted || authLoading) return null

  if (!user) {
    return (
      <section className="mx-auto px-4 sm:px-5 max-w-lg pt-16 pb-16 flex flex-col items-center text-center gap-5">
        <div className="w-16 h-16 rounded-2xl glass-card rounded-2xl flex items-center justify-center">
          <svg className="w-8 h-8 text-[#c1c6d7]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
          </svg>
        </div>
        <div>
          <p className="text-[18px] font-bold text-[#1a1b1f] mb-1">Necesitas una cuenta</p>
          <p className="text-[13px] text-[#717786]">Inicia sesión para ver y administrar tu cuenta.</p>
        </div>
        <div className="flex gap-3">
          <Link href="/login" className="px-5 py-2.5 bg-gradient-to-r from-primary to-tertiary text-white text-[14px] font-semibold rounded-xl hover:opacity-90 transition-opacity">
            Iniciar sesión
          </Link>
          <Link href="/register" className="px-5 py-2.5 bg-white/70 border border-white/50 text-[#414755] text-[14px] font-semibold rounded-xl hover:bg-white/90 transition-all">
            Crear cuenta
          </Link>
        </div>
      </section>
    )
  }

  const email    = user.email ?? ''
  const provider = (user.app_metadata?.provider as string | undefined) ?? 'email'
  const isGoogle = provider === 'google'
  const displayName = (user.user_metadata?.full_name as string | undefined) ?? email.split('@')[0] ?? 'Usuario'
  const initial = displayName.charAt(0).toUpperCase()

  async function saveName() {
    setNameMsg(null)
    if (!name.trim()) { setNameMsg({ ok: false, text: 'Ingresa tu nombre.' }); return }
    setSavingName(true)
    const sb = await getBrowserClient()
    const { error } = await sb.auth.updateUser({ data: { full_name: name.trim() } })
    setSavingName(false)
    setNameMsg(error ? { ok: false, text: 'No se pudo guardar. Intenta de nuevo.' } : { ok: true, text: 'Nombre actualizado.' })
  }

  async function savePassword() {
    setPwdMsg(null)
    if (pwd.length < 8)   { setPwdMsg({ ok: false, text: 'La contraseña debe tener al menos 8 caracteres.' }); return }
    if (pwd !== pwd2)     { setPwdMsg({ ok: false, text: 'Las contraseñas no coinciden.' }); return }
    setSavingPwd(true)
    const sb = await getBrowserClient()
    const { error } = await sb.auth.updateUser({ password: pwd })
    setSavingPwd(false)
    if (error) { setPwdMsg({ ok: false, text: `No se pudo cambiar. (${error.message})` }); return }
    setPwd(''); setPwd2('')
    setPwdMsg({ ok: true, text: isGoogle ? 'Contraseña establecida. Ya puedes entrar también con tu correo.' : 'Contraseña actualizada.' })
  }

  async function doLogout() {
    await signOut()
    router.push('/')
  }

  async function doDelete() {
    setDeleteErr('')
    setDeleting(true)
    try {
      const sb = await getBrowserClient()
      const { data: { session } } = await sb.auth.getSession()
      const token = session?.access_token
      if (!token) { setDeleteErr('Sesión no válida. Vuelve a iniciar sesión.'); setDeleting(false); return }
      const res = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok || !data.ok) {
        setDeleteErr(data.error === 'unavailable'
          ? 'La eliminación no está disponible en este momento.'
          : 'No se pudo eliminar la cuenta. Intenta de nuevo.')
        setDeleting(false)
        return
      }
      await sb.auth.signOut()
      router.push('/')
    } catch {
      setDeleteErr('Error de conexión. Intenta de nuevo.')
      setDeleting(false)
    }
  }

  const inputCls = 'w-full px-4 py-2.5 rounded-xl bg-white/60 border border-[#c1c6d7]/60 text-[14px] text-[#1a1b1f] placeholder:text-[#c1c6d7] focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary transition-all'

  return (
    <section className="mx-auto px-4 sm:px-5 max-w-2xl pt-8 pb-16">
      {/* Encabezado */}
      <div className="flex items-center gap-4 mb-6">
        <span className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-tertiary text-white text-[22px] font-bold flex items-center justify-center shrink-0">
          {initial}
        </span>
        <div className="min-w-0">
          <h1 className="text-[20px] sm:text-[24px] font-bold text-[#1a1b1f] tracking-tight truncate">{displayName}</h1>
          <p className="text-[13px] text-[#717786] truncate">{email}</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {/* Perfil */}
        <div className="glass-card rounded-2xl p-5">
          <h2 className="text-[15px] font-bold text-[#1a1b1f] mb-3">Perfil</h2>
          <label className="block text-[12px] font-semibold text-[#414755] mb-1.5">Nombre</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Tu nombre" className={inputCls} />
          <label className="block text-[12px] font-semibold text-[#414755] mt-4 mb-1.5">Correo electrónico</label>
          <input value={email} disabled className={`${inputCls} opacity-70 cursor-not-allowed`} />
          <p className="text-[11px] text-[#9ca3af] mt-1.5">El correo no se puede cambiar desde aquí.</p>
          {nameMsg && (
            <p className={`text-[12px] font-medium mt-3 ${nameMsg.ok ? 'text-secondary' : 'text-red-500'}`}>{nameMsg.text}</p>
          )}
          <button onClick={saveName} disabled={savingName}
            className="mt-4 px-5 py-2.5 bg-gradient-to-r from-primary to-tertiary text-white text-[13px] font-semibold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity cursor-pointer">
            {savingName ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>

        {/* Seguridad */}
        <div className="glass-card rounded-2xl p-5">
          <h2 className="text-[15px] font-bold text-[#1a1b1f] mb-1">{isGoogle ? 'Establecer contraseña' : 'Cambiar contraseña'}</h2>
          <p className="text-[12px] text-[#717786] mb-3">
            {isGoogle
              ? 'Entras con Google. Si quieres, crea una contraseña para también poder entrar con tu correo.'
              : 'Usa al menos 8 caracteres.'}
          </p>
          <div className="relative">
            <input type={showPwd ? 'text' : 'password'} autoComplete="new-password" value={pwd}
              onChange={(e) => setPwd(e.target.value)} placeholder="Nueva contraseña" className={`${inputCls} pr-11`} />
            <button type="button" onClick={() => setShowPwd(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-semibold text-[#717786] hover:text-primary cursor-pointer">
              {showPwd ? 'Ocultar' : 'Ver'}
            </button>
          </div>
          <input type={showPwd ? 'text' : 'password'} autoComplete="new-password" value={pwd2}
            onChange={(e) => setPwd2(e.target.value)} placeholder="Repetir contraseña" className={`${inputCls} mt-2.5`} />
          {pwdMsg && (
            <p className={`text-[12px] font-medium mt-3 ${pwdMsg.ok ? 'text-secondary' : 'text-red-500'}`}>{pwdMsg.text}</p>
          )}
          <button onClick={savePassword} disabled={savingPwd || !pwd}
            className="mt-4 px-5 py-2.5 bg-gradient-to-r from-primary to-tertiary text-white text-[13px] font-semibold rounded-xl hover:opacity-90 disabled:opacity-60 transition-opacity cursor-pointer">
            {savingPwd ? 'Guardando...' : isGoogle ? 'Establecer contraseña' : 'Actualizar contraseña'}
          </button>
        </div>

        {/* Accesos rápidos */}
        <div className="glass-card rounded-2xl p-5">
          <h2 className="text-[15px] font-bold text-[#1a1b1f] mb-3">Mis guardados</h2>
          <div className="flex flex-col sm:flex-row gap-2.5">
            <Link href="/carrito" className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white/60 border border-[#c1c6d7]/40 hover:border-secondary/40 hover:bg-white transition-colors">
              <span className="w-8 h-8 rounded-full bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" /></svg>
              </span>
              <span className="text-[13px] font-semibold text-[#414755]">Carrito de compra</span>
            </Link>
            <Link href="/lista" className="flex-1 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-white/60 border border-[#c1c6d7]/40 hover:border-red-300 hover:bg-white transition-colors">
              <span className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center shrink-0">
                <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="currentColor"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" /></svg>
              </span>
              <span className="text-[13px] font-semibold text-[#414755]">Lista de deseos</span>
            </Link>
          </div>
        </div>

        {/* Sesión */}
        <button onClick={doLogout}
          className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-white/70 border border-[#c1c6d7]/50 text-[14px] font-semibold text-[#414755] hover:bg-white transition-colors cursor-pointer">
          <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3" />
          </svg>
          Cerrar sesión
        </button>

        {/* Zona de peligro */}
        <div className="bg-red-50/70 border border-red-200 rounded-2xl p-5">
          <h2 className="text-[15px] font-bold text-red-600 mb-1">Eliminar cuenta</h2>
          <p className="text-[12px] text-[#717786] mb-3 leading-relaxed">
            Borra tu cuenta y todos tus datos (carrito y lista de deseos) de forma permanente. Esta acción no se puede deshacer.
            Conforme a la Ley 1581 de 2012 (Habeas Data), puedes eliminar tus datos cuando quieras.
          </p>

          {!deleteOpen ? (
            <button onClick={() => setDeleteOpen(true)}
              className="px-5 py-2.5 rounded-xl border border-red-300 text-red-600 text-[13px] font-semibold hover:bg-red-100 transition-colors cursor-pointer">
              Eliminar mi cuenta
            </button>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="text-[12px] font-medium text-[#414755]">
                Para confirmar, escribe <strong className="text-red-600">ELIMINAR</strong> y toca el botón.
              </p>
              <input value={deleteText} onChange={(e) => setDeleteText(e.target.value)} placeholder="ELIMINAR"
                className={`${inputCls} border-red-300 focus:ring-red-200 focus:border-red-400`} />
              {deleteErr && <p className="text-[12px] text-red-500 font-medium">{deleteErr}</p>}
              <div className="flex gap-2.5">
                <button onClick={doDelete} disabled={deleteText.trim().toUpperCase() !== 'ELIMINAR' || deleting}
                  className="px-5 py-2.5 rounded-xl bg-red-500 text-white text-[13px] font-bold hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer">
                  {deleting ? 'Eliminando...' : 'Sí, eliminar definitivamente'}
                </button>
                <button onClick={() => { setDeleteOpen(false); setDeleteText(''); setDeleteErr('') }}
                  className="px-5 py-2.5 rounded-xl bg-white/70 border border-[#c1c6d7]/50 text-[13px] font-semibold text-[#414755] hover:bg-white transition-colors cursor-pointer">
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="text-[11px] text-[#9ca3af] text-center mt-1">
          Manejamos tus datos según nuestra{' '}
          <Link href="/privacidad" className="text-primary font-semibold hover:opacity-75">política de privacidad</Link>.
        </p>
      </div>
    </section>
  )
}
