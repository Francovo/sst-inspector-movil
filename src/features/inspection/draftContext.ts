import { createContext, useContext } from 'react';

import { DEMO_USER } from '../session/demoUser';

export type Evidence = {
  id: string;
  /** Image URL: a bundled asset, object URL or data URL. */
  src: string;
  alt: string;
  /** Path inside the app's Filesystem once the photo is persisted. */
  path?: string;
};

/** Photo captured by the camera plugin or picked by the web file input. */
export type PhotoInput = {
  dataUrl: string;
  /** MIME subtype of the image, such as `jpeg` or `png`. */
  format: string;
  alt?: string;
};

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
  /** Photos attached to the report, newest last. */
  evidences: Evidence[];
};

const DEMO_EVIDENCES: Evidence[] = [
  { id: 'E-01', src: '/img/inspeccion1.jpg', alt: 'Revisión de un vehículo en el patio' },
  { id: 'E-02', src: '/img/inspeccion2.jpg', alt: 'Verificación de una estructura en obra' },
  { id: 'E-03', src: '/img/inspeccion3.jpg', alt: 'Supervisión de trabajos en altura' },
];

export const INITIAL_DRAFT: InspectionDraft = {
  responsable: DEMO_USER.fullName,
  cargo: DEMO_USER.role,
  signature: null,
  signedAt: null,
  evidences: DEMO_EVIDENCES,
};

export type InspectionDraftValue = {
  draft: InspectionDraft;
  setResponsable: (value: string) => void;
  setCargo: (value: string) => void;
  setSignature: (value: string | null) => void;
  addPhotos: (photos: PhotoInput[]) => void | Promise<void>;
  removeEvidence: (id: string) => void;
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

/** `E-04`, `E-05`… continuing from the amount of evidence already attached. */
export const evidenceId = (position: number): string => `E-${String(position).padStart(2, '0')}`;
