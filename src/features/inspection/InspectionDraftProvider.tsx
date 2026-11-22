import type { JSX, ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';

import { INITIAL_DRAFT, InspectionDraftContext, formatSignedAt } from './draftContext';
import type { InspectionDraft, InspectionDraftValue } from './draftContext';

type InspectionDraftProviderProps = {
  children: ReactNode;
};

/**
 * Keeps the signature draft shared between the "Firma" and "Resumen" screens.
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

  const value = useMemo<InspectionDraftValue>(
    () => ({ draft, setResponsable, setCargo, setSignature }),
    [draft, setResponsable, setCargo, setSignature],
  );

  return <InspectionDraftContext.Provider value={value}>{children}</InspectionDraftContext.Provider>;
};
