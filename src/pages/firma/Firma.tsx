import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import { arrowForwardOutline, briefcaseOutline, checkmarkCircle, createOutline, personOutline } from 'ionicons/icons';
import type { JSX } from 'react';

import AppHeader from '../../components/AppHeader';
import AppTabBar from '../../components/AppTabBar';
import SignaturePad from '../../components/SignaturePad';
import Stepper from '../../components/Stepper';
import { useInspectionDraft } from '../../features/inspection/draftContext';
import './Firma.css';

const INSPECTION_STEPS = ['Inspección', 'Evidencia', 'Revisión', 'Firma', 'Resumen'];

/**
 * Visual mockup of the "Firma Digital" screen.
 * The responsable fields and the canvas write into the shared inspection draft,
 * which is what the summary screen reads back.
 */
const Firma = (): JSX.Element => {
  const { draft, setResponsable, setCargo, setSignature } = useInspectionDraft();

  return (
    <IonPage>
      <AppHeader online={false} withMenu withOverflow />

      <IonContent className="sst-screen">
        <div className="firma">
          <Stepper current={4} steps={INSPECTION_STEPS} />

          <header className="firma__heading">
            <h2 className="firma__title">
              <IonIcon aria-hidden="true" icon={createOutline} />
              Firma digital
            </h2>
            <p className="firma__subtitle">Confirma la información de la inspección con tu firma.</p>
          </header>

          <section aria-labelledby="responsable-title" className="sst-card firma__card">
            <div className="firma__card-head">
              <IonIcon aria-hidden="true" icon={personOutline} />
              <h3 id="responsable-title">Responsable de la inspección</h3>
            </div>

            <div className="sst-field">
              <label className="sst-field__label" htmlFor="responsable-nombre">
                Nombre *
              </label>
              <div className="sst-field__control">
                <span aria-hidden="true" className="sst-field__icon">
                  <IonIcon icon={personOutline} />
                </span>
                <input
                  className="sst-input"
                  id="responsable-nombre"
                  onChange={(event) => setResponsable(event.target.value)}
                  placeholder="Ingresa tu nombre completo"
                  type="text"
                  value={draft.responsable}
                />
              </div>
            </div>

            <div className="sst-field">
              <label className="sst-field__label" htmlFor="responsable-cargo">
                Cargo *
              </label>
              <div className="sst-field__control">
                <span aria-hidden="true" className="sst-field__icon">
                  <IonIcon icon={briefcaseOutline} />
                </span>
                <input
                  className="sst-input"
                  id="responsable-cargo"
                  onChange={(event) => setCargo(event.target.value)}
                  placeholder="Ingresa tu cargo o rol"
                  type="text"
                  value={draft.cargo}
                />
              </div>
            </div>

            <div className="sst-field">
              <span className="sst-field__label">Firma del responsable *</span>
              <SignaturePad onClear={() => setSignature(null)} onSave={setSignature} />
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
      </IonContent>

      <AppTabBar active="inspecciones" />
    </IonPage>
  );
};

export default Firma;
