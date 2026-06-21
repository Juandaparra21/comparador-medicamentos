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

    async function exchange() {
      if (code) {
        // exchangeCodeForSession using the browser client stores the session
        // in localStorage so the AuthProvider picks it up immediately.
        const { error } = await getBrowserClient().auth.exchangeCodeForSession(code)
        if (error) console.error('[auth/callback]', error.message)
      }
      router.replace(next)
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
