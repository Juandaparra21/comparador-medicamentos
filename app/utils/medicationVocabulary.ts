// Vocabulary of common medications in Colombia used by the "did you mean" spell
// corrector AND by the generic/brand classifier in the scrapers.
// These are medication NAMES (reference data), never medical claims or advice.
//
// Stored lowercase with natural accents; consumers strip accents themselves for
// comparison, and the UI capitalizes the first letter for display.
//
// Split in two on purpose:
//   ACTIVE_INGREDIENTS — international names (INN). A product whose name starts
//                        with one of these is sold under its generic name.
//   POPULAR_BRANDS     — commercial brand names. Their presence marks "marca".
// Keep them separate so the classifier can tell one from the other. Add more over
// time as the catalog grows.

export const ACTIVE_INGREDIENTS: string[] = [
  // ── Analgésicos / antiinflamatorios / fiebre ──
  'acetaminofén', 'paracetamol', 'ibuprofeno', 'naproxeno', 'diclofenaco',
  'aspirina', 'ácido acetilsalicílico', 'ketorolaco', 'ketoprofeno', 'dexketoprofeno',
  'meloxicam', 'celecoxib', 'piroxicam', 'nimesulida', 'tramadol', 'dipirona',
  'metamizol',
  // ── Antialérgicos ──
  'loratadina', 'desloratadina', 'cetirizina', 'levocetirizina', 'difenhidramina',
  'clorfeniramina', 'hidroxicina', 'ebastina', 'bilastina', 'fexofenadina',
  // ── Gástricos ──
  'omeprazol', 'esomeprazol', 'pantoprazol', 'lansoprazol', 'ranitidina',
  'famotidina', 'hidróxido de aluminio', 'sucralfato', 'metoclopramida',
  'domperidona', 'ondansetrón', 'hioscina', 'loperamida', 'simeticona',
  'dimenhidrinato',
  // ── Antibióticos / antimicrobianos ──
  'amoxicilina', 'ampicilina', 'amoxicilina ácido clavulánico', 'azitromicina',
  'claritromicina', 'eritromicina', 'cefalexina', 'cefuroxima', 'ciprofloxacina',
  'levofloxacina', 'doxiciclina', 'tetraciclina', 'metronidazol', 'clindamicina',
  'trimetoprim sulfametoxazol', 'nitrofurantoína', 'penicilina', 'dicloxacilina',
  // ── Antivirales / antifúngicos / antiparasitarios ──
  'aciclovir', 'valaciclovir', 'oseltamivir', 'fluconazol', 'ketoconazol',
  'itraconazol', 'clotrimazol', 'nistatina', 'terbinafina', 'albendazol',
  'mebendazol', 'ivermectina', 'metronidazol', 'secnidazol', 'praziquantel',
  // ── Cardiovascular / presión ──
  'losartán', 'valsartán', 'telmisartán', 'enalapril', 'lisinopril', 'captopril',
  'amlodipino', 'nifedipino', 'hidroclorotiazida', 'furosemida', 'espironolactona',
  'metoprolol', 'propranolol', 'atenolol', 'carvedilol', 'bisoprolol', 'digoxina',
  'clopidogrel', 'warfarina', 'rivaroxabán', 'apixabán',
  // ── Colesterol / diabetes / tiroides ──
  'atorvastatina', 'rosuvastatina', 'simvastatina', 'lovastatina', 'metformina',
  'glibenclamida', 'glimepirida', 'sitagliptina', 'empagliflozina', 'insulina',
  'levotiroxina',
  // ── Respiratorio ──
  'salbutamol', 'budesonida', 'beclometasona', 'ipratropio', 'montelukast',
  'ambroxol', 'bromhexina', 'dextrometorfano', 'guaifenesina', 'pseudoefedrina',
  'acetilcisteína',
  // ── Sistema nervioso / salud mental ──
  'diazepam', 'alprazolam', 'clonazepam', 'lorazepam', 'sertralina', 'fluoxetina',
  'escitalopram', 'paroxetina', 'amitriptilina', 'trazodona', 'quetiapina',
  'gabapentina', 'pregabalina', 'carbamazepina', 'ácido valproico', 'fenitoína',
  'levetiracetam',
  // ── Dermatológico / tópico ──
  'mupirocina', 'ácido fusídico', 'betametasona', 'hidrocortisona', 'permetrina',
  'lidocaína', 'clotrimazol', 'calamina',
  // ── Hormonal / urológico ──
  'levonorgestrel', 'etinilestradiol', 'sildenafil', 'tadalafil', 'finasteride',
  'tamsulosina', 'testosterona', 'estradiol',
  // ── Corticoides / otros ──
  'prednisolona', 'prednisona', 'dexametasona', 'metilprednisolona', 'alopurinol',
  'colchicina',
  // ── Vitaminas / suplementos ──
  'vitamina c', 'ácido ascórbico', 'vitamina d', 'ácido fólico', 'complejo b',
  'sulfato ferroso', 'hierro', 'calcio', 'magnesio', 'zinc', 'omega 3',
  'sales de rehidratación',
]

// Marcas comerciales populares en Colombia. Su presencia en el nombre indica "marca".
export const POPULAR_BRANDS: string[] = [
  'dolex', 'winadol', 'noxpirin', 'sevedol', 'mejoral', 'advil', 'motrin',
  'apronax', 'flanax', 'voltaren', 'cataflam', 'buscapina', 'sal de frutas',
  'alka seltzer', 'milanta', 'zantac', 'clarityne', 'zyrtec', 'virlix', 'nasatapp',
  'histal', 'tabcin', 'vick vaporub', 'teraflu', 'dayvon', 'dolofen', 'acetamol',
]

// Combined list for the spell corrector (search "did you mean"). Order preserved:
// ingredients first, brands last — identical to the previous single list.
export const MEDICATION_TERMS: string[] = [...ACTIVE_INGREDIENTS, ...POPULAR_BRANDS]
