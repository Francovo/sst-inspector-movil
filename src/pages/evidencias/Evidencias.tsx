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
import type { ChangeEvent, JSX } from 'react';
import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import NoteBanner from '../../components/NoteBanner';
import PageHeading from '../../components/PageHeading';
import PageShell from '../../components/PageShell';
import Stepper from '../../components/Stepper';
import { INSPECTION_STEPS } from '../../features/inspection/constants';
import { useInspectionDraft } from '../../features/inspection/draftContext';
import './Evidencias.css';

/**
 * Visual mockup of the "Captura de Evidencias" screen.
 * The two buttons open the device picker and append the photo to the shared
 * draft, which is the same evidence list shown on the summary.
 */
const Evidencias = (): JSX.Element => {
  const navigate = useNavigate();
  const { draft, addEvidences, removeEvidence } = useInspectionDraft();
  const cameraInput = useRef<HTMLInputElement>(null);
  const galleryInput = useRef<HTMLInputElement>(null);
  const [description, setDescription] = useState('');
  const preview = draft.evidences.at(-1);

  const handleFiles = (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length) addEvidences(files);

    // Allow picking the same file again right away.
    event.target.value = '';
  };

  return (
    <PageShell header={{ online: false, withMenu: true }} tab="evidencias">
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
          <button className="sst-button sst-button--primary" onClick={() => cameraInput.current?.click()} type="button">
            <IonIcon aria-hidden="true" icon={cameraOutline} />
            Tomar foto
          </button>
          <button
            className="sst-button sst-button--outline"
            onClick={() => galleryInput.current?.click()}
            type="button"
          >
            <IonIcon aria-hidden="true" icon={imagesOutline} />
            Elegir de galería
          </button>
        </div>

        <input accept="image/*" capture="environment" hidden onChange={handleFiles} ref={cameraInput} type="file" />
        <input accept="image/*" hidden onChange={handleFiles} ref={galleryInput} type="file" />

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
