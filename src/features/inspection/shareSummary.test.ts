import { expect, test } from 'vitest';

import { INITIAL_DRAFT } from './draftContext';
import { buildSummaryText } from './shareSummary';

test('builds the shared summary from the draft', () => {
  const text = buildSummaryText({ ...INITIAL_DRAFT, evidences: [] });

  expect(text).toContain('INS-2026-001');
  expect(text).toContain('Johan Sebastián Montealegre');
  expect(text).toContain('Inspector SST Líder');
  expect(text).toContain('Firma: pendiente');
  expect(text).toContain('Evidencias: 0');
});
