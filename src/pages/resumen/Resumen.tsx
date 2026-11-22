import { IonButton, IonIcon } from '@ionic/react';
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
import { useState } from 'react';

import EvidenceGallery from '../../components/EvidenceGallery';
import PageShell from '../../components/PageShell';
import { DEMO_INSPECTION } from '../../features/inspection/demoInspection';
import { useInspectionDraft } from '../../features/inspection/draftContext';
import './Resumen.css';

/**
 * Visual mockup of the "Resumen de Inspección" screen.
 * The report header comes from the shared demo data; the inspector name, role,
 * signature and evidences come from the inspection draft.
 */
const Resumen = (): JSX.Element => {
  const { draft, addEvidences } = useInspectionDraft();
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const answeredPercent = Math.round((DEMO_INSPECTION.answered / DEMO_INSPECTION.total) * 100);
  const isSigned = Boolean(draft.signature);

  return (
    <PageShell
      header={{}}
      tab="inspecciones"
      overlay={
        <EvidenceGallery
          evidences={draft.evidences}
          isOpen={isGalleryOpen}
          onAdd={addEvidences}
          onClose={() => setIsGalleryOpen(false)}
        />
      }
    >
      <div className="resumen">
        <section className="sst-card">
          <div className="resumen__head">
            <div>
              <h2 className="resumen__title">Resumen de inspección</h2>
              <p className="resumen__subtitle">Revisa la información antes de guardar el reporte</p>
            </div>
            <div className="resumen__head-meta">
              <span className="resumen__code"># {DEMO_INSPECTION.code}</span>
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
              <dd>{DEMO_INSPECTION.company}</dd>
            </div>
            <div className="resumen__meta-row">
              <IonIcon aria-hidden="true" icon={locationOutline} />
              <dt>Sede / Área</dt>
              <dd>{DEMO_INSPECTION.site}</dd>
            </div>
            <div className="resumen__meta-row">
              <IonIcon aria-hidden="true" icon={listOutline} />
              <dt>Lista de chequeo</dt>
              <dd>{DEMO_INSPECTION.checklist}</dd>
            </div>
            <div className="resumen__meta-row">
              <IonIcon aria-hidden="true" icon={calendarOutline} />
              <dt>Fecha</dt>
              <dd>{DEMO_INSPECTION.date}</dd>
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
              {DEMO_INSPECTION.answered}
              <span>de {DEMO_INSPECTION.total}</span>
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
                  style={{ strokeDasharray: `${DEMO_INSPECTION.score}, 100` }}
                />
              </svg>
              <span className="resumen__gauge-label">{DEMO_INSPECTION.score}%</span>
            </div>
            <span className="resumen__metric-foot">Calificación alta</span>
          </article>

          <article className="sst-card resumen__metric">
            <span className="resumen__metric-label">Hallazgos</span>
            <p className="resumen__findings">
              <IonIcon aria-hidden="true" icon={warning} />
              {DEMO_INSPECTION.findings}
            </p>
            <span className="resumen__findings-detail">
              <span className="resumen__findings-danger">{DEMO_INSPECTION.nonConformities} No conformidades</span>
              <span>{DEMO_INSPECTION.observations} Observación</span>
            </span>
          </article>
        </section>

        <section className="sst-card">
          <div className="resumen__section-head">
            <h3>
              <IonIcon aria-hidden="true" icon={imagesOutline} />
              Evidencia destacada
            </h3>
            <button className="resumen__link" onClick={() => setIsGalleryOpen(true)} type="button">
              Ver todas ({draft.evidences.length})
            </button>
          </div>

          <ul className="resumen__evidences">
            {draft.evidences.map((evidence) => (
              <li className="resumen__evidence" key={evidence.id}>
                <img alt={evidence.alt} height="96" src={evidence.src} width="96" />
                <span className="resumen__evidence-id">{evidence.id}</span>
              </li>
            ))}
            <li className="resumen__evidence-more">
              <button onClick={() => setIsGalleryOpen(true)} type="button">
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
    </PageShell>
  );
};

export default Resumen;
