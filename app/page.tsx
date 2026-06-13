import MedicationSearch from '@/app/components/MedicationSearch'

export default function Home() {
  return (
    <>
      <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
        <div className="mx-auto px-4 max-w-5xl h-14 flex items-center justify-between">
          <span className="font-bold text-gray-900 text-lg tracking-tight">
            Medi<span className="text-blue-600">Compara</span>
          </span>
          <span className="text-sm text-gray-400 hidden sm:block">
            Farmacias de Colombia
          </span>
        </div>
      </header>

      <main className="flex-1">
        <MedicationSearch />
      </main>

      <footer className="border-t border-gray-100 py-6 text-center text-xs text-gray-400">
        Precios consultados directamente de las farmacias. Sujetos a cambios.
      </footer>
    </>
  )
}
