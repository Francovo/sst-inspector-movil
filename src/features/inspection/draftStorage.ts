import { Preferences } from '@capacitor/preferences';

import type { InspectionDraft } from './draftContext';
import { resolvePhotoSrc } from './photoStorage';

const DRAFT_KEY = 'sst-inspection-draft';

type StoredEvidence = {
  id: string;
  alt: string;
  path?: string;
  /** Only bundled demo assets keep their URL; captured photos use `path`. */
  src?: string;
};

type StoredDraft = {
  responsable: string;
  cargo: string;
  signature: string | null;
  signedAt: string | null;
  evidences: StoredEvidence[];
};

/**
 * Persists the draft metadata (signature included) in Preferences.
 * Captured photos are not embedded here: they live in Filesystem and only
 * their path is stored, keeping the preferences payload small.
 */
export const saveDraft = async (draft: InspectionDraft): Promise<void> => {
  const stored: StoredDraft = {
    responsable: draft.responsable,
    cargo: draft.cargo,
    signature: draft.signature,
    signedAt: draft.signedAt,
    evidences: draft.evidences.map((evidence) => ({
      id: evidence.id,
      alt: evidence.alt,
      path: evidence.path,
      src: evidence.bundled ? evidence.src : undefined,
    })),
  };

  await Preferences.set({ key: DRAFT_KEY, value: JSON.stringify(stored) });
};

export const loadDraft = async (): Promise<InspectionDraft | null> => {
  const { value } = await Preferences.get({ key: DRAFT_KEY });
  if (!value) return null;

  let stored: StoredDraft;

  try {
    stored = JSON.parse(value) as StoredDraft;
  } catch {
    return null;
  }

  if (
    !stored ||
    typeof stored.responsable !== 'string' ||
    typeof stored.cargo !== 'string' ||
    !Array.isArray(stored.evidences)
  ) {
    return null;
  }

  const evidences = await Promise.all(
    stored.evidences.map(async (evidence) => {
      const src = evidence.path ? await resolvePhotoSrc(evidence.path) : evidence.src;

      if (!src) return null;

      return {
        id: evidence.id,
        alt: evidence.alt,
        path: evidence.path,
        src,
        bundled: !evidence.path,
      };
    }),
  );

  return {
    responsable: stored.responsable,
    cargo: stored.cargo,
    signature: stored.signature ?? null,
    signedAt: stored.signedAt ?? null,
    evidences: evidences.filter((evidence) => evidence !== null),
  };
};

export const clearDraft = async (): Promise<void> => {
  await Preferences.remove({ key: DRAFT_KEY });
};
