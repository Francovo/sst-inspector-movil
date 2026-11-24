import { IonButton, IonIcon, IonSpinner, IonToast } from '@ionic/react';
import {
  briefcaseOutline,
  businessOutline,
  calendarOutline,
  checkmark,
  createOutline,
  documentTextOutline,
  imagesOutline,
  informationCircle,
  listOutline,
  locationOutline,
  personOutline,
  shareSocialOutline,
  syncOutline,
  timeOutline,
  warning,
} from 'ionicons/icons';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';

import PageShell from '../../components/PageShell';
import { shareInspection } from '../../features/inspection/shareInspection';
import type { InspeccionSST } from '../../models/sst.models';
import { StorageService } from '../../services/storage.service';

import './Resumen.css';

const formatDate = (value: string): string => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return value;

  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'long' }).format(date);
};

const isImageSource = (value: string): boolean =>
  value.startsWith('data:image/') || value.startsWith('http') || value.startsWith('/') || value.startsWith('blob:');

const STATUS_LABELS: Record<InspeccionSST['estado'], string> = {
  borrador: 'Borrador',
  pendiente_sincronizar: 'Pendiente',
  sincronizada: 'Sincronizada',
};

/**
 * Summary of the latest inspection saved by main's storage service.
 * It reads the real inspection model, so the report matches what the
 * inspection editor and the synchronization screen already handle.
 */
const Resumen = (): JSX.Element => {
  const [inspeccion, setInspeccion] = useState<InspeccionSST | null>(null);
  const [loading, setLoading] = useState(true);
  const [shareMessage, setShareMessage] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    StorageService.obtenerInspecciones()
      .then((inspecciones) => {
        if (active) setInspeccion(inspecciones[0] ?? null);
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <PageShell header={{ withMenu: true }}>
        <div className="resumen resumen--center">
          <IonSpinner name="crescent" />
          <p>Cargando el reporte…</p>
        </div>
      </PageShell>
    );
  }

  if (!inspeccion) {
    return (
      <PageShell header={{ withMenu: true }}>
        <div className="resumen resumen--center">
          <IonIcon aria-hidden="true" className="resumen__empty-icon" icon={documentTextOutline} />
          <h2 className="resumen__title">Aún no hay inspecciones guardadas</h2>
          <p className="resumen__subtitle">
            Completa una inspección y guárdala para ver aquí su resumen, firma y evidencias.
          </p>
          <IonButton className="sst-action" expand="block" routerLink="/listas">
            Nueva inspección
          </IonButton>
          <IonButton className="sst-action" expand="block" fill="outline" routerLink="/dashboard">
            Volver al inicio
          </IonButton>
        </div>
      </PageShell>
    );
  }

  const answerable = inspeccion.items.filter((item) => item.respuesta !== null);
  const answered = answerable.length;
  const total = inspeccion.items.length;
  const answeredPercent = total > 0 ? Math.round((answered / total) * 100) : 0;
  const score = StorageService.calcularCumplimiento(inspeccion);
  const nonConformities = inspeccion.items.filter((item) => item.respuesta === 'no_cumple').length;
  const observations = inspeccion.items.filter((item) => item.observacion.trim().length > 0).length;
  const signature = inspeccion.firma?.firmaBase64;
  const isSigned = Boolean(signature);
  const signatureIsImage = signature ? isImageSource(signature) : false;
  const inspector = inspeccion.firma?.nombre?.trim() || inspeccion.inspectorNombre || '—';
  const role = inspeccion.firma?.cargo?.trim() || '—';

  const handleShare = async () => {
    try {
      const outcome = await shareInspection(inspeccion);
      setShareMessage(outcome === 'copied' ? 'Resumen copiado al portapapeles.' : null);
    } catch {
      setShareMessage('No se pudo compartir el resumen.');
    }
  };

  return (
    <PageShell header={{ withMenu: true }}>
      <div className="resumen">
        <section className="sst-card">
          <div className="resumen__head">
            <div>
              <h2 className="resumen__title">Resumen de inspección</h2>
              <p className="resumen__subtitle">Revisa la información antes de sincronizar el reporte</p>
            </div>
            <div className="resumen__head-meta">
              <span className="resumen__code"># {inspeccion.codigoReporte}</span>
              <span
                className={`sst-badge ${
                  inspeccion.estado === 'sincronizada' ? 'sst-badge--success' : 'sst-badge--warning'
                }`}
              >
                <IonIcon aria-hidden="true" icon={inspeccion.estado === 'sincronizada' ? checkmark : timeOutline} />
                {STATUS_LABELS[inspeccion.estado]}
              </span>
            </div>
          </div>

          <hr className="sst-divider" />

          <dl className="resumen__meta">
            <div className="resumen__meta-row">
              <IonIcon aria-hidden="true" icon={businessOutline} />
              <dt>Empresa</dt>
              <dd>{inspeccion.empresa}</dd>
            </div>
            <div className="resumen__meta-row">
              <IonIcon aria-hidden="true" icon={locationOutline} />
              <dt>Sede / Área</dt>
              <dd>{inspeccion.sedeArea}</dd>
            </div>
            <div className="resumen__meta-row">
              <IonIcon aria-hidden="true" icon={listOutline} />
              <dt>Lista de chequeo</dt>
              <dd>{inspeccion.listaChequeoTitulo}</dd>
            </div>
            <div className="resumen__meta-row">
              <IonIcon aria-hidden="true" icon={calendarOutline} />
              <dt>Fecha</dt>
              <dd>{formatDate(inspeccion.fechaInspeccion)}</dd>
            </div>
            <div className="resumen__meta-row">
              <IonIcon aria-hidden="true" icon={personOutline} />
              <dt>Inspector</dt>
              <dd>{inspector}</dd>
            </div>
            <div className="resumen__meta-row">
              <IonIcon aria-hidden="true" icon={briefcaseOutline} />
              <dt>Cargo</dt>
              <dd>{role}</dd>
            </div>
          </dl>
        </section>

        <section aria-label="Indicadores de la inspección" className="resumen__metrics">
          <article className="sst-card resumen__metric">
            <span className="resumen__metric-label">Items respondidos</span>
            <p className="resumen__metric-value">
              {answered}
              <span>de {total}</span>
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
                  style={{ strokeDasharray: `${score}, 100` }}
                />
              </svg>
              <span className="resumen__gauge-label">{score}%</span>
            </div>
            <span className="resumen__metric-foot">
              {score >= 80 ? 'Calificación alta' : score >= 50 ? 'Calificación media' : 'Requiere atención'}
            </span>
          </article>

          <article className="sst-card resumen__metric">
            <span className="resumen__metric-label">Hallazgos</span>
            <p className="resumen__findings">
              <IonIcon aria-hidden="true" icon={warning} />
              {inspeccion.hallazgosCriticos}
            </p>
            <span className="resumen__findings-detail">
              <span className="resumen__findings-danger">
                {nonConformities} {nonConformities === 1 ? 'No conformidad' : 'No conformidades'}
              </span>
              <span>
                {observations} {observations === 1 ? 'Observación' : 'Observaciones'}
              </span>
            </span>
          </article>
        </section>

        <section className="sst-card">
          <div className="resumen__section-head">
            <h3>
              <IonIcon aria-hidden="true" icon={imagesOutline} />
              Evidencias
            </h3>
            <span className="resumen__link">{inspeccion.evidencias.length} adjuntas</span>
          </div>

          {inspeccion.evidencias.length > 0 ? (
            <ul className="resumen__evidences">
              {inspeccion.evidencias.slice(0, 4).map((evidence) => (
                <li className="resumen__evidence" key={evidence.id}>
                  {isImageSource(evidence.imagenBase64OPath) ? (
                    <img alt={evidence.descripcionHallazgo} src={evidence.imagenBase64OPath} />
                  ) : (
                    <span className="resumen__evidence-text">{evidence.descripcionHallazgo}</span>
                  )}
                  <span className="resumen__evidence-id">{evidence.id}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="resumen__empty-line">No se adjuntaron evidencias a esta inspección.</p>
          )}
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
            {signature ? (
              signatureIsImage ? (
                <img alt={`Firma de ${inspector}`} className="resumen__signature-image" src={signature} />
              ) : (
                <span className="resumen__signature-empty">{signature}</span>
              )
            ) : (
              <span className="resumen__signature-empty">Sin firma capturada</span>
            )}
          </div>

          <div className="resumen__signature-foot">
            <strong>{inspector}</strong>
            <span>{inspeccion.firma?.fechaFirma ? formatDate(inspeccion.firma.fechaFirma) : '—'}</span>
          </div>
        </section>

        <section className="resumen__notice">
          <IonIcon aria-hidden="true" icon={informationCircle} />
          <p>
            <strong>Reporte guardado localmente</strong>
            El reporte está en este dispositivo. Se sincronizará cuando uses la pantalla de sincronización.
          </p>
        </section>

        <div className="resumen__actions">
          <IonButton className="sst-action sst-action--ghost" expand="block" fill="outline" routerLink="/inspeccion">
            <IonIcon aria-hidden="true" icon={createOutline} slot="start" />
            Editar inspección
          </IonButton>

          <IonButton className="sst-action" expand="block" fill="outline" routerLink="/sincronizacion">
            <IonIcon aria-hidden="true" icon={syncOutline} slot="start" />
            Sincronizar
          </IonButton>

          <IonButton
            className="sst-action sst-action--cta resumen__share-action"
            color="success"
            expand="block"
            onClick={() => void handleShare()}
          >
            <IonIcon aria-hidden="true" icon={shareSocialOutline} slot="start" />
            Compartir resumen
          </IonButton>
        </div>

        <IonToast
          duration={2500}
          isOpen={shareMessage !== null}
          message={shareMessage ?? ''}
          onDidDismiss={() => setShareMessage(null)}
          position="top"
        />
      </div>
    </PageShell>
  );
};

export default Resumen;
