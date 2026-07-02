// Single source of truth for how a product's `quantity` field must be interpreted.
//
// `quantity` is a bare number whose MEANING depends on the presentation:
//   - volume forms (jarabe, crema, gel, pomada...): it is the net CONTENT of one
//     container, measured in ml (or g for ointments), NOT a unit count.
//   - everything else (tabletas, capsulas...): it is the COUNT of units in the pack.
//
// Showing a volume as "180 unidades" (or a bare "180") is wrong. Always route
// quantity display / filtering / labelling through these helpers so the unit is
// never lost or mislabelled, and so the presentation sets can never drift apart
// between the scrapers, the cards and the filters again.

// Volume forms: the number is the ml/g content of one container, not a unit count.
export const VOLUME_PRESENTATIONS = new Set([
  'Jarabe', 'Solucion', 'Gotas', 'Suspension', 'Spray', 'Crema', 'Gel', 'Pomada', 'Locion',
])

// Volume forms dosed by weight (ointments) use grams; the rest use millilitres.
const WEIGHT_PRESENTATIONS = new Set(['Pomada'])

// Colombian pharmacies sell many syrups and lotions "por onzas". 1 onza = 30 ml
// is the standard pharmacy equivalence used across the country.
export const ML_PER_ONZA = 30

export function isVolumePresentation(presentation: string): boolean {
  return VOLUME_PRESENTATIONS.has(presentation)
}

// Physical unit of a volume presentation: 'g' for ointments, else 'ml'.
export function volumeUnit(presentation: string): string {
  return WEIGHT_PRESENTATIONS.has(presentation) ? 'g' : 'ml'
}

// Short unit label for a quantity filter/slider: 'ml' / 'g' for volume forms,
// otherwise the generic 'unidades'.
export function quantityUnit(presentation: string): string {
  return isVolumePresentation(presentation) ? volumeUnit(presentation) : 'unidades'
}

// Per-unit price suffix: '/ml', '/g' or '/und'.
export function perUnitSuffix(presentation: string): string {
  return isVolumePresentation(presentation) ? `/${volumeUnit(presentation)}` : '/und'
}

// quantity === 1 means the pack size could not be confirmed from the name, so we
// show the form (e.g. "Tabletas") without asserting a misleading count of 1.
export function formatQuantity(quantity: number, presentation: string): string {
  if (isVolumePresentation(presentation)) {
    return quantity > 1 ? `${quantity}${volumeUnit(presentation)}` : presentation
  }
  if (!presentation) return quantity > 1 ? `× ${quantity}` : ''
  return quantity > 1 ? `${quantity} ${presentation}s` : `${presentation}s`
}
