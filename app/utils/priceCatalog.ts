import { getAllMedicineSlugs, getMedicineInfo } from '@/app/utils/medicineInfo'
import { normalize } from '@/app/utils/search'

// Catalogo de paginas /precio/[slug].
//
// Antes cada pagina de precio dependia de una ficha medica completa escrita a
// mano (medicineInfo.ts). Eso limitaba el catalogo a unas decenas de
// medicamentos. Una pagina de precio solo necesita el nombre, la consulta que
// se raspa y el grupo terapeutico, asi que este modulo une:
//   1. Las fichas completas existentes (medicineInfo.ts), sin cambios.
//   2. Entradas livianas (EXTRA_ENTRIES) sin informacion clinica.
//
// Reglas para EXTRA_ENTRIES:
// - Sin dosis, usos ni advertencias: Farmi no da informacion medica.
// - requiresPrescription solo se pone en true cuando es seguro (antibioticos,
//   controlados, psiquiatricos, GLP-1, anticoagulantes...). Nunca en false:
//   si no se sabe, se deja sin definir y la pagina usa un texto neutro.
// - brands solo con marcas que contienen ese principio activo.
// - Priorizadas por busquedas reales en Farmi (tabla search_events) y por
//   volumen de uso en Colombia.
//
// Una pagina sin precios guardados se sirve con noindex y no entra al sitemap
// hasta que el cron de snapshot guarde su primer precio.

export interface PriceEntry {
  slug: string
  activeIngredient: string
  /** Texto que se raspa y clave en price_snapshots / tracked_medications. */
  query: string
  therapeuticClass: string
  /** true = requiere formula. undefined = no se afirma nada. */
  requiresPrescription?: boolean
  /** Marcas comerciales que contienen este principio activo. */
  brands?: string[]
}

type Extra = Omit<PriceEntry, 'query'> & { query?: string }

const EXTRA_ENTRIES: Extra[] = [
  // Busquedas reales frecuentes en Farmi
  { slug: 'alprazolam', activeIngredient: 'Alprazolam', therapeuticClass: 'Ansiolítico (benzodiacepina)', requiresPrescription: true, brands: ['Xanax'] },
  { slug: 'clonazepam', activeIngredient: 'Clonazepam', therapeuticClass: 'Ansiolítico y anticonvulsivante (benzodiacepina)', requiresPrescription: true, brands: ['Rivotril'] },
  { slug: 'diazepam', activeIngredient: 'Diazepam', therapeuticClass: 'Ansiolítico (benzodiacepina)', requiresPrescription: true },
  { slug: 'lorazepam', activeIngredient: 'Lorazepam', therapeuticClass: 'Ansiolítico (benzodiacepina)', requiresPrescription: true, brands: ['Ativan'] },
  { slug: 'semaglutida', activeIngredient: 'Semaglutida', therapeuticClass: 'Antidiabético (agonista del receptor GLP-1)', requiresPrescription: true, brands: ['Ozempic', 'Wegovy', 'Rybelsus'] },
  { slug: 'tirzepatida', activeIngredient: 'Tirzepatida', therapeuticClass: 'Antidiabético (agonista dual GIP/GLP-1)', requiresPrescription: true, brands: ['Mounjaro'] },
  { slug: 'liraglutida', activeIngredient: 'Liraglutida', therapeuticClass: 'Antidiabético (agonista del receptor GLP-1)', requiresPrescription: true, brands: ['Saxenda', 'Victoza'] },
  { slug: 'adapaleno', activeIngredient: 'Adapaleno', therapeuticClass: 'Retinoide tópico' },
  { slug: 'peroxido-de-benzoilo', activeIngredient: 'Peróxido de benzoilo', query: 'peroxido de benzoilo', therapeuticClass: 'Antiacneico tópico' },
  { slug: 'minoxidil', activeIngredient: 'Minoxidil', therapeuticClass: 'Vasodilatador (uso tópico capilar)' },
  { slug: 'finasterida', activeIngredient: 'Finasterida', therapeuticClass: 'Inhibidor de la 5-alfa reductasa', requiresPrescription: true },
  { slug: 'diosmina-hesperidina', activeIngredient: 'Diosmina + hesperidina', query: 'diosmina hesperidina', therapeuticClass: 'Flebotónico', brands: ['Daflon'] },
  { slug: 'etoricoxib', activeIngredient: 'Etoricoxib', therapeuticClass: 'AINE (inhibidor selectivo de la COX-2)', requiresPrescription: true, brands: ['Arcoxia'] },
  { slug: 'ketoconazol', activeIngredient: 'Ketoconazol', therapeuticClass: 'Antimicótico (imidazol)', brands: ['Nizoral'] },
  { slug: 'melatonina', activeIngredient: 'Melatonina', therapeuticClass: 'Regulador del sueño' },
  { slug: 'lidocaina', activeIngredient: 'Lidocaína', therapeuticClass: 'Anestésico local' },
  { slug: 'lercanidipino', activeIngredient: 'Lercanidipino', therapeuticClass: 'Antagonista del calcio (dihidropiridina)', requiresPrescription: true, brands: ['Zanidip'] },
  { slug: 'tizanidina', activeIngredient: 'Tizanidina', therapeuticClass: 'Relajante muscular de acción central', requiresPrescription: true },
  { slug: 'valaciclovir', activeIngredient: 'Valaciclovir', therapeuticClass: 'Antiviral', requiresPrescription: true },
  { slug: 'trazodona', activeIngredient: 'Trazodona', therapeuticClass: 'Antidepresivo', requiresPrescription: true },
  { slug: 'cefalexina', activeIngredient: 'Cefalexina', therapeuticClass: 'Antibiótico (cefalosporina)', requiresPrescription: true },
  { slug: 'doxilamina', activeIngredient: 'Doxilamina', therapeuticClass: 'Antihistamínico (primera generación)' },
  { slug: 'tramadol', activeIngredient: 'Tramadol', therapeuticClass: 'Analgésico opioide', requiresPrescription: true },
  { slug: 'citicolina', activeIngredient: 'Citicolina', therapeuticClass: 'Neuroprotector' },
  { slug: 'vonoprazan', activeIngredient: 'Vonoprazan', therapeuticClass: 'Bloqueador ácido competitivo de potasio', requiresPrescription: true },
  { slug: 'sacubitril-valsartan', activeIngredient: 'Sacubitril + valsartán', query: 'sacubitril valsartan', therapeuticClass: 'Antihipertensivo (inhibidor de neprilisina y del receptor de angiotensina)', requiresPrescription: true, brands: ['Entresto'] },
  { slug: 'nitrofurazona', activeIngredient: 'Nitrofurazona', therapeuticClass: 'Antibacteriano tópico' },

  // Alto uso en Colombia: cardiovascular y metabolico
  { slug: 'furosemida', activeIngredient: 'Furosemida', therapeuticClass: 'Diurético de asa', requiresPrescription: true },
  { slug: 'espironolactona', activeIngredient: 'Espironolactona', therapeuticClass: 'Diurético ahorrador de potasio', requiresPrescription: true },
  { slug: 'bisoprolol', activeIngredient: 'Bisoprolol', therapeuticClass: 'Betabloqueador', requiresPrescription: true },
  { slug: 'metoprolol', activeIngredient: 'Metoprolol', therapeuticClass: 'Betabloqueador', requiresPrescription: true },
  { slug: 'propranolol', activeIngredient: 'Propranolol', therapeuticClass: 'Betabloqueador', requiresPrescription: true },
  { slug: 'nifedipino', activeIngredient: 'Nifedipino', therapeuticClass: 'Antagonista del calcio (dihidropiridina)', requiresPrescription: true },
  { slug: 'telmisartan', activeIngredient: 'Telmisartán', therapeuticClass: 'Antagonista de los receptores de angiotensina II (ARA II)', requiresPrescription: true },
  { slug: 'irbesartan', activeIngredient: 'Irbesartán', therapeuticClass: 'Antagonista de los receptores de angiotensina II (ARA II)', requiresPrescription: true },
  { slug: 'captopril', activeIngredient: 'Captopril', therapeuticClass: 'Inhibidor de la enzima convertidora de angiotensina (IECA)', requiresPrescription: true },
  { slug: 'simvastatina', activeIngredient: 'Simvastatina', therapeuticClass: 'Hipolipemiante (estatina)', requiresPrescription: true },
  { slug: 'ezetimiba', activeIngredient: 'Ezetimiba', therapeuticClass: 'Hipolipemiante', requiresPrescription: true },
  { slug: 'gemfibrozilo', activeIngredient: 'Gemfibrozilo', therapeuticClass: 'Hipolipemiante (fibrato)', requiresPrescription: true },
  { slug: 'rivaroxaban', activeIngredient: 'Rivaroxabán', therapeuticClass: 'Anticoagulante', requiresPrescription: true, brands: ['Xarelto'] },
  { slug: 'apixaban', activeIngredient: 'Apixabán', therapeuticClass: 'Anticoagulante', requiresPrescription: true, brands: ['Eliquis'] },
  { slug: 'warfarina', activeIngredient: 'Warfarina', therapeuticClass: 'Anticoagulante', requiresPrescription: true },
  { slug: 'glibenclamida', activeIngredient: 'Glibenclamida', therapeuticClass: 'Antidiabético oral (sulfonilurea)', requiresPrescription: true },
  { slug: 'sitagliptina', activeIngredient: 'Sitagliptina', therapeuticClass: 'Antidiabético oral (inhibidor DPP-4)', requiresPrescription: true, brands: ['Januvia'] },
  { slug: 'empagliflozina', activeIngredient: 'Empagliflozina', therapeuticClass: 'Antidiabético oral (inhibidor SGLT2)', requiresPrescription: true, brands: ['Jardiance'] },
  { slug: 'dapagliflozina', activeIngredient: 'Dapagliflozina', therapeuticClass: 'Antidiabético oral (inhibidor SGLT2)', requiresPrescription: true, brands: ['Forxiga'] },
  { slug: 'colchicina', activeIngredient: 'Colchicina', therapeuticClass: 'Antigotoso', requiresPrescription: true },
  { slug: 'alopurinol', activeIngredient: 'Alopurinol', therapeuticClass: 'Antigotoso (inhibidor de la xantina oxidasa)', requiresPrescription: true },

  // Salud mental y sistema nervioso
  { slug: 'escitalopram', activeIngredient: 'Escitalopram', therapeuticClass: 'Antidepresivo (ISRS)', requiresPrescription: true },
  { slug: 'paroxetina', activeIngredient: 'Paroxetina', therapeuticClass: 'Antidepresivo (ISRS)', requiresPrescription: true },
  { slug: 'venlafaxina', activeIngredient: 'Venlafaxina', therapeuticClass: 'Antidepresivo (IRSN)', requiresPrescription: true },
  { slug: 'duloxetina', activeIngredient: 'Duloxetina', therapeuticClass: 'Antidepresivo (IRSN)', requiresPrescription: true },
  { slug: 'amitriptilina', activeIngredient: 'Amitriptilina', therapeuticClass: 'Antidepresivo tricíclico', requiresPrescription: true },
  { slug: 'quetiapina', activeIngredient: 'Quetiapina', therapeuticClass: 'Antipsicótico atípico', requiresPrescription: true },
  { slug: 'risperidona', activeIngredient: 'Risperidona', therapeuticClass: 'Antipsicótico atípico', requiresPrescription: true },
  { slug: 'pregabalina', activeIngredient: 'Pregabalina', therapeuticClass: 'Anticonvulsivante (dolor neuropático)', requiresPrescription: true, brands: ['Lyrica'] },
  { slug: 'gabapentina', activeIngredient: 'Gabapentina', therapeuticClass: 'Anticonvulsivante (dolor neuropático)', requiresPrescription: true },
  { slug: 'zolpidem', activeIngredient: 'Zolpidem', therapeuticClass: 'Hipnótico', requiresPrescription: true },

  // Digestivo
  { slug: 'pantoprazol', activeIngredient: 'Pantoprazol', therapeuticClass: 'Inhibidor de la bomba de protones (IBP)' },
  { slug: 'lansoprazol', activeIngredient: 'Lansoprazol', therapeuticClass: 'Inhibidor de la bomba de protones (IBP)' },
  { slug: 'loperamida', activeIngredient: 'Loperamida', therapeuticClass: 'Antidiarreico' },
  { slug: 'metoclopramida', activeIngredient: 'Metoclopramida', therapeuticClass: 'Antiemético (procinético)' },
  { slug: 'ondansetron', activeIngredient: 'Ondansetrón', therapeuticClass: 'Antiemético', requiresPrescription: true },
  { slug: 'butilbromuro-de-hioscina', activeIngredient: 'Butilbromuro de hioscina', query: 'hioscina', therapeuticClass: 'Antiespasmódico', brands: ['Buscapina'] },

  // Antiinfecciosos
  { slug: 'ciprofloxacino', activeIngredient: 'Ciprofloxacino', therapeuticClass: 'Antibiótico (fluoroquinolona)', requiresPrescription: true },
  { slug: 'nitrofurantoina', activeIngredient: 'Nitrofurantoína', therapeuticClass: 'Antibiótico (antiséptico urinario)', requiresPrescription: true },
  { slug: 'clindamicina', activeIngredient: 'Clindamicina', therapeuticClass: 'Antibiótico (lincosamida)', requiresPrescription: true },
  { slug: 'doxiciclina', activeIngredient: 'Doxiciclina', therapeuticClass: 'Antibiótico (tetraciclina)', requiresPrescription: true },
  { slug: 'claritromicina', activeIngredient: 'Claritromicina', therapeuticClass: 'Antibiótico (macrólido)', requiresPrescription: true },
  { slug: 'trimetoprim-sulfametoxazol', activeIngredient: 'Trimetoprim + sulfametoxazol', query: 'trimetoprim sulfametoxazol', therapeuticClass: 'Antibiótico (sulfonamida)', requiresPrescription: true },
  { slug: 'aciclovir', activeIngredient: 'Aciclovir', therapeuticClass: 'Antiviral' },
  { slug: 'albendazol', activeIngredient: 'Albendazol', therapeuticClass: 'Antiparasitario' },
  { slug: 'ivermectina', activeIngredient: 'Ivermectina', therapeuticClass: 'Antiparasitario' },
  { slug: 'nistatina', activeIngredient: 'Nistatina', therapeuticClass: 'Antimicótico' },
  { slug: 'clotrimazol', activeIngredient: 'Clotrimazol', therapeuticClass: 'Antimicótico (imidazol)' },
  { slug: 'terbinafina', activeIngredient: 'Terbinafina', therapeuticClass: 'Antimicótico (alilamina)' },

  // Dolor, inflamacion y alergia
  { slug: 'meloxicam', activeIngredient: 'Meloxicam', therapeuticClass: 'AINE (Antiinflamatorio No Esteroideo)' },
  { slug: 'celecoxib', activeIngredient: 'Celecoxib', therapeuticClass: 'AINE (inhibidor selectivo de la COX-2)', requiresPrescription: true },
  { slug: 'metocarbamol', activeIngredient: 'Metocarbamol', therapeuticClass: 'Relajante muscular' },
  { slug: 'prednisona', activeIngredient: 'Prednisona', therapeuticClass: 'Corticoide (glucocorticoide)', requiresPrescription: true },
  { slug: 'betametasona', activeIngredient: 'Betametasona', therapeuticClass: 'Corticoide (glucocorticoide)' },
  { slug: 'hidrocortisona', activeIngredient: 'Hidrocortisona', therapeuticClass: 'Corticoide (glucocorticoide)' },
  { slug: 'levocetirizina', activeIngredient: 'Levocetirizina', therapeuticClass: 'Antihistamínico (segunda generación)' },
  { slug: 'fexofenadina', activeIngredient: 'Fexofenadina', therapeuticClass: 'Antihistamínico (segunda generación)', brands: ['Allegra'] },
  { slug: 'budesonida', activeIngredient: 'Budesonida', therapeuticClass: 'Corticoide inhalado', requiresPrescription: true },

  // Otros de alto consumo
  { slug: 'acido-folico', activeIngredient: 'Ácido fólico', query: 'acido folico', therapeuticClass: 'Vitamina (B9)' },
  { slug: 'sulfato-ferroso', activeIngredient: 'Sulfato ferroso', query: 'sulfato ferroso', therapeuticClass: 'Suplemento de hierro' },
  { slug: 'levonorgestrel', activeIngredient: 'Levonorgestrel', therapeuticClass: 'Anticonceptivo hormonal' },
  { slug: 'tadalafil', activeIngredient: 'Tadalafil', therapeuticClass: 'Inhibidor de la fosfodiesterasa-5 (PDE5)', brands: ['Cialis'] },
]

function fromMedicineInfo(): PriceEntry[] {
  return getAllMedicineSlugs()
    .map((slug) => getMedicineInfo(slug))
    .filter((m): m is NonNullable<typeof m> => m !== null)
    .map((m) => ({
      slug: m.slug,
      activeIngredient: m.activeIngredient,
      // Misma clave que antes: el historial ya guardado sigue enlazado.
      query: normalize(m.activeIngredient),
      therapeuticClass: m.therapeuticClass,
      requiresPrescription: m.requiresPrescription,
    }))
}

const CATALOG: Map<string, PriceEntry> = (() => {
  const map = new Map<string, PriceEntry>()
  for (const e of fromMedicineInfo()) map.set(e.slug, e)
  for (const e of EXTRA_ENTRIES) {
    if (map.has(e.slug)) continue // la ficha completa tiene prioridad
    map.set(e.slug, { ...e, query: e.query ?? normalize(e.activeIngredient) })
  }
  return map
})()

export function getPriceEntry(slug: string): PriceEntry | null {
  return CATALOG.get(slug.toLowerCase()) ?? null
}

export function getAllPriceEntries(): PriceEntry[] {
  return [...CATALOG.values()]
}

export function getAllPriceSlugs(): string[] {
  return [...CATALOG.keys()]
}

/** Enlaces relacionados: primero el mismo grupo terapeutico, luego vecinos alfabeticos. */
export function getRelatedEntries(slug: string, limit = 6): PriceEntry[] {
  const self = getPriceEntry(slug)
  if (!self) return []
  const all = getAllPriceEntries()
    .filter((e) => e.slug !== slug)
    .sort((a, b) => a.activeIngredient.localeCompare(b.activeIngredient, 'es'))
  const family = (c: string) => c.split('(')[0].trim().toLowerCase()
  const same = all.filter((e) => family(e.therapeuticClass) === family(self.therapeuticClass))
  const rest = all.filter((e) => !same.includes(e))
  // Vecinos alfabeticos para que ninguna pagina quede sin enlaces entrantes.
  const idx = rest.findIndex((e) => e.activeIngredient.localeCompare(self.activeIngredient, 'es') > 0)
  const start = idx === -1 ? 0 : idx
  const neighbors = [...rest.slice(start), ...rest.slice(0, start)]
  return [...same, ...neighbors].slice(0, limit)
}
