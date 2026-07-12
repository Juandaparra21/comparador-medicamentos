import { track } from '@vercel/analytics'

// Evento "outbound_click": un usuario salió hacia la página de una farmacia.
// Es la métrica clave de valor referido (base para futura monetización).
// Propiedades (sin datos personales, Ley 1581):
//   pharmacy: nombre de la farmacia destino (ej. "Cruz Verde")
//   product:  nombre del producto o principio activo clicado
//   price:    precio COP mostrado al momento del clic (opcional)
//   source:   componente de origen ("result_card" | "group_card" | "precio_page")
export function trackOutboundClick(data: {
  pharmacy: string
  product: string
  price?: number
  source: 'result_card' | 'group_card' | 'precio_page'
}) {
  try {
    track('outbound_click', {
      pharmacy: data.pharmacy,
      product: data.product,
      source: data.source,
      ...(typeof data.price === 'number' ? { price: data.price } : {}),
    })
  } catch {
    // La analítica nunca debe romper la navegación hacia la farmacia.
  }
}
