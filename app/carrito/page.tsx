import type { Metadata } from 'next'
import CarritoClient from './CarritoClient'

export const metadata: Metadata = {
  title: 'Carrito - FarmiYa',
  description: 'Medicamentos guardados en tu carrito de compra.',
}

export default function CarritoPage() {
  return <CarritoClient />
}
