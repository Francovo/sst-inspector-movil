import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';

export type PhotoSource = 'camera' | 'gallery' | 'prompt';

export type CapturedPhoto = {
  dataUrl: string;
  /** MIME subtype of the image, used as the stored file extension. */
  format: string;
  alt?: string;
};

const mimeFromDataUrl = (dataUrl: string): string =>
  dataUrl.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,/)?.[1] ?? 'jpeg';

const sourceFor = (source: PhotoSource): CameraSource => {
  if (source === 'camera') return CameraSource.Camera;
  if (source === 'gallery') return CameraSource.Photos;
  return CameraSource.Prompt;
};

/**
 * Opens the native camera or photo picker.
 * The browser uses a regular file input instead (see `usePhotoCapture`), so the
 * app keeps working in development and in the e2e suite.
 */
export const captureNativePhoto = async (source: PhotoSource): Promise<CapturedPhoto | null> => {
  if (!Capacitor.isNativePlatform()) return null;

  const photo = await Camera.getPhoto({
    source: sourceFor(source),
    resultType: CameraResultType.DataUrl,
    quality: 75,
    width: 1600,
    correctOrientation: true,
    saveToGallery: false,
    promptLabelHeader: 'Agregar evidencia',
    promptLabelPhoto: 'Elegir de galería',
    promptLabelPicture: 'Tomar foto',
    promptLabelCancel: 'Cancelar',
  });

  if (!photo.dataUrl) return null;

  return {
    dataUrl: photo.dataUrl,
    format: mimeFromDataUrl(photo.dataUrl),
    alt: 'Evidencia fotográfica',
  };
};

/** Reads a browser-selected image as a data URL. */
export const fileToPhoto = (file: File): Promise<CapturedPhoto> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error('No se pudo leer la imagen'));
        return;
      }

      resolve({
        dataUrl: reader.result,
        format: mimeFromDataUrl(reader.result),
        alt: file.name.replace(/\.[^.]+$/, ''),
      });
    };

    reader.onerror = () => reject(reader.error ?? new Error('No se pudo leer la imagen'));
    reader.readAsDataURL(file);
  });
