/**
 * Demo report header shared by the summary and future report screens.
 * The inspection flow does not exist yet, so these values are fixed on purpose.
 */
export const DEMO_INSPECTION = {
  code: 'INS-2026-001',
  company: 'Industrias del Café S.A.S.',
  site: 'Planta de producción – Zona 1',
  checklist: 'Decreto 1072 – Condiciones Locativas',
  date: '10 de noviembre de 2026',
  answered: 18,
  total: 20,
  score: 90,
  findings: 3,
  nonConformities: 2,
  observations: 1,
} as const;
