import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import type { ScrapedProduct } from './types'

// Server-side cache for scraper results, used to smooth over intermittent source
// failures (e.g. Cloudflare blocking Vercel's IP for a given request). Accessed
// only with the service key, server-side. If env is missing it no-ops.
const url = process.env.SUPABASE_URL
const key = process.env.SUPABASE_SERVICE_KEY

let sb: SupabaseClient | null = null
function client(): SupabaseClient | null {
  if (!url || !key) return null
  if (!sb) sb = createClient(url, key, { auth: { persistSession: false } })
  return sb
}

const FRESH_MS = 10 * 60 * 1000 // serve without re-fetching for 10 min

export interface CacheHit {
  results: ScrapedProduct[]
  fresh:   boolean
}

export async function getCache(pharmacy: string, query: string): Promise<CacheHit | null> {
  const db = client()
  if (!db) return null
  try {
    const { data } = await db
      .from('scraper_cache')
      .select('results, updated_at')
      .eq('pharmacy', pharmacy)
      .eq('query', query)
      .maybeSingle()
    if (!data) return null
    const age = Date.now() - new Date(data.updated_at as string).getTime()
    return { results: (data.results as ScrapedProduct[]) ?? [], fresh: age < FRESH_MS }
  } catch {
    return null
  }
}

export async function setCache(pharmacy: string, query: string, results: ScrapedProduct[]): Promise<void> {
  const db = client()
  if (!db || results.length === 0) return
  try {
    await db.from('scraper_cache').upsert(
      { pharmacy, query, results, updated_at: new Date().toISOString() },
      { onConflict: 'pharmacy,query' },
    )
  } catch {
    // best-effort; a cache write failure must never break search
  }
}
