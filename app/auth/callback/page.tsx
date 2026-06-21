'use client'

import { Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getBrowserClient } from '@/app/lib/supabase/browser'

function Spinner() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 text-[#717786]">
      <div className="w-10 h-10 border-4 border-white/50 border-t-primary rounded-full animate-spin" />
      <p className="text-[14px]">Verificando cuenta...</p>
    </div>
  )
}

function CallbackInner() {
  const router = useRouter()
  const params = useSearchParams()

  useEffect(() => {
    const code = params.get('code')
    const next = params.get('next') ?? '/'
    const sb = getBrowserClient()

    async function exchange() {
      if (code) {
        // PKCE flow: Supabase redirects with ?code=xxx
        const { error } = await sb.auth.exchangeCodeForSession(code)
        if (error) console.error('[auth/callback] exchangeCodeForSession:', error.message)
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
          router.replace(next)
        }
      }, 3_000)
    }

    exchange()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Spinner />
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <CallbackInner />
    </Suspense>
  )
}
