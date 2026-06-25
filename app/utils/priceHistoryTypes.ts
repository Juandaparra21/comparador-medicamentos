// Shared shapes for the real price-history chart. Kept framework-neutral (no
// 'use client') so both the server tracking lib and the client chart can import it.
export interface PricePoint {
  label: string
  price: number
}

export interface PharmacyHistory {
  pharmacy: string
  color: string
  data: PricePoint[]
}
