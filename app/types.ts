export type Availability = 'available' | 'limited' | 'unavailable'
export type MedicationType = 'generic' | 'brand'

export interface PharmacyResult {
  id: string
  pharmacy: string
  productName: string
  activeIngredient: string
  concentration: string
  presentation: string
  quantity: number
  price: number
  pricePerUnit: number
  availability: Availability
  url: string
  type: MedicationType
  discount?: number
  referencePrice?: number
  imageUrl?: string
}

export interface WishlistItem {
  id: string
  productName: string
  activeIngredient: string
  concentration: string
  pharmacy: string
  price: number
  referencePrice?: number
  type: MedicationType
  url: string
  imageUrl?: string
  addedAt: number
}
