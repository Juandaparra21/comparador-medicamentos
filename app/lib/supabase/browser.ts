import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let client: SupabaseClient | null = null

export function getBrowserClient(): SupabaseClient {
  if (!url || !anon) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. ' +
      'Add these to your Vercel environment variables and redeploy.'
    )
  }
  if (!client) client = createClient(url, anon)
  return client
}

export function isBrowserClientAvailable(): boolean {
  return Boolean(url && anon)
}
