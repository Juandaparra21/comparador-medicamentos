import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// These are public keys — safe to expose in client code (anon key has no elevated privileges)
const SUPABASE_URL  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? 'https://rcjidvjbybbtutfeerzk.supabase.co'
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'sb_publishable_7V2QG3IJ3VvuXJu8q3uagQ_vzOtwsV4'

let client: SupabaseClient | null = null

export function getBrowserClient(): SupabaseClient {
  if (!client) client = createClient(SUPABASE_URL, SUPABASE_ANON)
  return client
}

export function isBrowserClientAvailable(): boolean {
  return true
}
