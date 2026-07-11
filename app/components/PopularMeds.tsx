import { getAllMedicineSlugs, getMedicineInfo } from '@/app/utils/medicineInfo'
import { PopularMedsList } from './PopularMedsList'

/* Popular medications (internal links to the transactional /precio pages).
   Server component: computes the catalog server-side (keeps it out of the client
   bundle and gives crawlers direct links), then hands the data to a client list
   so the heading/CTA can be translated. */
export function PopularMeds() {
  const meds = getAllMedicineSlugs()
    .map((slug) => getMedicineInfo(slug))
    .filter((m): m is NonNullable<typeof m> => m !== null)
    .sort((a, b) => a.activeIngredient.localeCompare(b.activeIngredient, 'es'))
    .map((m) => ({ slug: m.slug, activeIngredient: m.activeIngredient, therapeuticClass: m.therapeuticClass }))

  if (meds.length === 0) return null

  return <PopularMedsList meds={meds} />
}
