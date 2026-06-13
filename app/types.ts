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
  discount?: number       // % de descuento vs referencePrice
  referencePrice?: number // precio de referencia antes del descuento
}

export interface WishlistItem {
  id: string
  productName: string
  activeIngredient: string
  concentration: string
  pharmacy: string
  price: number
  type: MedicationType
  addedAt: number
}
