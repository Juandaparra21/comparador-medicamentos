'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { getBrowserClient } from '@/app/lib/supabase/browser'
import { BrandLoader } from '@/app/components/BrandLoader'

function Spinner() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <BrandLoader label="Verificando cuenta..." />
    </div>
  )
}

function ErrorView({ detail }: { detail: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6 text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center">
        <svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
        </svg>
      </div>
      <p className="text-[16px] font-bold text-[#1a1b1f]">No pudimos completar el acceso</p>
      <p className="text-[13px] text-[#717786] max-w-sm">
        Intentalo de nuevo. Si el problema sigue, comparte este detalle con soporte:
      </p>
      <code className="text-[11px] text-[#717786] bg-[#f3f4f6] rounded-lg px-3 py-2 max-w-sm break-words">
        {detail}
      </code>
      <Link
        href="/login"
        className="mt-2 px-5 py-2.5 bg-gradient-to-r from-primary to-tertiary text-white text-[14px] font-semibold rounded-xl hover:opacity-90 transition-opacity"
      >
        Volver a iniciar sesión
      </Link>
    </div>
  )
}

function CallbackInner() {
  const router = useRouter()
  const params = useSearchParams()
  const [errorDetail, setErrorDetail] = useState<string | null>(null)

  useEffect(() => {
    const code = params.get('code')
    const next = params.get('next') ?? '/'

    // Supabase appends ?error=...&error_description=... (or the same in the URL
    // hash) when the provider or the auth server rejects the request. Surface it
    // instead of pretending the login worked.
    function readError(): string | null {
      const qErr = params.get('error_description') || params.get('error')
      if (qErr) return qErr
      const hash = typeof window !== 'undefined' ? window.location.hash.slice(1) : ''
      if (hash) {
        const h = new URLSearchParams(hash)
        const hErr = h.get('error_description') || h.get('error')
        if (hErr) return hErr
      }
      return null
    }

    async function exchange() {
      const providerError = readError()
      if (providerError) {
        setErrorDetail(providerError.replace(/\+/g, ' '))
        return
      }

      const sb = await getBrowserClient()

      if (code) {
        // PKCE flow: Supabase redirects with ?code=xxx
        const { error } = await sb.auth.exchangeCodeForSession(code)
        if (error) {
          setErrorDetail(error.message)
          return
        }
        router.replace(next)
        return
      }

      // Implicit flow fallback: tokens are in the URL hash (#access_token=...).
      // The Supabase client detects these automatically when getSession() is called.
      const { data: { session } } = await sb.auth.getSession()
      if (session) {
        router.replace(next)
        return
      }

      // Wait up to 3 s for onAuthStateChange to fire (hash tokens race with render)
      let done = false
      const { data: { subscription } } = sb.auth.onAuthStateChange((event, s) => {
        if (done) return
        if (event === 'SIGNED_IN' || s) {
          done = true
          subscription.unsubscribe()
          router.replace(next)
        }
      })

      setTimeout(() => {
        if (!done) {
          done = true
          subscription.unsubscribe()
          // No code, no hash tokens, no session materialized: the redirect never
          // carried a valid credential. Show why instead of bouncing to home.
          setErrorDetail('No se recibió ningún código de acceso válido en el enlace de retorno.')
        }
      }, 3_000)
    }

    exchange()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (errorDetail) return <ErrorView detail={errorDetail} />
  return <Spinner />
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <CallbackInner />
    </Suspense>
  )
}
