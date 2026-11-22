import { IonContent, IonIcon, IonModal } from '@ionic/react';
import { addOutline, closeOutline, imagesOutline } from 'ionicons/icons';
import type { JSX } from 'react';

import type { Evidence, PhotoInput } from '../features/inspection/draftContext';
import PhotoFileInput from '../features/media/PhotoFileInput';
import { usePhotoCapture } from '../features/media/usePhotoCapture';

import ErrorToast from './ErrorToast';
import './EvidenceGallery.css';

type EvidenceGalleryProps = {
  evidences: readonly Evidence[];
  isOpen: boolean;
  onAdd: (photos: PhotoInput[]) => void | Promise<void>;
  onClose: () => void;
};

/**
 * Full gallery of the evidence attached to the report.
 * "Agregar foto" opens the native camera/photo picker on device and the file
 * input on the web; both feed the same inspection draft.
 */
const EvidenceGallery = ({ evidences, isOpen, onAdd, onClose }: EvidenceGalleryProps): JSX.Element => {
  const { capture, inputRef, handleFileChange, error, clearError } = usePhotoCapture({
    onPhoto: (photo) => onAdd([photo]),
  });

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonContent className="sst-screen">
        <div className="gallery">
          <header className="gallery__head">
            <div>
              <h2 className="gallery__title">
                <IonIcon aria-hidden="true" icon={imagesOutline} />
                Evidencias
                <span className="gallery__count">{evidences.length}</span>
              </h2>
              <p className="gallery__hint">Fotos adjuntas al reporte de inspección.</p>
            </div>

            <button aria-label="Cerrar galería" className="gallery__close" onClick={onClose} type="button">
              <IonIcon aria-hidden="true" icon={closeOutline} />
            </button>
          </header>

          <ul className="gallery__grid">
            {evidences.map((evidence) => (
              <li className="gallery__item" key={evidence.id}>
                <img alt={evidence.alt} height="160" src={evidence.src} width="160" />
                <span className="gallery__id">{evidence.id}</span>
              </li>
            ))}
          </ul>

          <button className="gallery__add" onClick={() => void capture('prompt')} type="button">
            <IonIcon aria-hidden="true" icon={addOutline} />
            Agregar foto
          </button>

          <PhotoFileInput inputRef={inputRef} onChange={handleFileChange} />
          <ErrorToast message={error} onDismiss={clearError} />
        </div>
      </IonContent>
    </IonModal>
  );
};

export default EvidenceGallery;
