import { Capacitor } from '@capacitor/core';
import type { ChangeEvent, RefObject } from 'react';
import { useCallback, useRef, useState } from 'react';

import { captureNativePhoto, fileToPhoto } from './photoCapture';
import type { CapturedPhoto, PhotoSource } from './photoCapture';

type UsePhotoCaptureOptions = {
  onPhoto: (photo: CapturedPhoto) => void | Promise<void>;
};

type UsePhotoCaptureValue = {
  capture: (source: PhotoSource) => Promise<void>;
  inputRef: RefObject<HTMLInputElement | null>;
  handleFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
  clearError: () => void;
};

const isCancellation = (error: unknown): boolean => {
  const message = error instanceof Error ? error.message : String(error);
  return /cancel/i.test(message);
};

/**
 * Captures a photo with the native camera on device and with a file input on
 * the web. Both paths produce the same data URL payload.
 */
export const usePhotoCapture = ({ onPhoto }: UsePhotoCaptureOptions): UsePhotoCaptureValue => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  const notify = useCallback(
    async (photo: CapturedPhoto) => {
      try {
        await onPhoto(photo);
      } catch {
        setError('No se pudo guardar la evidencia.');
      }
    },
    [onPhoto],
  );

  const capture = useCallback(
    async (source: PhotoSource) => {
      setError(null);

      if (!Capacitor.isNativePlatform()) {
        const input = inputRef.current;
        if (!input) return;

        if (source === 'camera') input.setAttribute('capture', 'environment');
        else input.removeAttribute('capture');

        input.click();
        return;
      }

      try {
        const photo = await captureNativePhoto(source);
        if (photo) await notify(photo);
      } catch (caught) {
        if (!isCancellation(caught)) {
          setError('No se pudo abrir la cámara. Intenta de nuevo.');
        }
      }
    },
    [notify],
  );

  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file) return;

      setError(null);
      void fileToPhoto(file)
        .then(notify)
        .catch(() => setError('No se pudo leer la imagen.'));
    },
    [notify],
  );

  const clearError = useCallback(() => setError(null), []);

  return { capture, inputRef, handleFileChange, error, clearError };
};
