import type { PharmacyResult, WishlistItem } from '@/app/types'
import { getBrowserClient, isBrowserClientAvailable } from '@/app/lib/supabase/browser'

export type CartItem = WishlistItem

const KEY   = 'farmi_cart'
const EVENT = 'farmi:cart'

// ---- localStorage (anonymous) ----

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') }
  catch { return [] }
}

function save(list: CartItem[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
  window.dispatchEvent(new Event(EVENT))
}

export function addToCart(result: PharmacyResult): void {
  const list = getCart()
  if (list.some(i => i.id === result.id)) return
  save([...list, {
    id:               result.id,
    productName:      result.productName,
    activeIngredient: result.activeIngredient,
    concentration:    result.concentration,
    pharmacy:         result.pharmacy,
    price:            result.price,
    referencePrice:   result.referencePrice,
    type:             result.type,
    url:              result.url,
    imageUrl:         result.imageUrl,
    addedAt:          Date.now(),
  }])
}

export function removeFromCart(id: string): void {
  save(getCart().filter(i => i.id !== id))
}

export function isInCart(id: string): boolean {
  return getCart().some(i => i.id === id)
}

export function CART_EVENT() { return EVENT }

// ---- Supabase (authenticated) ----

export async function getCartDB(): Promise<CartItem[]> {
  if (!isBrowserClientAvailable()) return []
  const sb = await getBrowserClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data } = await (sb.from('carts') as any).select('*').order('added_at', { ascending: false }) as { data: Record<string, any>[] | null }
  if (!data) return []
  return data.map(r => ({
    id:               r.product_id as string,
    productName:      r.product_name as string,
    activeIngredient: r.active_ingredient as string,
    concentration:    r.concentration as string,
    pharmacy:         r.pharmacy as string,
    price:            r.price as number,
    referencePrice:   r.reference_price as number | undefined,
    type:             r.type as 'generic' | 'brand',
    url:              r.url as string,
    imageUrl:         r.image_url as string | undefined,
    addedAt:          new Date(r.added_at as string).getTime(),
  }))
}

export async function addToCartDB(result: PharmacyResult): Promise<void> {
  if (!isBrowserClientAvailable()) return
  const sb = await getBrowserClient()
  const { data: { user } } = await sb.auth.getUser()
  if (!user) return
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (sb.from('carts') as any).upsert({
    user_id:           user.id,
    product_id:        result.id,
    product_name:      result.productName,
    active_ingredient: result.activeIngredient,
    concentration:     result.concentration,
    pharmacy:          result.pharmacy,
    price:             result.price,
    reference_price:   result.referencePrice ?? null,
    type:              result.type,
    url:               result.url,
    image_url:         result.imageUrl ?? null,
  }, { onConflict: 'user_id,product_id' })
}

export async function removeFromCartDB(productId: string): Promise<void> {
  if (!isBrowserClientAvailable()) return
  const sb = await getBrowserClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  await (sb.from('carts') as any).delete().eq('product_id', productId)
}

export async function isInCartDB(productId: string): Promise<boolean> {
  if (!isBrowserClientAvailable()) return false
  const sb = await getBrowserClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { count } = await (sb.from('carts') as any)
    .select('id', { count: 'exact', head: true })
    .eq('product_id', productId) as { count: number | null }
  return (count ?? 0) > 0
}
