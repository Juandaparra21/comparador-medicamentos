import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Service-role client for server-only routes (price tracking, cron snapshots).
// Bypasses RLS, so it must never be imported into client code. No-ops if env is
// missing so the app still builds/runs without Supabase configured.
const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_KEY

let sb: SupabaseClient | null = null

export function getAdminClient(): SupabaseClient | null {
  if (!url || !key) return null
  if (!sb) sb = createClient(url, key, { auth: { persistSession: false } })
  return sb
}
