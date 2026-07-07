import type { SupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON } from './config'

let clientPromise: Promise<SupabaseClient> | null = null

// Lazy: @supabase/supabase-js is ~224KB. Loading it via dynamic import keeps it
// out of every page's initial bundle (it was on the critical path through
// AuthProvider in the root layout). It now loads as a separate chunk after the
// page is interactive / on first auth use.
export function getBrowserClient(): Promise<SupabaseClient> {
  if (!clientPromise) {
    clientPromise = import('@supabase/supabase-js').then(({ createClient }) =>
      // Implicit flow: tokens come back in the URL hash, so there is no PKCE
      // code_verifier to lose. PKCE stores that verifier in localStorage, which
      // breaks whenever the return lands on a different origin (www vs non-www)
      // or a different browser context (in-app browsers on mobile — 80%+ of our
      // traffic). Implicit sidesteps that entire failure class for a purely
      // client-side auth. /auth/callback already handles the hash-token path.
      createClient(SUPABASE_URL, SUPABASE_ANON, { auth: { flowType: 'implicit' } }),
    )
  }
  return clientPromise
}

export function isBrowserClientAvailable(): boolean {
  return true
}
