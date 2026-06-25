import { Suspense } from 'react'
import ListaClient from './ListaClient'

export const metadata = {
  title: 'Lista de deseos - Farmi',
  robots: { index: false, follow: true },
}

export default function ListaPage() {
  return (
    <Suspense>
      <ListaClient />
    </Suspense>
  )
}
