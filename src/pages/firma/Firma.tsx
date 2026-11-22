import { IonButton, IonIcon } from '@ionic/react';
import { arrowForwardOutline, briefcaseOutline, checkmarkCircle, createOutline, personOutline } from 'ionicons/icons';
import type { JSX } from 'react';

import PageHeading from '../../components/PageHeading';
import PageShell from '../../components/PageShell';
import SignaturePad from '../../components/SignaturePad';
import Stepper from '../../components/Stepper';
import TextField from '../../components/form/TextField';
import { INSPECTION_STEPS } from '../../features/inspection/constants';
import { useInspectionDraft } from '../../features/inspection/draftContext';
import { lightImpact } from '../../features/native/haptics';
import './Firma.css';

/**
 * Visual mockup of the "Firma Digital" screen.
 * The responsable fields and the canvas write into the shared inspection draft,
 * which is what the summary screen reads back.
 */
const Firma = (): JSX.Element => {
  const { draft, setResponsable, setCargo, setSignature } = useInspectionDraft();

  return (
    <PageShell header={{ withMenu: true, withOverflow: true }} tab="inspecciones">
      <div className="firma">
        <Stepper current={4} steps={INSPECTION_STEPS} />

        <PageHeading
          icon={createOutline}
          subtitle="Confirma la información de la inspección con tu firma."
          title="Firma digital"
        />

        <section aria-labelledby="responsable-title" className="sst-card firma__card">
          <div className="firma__card-head">
            <IonIcon aria-hidden="true" icon={personOutline} />
            <h3 id="responsable-title">Responsable de la inspección</h3>
          </div>

          <TextField
            icon={personOutline}
            id="responsable-nombre"
            label="Nombre *"
            onChange={(event) => setResponsable(event.target.value)}
            placeholder="Ingresa tu nombre completo"
            type="text"
            value={draft.responsable}
          />

          <TextField
            icon={briefcaseOutline}
            id="responsable-cargo"
            label="Cargo *"
            onChange={(event) => setCargo(event.target.value)}
            placeholder="Ingresa tu cargo o rol"
            type="text"
            value={draft.cargo}
          />

          <div className="sst-field">
            <span className="sst-field__label">Firma del responsable *</span>
            <SignaturePad
              onClear={() => setSignature(null)}
              onSave={(signature) => {
                setSignature(signature);
                lightImpact();
              }}
            />
          </div>

          {draft.signature && (
            <p className="firma__feedback" role="status">
              <IonIcon aria-hidden="true" icon={checkmarkCircle} />
              Firma capturada en este dispositivo (demostración).
            </p>
          )}
        </section>

        <IonButton className="sst-action sst-action--cta" color="success" expand="block" routerLink="/resumen">
          Continuar al resumen
          <IonIcon aria-hidden="true" icon={arrowForwardOutline} slot="end" />
        </IonButton>
      </div>
    </PageShell>
  );
};

export default Firma;
