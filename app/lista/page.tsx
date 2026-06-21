import { Suspense } from 'react'
import ListaClient from './ListaClient'

export const metadata = {
  title: 'Lista de deseos - Farmi',
}

export default function ListaPage() {
  return (
    <Suspense>
      <ListaClient />
    </Suspense>
  )
}
