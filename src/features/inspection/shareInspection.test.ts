import { expect, test } from 'vitest';

import type { InspeccionSST } from '../../models/sst.models';

import { buildInspectionSummary } from './shareInspection';

const INSPECCION: InspeccionSST = {
  id: 'insp-001',
  codigoReporte: 'SST-2026-001',
  empresa: 'Industrias del Café S.A.S.',
  sedeArea: 'Planta Principal',
  listaChequeoId: 'decreto-1072',
  listaChequeoTitulo: 'Decreto 1072',
  inspectorNombre: 'Johan Sebastián Montealegre',
  fechaInspeccion: '2026-11-23',
  items: [],
  evidencias: [],
  firma: {
    nombre: 'Johan Sebastián Montealegre',
    cargo: 'Inspector SST Líder',
    firmaBase64: 'data:image/png;base64,abc',
    fechaFirma: '2026-11-23T10:00:00.000Z',
  },
  estado: 'pendiente_sincronizar',
  porcentajeCumplimiento: 90,
  hallazgosCriticos: 2,
};

test('builds the shared report from the inspection model', () => {
  const text = buildInspectionSummary(INSPECCION);

  expect(text).toContain('SST-2026-001');
  expect(text).toContain('Industrias del Café S.A.S.');
  expect(text).toContain('Johan Sebastián Montealegre (Inspector SST Líder)');
  expect(text).toContain('Cumplimiento: 90%');
  expect(text).toContain('Evidencias: 0');
  expect(text).toContain('Estado: pendiente sincronizar');
});
