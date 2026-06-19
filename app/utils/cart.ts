import type { PharmacyResult, WishlistItem } from '@/app/types'

export type CartItem = WishlistItem

const KEY   = 'medicompara_cart'
const EVENT = 'medicompara:cart'

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
