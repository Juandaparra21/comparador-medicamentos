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
  naproxeno: {
    slug: 'naproxeno',
    activeIngredient: 'Naproxeno',
    therapeuticClass: 'AINE (Antiinflamatorio No Esteroideo)',
    requiresPrescription: false,
    uses: [
      'Dolor leve a moderado (muscular, articular, dental, cabeza)',
      'Dolor e inflamación en artritis y lesiones',
      'Dolor menstrual (dismenorrea)',
    ],
    mechanism:
      'Inhibe las enzimas COX-1 y COX-2, reduciendo la producción de prostaglandinas. Tiene una acción más prolongada que otros AINE, por lo que se toma menos veces al día.',
    typicalDose: '250 mg - 500 mg cada 12 horas, con alimentos',
    maxDailyDose: '1000 mg por día sin prescripción',
    warnings: [
      'Tomar con alimentos para reducir la irritación gástrica.',
      'Puede aumentar el riesgo cardiovascular y gastrointestinal con uso prolongado.',
      'No usar en el tercer trimestre del embarazo.',
      'Consulte al médico si el dolor persiste más de 5 días.',
    ],
    sideEffects: [
      'Malestar estomacal, acidez, náuseas',
      'Riesgo de úlcera con uso prolongado',
      'Mareos o somnolencia',
      'Retención de líquidos',
    ],
    contraindications: [
      'Úlcera péptica activa o sangrado gastrointestinal',
      'Insuficiencia renal o hepática grave',
      'Tercer trimestre de embarazo',
      'Hipersensibilidad a AINEs',
    ],
  },
  diclofenaco: {
    slug: 'diclofenaco',
    activeIngredient: 'Diclofenaco',
    therapeuticClass: 'AINE (Antiinflamatorio No Esteroideo)',
    requiresPrescription: true,
    uses: [
      'Dolor e inflamación musculoesquelética (artritis, lumbago, esguinces)',
      'Dolor postoperatorio o postraumático',
      'Dolor menstrual',
    ],
    mechanism:
      'Inhibe las enzimas COX, disminuyendo la síntesis de prostaglandinas responsables del dolor y la inflamación.',
    typicalDose: '50 mg dos o tres veces al día, con alimentos',
    maxDailyDose: '150 mg por día',
    warnings: [
      'Es uno de los AINE con mayor riesgo cardiovascular: usar la dosis mínima el menor tiempo posible.',
      'Puede causar irritación o úlcera gástrica.',
      'Puede alterar la función hepática; el médico puede pedir controles.',
      'No usar en el tercer trimestre del embarazo.',
    ],
    sideEffects: [
      'Molestias gástricas, náuseas',
      'Elevación de enzimas hepáticas',
      'Mareos, cefalea',
      'Retención de líquidos',
    ],
    contraindications: [
      'Úlcera péptica activa o hemorragia gastrointestinal',
      'Enfermedad cardiovascular grave',
      'Insuficiencia renal o hepática severa',
      'Hipersensibilidad a AINEs',
    ],
  },
  loratadina: {
    slug: 'loratadina',
    activeIngredient: 'Loratadina',
    therapeuticClass: 'Antihistamínico (segunda generación)',
    requiresPrescription: false,
    uses: [
      'Rinitis alérgica (estornudos, secreción y picazón nasal)',
      'Urticaria y picazón por alergias',
      'Síntomas alérgicos leves de ojos y piel',
    ],
    mechanism:
      'Bloquea los receptores H1 de la histamina a nivel periférico, aliviando los síntomas de alergia. Al no atravesar fácilmente el cerebro, causa poca somnolencia.',
    typicalDose: '10 mg una vez al día',
    maxDailyDose: '10 mg por día',
    warnings: [
      'No superar la dosis indicada.',
      'En enfermedad hepática, el médico puede ajustar la dosis.',
      'Si los síntomas persisten o empeoran, consulte al médico.',
    ],
    sideEffects: [
      'Dolor de cabeza',
      'Somnolencia leve (poco frecuente)',
      'Boca seca',
      'Fatiga',
    ],
    contraindications: [
      'Hipersensibilidad a la loratadina o a la fórmula',
    ],
  },
  cetirizina: {
    slug: 'cetirizina',
    activeIngredient: 'Cetirizina',
    therapeuticClass: 'Antihistamínico (segunda generación)',
    requiresPrescription: false,
    uses: [
      'Rinitis alérgica estacional y perenne',
      'Urticaria crónica y picazón',
      'Síntomas alérgicos de ojos y nariz',
    ],
    mechanism:
      'Antagoniza los receptores H1 de la histamina, reduciendo la respuesta alérgica. Es eficaz y de acción prolongada, con somnolencia leve en algunas personas.',
    typicalDose: '10 mg una vez al día',
    maxDailyDose: '10 mg por día',
    warnings: [
      'Puede causar somnolencia: precaución al conducir o manejar maquinaria.',
      'Evitar el consumo de alcohol durante el tratamiento.',
      'En insuficiencia renal, el médico puede reducir la dosis.',
    ],
    sideEffects: [
      'Somnolencia',
      'Boca seca',
      'Fatiga',
      'Dolor de cabeza',
    ],
    contraindications: [
      'Hipersensibilidad a la cetirizina o a la hidroxizina',
      'Insuficiencia renal grave (requiere ajuste de dosis)',
    ],
  },
  omeprazol: {
    slug: 'omeprazol',
    activeIngredient: 'Omeprazol',
    therapeuticClass: 'Inhibidor de la bomba de protones (IBP)',
    requiresPrescription: false,
    uses: [
      'Reflujo gastroesofágico y acidez frecuente',
      'Úlcera gástrica y duodenal',
      'Protección gástrica en tratamientos con AINE',
    ],
    mechanism:
      'Bloquea de forma irreversible la bomba de protones (H+/K+ ATPasa) de las células del estómago, reduciendo de manera importante la producción de ácido.',
    typicalDose: '20 mg una vez al día, en ayunas antes del desayuno',
    maxDailyDose: '40 mg por día (bajo indicación médica)',
    warnings: [
      'No es para alivio inmediato: su efecto se construye en varios días.',
      'El uso prolongado puede afectar la absorción de vitamina B12, magnesio y calcio.',
      'No usar más de 14 días seguidos sin consultar al médico.',
    ],
    sideEffects: [
      'Dolor de cabeza',
      'Diarrea o estreñimiento',
      'Dolor abdominal, náuseas',
      'Flatulencia',
    ],
    contraindications: [
      'Hipersensibilidad al omeprazol',
      'Uso con ciertos antirretrovirales (consultar al médico)',
    ],
  },
  amoxicilina: {
    slug: 'amoxicilina',
    activeIngredient: 'Amoxicilina',
    therapeuticClass: 'Antibiótico (penicilina de amplio espectro)',
    requiresPrescription: true,
    uses: [
      'Infecciones respiratorias bacterianas (bronquitis, sinusitis, otitis)',
      'Infecciones de garganta, piel y vías urinarias',
      'Parte de esquemas contra Helicobacter pylori',
    ],
    mechanism:
      'Inhibe la síntesis de la pared de las bacterias, provocando su muerte. Actúa solo contra bacterias, no contra virus.',
    typicalDose: '500 mg cada 8 horas (según indicación médica)',
    maxDailyDose: 'Definida por el médico según peso e infección',
    warnings: [
      'Completar todo el tratamiento aunque se sienta mejor, para evitar resistencia.',
      'No sirve para gripa ni infecciones virales.',
      'Informe al médico si es alérgico a las penicilinas.',
      'Puede reducir la eficacia de anticonceptivos orales.',
    ],
    sideEffects: [
      'Diarrea, náuseas',
      'Erupción cutánea',
      'Candidiasis (hongos)',
      'Molestias digestivas',
    ],
    contraindications: [
      'Alergia a penicilinas o a otros betalactámicos',
      'Antecedente de reacción alérgica grave a antibióticos',
    ],
  },
  enalapril: {
    slug: 'enalapril',
    activeIngredient: 'Enalapril',
    therapeuticClass: 'Inhibidor de la enzima convertidora de angiotensina (IECA)',
    requiresPrescription: true,
    uses: [
      'Hipertensión arterial',
      'Insuficiencia cardíaca',
      'Protección del corazón y del riñón en ciertos pacientes',
    ],
    mechanism:
      'Inhibe la enzima convertidora de angiotensina, reduciendo la formación de angiotensina II. Esto relaja los vasos sanguíneos y baja la presión arterial.',
    typicalDose: '5 mg - 20 mg al día (una o dos tomas)',
    maxDailyDose: '40 mg por día',
    warnings: [
      'No usar durante el embarazo: puede causar daño fetal grave.',
      'Puede producir tos seca persistente.',
      'Vigilar la función renal y el potasio en sangre.',
      'La primera dosis puede bajar mucho la presión; tomarla con precaución.',
    ],
    sideEffects: [
      'Tos seca',
      'Mareos por presión baja',
      'Aumento del potasio en sangre',
      'Fatiga',
    ],
    contraindications: [
      'Embarazo',
      'Antecedente de angioedema con IECA',
      'Estenosis bilateral de las arterias renales',
    ],
  },
  amlodipino: {
    slug: 'amlodipino',
    activeIngredient: 'Amlodipino',
    therapeuticClass: 'Antagonista del calcio (dihidropiridina)',
    requiresPrescription: true,
    uses: [
      'Hipertensión arterial',
      'Angina de pecho (dolor por falta de riego al corazón)',
    ],
    mechanism:
      'Bloquea la entrada de calcio a las células del músculo de los vasos, relajándolos. Esto dilata las arterias y disminuye la presión arterial.',
    typicalDose: '5 mg una vez al día (puede subirse a 10 mg)',
    maxDailyDose: '10 mg por día',
    warnings: [
      'Puede causar hinchazón de tobillos y piernas (edema).',
      'Puede producir mareo por presión baja al inicio.',
      'No suspender de golpe sin indicación médica.',
    ],
    sideEffects: [
      'Edema (hinchazón) de tobillos',
      'Dolor de cabeza',
      'Rubor o calor en la cara',
      'Palpitaciones',
    ],
    contraindications: [
      'Hipersensibilidad a las dihidropiridinas',
      'Presión arterial muy baja (hipotensión grave)',
      'Estenosis aórtica severa',
    ],
  },
  atorvastatina: {
    slug: 'atorvastatina',
    activeIngredient: 'Atorvastatina',
    therapeuticClass: 'Hipolipemiante (estatina)',
    requiresPrescription: true,
    uses: [
      'Colesterol y triglicéridos altos',
      'Prevención de infarto y accidente cerebrovascular en pacientes de riesgo',
    ],
    mechanism:
      'Inhibe la enzima HMG-CoA reductasa del hígado, reduciendo la producción de colesterol y bajando el colesterol LDL ("malo") en la sangre.',
    typicalDose: '10 mg - 20 mg una vez al día, usualmente en la noche',
    maxDailyDose: '80 mg por día',
    warnings: [
      'Avise al médico si presenta dolor muscular inexplicado (riesgo raro de daño muscular).',
      'No usar durante el embarazo o la lactancia.',
      'El médico puede pedir controles de función hepática.',
      'Evitar el jugo de toronja en grandes cantidades.',
    ],
    sideEffects: [
      'Dolores musculares',
      'Elevación de enzimas hepáticas',
      'Dolor de cabeza',
      'Molestias digestivas',
    ],
    contraindications: [
      'Embarazo y lactancia',
      'Enfermedad hepática activa',
      'Hipersensibilidad a las estatinas',
    ],
  },
  salbutamol: {
    slug: 'salbutamol',
    activeIngredient: 'Salbutamol',
    therapeuticClass: 'Broncodilatador (agonista beta-2 de acción corta)',
    requiresPrescription: true,
    uses: [
      'Crisis de asma y broncoespasmo',
      'Dificultad para respirar en EPOC',
      'Prevención del broncoespasmo por ejercicio',
    ],
    mechanism:
      'Estimula los receptores beta-2 del músculo de las vías respiratorias, relajándolo. Esto abre los bronquios y facilita la respiración en pocos minutos.',
    typicalDose: '1 a 2 inhalaciones (100 mcg cada una) cada 4 a 6 horas si se necesita',
    maxDailyDose: 'No exceder lo indicado por el médico',
    warnings: [
      'Si necesita usarlo con mucha frecuencia, su asma puede estar mal controlada: consulte al médico.',
      'Puede causar temblor y aumento del ritmo cardíaco.',
      'Usar con precaución en enfermedad cardíaca.',
    ],
    sideEffects: [
      'Temblor (sobre todo en las manos)',
      'Taquicardia o palpitaciones',
      'Nerviosismo o inquietud',
      'Dolor de cabeza',
    ],
    contraindications: [
      'Hipersensibilidad al salbutamol',
    ],
  },
  hidroclorotiazida: {
    slug: 'hidroclorotiazida',
    activeIngredient: 'Hidroclorotiazida',
    therapeuticClass: 'Diurético tiazídico',
    requiresPrescription: true,
    uses: [
      'Hipertensión arterial',
      'Retención de líquidos (edema)',
    ],
    mechanism:
      'Actúa en el riñón disminuyendo la reabsorción de sodio y agua, lo que aumenta la orina y reduce el volumen de líquido y la presión arterial.',
    typicalDose: '12,5 mg - 25 mg una vez al día, en la mañana',
    maxDailyDose: '50 mg por día',
    warnings: [
      'Puede bajar el potasio en sangre: el médico puede pedir controles.',
      'Puede causar deshidratación; mantenga buena hidratación.',
      'Aumenta la sensibilidad al sol (use protección solar).',
      'Usar con precaución en diabetes y gota.',
    ],
    sideEffects: [
      'Aumento de la frecuencia para orinar',
      'Descenso del potasio (calambres, debilidad)',
      'Mareo por presión baja',
      'Sensibilidad al sol',
    ],
    contraindications: [
      'Ausencia de producción de orina (anuria)',
      'Hipersensibilidad a las sulfonamidas',
      'Alteraciones graves de electrolitos no controladas',
    ],
  },
  levotiroxina: {
    slug: 'levotiroxina',
    activeIngredient: 'Levotiroxina',
    therapeuticClass: 'Hormona tiroidea',
    requiresPrescription: true,
    uses: [
      'Hipotiroidismo (tiroides poco activa)',
      'Reemplazo de la hormona tiroidea tras cirugía de tiroides',
    ],
    mechanism:
      'Reemplaza la hormona tiroidea T4 que el cuerpo no produce en cantidad suficiente, normalizando el metabolismo.',
    typicalDose: 'Individualizada; suele estar entre 50 y 150 mcg al día, en ayunas',
    maxDailyDose: 'Definida por el médico según los niveles de TSH',
    warnings: [
      'Tomar en ayunas, 30 a 60 minutos antes del desayuno, con agua.',
      'No cambiar de marca sin control médico: la dosis es muy precisa.',
      'La dosis se ajusta con exámenes de sangre (TSH) periódicos.',
      'Separar de calcio, hierro y antiácidos por varias horas.',
    ],
    sideEffects: [
      'Por dosis alta: palpitaciones, temblor, insomnio',
      'Nerviosismo o ansiedad',
      'Pérdida de peso o sudoración excesiva',
    ],
    contraindications: [
      'Hipertiroidismo no tratado (tiroides muy activa)',
      'Infarto agudo de miocardio reciente',
      'Insuficiencia suprarrenal no tratada',
    ],
  },
}

export function getMedicineInfo(slug: string): MedicineInfo | null {
  return MEDICINE_INFO[slug.toLowerCase()] ?? null
}

export function getAllMedicineSlugs(): string[] {
  return Object.keys(MEDICINE_INFO)
}
