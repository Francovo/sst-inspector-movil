import { IonIcon } from '@ionic/react';
import {
  cameraOutline,
  checkmarkDoneOutline,
  chevronBackOutline,
  closeOutline,
  createOutline,
  imageOutline,
  imagesOutline,
  informationCircle,
} from 'ionicons/icons';
import type { JSX } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import ErrorToast from '../../components/ErrorToast';
import NoteBanner from '../../components/NoteBanner';
import PageHeading from '../../components/PageHeading';
import PageShell from '../../components/PageShell';
import Stepper from '../../components/Stepper';
import { INSPECTION_STEPS } from '../../features/inspection/constants';
import { useInspectionDraft } from '../../features/inspection/draftContext';
import PhotoFileInput from '../../features/media/PhotoFileInput';
import { usePhotoCapture } from '../../features/media/usePhotoCapture';
import './Evidencias.css';

/**
 * Visual mockup of the "Captura de Evidencias" screen.
 * Camera/photos are captured through Capacitor on device and through a file
 * input on the web; both append to the shared inspection draft.
 */
const Evidencias = (): JSX.Element => {
  const navigate = useNavigate();
  const { draft, addPhotos, removeEvidence } = useInspectionDraft();
  const [description, setDescription] = useState('');
  const preview = draft.evidences.at(-1);
  const { capture, inputRef, handleFileChange, error, clearError } = usePhotoCapture({
    onPhoto: (photo) => addPhotos([photo]),
  });

  return (
    <PageShell header={{ withMenu: true }} tab="evidencias">
      <div className="evidencias">
        <Stepper current={2} steps={INSPECTION_STEPS} />

        <PageHeading
          icon={imageOutline}
          subtitle="Registra evidencia fotográfica del hallazgo"
          title="Captura de evidencias"
          variant="badge"
        />

        <NoteBanner icon={informationCircle}>
          Puedes tomar una foto o elegir una imagen de tu galería. Las evidencias se guardan en el dispositivo y se
          sincronizarán cuando tengas conexión.
        </NoteBanner>

        <section
          aria-label="Vista previa de la evidencia"
          className={`evidencias__preview${preview ? '' : ' evidencias__preview--empty'}`}
        >
          {preview ? (
            <>
              <img alt={preview.alt} src={preview.src} />
              <button
                aria-label="Eliminar imagen"
                className="evidencias__remove"
                onClick={() => removeEvidence(preview.id)}
                type="button"
              >
                <IonIcon aria-hidden="true" icon={closeOutline} />
              </button>
              <span className="evidencias__tag">
                <IonIcon aria-hidden="true" icon={imageOutline} />
                Foto capturada #{draft.evidences.length}
              </span>
            </>
          ) : (
            <span className="evidencias__placeholder">
              <IonIcon aria-hidden="true" icon={cameraOutline} />
              Aún no hay evidencias
            </span>
          )}
        </section>

        <div className="evidencias__actions">
          <button className="sst-button sst-button--primary" onClick={() => void capture('camera')} type="button">
            <IonIcon aria-hidden="true" icon={cameraOutline} />
            Tomar foto
          </button>
          <button className="sst-button sst-button--outline" onClick={() => void capture('gallery')} type="button">
            <IonIcon aria-hidden="true" icon={imagesOutline} />
            Elegir de galería
          </button>
        </div>

        <PhotoFileInput inputRef={inputRef} onChange={handleFileChange} />
        <ErrorToast message={error} onDismiss={clearError} />

        <section className="sst-card evidencias__description">
          <div className="evidencias__description-head">
            <label htmlFor="evidencias-descripcion">
              <IonIcon aria-hidden="true" icon={createOutline} />
              Descripción del hallazgo
            </label>
            <span>{description.length}/500</span>
          </div>
          <textarea
            className="sst-textarea"
            id="evidencias-descripcion"
            maxLength={500}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Describe aquí el hallazgo, incluye detalles relevantes..."
            rows={2}
            value={description}
          />
        </section>

        <div className="evidencias__footer">
          <button className="sst-button sst-button--outline" onClick={() => navigate('/inspeccion')} type="button">
            <IonIcon aria-hidden="true" icon={chevronBackOutline} />
            Volver al formulario
          </button>
          <button className="sst-button sst-button--primary" onClick={() => navigate('/firma')} type="button">
            <IonIcon aria-hidden="true" icon={checkmarkDoneOutline} />
            Guardar evidencia
          </button>
        </div>
      </div>
    </PageShell>
  );
};

export default Evidencias;
