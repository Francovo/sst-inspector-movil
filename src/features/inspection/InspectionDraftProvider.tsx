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
      // Object URLs are created outside the state updater so React can call the
      // updater twice in development without leaking a second blob.
      const created = files.map((file, index) => ({
        id: evidenceId(draft.evidences.length + index + 1),
        src: URL.createObjectURL(file),
        alt: file.name.replace(/\.[^.]+$/, ''),
      }));

      setDraft((current) => ({ ...current, evidences: [...current.evidences, ...created] }));
    },
    [draft.evidences.length],
  );

  const value = useMemo<InspectionDraftValue>(
    () => ({ draft, setResponsable, setCargo, setSignature, addEvidences }),
    [draft, setResponsable, setCargo, setSignature, addEvidences],
  );

  return <InspectionDraftContext.Provider value={value}>{children}</InspectionDraftContext.Provider>;
};
