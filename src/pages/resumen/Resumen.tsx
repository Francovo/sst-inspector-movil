import { IonButton, IonContent, IonIcon, IonPage } from '@ionic/react';
import {
  briefcaseOutline,
  businessOutline,
  calendarOutline,
  checkmark,
  createOutline,
  imagesOutline,
  informationCircle,
  listOutline,
  locationOutline,
  personOutline,
  saveOutline,
  timeOutline,
  warning,
} from 'ionicons/icons';
import type { JSX } from 'react';

import AppHeader from '../../components/AppHeader';
import AppTabBar from '../../components/AppTabBar';
import { useInspectionDraft } from '../../features/inspection/draftContext';
import './Resumen.css';

/**
 * Demo content for the visual mockup: the inspection itself does not exist yet,
 * so every value below is hard-coded on purpose. The inspector name, the role
 * and the signature come from the shared draft filled on the "Firma" screen.
 */
const INSPECTION = {
  code: 'INS-2026-001',
  company: 'Industrias del Café S.A.S.',
  site: 'Planta de producción – Zona 1',
  checklist: 'Decreto 1072 – Condiciones Locativas',
  date: '10 de noviembre de 2026',
  answered: 18,
  total: 20,
  score: 90,
  findings: 3,
  nonConformities: 2,
  observations: 1,
  evidences: [
    { id: 'E-01', src: '/img/inspeccion1.jpg', alt: 'Revisión de un vehículo en el patio' },
    { id: 'E-02', src: '/img/inspeccion2.jpg', alt: 'Verificación de una estructura en obra' },
    { id: 'E-03', src: '/img/inspeccion3.jpg', alt: 'Supervisión de trabajos en altura' },
  ],
};

const Resumen = (): JSX.Element => {
  const { draft } = useInspectionDraft();
  const answeredPercent = Math.round((INSPECTION.answered / INSPECTION.total) * 100);
  const isSigned = Boolean(draft.signature);

  return (
    <IonPage>
      <AppHeader online />

      <IonContent className="sst-screen">
        <div className="resumen">
          <section className="sst-card">
            <div className="resumen__head">
              <div>
                <h2 className="resumen__title">Resumen de inspección</h2>
                <p className="resumen__subtitle">Revisa la información antes de guardar el reporte</p>
              </div>
              <div className="resumen__head-meta">
                <span className="resumen__code"># {INSPECTION.code}</span>
                <span className="sst-badge sst-badge--success">
                  <IonIcon aria-hidden="true" icon={checkmark} />
                  Completado
                </span>
              </div>
            </div>

            <hr className="sst-divider" />

            <dl className="resumen__meta">
              <div className="resumen__meta-row">
                <IonIcon aria-hidden="true" icon={businessOutline} />
                <dt>Empresa</dt>
                <dd>{INSPECTION.company}</dd>
              </div>
              <div className="resumen__meta-row">
                <IonIcon aria-hidden="true" icon={locationOutline} />
                <dt>Sede / Área</dt>
                <dd>{INSPECTION.site}</dd>
              </div>
              <div className="resumen__meta-row">
                <IonIcon aria-hidden="true" icon={listOutline} />
                <dt>Lista de chequeo</dt>
                <dd>{INSPECTION.checklist}</dd>
              </div>
              <div className="resumen__meta-row">
                <IonIcon aria-hidden="true" icon={calendarOutline} />
                <dt>Fecha</dt>
                <dd>{INSPECTION.date}</dd>
              </div>
              <div className="resumen__meta-row">
                <IonIcon aria-hidden="true" icon={personOutline} />
                <dt>Inspector</dt>
                <dd>{draft.responsable || '—'}</dd>
              </div>
              <div className="resumen__meta-row">
                <IonIcon aria-hidden="true" icon={briefcaseOutline} />
                <dt>Cargo</dt>
                <dd>{draft.cargo || '—'}</dd>
              </div>
            </dl>
          </section>

          <section aria-label="Indicadores de la inspección" className="resumen__metrics">
            <article className="sst-card resumen__metric">
              <span className="resumen__metric-label">Items respondidos</span>
              <p className="resumen__metric-value">
                {INSPECTION.answered}
                <span>de {INSPECTION.total}</span>
              </p>
              <span className="resumen__bar">
                <span style={{ width: `${answeredPercent}%` }} />
              </span>
              <span className="resumen__metric-foot resumen__metric-foot--success">{answeredPercent}% completado</span>
            </article>

            <article className="sst-card resumen__metric">
              <span className="resumen__metric-label">Nivel de cumplimiento</span>
              <div className="resumen__gauge">
                <svg aria-hidden="true" viewBox="0 0 36 36">
                  <circle className="resumen__gauge-track" cx="18" cy="18" r="15.9155" />
                  <circle
                    className="resumen__gauge-value"
                    cx="18"
                    cy="18"
                    r="15.9155"
                    style={{ strokeDasharray: `${INSPECTION.score}, 100` }}
                  />
                </svg>
                <span className="resumen__gauge-label">{INSPECTION.score}%</span>
              </div>
              <span className="resumen__metric-foot">Calificación alta</span>
            </article>

            <article className="sst-card resumen__metric">
              <span className="resumen__metric-label">Hallazgos</span>
              <p className="resumen__findings">
                <IonIcon aria-hidden="true" icon={warning} />
                {INSPECTION.findings}
              </p>
              <span className="resumen__findings-detail">
                <span className="resumen__findings-danger">{INSPECTION.nonConformities} No conformidades</span>
                <span>{INSPECTION.observations} Observación</span>
              </span>
            </article>
          </section>

          <section className="sst-card">
            <div className="resumen__section-head">
              <h3>
                <IonIcon aria-hidden="true" icon={imagesOutline} />
                Evidencia destacada
              </h3>
              <button className="resumen__link" type="button">
                Ver todas ({INSPECTION.evidences.length})
              </button>
            </div>

            <ul className="resumen__evidences">
              {INSPECTION.evidences.map((evidence) => (
                <li className="resumen__evidence" key={evidence.id}>
                  <img alt={evidence.alt} height="96" src={evidence.src} width="96" />
                  <span className="resumen__evidence-id">{evidence.id}</span>
                </li>
              ))}
              <li className="resumen__evidence-more">
                <button type="button">
                  <span aria-hidden="true">+</span>
                  <span>Ver todas las evidencias</span>
                </button>
              </li>
            </ul>
          </section>

          <section aria-label="Firma del inspector" className="sst-card resumen__signature">
            <div className={`resumen__signature-banner${isSigned ? '' : ' resumen__signature-banner--pending'}`}>
              <span aria-hidden="true" className="resumen__signature-icon">
                <IonIcon icon={isSigned ? checkmark : timeOutline} />
              </span>
              <div>
                <p>Firma del inspector</p>
                <small>{isSigned ? 'Firma registrada correctamente' : 'Firma pendiente de captura'}</small>
              </div>
              <span className={`sst-badge ${isSigned ? 'sst-badge--success' : 'sst-badge--warning'}`}>
                {isSigned ? 'Válida' : 'Pendiente'}
              </span>
            </div>

            <div className={`resumen__signature-pad${isSigned ? '' : ' resumen__signature-pad--empty'}`}>
              {draft.signature ? (
                <img
                  alt={`Firma de ${draft.responsable || 'el inspector'}`}
                  className="resumen__signature-image"
                  src={draft.signature}
                />
              ) : (
                <span className="resumen__signature-empty">Sin firma capturada</span>
              )}
            </div>

            <div className="resumen__signature-foot">
              <strong>{draft.responsable || '—'}</strong>
              <span>{draft.signedAt ?? '—'}</span>
            </div>
          </section>

          <section className="resumen__notice">
            <IonIcon aria-hidden="true" icon={informationCircle} />
            <p>
              <strong>Se guardará localmente</strong>
              El reporte se almacenará en este dispositivo. Se sincronizará automáticamente cuando tengas conexión a
              internet.
            </p>
          </section>

          <div className="resumen__actions">
            <IonButton className="sst-action sst-action--ghost" expand="block" fill="outline" routerLink="/firma">
              <IonIcon aria-hidden="true" icon={createOutline} slot="start" />
              Editar inspección
            </IonButton>

            <IonButton className="sst-action sst-action--cta" color="success" expand="block">
              <IonIcon aria-hidden="true" icon={saveOutline} slot="start" />
              Finalizar y guardar
            </IonButton>
          </div>
        </div>
      </IonContent>

      <AppTabBar active="inspecciones" />
    </IonPage>
  );
};

export default Resumen;
