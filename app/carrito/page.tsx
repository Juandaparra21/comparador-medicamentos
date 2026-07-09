import type { Metadata } from 'next'
import CarritoClient from './CarritoClient'

export const metadata: Metadata = {
  title: 'Carrito',
  description: 'Medicamentos guardados en tu carrito de compra.',
  robots: { index: false, follow: true },
}

export default function CarritoPage() {
  return <CarritoClient />
}
