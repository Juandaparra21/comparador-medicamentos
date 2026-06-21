import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON } from './config'

let client: SupabaseClient | null = null

export function getBrowserClient(): SupabaseClient {
  if (!client) client = createClient(SUPABASE_URL, SUPABASE_ANON, {
    auth: { flowType: 'pkce' },
  })
  return client
}

export function isBrowserClientAvailable(): boolean {
  return true
}
