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
      createClient(SUPABASE_URL, SUPABASE_ANON, { auth: { flowType: 'pkce' } }),
    )
  }
  return clientPromise
}

export function isBrowserClientAvailable(): boolean {
  return true
}
