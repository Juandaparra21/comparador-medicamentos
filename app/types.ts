export type Availability = 'available' | 'limited' | 'unavailable'

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
}
