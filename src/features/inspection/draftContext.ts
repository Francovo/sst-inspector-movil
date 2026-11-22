import { createContext, useContext } from 'react';

/**
 * Draft of the inspection being signed.
 *
 * It lives in memory only: there is no report, storage or signature validation
 * behind it yet, so reloading the app resets it.
 */
export type InspectionDraft = {
  responsable: string;
  cargo: string;
  /** PNG data URL of the captured signature, or null while it is still pending. */
  signature: string | null;
  /** Local date and time of the capture, or null while it is still pending. */
  signedAt: string | null;
};

export const INITIAL_DRAFT: InspectionDraft = {
  responsable: 'Johan Sebastián Montealegre',
  cargo: 'Inspector SST Líder',
  signature: null,
  signedAt: null,
};

export type InspectionDraftValue = {
  draft: InspectionDraft;
  setResponsable: (value: string) => void;
  setCargo: (value: string) => void;
  setSignature: (value: string | null) => void;
};

export const InspectionDraftContext = createContext<InspectionDraftValue | null>(null);

export const useInspectionDraft = (): InspectionDraftValue => {
  const context = useContext(InspectionDraftContext);

  if (!context) {
    throw new Error('useInspectionDraft debe usarse dentro de <InspectionDraftProvider>');
  }

  return context;
};

/** `dd/mm/yyyy hh:mm` in the device timezone. */
export const formatSignedAt = (date: Date): string => {
  const pad = (value: number) => String(value).padStart(2, '0');

  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()} ${pad(
    date.getHours(),
  )}:${pad(date.getMinutes())}`;
};
