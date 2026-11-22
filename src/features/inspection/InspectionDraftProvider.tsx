import type { JSX, ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';

import { INITIAL_DRAFT, InspectionDraftContext, evidenceId, formatSignedAt } from './draftContext';
import type { InspectionDraft, InspectionDraftValue, PhotoInput } from './draftContext';

type InspectionDraftProviderProps = {
  children: ReactNode;
};

/**
 * Keeps the inspection draft shared between the "Firma" and "Resumen" screens.
 * Replace it with real state management once the inspection domain exists.
 */
export const InspectionDraftProvider = ({ children }: InspectionDraftProviderProps): JSX.Element => {
  const [draft, setDraft] = useState<InspectionDraft>(INITIAL_DRAFT);

  const setResponsable = useCallback((responsable: string) => {
    setDraft((current) => ({ ...current, responsable }));
  }, []);

  const setCargo = useCallback((cargo: string) => {
    setDraft((current) => ({ ...current, cargo }));
  }, []);

  const setSignature = useCallback((signature: string | null) => {
    setDraft((current) => ({
      ...current,
      signature,
      signedAt: signature ? formatSignedAt(new Date()) : null,
    }));
  }, []);

  const addPhotos = useCallback(
    (photos: PhotoInput[]) => {
      // Continue from the highest id so deleting a middle photo never produces
      // a duplicate key.
      const lastPosition = draft.evidences.reduce((max, evidence) => {
        const position = Number.parseInt(evidence.id.replace('E-', ''), 10);
        return Number.isNaN(position) ? max : Math.max(max, position);
      }, 0);

      const created = photos.map((photo, index) => {
        const id = evidenceId(lastPosition + index + 1);

        return {
          id,
          src: photo.dataUrl,
          alt: photo.alt ?? `Evidencia ${id}`,
        };
      });

      setDraft((current) => ({ ...current, evidences: [...current.evidences, ...created] }));
    },
    [draft.evidences],
  );

  const removeEvidence = useCallback((id: string) => {
    setDraft((current) => ({
      ...current,
      evidences: current.evidences.filter((evidence) => evidence.id !== id),
    }));
  }, []);

  const value = useMemo<InspectionDraftValue>(
    () => ({ draft, setResponsable, setCargo, setSignature, addPhotos, removeEvidence }),
    [draft, setResponsable, setCargo, setSignature, addPhotos, removeEvidence],
  );

  return <InspectionDraftContext.Provider value={value}>{children}</InspectionDraftContext.Provider>;
};
