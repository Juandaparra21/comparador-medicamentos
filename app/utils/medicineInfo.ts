export interface MedicineInfo {
  slug: string
  activeIngredient: string
  therapeuticClass: string
  requiresPrescription: boolean
  uses: string[]
  mechanism: string
  typicalDose: string
  maxDailyDose: string
  warnings: string[]
  sideEffects: string[]
  contraindications: string[]
}

const MEDICINE_INFO: Record<string, MedicineInfo> = {
  acetaminofen: {
    slug: 'acetaminofen',
    activeIngredient: 'Acetaminofén',
    therapeuticClass: 'Analgésico / Antipirético',
    requiresPrescription: false,
    uses: [
      'Alivio del dolor leve a moderado (dolor de cabeza, muscular, dental)',
      'Reducción de la fiebre',
      'Dolor asociado a resfriado y gripe',
    ],
    mechanism:
      'Actúa en el sistema nervioso central inhibiendo la síntesis de prostaglandinas, lo que reduce la percepción del dolor y baja la fiebre. No tiene efecto antiinflamatorio significativo.',
    typicalDose: '500 mg - 1000 mg cada 6 a 8 horas',
    maxDailyDose: '4000 mg en adultos (3000 mg si hay consumo de alcohol)',
    warnings: [
      'No exceder la dosis máxima diaria: puede causar daño hepático severo.',
      'Evitar el consumo de alcohol durante el tratamiento.',
      'Verificar que otros medicamentos que tome no contengan acetaminofén.',
      'Consulte al médico si los síntomas persisten más de 3 días.',
    ],
    sideEffects: [
      'Náuseas (poco frecuente a dosis normales)',
      'Reacciones alérgicas en personas sensibles',
      'Daño hepático con sobredosis',
    ],
    contraindications: [
      'Enfermedad hepática severa',
      'Hipersensibilidad conocida al acetaminofén',
      'Uso conjunto con medicamentos hepatotóxicos sin supervisión médica',
    ],
  },
  ibuprofeno: {
    slug: 'ibuprofeno',
    activeIngredient: 'Ibuprofeno',
    therapeuticClass: 'AINE (Antiinflamatorio No Esteroideo)',
    requiresPrescription: false,
    uses: [
      'Dolor leve a moderado (cefalea, odontálgico, muscular, articular)',
      'Inflamación y dolor en artritis y lesiones musculares',
      'Fiebre',
      'Dismenorrea (dolor menstrual)',
    ],
    mechanism:
      'Inhibe las enzimas COX-1 y COX-2, reduciendo la producción de prostaglandinas. Esto genera efectos analgésicos, antiinflamatorios y antipiréticos.',
    typicalDose: '200 mg - 400 mg cada 6 a 8 horas (con alimentos)',
    maxDailyDose: '1200 mg sin prescripción / 2400 mg bajo prescripción médica',
    warnings: [
      'Tomar siempre con alimentos para reducir el riesgo de irritación gástrica.',
      'No usar en el tercer trimestre del embarazo.',
      'Puede aumentar el riesgo cardiovascular con uso prolongado.',
      'Evitar en personas con úlcera péptica activa.',
    ],
    sideEffects: [
      'Malestar estomacal, náuseas',
      'Acidez o úlcera gástrica con uso prolongado',
      'Retención de líquidos',
      'Mareos',
    ],
    contraindications: [
      'Úlcera péptica activa o hemorragia gastrointestinal',
      'Insuficiencia renal o hepática grave',
      'Tercer trimestre de embarazo',
      'Hipersensibilidad a AINEs',
    ],
  },
  losartan: {
    slug: 'losartan',
    activeIngredient: 'Losartán',
    therapeuticClass: 'Antagonista de los receptores de angiotensina II (ARA II)',
    requiresPrescription: true,
    uses: [
      'Tratamiento de la hipertensión arterial',
      'Protección renal en pacientes diabéticos con hipertensión',
      'Reducción del riesgo de accidente cerebrovascular en hipertensión con hipertrofia ventricular',
    ],
    mechanism:
      'Bloquea selectivamente los receptores AT1 de la angiotensina II, impidiendo la vasoconstricción y la secreción de aldosterona. Esto produce vasodilatación y disminución de la presión arterial.',
    typicalDose: '50 mg una vez al día (puede aumentarse a 100 mg)',
    maxDailyDose: '100 mg por día',
    warnings: [
      'No usar durante el embarazo: puede causar daño fetal grave.',
      'Monitorear la función renal y los niveles de potasio periódicamente.',
      'Evitar sustitutos de sal con potasio sin consultar al médico.',
      'Puede producir hipotensión en la primera dosis, especialmente en pacientes deshidratados.',
    ],
    sideEffects: [
      'Mareos, especialmente al inicio del tratamiento',
      'Hiperpotasemia (aumento del potasio en sangre)',
      'Fatiga',
      'Tos (menos frecuente que con los IECA)',
    ],
    contraindications: [
      'Embarazo',
      'Hipersensibilidad al losartán o componentes de la fórmula',
      'Uso combinado con aliskiren en pacientes con diabetes o insuficiencia renal',
    ],
  },
  metformina: {
    slug: 'metformina',
    activeIngredient: 'Metformina',
    therapeuticClass: 'Antidiabético oral (Biguanida)',
    requiresPrescription: true,
    uses: [
      'Tratamiento de la diabetes mellitus tipo 2',
      'Control de la glucosa en sangre como primera línea de tratamiento',
      'Uso en síndrome de ovario poliquístico (fuera de indicación oficial)',
    ],
    mechanism:
      'Reduce la producción hepática de glucosa, mejora la sensibilidad a la insulina en tejidos periféricos y disminuye la absorción intestinal de glucosa. No causa hipoglucemia por sí sola.',
    typicalDose: '500 mg - 850 mg dos o tres veces al día con las comidas',
    maxDailyDose: '2550 mg - 3000 mg por día',
    warnings: [
      'Suspender antes de procedimientos con contraste yodado.',
      'Contraindicada en insuficiencia renal moderada a severa.',
      'Puede causar deficiencia de vitamina B12 con uso prolongado.',
      'Riesgo de acidosis láctica (raro pero grave): evitar en situaciones de hipoxia.',
    ],
    sideEffects: [
      'Náuseas, vómitos, diarrea al inicio (usualmente transitorios)',
      'Malestar gastrointestinal',
      'Sabor metálico en la boca',
      'Deficiencia de B12 con uso a largo plazo',
    ],
    contraindications: [
      'Insuficiencia renal moderada-severa (TFG < 30 mL/min)',
      'Insuficiencia hepática',
      'Alcoholismo',
      'Acidosis metabólica',
    ],
  },
}

export function getMedicineInfo(slug: string): MedicineInfo | null {
  return MEDICINE_INFO[slug.toLowerCase()] ?? null
}

export function getAllMedicineSlugs(): string[] {
  return Object.keys(MEDICINE_INFO)
}
