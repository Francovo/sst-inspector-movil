import type { JSX, ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { INITIAL_DRAFT, InspectionDraftContext, evidenceId, formatSignedAt } from './draftContext';
import type { InspectionDraft, InspectionDraftValue, PhotoInput } from './draftContext';
import { loadDraft, saveDraft } from './draftStorage';
import { deletePhoto, persistPhoto } from './photoStorage';

type InspectionDraftProviderProps = {
  children: ReactNode;
};

const SAVE_DEBOUNCE_MS = 200;

/**
 * Keeps the inspection draft shared between the "Firma" and "Resumen" screens.
 * The metadata and signature are persisted in Preferences; captured photos are
 * written to Filesystem and only their path is kept in the draft.
 */
export const InspectionDraftProvider = ({ children }: InspectionDraftProviderProps): JSX.Element => {
  const [draft, setDraft] = useState<InspectionDraft>(INITIAL_DRAFT);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    let active = true;

    loadDraft()
      .then((stored) => {
        if (active && stored) setDraft(stored);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setIsHydrated(true);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!isHydrated) return undefined;

    const timer = window.setTimeout(() => {
      void saveDraft(draft).catch(() => undefined);
    }, SAVE_DEBOUNCE_MS);

    return () => window.clearTimeout(timer);
  }, [draft, isHydrated]);

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
    async (photos: PhotoInput[]) => {
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

      await Promise.all(
        created.map(async (evidence, index) => {
          try {
            const stored = await persistPhoto(evidence.id, evidence.src, photos[index].format);

            setDraft((current) => ({
              ...current,
              evidences: current.evidences.map((item) =>
                item.id === evidence.id ? { ...item, path: stored.path, src: stored.src } : item,
              ),
            }));
          } catch {
            // Keep the in-memory data URL when the file cannot be written.
          }
        }),
      );
    },
    [draft.evidences],
  );

  const removeEvidence = useCallback(
    (id: string) => {
      const target = draft.evidences.find((evidence) => evidence.id === id);
      if (target?.path) void deletePhoto(target.path);

      setDraft((current) => ({
        ...current,
        evidences: current.evidences.filter((evidence) => evidence.id !== id),
      }));
    },
    [draft.evidences],
  );

  const value = useMemo<InspectionDraftValue>(
    () => ({ draft, setResponsable, setCargo, setSignature, addPhotos, removeEvidence }),
    [draft, setResponsable, setCargo, setSignature, addPhotos, removeEvidence],
  );

  return <InspectionDraftContext.Provider value={value}>{children}</InspectionDraftContext.Provider>;
};
