import type { PharmacyResult, WishlistItem } from '@/app/types'
import { getBrowserClient, isBrowserClientAvailable } from '@/app/lib/supabase/browser'

const KEY   = 'medicompara_wishlist'
const EVENT = 'medicompara:wishlist'

// ---- localStorage (anonymous) ----

export function getWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') }
  catch { return [] }
}

function save(list: WishlistItem[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
  window.dispatchEvent(new Event(EVENT))
}

export function addToWishlist(result: PharmacyResult): void {
  const list = getWishlist()
  if (list.some((i) => i.id === result.id)) return
  save([...list, {
    id: result.id,
    productName: result.productName,
    activeIngredient: result.activeIngredient,
    concentration: result.concentration,
    pharmacy: result.pharmacy,
    price: result.price,
    type: result.type,
    url: result.url,
    imageUrl: result.imageUrl,
    addedAt: Date.now(),
  }])
}

export function removeFromWishlist(id: string): void {
  save(getWishlist().filter((i) => i.id !== id))
}

export function isInWishlist(id: string): boolean {
  return getWishlist().some((i) => i.id === id)
}

export function WISHLIST_EVENT() { return EVENT }

// ---- Supabase (authenticated) ----

export async function getWishlistDB(): Promise<WishlistItem[]> {
  if (!isBrowserClientAvailable()) return []
  const sb = getBrowserClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (sb.from('wishlists') as any).select('*').order('added_at', { ascending: false }) as { data: Record<string, any>[] | null }
  if (!data) return []
  return data.map(r => ({
    id:              r.product_id as string,
    productName:     r.product_name as string,
    activeIngredient: r.active_ingredient as string,
    concentration:   r.concentration as string,
    pharmacy:        r.pharmacy as string,
    price:           r.price as number,
    type:            r.type as 'generic' | 'brand',
    url:             r.url as string,
    imageUrl:        r.image_url as string | undefined,
    addedAt:         new Date(r.added_at as string).getTime(),
  }))
}

export async function addToWishlistDB(result: PharmacyResult): Promise<void> {
  if (!isBrowserClientAvailable()) return
  const sb = getBrowserClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (sb.from('wishlists') as any).upsert({
    user_id:          user.id,
    product_id:       result.id,
    product_name:     result.productName,
    active_ingredient: result.activeIngredient,
    concentration:    result.concentration,
    pharmacy:         result.pharmacy,
    price:            result.price,
    type:             result.type,
    url:              result.url,
    image_url:        result.imageUrl ?? null,
  }, { onConflict: 'user_id,product_id' })
}

export async function removeFromWishlistDB(productId: string): Promise<void> {
  if (!isBrowserClientAvailable()) return
  const sb = getBrowserClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (sb.from('wishlists') as any).delete().eq('product_id', productId)
}

export async function isInWishlistDB(productId: string): Promise<boolean> {
  if (!isBrowserClientAvailable()) return false
  const sb = getBrowserClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count } = await (sb.from('wishlists') as any)
    .select('id', { count: 'exact', head: true })
    .eq('product_id', productId) as { count: number | null }
  return (count ?? 0) > 0
}
