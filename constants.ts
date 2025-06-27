import { GameStage, StageContent, Offer, Task, ConstitutionalPrinciple, PromptChainingStep } from './types';
import React from 'react'; // Import React for JSX

// Fix: Changed to React.createElement to avoid JSX parsing issues in .ts files.
export const GAME_TITLE_SVG: React.ReactNode = React.createElement(
  'svg',
  { width: "32", height: "32", viewBox: "0 0 24 24", fill: "currentColor", className: "text-sky-400" },
  React.createElement('path', {
    d: "M14 2H6C4.9 2 4 2.9 4 4V20C4 21.1 4.9 22 6 22H18C19.1 22 20 21.1 20 20V8L14 2ZM18 20H6V4H13V9H18V20ZM8 18H16V16H8V18ZM8 14H16V12H8V14ZM12 10H8V11H12V10Z",
  })
);


export const STAGES_CONTENT: Record<GameStage, StageContent> = {
  [GameStage.INTRODUCTION]: { title: "¡Bienvenido, Evaluador!", description: "Tu tarea es evaluar 5 ofertas para un contrato público para digitalizar servicios municipales. Criterios: 60% Técnico, 40% Económico. Tu objetivo es usar Ingeniería de Prompts avanzada para asegurar una evaluación justa, transparente y conforme a la LCSP. ¡Empecemos!" },
  [GameStage.BASIC_PROMPT_INTRO]: { title: "El Peligro de los Prompts Básicos", description: "Muchos empiezan con prompts simples. Veamos por qué esto puede ser problemático para tareas complejas como la contratación pública." },
  [GameStage.BASIC_PROMPT_SIM]: { title: "Simulando un Prompt Básico", description: "Experimenta los resultados vagos de un prompt no estructurado." },
  [GameStage.TASK_MAPPING_INTRO]: { title: "Estrategia 1: Mapeo de Tareas", description: "Un enfoque estructurado es clave. El Mapeo de Tareas descompone la evaluación en pasos manejables. Esto crea una hoja de ruta clara para nuestra interacción con la IA." },
  [GameStage.TASK_MAPPING]: { title: "Construye la Hoja de Ruta de Evaluación", description: "Arrastra y suelta (o selecciona en orden) las tareas principales para evaluar ofertas según las mejores prácticas de la LCSP." },
  [GameStage.CONSTITUTIONAL_AI_INTRO]: { title: "Estrategia 2: IA Constitucional", description: "La contratación pública debe adherirse a principios legales y éticos estrictos (Transparencia, Igualdad, Objetividad, Proporcionalidad, Fundamentación). La IA Constitucional ayuda a integrar estos principios en nuestros prompts." },
  [GameStage.CONSTITUTIONAL_AI]: { title: "Defiende los Principios", description: "Analiza escenarios. Identifica si las ofertas o los métodos de evaluación respetan o violan los principios clave de la LCSP." },
  [GameStage.PROMPT_CHAINING_INTRO]: { title: "Estrategia 3 & 4: Encadenamiento de Prompts y Aprendizaje Few-Shot", description: "Ahora evaluaremos las ofertas paso a paso (Encadenamiento de Prompts). Para cada paso, crearemos prompts precisos, mejorados con ejemplos de buenas y malas prácticas (Aprendizaje Few-Shot) y elementos de marcos como ASPECCT/RTF." },
  [GameStage.PROMPT_CHAINING]: { title: "Creando y Evaluando Prompts", description: "Aplica tu conocimiento para evaluar ofertas en cada fase del proceso." },
  [GameStage.FEW_SHOT_LEARNING_INTRO]: { title: "Aprendizaje Few-Shot en Acción", description: "Esta metodología está integrada en el Encadenamiento de Prompts. Seleccionarás buenos ejemplos para guiar a la IA." },
  [GameStage.FINAL_SUMMARY_INTRO]: { title: "El Poder del Prompting Metódico", description: "Revisemos cómo estas estrategias conducen a evaluaciones robustas y defendibles." },
  [GameStage.GAME_SUMMARY]: { title: "Evaluación Completa: Resultados y Aprendizajes", description: "Revisa la evaluación final y los puntos clave de aplicar ingeniería de prompts estructurada." },
};

export const INITIAL_OFFERS: Offer[] = [
  { id: 1, name: "Soluciones Innovatech", description: "Plataforma de última generación impulsada por IA con un enfoque en la experiencia del usuario.", adminDocsComplete: true, technicalProposalStrength: 'strong', price: 110000, clarity: true, usesQuantifiableData: true, justificationProvided: true },
  { id: 2, name: "Digitalizadores Cívicos", description: "Historial probado con municipios similares, pila de tecnología estándar.", adminDocsComplete: true, technicalProposalStrength: 'average', price: 95000, clarity: true, usesQuantifiableData: false, justificationProvided: false },
  { id: 3, name: "GovModernize S.L.", description: "Propuesta ambiciosa con tecnología experimental, algunas lagunas en la documentación.", adminDocsComplete: false, technicalProposalStrength: 'average', price: 100000, clarity: false, usesQuantifiableData: true, justificationProvided: true },
];

export const TASKS_FOR_MAPPING: Task[] = [
  { id: 't1', name: "Verificación Formal", description: "Comprobar el cumplimiento de los requisitos administrativos.", order: 1 },
  { id: 't2', name: "Evaluación Técnica", description: "Puntuar los criterios técnicos según el marco establecido.", order: 2 },
  { id: 't3', name: "Evaluación Económica", description: "Aplicar fórmulas de valoración a los precios ofertados.", order: 3 },
  { id: 't4', name: "Síntesis Final", description: "Calcular las puntuaciones finales ponderadas y clasificar las ofertas.", order: 4 },
  { id: 't5', name: "Documentación", description: "Preparar el acta de evaluación y justificar las decisiones.", order: 5 },
];

export const CONSTITUTIONAL_PRINCIPLES: ConstitutionalPrinciple[] = [
  { id: 'p1', name: "Transparencia", description: "Toda puntuación y decisión debe ser explicable y verificable por terceros.", exampleViolation: "La Oferta A obtiene 20 puntos por 'innovación' sin detallar cómo se evaluó.", exampleAdherence: "La puntuación de la Oferta B en 'Metodología' es 15/20 porque su plan ágil incluye sprints quincenales y definiciones claras de entregables, a diferencia de la Oferta C que fue vaga." },
  { id: 'p2', name: "Igualdad", description: "Aplicar exactamente los mismos criterios y proceso de evaluación a todas las ofertas sin excepción.", exampleViolation: "Dar más tiempo a la Oferta C para presentar documentos faltantes porque su director es conocido.", exampleAdherence: "Rechazar todas las ofertas que no cumplieron el requisito administrativo obligatorio X, independientemente de su mérito técnico." },
  { id: 'p3', name: "Objetividad", description: "Basar las decisiones en datos cuantificables y criterios predefinidos, no en percepciones subjetivas o sesgos.", exampleViolation: "'Tengo un buen presentimiento sobre la Oferta D, parecen muy profesionales.'", exampleAdherence: "La Oferta E puntúa más alto en 'Experiencia' porque proporcionó evidencia de 3 proyectos relevantes en los últimos 2 años, cumpliendo el criterio, mientras que la Oferta F solo mostró 1." },
  { id: 'p4', name: "Proporcionalidad", description: "La ponderación de los criterios (ej. 60% técnico / 40% económico) debe respetarse estrictamente en la puntuación final.", exampleViolation: "Elegir una oferta técnicamente más débil pero mucho más barata, dando efectivamente al precio más de su 40% de peso.", exampleAdherence: "Calcular la puntuación final aplicando estrictamente Puntos_Tec * 0.60 + Puntos_Econ * 0.40 para todas las ofertas." },
  { id: 'p5', name: "Justificación (Fundamentación)", description: "Cada decisión significativa (admisión, exclusión, puntuación) debe tener una base legal y fáctica específica, a menudo citando artículos de la LCSP.", exampleViolation: "Excluir la Oferta G 'porque no es lo suficientemente buena' sin razones específicas vinculadas a criterios o la ley.", exampleAdherence: "La Oferta H se excluye en base al Art. 140.1.c LCSP por no aportar la prueba de solvencia financiera requerida. La evaluación técnica indica que la Oferta I obtiene 18/25 en 'Plan de Trabajo' debido a las fortalezas específicas X, Y, Z señaladas en su propuesta." },
];

export const PROMPT_CHAINING_STEPS: PromptChainingStep[] = [
  {
    id: "admin_verification",
    name: "Verificación Administrativa",
    basePrompt: "Eres verificador administrativo. Revisa SOLO el cumplimiento formal de requisitos de esta oferta según LCSP art. 140 y ss. Input: [Documentación administrativa de la oferta]. Output requerido: 'APTO' o 'NO APTO' con justificación específica.",
    outputFormatExample: "Output: APTO (Todos los documentos obligatorios presentados y válidos) / NO APTO (Falta prueba de solvencia financiera según requisito 3.2b del pliego).",
    fewShotExamplesGood: [{id: 'g1', text: "Céntrate en la completitud y validez de los documentos especificados en el pliego."}],
    fewShotExamplesBad: [{id: 'b1', text: "No evalúes aspectos técnicos o económicos todavía.", reason: "Este paso es puramente administrativo."}],
    enhancementChoices: [
      {id: 'e1', text: "Especificar el Artículo 140 de la LCSP como referencia clave.", isGood: true},
      {id: 'e2', text: "Pedir una lista de documentos faltantes si es NO APTO.", isGood: true},
      {id: 'e3', text: "Mencionar si te gusta el logo de su empresa.", isGood: false, feedback: "Irrelevante para la verificación administrativa."},
    ]
  },
  {
    id: "technical_evaluation",
    name: "Evaluación Técnica",
    basePrompt: "Eres evaluador técnico. Evalúa SOLO aspectos técnicos de esta oferta. Los criterios son: Metodología (25 pts), Equipo Técnico (20 pts), Experiencia (15 pts). Total técnico: 60 pts. Output: Puntuación detallada por criterio y total, con justificaciones.",
    criteria: "Metodología (25 pts), Equipo técnico (20 pts), Experiencia (15 pts)",
    outputFormatExample: "Output: Metodología: 20/25 (Justificación: ...), Equipo: 15/20 (Justificación: ...), Experiencia: 10/15 (Justificación: ...), Total Técnico: 45/60.",
    fewShotExamplesGood: [
      {id: 'g1', text: "Puntuar 'Metodología de trabajo' (25 pts máx): La oferta X obtiene 15 puntos por presentar una metodología ágil con sprints de 2 semanas, entregables de fase claros y revisiones de control de calidad intermedias. Carece de un plan de mitigación de riesgos detallado.", points: 15},
      {id: 'g2', text: "Vincular claramente las puntuaciones a aspectos específicos de la propuesta de la oferta.", points: 0}
    ],
    fewShotExamplesBad: [
      {id: 'b1', text: "Oferta Y: 'Buena propuesta, 20 puntos'", reason: "Puntuación arbitraria, sin justificación específica ligada a criterios."},
      {id: 'b2', text: "Considerar el precio al dar la puntuación técnica.", reason: "El precio se evalúa por separado."}
    ],
    enhancementChoices: [
      {id: 'e1', text: "Exigir justificación detallada para la puntuación de cada criterio.", isGood: true},
      {id: 'e2', text: "Hacer referencia a ASPECCT: Audiencia (comité técnico), Estilo (formal), Propósito (puntuación objetiva).", isGood: true},
      {id: 'e3', text: "Pedir a la IA que sea indulgente si la oferta es de una empresa local.", isGood: false, feedback: "Viola los principios de Igualdad y Objetividad."},
    ]
  },
  {
    id: "economic_evaluation",
    name: "Evaluación Económica",
    basePrompt: "Eres evaluador económico. Ofertas aptas: [lista de ofertas aptas]. Aplica la fórmula: Puntos_Econ = 40 * (Oferta_más_barata / Oferta_evaluada). Precio ofertado: [precio de esta oferta]. Output: Puntuación económica calculada.",
    outputFormatExample: "Output: Puntuación Económica: 32/40 (Calculado en base a la oferta más baja de 80.000€ y el precio de esta oferta de 100.000€: 40 * (80000/100000) = 32).",
    fewShotExamplesGood: [
      {id: 'g1', text: "Oferta A: 100.000€. Oferta B: 80.000€. Puntos A = 40 * (80.000/100.000) = 32 puntos. Puntos B = 40 * (80.000/80.000) = 40 puntos."},
      {id: 'g2', text: "Asegurar que la 'Oferta_más_barata' se identifica correctamente entre todas las ofertas administrativa y técnicamente conformes."}
    ],
    fewShotExamplesBad: [
      {id: 'b1', text: "Dar más puntos si el precio parece 'justo' aunque no sea el más bajo.", reason: "La fórmula es estricta y objetiva."},
    ],
    enhancementChoices: [
      {id: 'e1', text: "Indicar explícitamente el valor de la 'Oferta_más_barata' a utilizar en el cálculo.", isGood: true},
      {id: 'e2', text: "Solicitar que se muestren los pasos del cálculo para mayor transparencia.", isGood: true},
      {id: 'e3', text: "Sugerir redondear al alza la puntuación si está cerca de un número entero.", isGood: false, feedback: "Se requiere precisión matemática."},
    ]
  },
  {
    id: "final_synthesis",
    name: "Síntesis Final y Documentación",
    basePrompt: "Combina evaluaciones previas aplicando ponderación 60% técnico + 40% económico. Genera ranking final y borrador de propuesta de adjudicación. Documentar cada decisión según art. 150 LCSP.",
    outputFormatExample: "Output: Oferta X: Téc 45/60, Econ 32/40. Final = (45*1) + (32*1) = 77/100. Ranking #1. Propuesta de adjudicación: Oferta X. Justificación: Puntuación combinada más alta, cumple con todos los requisitos de la LCSP especificados en el Art. XYZ.",
    fewShotExamplesGood: [
      {id: 'g1', text: "'En aplicación del art. 146.1 LCSP, la mesa de contratación acuerda...' [Siempre citar base legal específica]."},
      {id: 'g2', text: "El ranking final debe listar claramente todas las ofertas con sus puntuaciones desglosadas y finales."}
    ],
    fewShotExamplesBad: [
      {id: 'b1', text: "Declarar ganadora la oferta más barata sin el cálculo ponderado completo.", reason: "Viola la proporcionalidad 60/40."}
    ],
    enhancementChoices: [
      {id: 'e1', text: "Exigir la citación del Artículo 150 de la LCSP para la documentación.", isGood: true},
      {id: 'e2', text: "Solicitar que el resultado se estructure para un 'Acta de evaluación'.", isGood: true},
      {id: 'e3', text: "Permitir ligeros ajustes en el ranking basados en la 'impresión general'.", isGood: false, feedback: "El ranking final debe basarse en la puntuación y ponderación objetivas."},
    ]
  }
];


export const BASIC_PROMPT_EXAMPLE = {
  prompt: "Ayúdame a evaluar las ofertas de este procedimiento de contratación pública. Tengo 5 propuestas para servicios de consultoría en digitalización de trámites municipales. Los criterios son 60% técnico y 40% económico. ¿Cómo debería proceder?",
  aiResponse: "Vale, para evaluar las ofertas, deberías mirar sus aspectos técnicos y sus precios. Considera cuál parece la mejor en general. Podrías hacer una lista." ,
  problem: "Muy vago, falta contexto específico, no está estructurado. Esto no es útil para una evaluación real."
};