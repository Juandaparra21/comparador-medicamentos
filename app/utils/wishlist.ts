import type { PharmacyResult, WishlistItem } from '@/app/types'

const KEY = 'medicompara_wishlist'
const EVENT = 'medicompara:wishlist'

export function getWishlist(): WishlistItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

function save(list: WishlistItem[]) {
  localStorage.setItem(KEY, JSON.stringify(list))
  window.dispatchEvent(new Event(EVENT))
}

export function addToWishlist(result: PharmacyResult): void {
  const list = getWishlist()
  if (list.some((i) => i.id === result.id)) return
  save([
    ...list,
    {
      id: result.id,
      productName: result.productName,
      activeIngredient: result.activeIngredient,
      concentration: result.concentration,
      pharmacy: result.pharmacy,
      price: result.price,
      type: result.type,
      addedAt: Date.now(),
    },
  ])
}

export function removeFromWishlist(id: string): void {
  save(getWishlist().filter((i) => i.id !== id))
}

export function isInWishlist(id: string): boolean {
  return getWishlist().some((i) => i.id === id)
}

export function WISHLIST_EVENT() {
  return EVENT
}
