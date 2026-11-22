import type { JSX, ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';

import { INITIAL_DRAFT, InspectionDraftContext, evidenceId, formatSignedAt } from './draftContext';
import type { InspectionDraft, InspectionDraftValue } from './draftContext';

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

  const addEvidences = useCallback(
    (files: File[]) => {
      // Continue from the highest id so deleting a middle photo never produces
      // a duplicate key.
      const lastPosition = draft.evidences.reduce((max, evidence) => {
        const position = Number.parseInt(evidence.id.replace('E-', ''), 10);
        return Number.isNaN(position) ? max : Math.max(max, position);
      }, 0);

      // Object URLs are created outside the state updater so React can call the
      // updater twice in development without leaking a second blob.
      const created = files.map((file, index) => ({
        id: evidenceId(lastPosition + index + 1),
        src: URL.createObjectURL(file),
        alt: file.name.replace(/\.[^.]+$/, ''),
      }));

      setDraft((current) => ({ ...current, evidences: [...current.evidences, ...created] }));
    },
    [draft.evidences],
  );

  const removeEvidence = useCallback(
    (id: string) => {
      const target = draft.evidences.find((evidence) => evidence.id === id);

      // Only uploaded photos own a blob URL; the bundled demo images do not.
      if (target?.src.startsWith('blob:')) URL.revokeObjectURL(target.src);

      setDraft((current) => ({
        ...current,
        evidences: current.evidences.filter((evidence) => evidence.id !== id),
      }));
    },
    [draft.evidences],
  );

  const value = useMemo<InspectionDraftValue>(
    () => ({ draft, setResponsable, setCargo, setSignature, addEvidences, removeEvidence }),
    [draft, setResponsable, setCargo, setSignature, addEvidences, removeEvidence],
  );

  return <InspectionDraftContext.Provider value={value}>{children}</InspectionDraftContext.Provider>;
};
