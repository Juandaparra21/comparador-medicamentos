import { createClient } from '@supabase/supabase-js'

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL!
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Singleton — one client per browser session
let client: ReturnType<typeof createClient> | null = null

export function getBrowserClient() {
  if (!client) client = createClient(url, anon)
  return client
}
