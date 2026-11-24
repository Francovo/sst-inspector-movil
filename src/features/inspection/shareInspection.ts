import { Capacitor } from '@capacitor/core';
import { Share } from '@capacitor/share';

import type { InspeccionSST } from '../../models/sst.models';

export type ShareOutcome = 'shared' | 'copied';

const inspectorName = (inspeccion: InspeccionSST): string =>
  inspeccion.firma?.nombre?.trim() || inspeccion.inspectorNombre.trim() || 'Sin asignar';

const inspectorRole = (inspeccion: InspeccionSST): string => inspeccion.firma?.cargo?.trim() || 'Sin cargo';

/**
 * Plain-text report used by the native share sheet and the clipboard fallback.
 * Kept pure so it can be covered by a unit test without touching the plugins.
 */
export const buildInspectionSummary = (inspeccion: InspeccionSST): string =>
  [
    `Resumen de inspección ${inspeccion.codigoReporte}`,
    `${inspeccion.empresa} — ${inspeccion.sedeArea}`,
    `Lista: ${inspeccion.listaChequeoTitulo}`,
    `Fecha: ${inspeccion.fechaInspeccion}`,
    `Inspector: ${inspectorName(inspeccion)} (${inspectorRole(inspeccion)})`,
    `Cumplimiento: ${inspeccion.porcentajeCumplimiento}%`,
    `Hallazgos críticos: ${inspeccion.hallazgosCriticos}`,
    `Evidencias: ${inspeccion.evidencias.length}`,
    `Estado: ${inspeccion.estado.replace(/_/g, ' ')}`,
  ].join('\n');

/**
 * Shares the report with the native sheet on device. On the web it uses the
 * Web Share API and falls back to the clipboard.
 */
export const shareInspection = async (inspeccion: InspeccionSST): Promise<ShareOutcome> => {
  const title = `Inspección ${inspeccion.codigoReporte}`;
  const text = buildInspectionSummary(inspeccion);

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
