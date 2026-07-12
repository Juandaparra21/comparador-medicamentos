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
  azitromicina: {
    slug: 'azitromicina',
    activeIngredient: 'Azitromicina',
    therapeuticClass: 'Antibiótico (macrólido)',
    requiresPrescription: true,
    uses: [
      'Infecciones respiratorias bacterianas (faringitis, bronquitis, neumonía leve)',
      'Otitis y sinusitis bacterianas',
      'Algunas infecciones de piel y de transmisión sexual',
    ],
    mechanism:
      'Se une al ribosoma bacteriano e impide que la bacteria fabrique sus proteínas, deteniendo su crecimiento. Se concentra en los tejidos, por eso los tratamientos son cortos.',
    typicalDose: '500 mg una vez al día por 3 días (según indicación médica)',
    maxDailyDose: 'Definida por el médico según la infección',
    warnings: [
      'Completar todo el tratamiento aunque se sienta mejor, para evitar resistencia.',
      'No sirve para gripa ni infecciones virales.',
      'Puede alterar el ritmo cardíaco en personas susceptibles: informe si tiene antecedentes cardíacos.',
      'Informe al médico sobre otros medicamentos que tome (tiene varias interacciones).',
    ],
    sideEffects: [
      'Diarrea, náuseas, dolor abdominal',
      'Dolor de cabeza',
      'Alteración temporal del gusto',
    ],
    contraindications: [
      'Alergia a la azitromicina u otros macrólidos',
      'Antecedente de problemas hepáticos con azitromicina',
    ],
  },
  esomeprazol: {
    slug: 'esomeprazol',
    activeIngredient: 'Esomeprazol',
    therapeuticClass: 'Inhibidor de la bomba de protones (IBP)',
    requiresPrescription: false,
    uses: [
      'Reflujo gastroesofágico y acidez frecuente',
      'Úlcera gástrica y duodenal',
      'Protección gástrica en tratamientos con AINE',
    ],
    mechanism:
      'Bloquea la bomba de protones de las células del estómago, reduciendo de forma potente y prolongada la producción de ácido. Es una versión mejorada del omeprazol.',
    typicalDose: '20 mg - 40 mg una vez al día, antes del desayuno',
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
      'Hipersensibilidad al esomeprazol u otros IBP',
      'Uso con ciertos antirretrovirales (consultar al médico)',
    ],
  },
  sertralina: {
    slug: 'sertralina',
    activeIngredient: 'Sertralina',
    therapeuticClass: 'Antidepresivo (ISRS)',
    requiresPrescription: true,
    uses: [
      'Depresión',
      'Trastornos de ansiedad y pánico',
      'Trastorno obsesivo-compulsivo (TOC)',
    ],
    mechanism:
      'Aumenta la disponibilidad de serotonina en el cerebro al bloquear su recaptación, lo que con el tiempo mejora el estado de ánimo y reduce la ansiedad.',
    typicalDose: '50 mg una vez al día (el médico ajusta según respuesta)',
    maxDailyDose: '200 mg por día',
    warnings: [
      'El efecto completo tarda de 2 a 4 semanas: no suspenda por no sentir mejoría inmediata.',
      'No suspender de golpe; la dosis se reduce gradualmente con el médico.',
      'Vigilar cambios de ánimo o ideas de autolesión al inicio, sobre todo en jóvenes.',
      'No combinar con otros medicamentos para la depresión sin supervisión médica.',
    ],
    sideEffects: [
      'Náuseas, diarrea',
      'Insomnio o somnolencia',
      'Sudoración',
      'Cambios en el deseo sexual',
    ],
    contraindications: [
      'Uso simultáneo con inhibidores de la MAO',
      'Hipersensibilidad a la sertralina',
    ],
  },
  fluoxetina: {
    slug: 'fluoxetina',
    activeIngredient: 'Fluoxetina',
    therapeuticClass: 'Antidepresivo (ISRS)',
    requiresPrescription: true,
    uses: [
      'Depresión',
      'Trastorno obsesivo-compulsivo (TOC)',
      'Bulimia nerviosa y trastornos de ansiedad',
    ],
    mechanism:
      'Bloquea la recaptación de serotonina en el cerebro, aumentando su disponibilidad. Tiene acción prolongada, por lo que permanece en el cuerpo varios días.',
    typicalDose: '20 mg una vez al día, en la mañana',
    maxDailyDose: '80 mg por día (bajo indicación médica)',
    warnings: [
      'El efecto completo tarda varias semanas en notarse.',
      'No suspender de golpe ni cambiar la dosis sin el médico.',
      'Vigilar cambios de ánimo o comportamiento al inicio del tratamiento.',
      'Tiene muchas interacciones: informe todos los medicamentos que toma.',
    ],
    sideEffects: [
      'Náuseas',
      'Insomnio, nerviosismo',
      'Dolor de cabeza',
      'Disminución del apetito',
    ],
    contraindications: [
      'Uso simultáneo con inhibidores de la MAO',
      'Hipersensibilidad a la fluoxetina',
    ],
  },
  prednisolona: {
    slug: 'prednisolona',
    activeIngredient: 'Prednisolona',
    therapeuticClass: 'Corticoide (glucocorticoide)',
    requiresPrescription: true,
    uses: [
      'Procesos inflamatorios y alérgicos importantes',
      'Crisis de asma y enfermedades respiratorias',
      'Enfermedades autoinmunes (según indicación médica)',
    ],
    mechanism:
      'Imita a las hormonas corticoides del cuerpo: disminuye la inflamación y modula la respuesta del sistema inmunitario.',
    typicalDose: 'Variable según la condición; la define el médico',
    maxDailyDose: 'Definida por el médico según la enfermedad y el peso',
    warnings: [
      'No suspender bruscamente tras varios días de uso: la dosis se baja de forma gradual.',
      'Puede subir el azúcar en sangre y la presión arterial.',
      'Tomar con alimentos para proteger el estómago.',
      'El uso prolongado requiere control médico estricto.',
    ],
    sideEffects: [
      'Aumento del apetito y del peso',
      'Insomnio, cambios de ánimo',
      'Retención de líquidos',
      'Irritación gástrica',
    ],
    contraindications: [
      'Infecciones activas no tratadas (bacterianas, virales o por hongos)',
      'Hipersensibilidad a los corticoides',
    ],
  },
  dexametasona: {
    slug: 'dexametasona',
    activeIngredient: 'Dexametasona',
    therapeuticClass: 'Corticoide (glucocorticoide potente)',
    requiresPrescription: true,
    uses: [
      'Inflamaciones y alergias severas',
      'Algunos tratamientos respiratorios y neurológicos',
      'Complemento en ciertos esquemas médicos hospitalarios',
    ],
    mechanism:
      'Es un corticoide de alta potencia y larga duración: reduce la inflamación y frena la respuesta exagerada del sistema inmunitario.',
    typicalDose: 'Variable según la condición; la define el médico',
    maxDailyDose: 'Definida por el médico según la enfermedad',
    warnings: [
      'Usar solo bajo indicación y control médico.',
      'No suspender bruscamente tras uso de varios días.',
      'Puede elevar el azúcar en sangre y bajar las defensas.',
      'Tomar con alimentos para reducir la molestia gástrica.',
    ],
    sideEffects: [
      'Insomnio, inquietud',
      'Aumento del apetito',
      'Retención de líquidos',
      'Elevación del azúcar en sangre',
    ],
    contraindications: [
      'Infecciones sistémicas activas sin tratamiento',
      'Hipersensibilidad a los corticoides',
    ],
  },
  ketoprofeno: {
    slug: 'ketoprofeno',
    activeIngredient: 'Ketoprofeno',
    therapeuticClass: 'AINE (Antiinflamatorio No Esteroideo)',
    requiresPrescription: true,
    uses: [
      'Dolor e inflamación musculoesquelética (golpes, esguinces, artritis)',
      'Dolor postoperatorio y dental',
      'Dolor menstrual',
    ],
    mechanism:
      'Inhibe las enzimas COX, reduciendo la producción de prostaglandinas que causan dolor e inflamación.',
    typicalDose: '50 mg - 100 mg dos o tres veces al día, con alimentos',
    maxDailyDose: '300 mg por día (bajo indicación médica)',
    warnings: [
      'Tomar con alimentos para reducir la irritación gástrica.',
      'No usar en el tercer trimestre del embarazo.',
      'Evitar el uso prolongado sin control médico.',
      'Precaución en personas con antecedentes de úlcera o problemas renales.',
    ],
    sideEffects: [
      'Malestar estomacal, acidez',
      'Náuseas',
      'Mareos',
      'Retención de líquidos',
    ],
    contraindications: [
      'Úlcera péptica activa o sangrado gastrointestinal',
      'Insuficiencia renal o hepática grave',
      'Tercer trimestre de embarazo',
      'Hipersensibilidad a AINEs',
    ],
  },
  metronidazol: {
    slug: 'metronidazol',
    activeIngredient: 'Metronidazol',
    therapeuticClass: 'Antibiótico y antiparasitario (nitroimidazol)',
    requiresPrescription: true,
    uses: [
      'Infecciones por bacterias anaerobias (boca, abdomen, ginecológicas)',
      'Parasitosis como amebiasis y giardiasis',
      'Vaginosis bacteriana y tricomoniasis',
    ],
    mechanism:
      'Dentro de la bacteria o el parásito se transforma en compuestos que dañan su ADN, destruyéndolos. Actúa sobre gérmenes que viven sin oxígeno.',
    typicalDose: '250 mg - 500 mg cada 8 horas (según indicación médica)',
    maxDailyDose: 'Definida por el médico según la infección',
    warnings: [
      'No consumir alcohol durante el tratamiento ni 3 días después: causa una reacción muy desagradable (náuseas, vómito, palpitaciones).',
      'Completar todo el tratamiento indicado.',
      'Puede dejar sabor metálico en la boca y oscurecer la orina (sin gravedad).',
    ],
    sideEffects: [
      'Náuseas, sabor metálico',
      'Dolor de cabeza',
      'Malestar abdominal',
      'Orina oscura (inofensivo)',
    ],
    contraindications: [
      'Consumo de alcohol durante el tratamiento',
      'Primer trimestre de embarazo (consultar al médico)',
      'Hipersensibilidad a los nitroimidazoles',
    ],
  },
  fluconazol: {
    slug: 'fluconazol',
    activeIngredient: 'Fluconazol',
    therapeuticClass: 'Antimicótico (triazol)',
    requiresPrescription: true,
    uses: [
      'Candidiasis vaginal (dosis única en muchos casos)',
      'Candidiasis oral y de piel',
      'Prevención de infecciones por hongos en pacientes de riesgo',
    ],
    mechanism:
      'Bloquea una enzima que el hongo necesita para fabricar su membrana celular, deteniendo su crecimiento.',
    typicalDose: '150 mg dosis única (candidiasis vaginal) o según indicación médica',
    maxDailyDose: 'Definida por el médico según la infección',
    warnings: [
      'Si los síntomas no mejoran o vuelven pronto, consulte al médico en lugar de repetir dosis por su cuenta.',
      'Tiene interacciones con varios medicamentos: informe lo que toma.',
      'Evitar durante el embarazo salvo indicación médica.',
    ],
    sideEffects: [
      'Náuseas, dolor abdominal',
      'Dolor de cabeza',
      'Diarrea',
      'Erupción cutánea (poco frecuente)',
    ],
    contraindications: [
      'Hipersensibilidad al fluconazol u otros azoles',
      'Uso con ciertos medicamentos que alteran el ritmo cardíaco',
    ],
  },
  sildenafil: {
    slug: 'sildenafil',
    activeIngredient: 'Sildenafil',
    therapeuticClass: 'Inhibidor de la fosfodiesterasa-5 (PDE5)',
    requiresPrescription: true,
    uses: [
      'Disfunción eréctil',
    ],
    mechanism:
      'Bloquea la enzima PDE5, lo que mejora el flujo de sangre hacia el pene ante la estimulación sexual. No produce erecciones sin estímulo ni aumenta el deseo.',
    typicalDose: '50 mg aproximadamente 1 hora antes de la actividad sexual',
    maxDailyDose: '100 mg, máximo una vez al día',
    warnings: [
      'Nunca combinarlo con nitratos (medicamentos para el pecho como isosorbide o nitroglicerina): la presión puede caer peligrosamente.',
      'Consulte al médico primero si tiene enfermedad del corazón.',
      'No combinar con otros medicamentos para la disfunción eréctil.',
      'Si una erección dura más de 4 horas, busque atención médica urgente.',
    ],
    sideEffects: [
      'Dolor de cabeza',
      'Enrojecimiento facial (rubor)',
      'Congestión nasal',
      'Alteraciones visuales leves y pasajeras',
    ],
    contraindications: [
      'Uso de nitratos en cualquier forma',
      'Enfermedad cardiovascular en la que el esfuerzo esté desaconsejado',
      'Hipotensión severa',
    ],
  },
  tamsulosina: {
    slug: 'tamsulosina',
    activeIngredient: 'Tamsulosina',
    therapeuticClass: 'Alfabloqueador (uroselectivo)',
    requiresPrescription: true,
    uses: [
      'Síntomas urinarios de la próstata agrandada (hiperplasia prostática benigna)',
      'Apoyo en la expulsión de algunos cálculos urinarios (según indicación)',
    ],
    mechanism:
      'Relaja el músculo de la próstata y del cuello de la vejiga, facilitando el paso de la orina sin reducir el tamaño de la próstata.',
    typicalDose: '0,4 mg una vez al día, después de la misma comida',
    maxDailyDose: '0,8 mg por día (bajo indicación médica)',
    warnings: [
      'Puede causar mareo al pararse rápido, sobre todo los primeros días.',
      'Si va a operarse de cataratas, avise al oftalmólogo que toma tamsulosina.',
      'Tragar la cápsula entera, sin abrir ni masticar.',
    ],
    sideEffects: [
      'Mareo',
      'Eyaculación retrógrada o disminuida',
      'Congestión nasal',
      'Dolor de cabeza',
    ],
    contraindications: [
      'Hipotensión ortostática previa',
      'Insuficiencia hepática severa',
      'Hipersensibilidad a la tamsulosina',
    ],
  },
  clopidogrel: {
    slug: 'clopidogrel',
    activeIngredient: 'Clopidogrel',
    therapeuticClass: 'Antiagregante plaquetario',
    requiresPrescription: true,
    uses: [
      'Prevención de trombos tras infarto o colocación de stent',
      'Prevención de accidente cerebrovascular en pacientes de riesgo',
      'Enfermedad arterial periférica',
    ],
    mechanism:
      'Impide que las plaquetas se agrupen y formen coágulos dentro de las arterias, reduciendo el riesgo de infarto y trombosis.',
    typicalDose: '75 mg una vez al día',
    maxDailyDose: '75 mg por día (dosis de carga solo bajo indicación médica)',
    warnings: [
      'No suspender por cuenta propia: hacerlo puede provocar un trombo, sobre todo con stent reciente.',
      'Aumenta el riesgo de sangrado: avise a médicos y odontólogos antes de cualquier procedimiento.',
      'Consulte antes de combinarlo con omeprazol u otros medicamentos para el estómago.',
      'Acuda al médico ante sangrados inusuales o moretones frecuentes.',
    ],
    sideEffects: [
      'Moretones con facilidad',
      'Sangrados menores (encías, nariz)',
      'Diarrea',
      'Dolor abdominal',
    ],
    contraindications: [
      'Sangrado activo (úlcera, hemorragia cerebral)',
      'Insuficiencia hepática severa',
      'Hipersensibilidad al clopidogrel',
    ],
  },
  rosuvastatina: {
    slug: 'rosuvastatina',
    activeIngredient: 'Rosuvastatina',
    therapeuticClass: 'Hipolipemiante (estatina)',
    requiresPrescription: true,
    uses: [
      'Colesterol y triglicéridos altos',
      'Prevención de infarto y accidente cerebrovascular en pacientes de riesgo',
    ],
    mechanism:
      'Inhibe la enzima HMG-CoA reductasa del hígado, reduciendo la producción de colesterol. Es una de las estatinas más potentes, por eso se usa en dosis menores.',
    typicalDose: '10 mg - 20 mg una vez al día, a cualquier hora',
    maxDailyDose: '40 mg por día',
    warnings: [
      'Avise al médico si presenta dolor muscular inexplicado.',
      'No usar durante el embarazo o la lactancia.',
      'El médico puede pedir controles de función hepática y renal.',
      'Informe si toma otros medicamentos para el colesterol o antibióticos.',
    ],
    sideEffects: [
      'Dolores musculares',
      'Dolor de cabeza',
      'Molestias digestivas',
      'Elevación de enzimas hepáticas',
    ],
    contraindications: [
      'Embarazo y lactancia',
      'Enfermedad hepática activa',
      'Hipersensibilidad a las estatinas',
    ],
  },
  valsartan: {
    slug: 'valsartan',
    activeIngredient: 'Valsartán',
    therapeuticClass: 'Antagonista de los receptores de angiotensina II (ARA II)',
    requiresPrescription: true,
    uses: [
      'Hipertensión arterial',
      'Insuficiencia cardíaca',
      'Protección del corazón después de un infarto',
    ],
    mechanism:
      'Bloquea los receptores AT1 de la angiotensina II, evitando que los vasos se contraigan. Así se relajan las arterias y baja la presión arterial.',
    typicalDose: '80 mg - 160 mg una vez al día',
    maxDailyDose: '320 mg por día',
    warnings: [
      'No usar durante el embarazo: puede causar daño fetal grave.',
      'Monitorear la función renal y el potasio periódicamente.',
      'Evitar sustitutos de sal con potasio sin consultar al médico.',
      'Puede causar mareo al inicio del tratamiento.',
    ],
    sideEffects: [
      'Mareos',
      'Fatiga',
      'Hiperpotasemia (aumento del potasio en sangre)',
      'Dolor de cabeza',
    ],
    contraindications: [
      'Embarazo',
      'Insuficiencia hepática severa',
      'Uso combinado con aliskiren en diabetes o insuficiencia renal',
    ],
  },
  montelukast: {
    slug: 'montelukast',
    activeIngredient: 'Montelukast',
    therapeuticClass: 'Antiasmático (antagonista de leucotrienos)',
    requiresPrescription: true,
    uses: [
      'Tratamiento de mantenimiento del asma',
      'Rinitis alérgica',
      'Prevención del broncoespasmo por ejercicio',
    ],
    mechanism:
      'Bloquea los leucotrienos, sustancias que inflaman y estrechan las vías respiratorias en el asma y la alergia.',
    typicalDose: '10 mg una vez al día, en la noche (adultos)',
    maxDailyDose: '10 mg por día',
    warnings: [
      'No sirve para tratar una crisis de asma en curso: para eso está el inhalador de rescate.',
      'Vigilar cambios de ánimo, sueño o comportamiento y comentarlos al médico.',
      'No suspender el resto del tratamiento del asma sin indicación.',
    ],
    sideEffects: [
      'Dolor de cabeza',
      'Dolor abdominal',
      'Alteraciones del sueño (poco frecuente)',
      'Cambios de ánimo (raro; consultar si ocurre)',
    ],
    contraindications: [
      'Hipersensibilidad al montelukast',
    ],
  },
  desloratadina: {
    slug: 'desloratadina',
    activeIngredient: 'Desloratadina',
    therapeuticClass: 'Antihistamínico (segunda generación)',
    requiresPrescription: false,
    uses: [
      'Rinitis alérgica (estornudos, secreción y picazón nasal)',
      'Urticaria y picazón en la piel',
    ],
    mechanism:
      'Es el metabolito activo de la loratadina: bloquea los receptores H1 de la histamina con acción prolongada y muy poca somnolencia.',
    typicalDose: '5 mg una vez al día',
    maxDailyDose: '5 mg por día',
    warnings: [
      'No superar la dosis indicada.',
      'En insuficiencia renal o hepática, consulte antes de usarla.',
      'Si los síntomas persisten, consulte al médico.',
    ],
    sideEffects: [
      'Dolor de cabeza',
      'Boca seca',
      'Fatiga',
    ],
    contraindications: [
      'Hipersensibilidad a la desloratadina o a la loratadina',
    ],
  },
  ambroxol: {
    slug: 'ambroxol',
    activeIngredient: 'Ambroxol',
    therapeuticClass: 'Mucolítico / Expectorante',
    requiresPrescription: false,
    uses: [
      'Tos con flemas (productiva)',
      'Afecciones respiratorias con moco espeso (bronquitis, gripa)',
    ],
    mechanism:
      'Hace el moco más fluido y estimula los mecanismos naturales de limpieza de las vías respiratorias, facilitando expulsar las flemas.',
    typicalDose: '30 mg dos o tres veces al día (adultos)',
    maxDailyDose: '120 mg por día',
    warnings: [
      'Tomar abundante líquido ayuda a que haga mejor efecto.',
      'Si la tos dura más de una semana o hay fiebre alta, consulte al médico.',
      'En jarabe, verifique la concentración: la de niños y la de adultos son distintas.',
    ],
    sideEffects: [
      'Náuseas leves',
      'Malestar estomacal',
      'Alteración del gusto',
    ],
    contraindications: [
      'Hipersensibilidad al ambroxol',
      'Primer trimestre de embarazo (consultar al médico)',
    ],
  },
  carvedilol: {
    slug: 'carvedilol',
    activeIngredient: 'Carvedilol',
    therapeuticClass: 'Betabloqueador (con efecto vasodilatador)',
    requiresPrescription: true,
    uses: [
      'Insuficiencia cardíaca',
      'Hipertensión arterial',
      'Protección del corazón después de un infarto',
    ],
    mechanism:
      'Bloquea los receptores beta del corazón (late más despacio y con menos esfuerzo) y relaja los vasos sanguíneos, bajando la presión arterial.',
    typicalDose: '6,25 mg - 25 mg dos veces al día, con alimentos',
    maxDailyDose: '50 mg por día (según indicación médica)',
    warnings: [
      'No suspender bruscamente: el médico reduce la dosis de forma gradual.',
      'Puede causar mareo al inicio o al aumentar la dosis.',
      'En diabéticos puede enmascarar los síntomas de azúcar baja.',
      'Tomar con alimentos reduce el riesgo de mareo.',
    ],
    sideEffects: [
      'Mareo, fatiga',
      'Presión arterial baja',
      'Pulso lento (bradicardia)',
      'Aumento de peso por retención de líquidos (avisar al médico)',
    ],
    contraindications: [
      'Asma grave o broncoespasmo activo',
      'Bradicardia severa o bloqueos cardíacos avanzados',
      'Insuficiencia hepática severa',
    ],
  },
}

export function getMedicineInfo(slug: string): MedicineInfo | null {
  return MEDICINE_INFO[slug.toLowerCase()] ?? null
}

export function getAllMedicineSlugs(): string[] {
  return Object.keys(MEDICINE_INFO)
}
