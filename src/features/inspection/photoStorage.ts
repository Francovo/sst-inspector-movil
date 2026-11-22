import { Capacitor } from '@capacitor/core';
import { Directory, Filesystem } from '@capacitor/filesystem';

const EVIDENCE_DIRECTORY = 'evidencias';

export type StoredPhoto = {
  path: string;
  /** Source ready to use in an <img>: file URL on device, data URL on web. */
  src: string;
};

const extensionFor = (format: string): string => {
  const normalized = format.toLowerCase();
  if (normalized === 'jpeg') return 'jpg';
  return normalized.replace(/[^a-z0-9]/g, '') || 'jpg';
};

const mimeFor = (path: string): string => {
  const extension = path.split('.').pop()?.toLowerCase();

  if (extension === 'jpg' || extension === 'jpeg') return 'image/jpeg';
  if (extension === 'png') return 'image/png';
  if (extension === 'webp') return 'image/webp';
  if (extension === 'gif') return 'image/gif';
  if (extension === 'heic') return 'image/heic';

  return 'image/jpeg';
};

const base64FromDataUrl = (dataUrl: string): string => dataUrl.split(',')[1] ?? '';

/**
 * Writes a captured photo into the app's private data directory.
 * On device the returned `src` is a WebView-safe file URL; on the web the data
 * URL is kept because Filesystem is backed by IndexedDB there.
 */
export const persistPhoto = async (id: string, dataUrl: string, format: string): Promise<StoredPhoto> => {
  const path = `${EVIDENCE_DIRECTORY}/${id}.${extensionFor(format)}`;

  await Filesystem.writeFile({
    path,
    data: base64FromDataUrl(dataUrl),
    directory: Directory.Data,
    recursive: true,
  });

  if (!Capacitor.isNativePlatform()) {
    return { path, src: dataUrl };
  }

  const { uri } = await Filesystem.getUri({ path, directory: Directory.Data });
  return { path, src: Capacitor.convertFileSrc(uri) };
};

/** Rebuilds the display source of a persisted photo after an app restart. */
export const resolvePhotoSrc = async (path: string): Promise<string | null> => {
  try {
    if (Capacitor.isNativePlatform()) {
      const { uri } = await Filesystem.getUri({ path, directory: Directory.Data });
      return Capacitor.convertFileSrc(uri);
    }

    const { data } = await Filesystem.readFile({
      path,
      directory: Directory.Data,
    });

    if (typeof data === 'string') {
      return `data:${mimeFor(path)};base64,${data}`;
    }

    return URL.createObjectURL(data);
  } catch {
    return null;
  }
};

export const deletePhoto = async (path: string): Promise<void> => {
  try {
    await Filesystem.deleteFile({ path, directory: Directory.Data });
  } catch {
    // The file may already be gone (for example after clearing app data).
  }
};
