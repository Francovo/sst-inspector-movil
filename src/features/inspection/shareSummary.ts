import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

import { DEMO_INSPECTION } from './demoInspection';
import type { InspectionDraft } from './draftContext';

export type ShareOutcome = 'shared' | 'copied';

export const buildSummaryText = (draft: InspectionDraft): string =>
  [
    `Resumen de inspección ${DEMO_INSPECTION.code}`,
    `${DEMO_INSPECTION.company} — ${DEMO_INSPECTION.site}`,
    `Lista: ${DEMO_INSPECTION.checklist}`,
    `Inspector: ${draft.responsable || 'Sin asignar'} (${draft.cargo || 'Sin cargo'})`,
    `Firma: ${draft.signature ? `capturada ${draft.signedAt ?? ''}` : 'pendiente'}`,
    `Evidencias: ${draft.evidences.length}`,
  ].join('\n');

/**
 * Shares a text summary with the native share sheet.
 * On the web it uses the Web Share API and falls back to the clipboard.
 */
export const shareSummary = async (draft: InspectionDraft): Promise<ShareOutcome> => {
  const title = `Inspección ${DEMO_INSPECTION.code}`;
  const text = buildSummaryText(draft);

  if (Capacitor.isNativePlatform()) {
    await Share.share({ title, text, dialogTitle: 'Compartir resumen' });
    return 'shared';
  }

  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    try {
      await navigator.share({ title, text });
      return 'shared';
    } catch (error) {
      if (error instanceof DOMException && error.name === 'AbortError') {
        return 'shared';
      }
    }
  }

  await navigator.clipboard.writeText(text);
  return 'copied';
};
