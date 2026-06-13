import MedicationSearch from '@/app/components/MedicationSearch'

export default function Home() {
  return (
    <>
      {/* Glass header — Level 1 elevation */}
      <header className="sticky top-0 z-20 bg-white/70 backdrop-blur-xl border-b border-white/50 shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        <div className="mx-auto px-5 max-w-5xl h-14 flex items-center justify-between">
          <span className="font-bold text-[17px] tracking-tight select-none">
            <span className="text-[#1a1b1f]">Medi</span>
            <span className="text-primary">Compara</span>
          </span>
          <span className="text-[12px] font-semibold tracking-[0.05em] uppercase text-[#717786] hidden sm:block">
            Farmacias de Colombia
          </span>
        </div>
      </header>

      <main className="flex-1">
        <MedicationSearch />
      </main>

      <footer className="border-t border-[#c1c6d7]/30 py-6 text-center text-[12px] text-[#717786]">
        Precios consultados directamente de las farmacias. Sujetos a cambios.
      </footer>
    </>
  )
}
