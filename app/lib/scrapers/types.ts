export interface ScrapedProduct {
  pharmacyId: string
  productName: string
  type: 'generic' | 'brand'
  activeIngredient: string
  concentration: string
  presentation: string
  quantity: number
  price: number
  pricePerUnit: number
  referencePrice?: number
  discountPct?: number
  availability: 'available' | 'limited' | 'unavailable'
  url: string
}
