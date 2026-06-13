export interface PricePoint {
  month: string
  price: number
}

export interface PharmacyHistory {
  pharmacy: string
  color: string
  data: PricePoint[]
}

export interface MedicationHistory {
  ingredient: string
  label: string
  unit: string
  histories: PharmacyHistory[]
}

const PRICE_HISTORY: Record<string, MedicationHistory> = {
  acetaminofen: {
    ingredient: 'Acetaminofen',
    label: 'Acetaminofén 500 mg x 10 tab',
    unit: 'x 10 tab',
    histories: [
      {
        pharmacy: 'Cruz Verde',
        color: '#006e28',
        data: [
          { month: 'Ene', price: 3800 }, { month: 'Feb', price: 3600 },
          { month: 'Mar', price: 3500 }, { month: 'Abr', price: 3700 },
          { month: 'May', price: 4000 }, { month: 'Jun', price: 3900 },
          { month: 'Jul', price: 3500 }, { month: 'Ago', price: 3400 },
          { month: 'Sep', price: 3500 }, { month: 'Oct', price: 3600 },
          { month: 'Nov', price: 3800 }, { month: 'Dic', price: 3500 },
        ],
      },
      {
        pharmacy: 'Drogas La Rebaja',
        color: '#0058bc',
        data: [
          { month: 'Ene', price: 3200 }, { month: 'Feb', price: 3300 },
          { month: 'Mar', price: 3100 }, { month: 'Abr', price: 3000 },
          { month: 'May', price: 3400 }, { month: 'Jun', price: 3200 },
          { month: 'Jul', price: 3000 }, { month: 'Ago', price: 2900 },
          { month: 'Sep', price: 3100 }, { month: 'Oct', price: 3200 },
          { month: 'Nov', price: 3500 }, { month: 'Dic', price: 3200 },
        ],
      },
      {
        pharmacy: 'Colsubsidio',
        color: '#4c4aca',
        data: [
          { month: 'Ene', price: 4000 }, { month: 'Feb', price: 3800 },
          { month: 'Mar', price: 3600 }, { month: 'Abr', price: 3500 },
          { month: 'May', price: 3700 }, { month: 'Jun', price: 3600 },
          { month: 'Jul', price: 3400 }, { month: 'Ago', price: 3300 },
          { month: 'Sep', price: 3200 }, { month: 'Oct', price: 3400 },
          { month: 'Nov', price: 3600 }, { month: 'Dic', price: 3500 },
        ],
      },
      {
        pharmacy: 'Farmatodo',
        color: '#e85d04',
        data: [
          { month: 'Ene', price: 4500 }, { month: 'Feb', price: 4400 },
          { month: 'Mar', price: 4200 }, { month: 'Abr', price: 4000 },
          { month: 'May', price: 4300 }, { month: 'Jun', price: 4400 },
          { month: 'Jul', price: 4100 }, { month: 'Ago', price: 4000 },
          { month: 'Sep', price: 4200 }, { month: 'Oct', price: 4300 },
          { month: 'Nov', price: 4500 }, { month: 'Dic', price: 4200 },
        ],
      },
    ],
  },
  ibuprofeno: {
    ingredient: 'Ibuprofeno',
    label: 'Ibuprofeno 400 mg x 10 tab',
    unit: 'x 10 tab',
    histories: [
      {
        pharmacy: 'Cruz Verde',
        color: '#006e28',
        data: [
          { month: 'Ene', price: 5200 }, { month: 'Feb', price: 5000 },
          { month: 'Mar', price: 4800 }, { month: 'Abr', price: 5100 },
          { month: 'May', price: 5400 }, { month: 'Jun', price: 5300 },
          { month: 'Jul', price: 5000 }, { month: 'Ago', price: 4900 },
          { month: 'Sep', price: 5000 }, { month: 'Oct', price: 5200 },
          { month: 'Nov', price: 5500 }, { month: 'Dic', price: 5200 },
        ],
      },
      {
        pharmacy: 'Drogas La Rebaja',
        color: '#0058bc',
        data: [
          { month: 'Ene', price: 4800 }, { month: 'Feb', price: 4600 },
          { month: 'Mar', price: 4500 }, { month: 'Abr', price: 4700 },
          { month: 'May', price: 5000 }, { month: 'Jun', price: 4900 },
          { month: 'Jul', price: 4600 }, { month: 'Ago', price: 4400 },
          { month: 'Sep', price: 4500 }, { month: 'Oct', price: 4800 },
          { month: 'Nov', price: 5100 }, { month: 'Dic', price: 4800 },
        ],
      },
      {
        pharmacy: 'Colsubsidio',
        color: '#4c4aca',
        data: [
          { month: 'Ene', price: 5800 }, { month: 'Feb', price: 5600 },
          { month: 'Mar', price: 5400 }, { month: 'Abr', price: 5200 },
          { month: 'May', price: 5500 }, { month: 'Jun', price: 5400 },
          { month: 'Jul', price: 5100 }, { month: 'Ago', price: 5000 },
          { month: 'Sep', price: 5200 }, { month: 'Oct', price: 5400 },
          { month: 'Nov', price: 5700 }, { month: 'Dic', price: 5500 },
        ],
      },
      {
        pharmacy: 'Olimpica Drogueria',
        color: '#db2777',
        data: [
          { month: 'Ene', price: 6200 }, { month: 'Feb', price: 6000 },
          { month: 'Mar', price: 5800 }, { month: 'Abr', price: 5600 },
          { month: 'May', price: 5900 }, { month: 'Jun', price: 6100 },
          { month: 'Jul', price: 5700 }, { month: 'Ago', price: 5500 },
          { month: 'Sep', price: 5800 }, { month: 'Oct', price: 6000 },
          { month: 'Nov', price: 6300 }, { month: 'Dic', price: 6000 },
        ],
      },
    ],
  },
  losartan: {
    ingredient: 'Losartan',
    label: 'Losartán 50 mg x 30 tab',
    unit: 'x 30 tab',
    histories: [
      {
        pharmacy: 'Cruz Verde',
        color: '#006e28',
        data: [
          { month: 'Ene', price: 18000 }, { month: 'Feb', price: 17500 },
          { month: 'Mar', price: 17000 }, { month: 'Abr', price: 16800 },
          { month: 'May', price: 17200 }, { month: 'Jun', price: 17500 },
          { month: 'Jul', price: 16500 }, { month: 'Ago', price: 16000 },
          { month: 'Sep', price: 16800 }, { month: 'Oct', price: 17000 },
          { month: 'Nov', price: 17800 }, { month: 'Dic', price: 17200 },
        ],
      },
      {
        pharmacy: 'Drogas La Rebaja',
        color: '#0058bc',
        data: [
          { month: 'Ene', price: 15000 }, { month: 'Feb', price: 14800 },
          { month: 'Mar', price: 14500 }, { month: 'Abr', price: 14200 },
          { month: 'May', price: 14800 }, { month: 'Jun', price: 15000 },
          { month: 'Jul', price: 14000 }, { month: 'Ago', price: 13800 },
          { month: 'Sep', price: 14200 }, { month: 'Oct', price: 14500 },
          { month: 'Nov', price: 15200 }, { month: 'Dic', price: 14800 },
        ],
      },
      {
        pharmacy: 'Cafam',
        color: '#7c3aed',
        data: [
          { month: 'Ene', price: 19500 }, { month: 'Feb', price: 19000 },
          { month: 'Mar', price: 18500 }, { month: 'Abr', price: 18200 },
          { month: 'May', price: 18800 }, { month: 'Jun', price: 19000 },
          { month: 'Jul', price: 18000 }, { month: 'Ago', price: 17500 },
          { month: 'Sep', price: 18200 }, { month: 'Oct', price: 18500 },
          { month: 'Nov', price: 19200 }, { month: 'Dic', price: 18800 },
        ],
      },
    ],
  },
  metformina: {
    ingredient: 'Metformina',
    label: 'Metformina 850 mg x 30 tab',
    unit: 'x 30 tab',
    histories: [
      {
        pharmacy: 'Cruz Verde',
        color: '#006e28',
        data: [
          { month: 'Ene', price: 12000 }, { month: 'Feb', price: 11800 },
          { month: 'Mar', price: 11500 }, { month: 'Abr', price: 11200 },
          { month: 'May', price: 11800 }, { month: 'Jun', price: 12000 },
          { month: 'Jul', price: 11000 }, { month: 'Ago', price: 10800 },
          { month: 'Sep', price: 11200 }, { month: 'Oct', price: 11500 },
          { month: 'Nov', price: 12200 }, { month: 'Dic', price: 11800 },
        ],
      },
      {
        pharmacy: 'Colsubsidio',
        color: '#4c4aca',
        data: [
          { month: 'Ene', price: 13500 }, { month: 'Feb', price: 13200 },
          { month: 'Mar', price: 12800 }, { month: 'Abr', price: 12500 },
          { month: 'May', price: 13000 }, { month: 'Jun', price: 13200 },
          { month: 'Jul', price: 12200 }, { month: 'Ago', price: 12000 },
          { month: 'Sep', price: 12500 }, { month: 'Oct', price: 12800 },
          { month: 'Nov', price: 13500 }, { month: 'Dic', price: 13000 },
        ],
      },
      {
        pharmacy: 'Olimpica Drogueria',
        color: '#db2777',
        data: [
          { month: 'Ene', price: 15000 }, { month: 'Feb', price: 14500 },
          { month: 'Mar', price: 14200 }, { month: 'Abr', price: 14000 },
          { month: 'May', price: 14500 }, { month: 'Jun', price: 14800 },
          { month: 'Jul', price: 13800 }, { month: 'Ago', price: 13500 },
          { month: 'Sep', price: 14000 }, { month: 'Oct', price: 14200 },
          { month: 'Nov', price: 15000 }, { month: 'Dic', price: 14500 },
        ],
      },
    ],
  },
}

export function getMedicationHistory(slug: string): MedicationHistory | null {
  return PRICE_HISTORY[slug.toLowerCase()] ?? null
}

export function getAllHistorySlugs(): string[] {
  return Object.keys(PRICE_HISTORY)
}
