import { IonContent, IonIcon, IonModal } from '@ionic/react';
import { addOutline, closeOutline, imagesOutline } from 'ionicons/icons';
import type { ChangeEvent, JSX } from 'react';

import type { Evidence } from '../features/inspection/draftContext';
import './EvidenceGallery.css';

type EvidenceGalleryProps = {
  evidences: readonly Evidence[];
  isOpen: boolean;
  onAdd: (files: File[]) => void;
  onClose: () => void;
};

/**
 * Full gallery of the evidence attached to the report.
 * The "Agregar foto" control opens the device picker; picked images become
 * object URLs handled by the inspection draft.
 */
const EvidenceGallery = ({ evidences, isOpen, onAdd, onClose }: EvidenceGalleryProps): JSX.Element => {
  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length) onAdd(files);

    // Allow picking the same file again right away.
    event.target.value = '';
  };

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

          <label className="gallery__add">
            <IonIcon aria-hidden="true" icon={addOutline} />
            Agregar foto
            <input accept="image/*" hidden multiple onChange={handleFiles} type="file" />
          </label>
        </div>
      </IonContent>
    </IonModal>
  );
};

export default EvidenceGallery;
