import { IonButton, IonIcon, IonSpinner, IonToast } from '@ionic/react';
import {
  cameraOutline,
  chevronBackOutline,
  chevronForwardOutline,
  createOutline,
  shieldCheckmarkOutline,
} from 'ionicons/icons';
import type { JSX } from 'react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import ErrorToast from '../../components/ErrorToast';
import PageHeading from '../../components/PageHeading';
import PageShell from '../../components/PageShell';
import { crearInspeccion } from '../../features/inspection/questions';
import PhotoFileInput from '../../features/media/PhotoFileInput';
import type { CapturedPhoto } from '../../features/media/photoCapture';
import { usePhotoCapture } from '../../features/media/usePhotoCapture';
import type { EstadoRespuesta, EvidenciaFotografica, InspeccionSST, ItemChequeo } from '../../models/sst.models';
import { getCurrentUser } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

import './Formulario.css';

const OPTIONS: readonly {
  value: Exclude<EstadoRespuesta, null>;
  label: string;
}[] = [
  { value: 'cumple', label: 'Cumple' },
  { value: 'no_cumple', label: 'No cumple' },
  { value: 'no_aplica', label: 'No aplica' },
];

type FormLocationState = {
  listaId?: string;
  inspectionId?: string;
};

/**
 * Guided inspection flow: one question per screen, with progress, answer,
 * observation and an optional photo. The inspection is persisted as a draft
 * after every change so Firma and Resumen can read it from the shared storage.
 */
const FormularioEditor = ({ initial }: { initial: InspeccionSST }): JSX.Element => {
  const navigate = useNavigate();
  const [inspeccion, setInspeccion] = useState<InspeccionSST>(initial);
  const [index, setIndex] = useState(() => {
    const firstUnanswered = initial.items.findIndex((item) => item.respuesta === null);
    return firstUnanswered >= 0 ? firstUnanswered : 0;
  });
  const [toast, setToast] = useState<string | null>(null);

  const itemActual = inspeccion.items[index];
  const total = inspeccion.items.length;
  const progress = total > 0 ? Math.round(((index + 1) / total) * 100) : 0;
  const lastItem = index >= total - 1;
  const evidenciaActual = inspeccion.evidencias.find((evidencia) => evidencia.itemId === itemActual?.id);

  const persist = (next: InspeccionSST) => {
    setInspeccion(next);
    void StorageService.guardarInspeccion(next);
  };

  const updateItem = (changes: Partial<ItemChequeo>) => {
    const next: InspeccionSST = {
      ...inspeccion,
      items: inspeccion.items.map((item, position) => (position === index ? { ...item, ...changes } : item)),
    };

    persist(next);
  };

  const handlePhoto = (photo: CapturedPhoto) => {
    if (!itemActual) return;

    const evidencia: EvidenciaFotografica = {
      id: `ev-${Date.now()}`,
      itemId: itemActual.id,
      imagenBase64OPath: photo.dataUrl,
      descripcionHallazgo: itemActual.observacion.trim() || itemActual.pregunta,
      fechaCaptura: new Date().toISOString(),
    };

    persist({
      ...inspeccion,
      evidencias: [...inspeccion.evidencias.filter((item) => item.itemId !== itemActual.id), evidencia],
    });
  };

  const { capture, inputRef, handleFileChange, error, clearError } = usePhotoCapture({
    onPhoto: handlePhoto,
  });

  const handleObservation = (value: string) => {
    setInspeccion((current) => ({
      ...current,
      items: current.items.map((item, position) => (position === index ? { ...item, observacion: value } : item)),
    }));
  };

  const handleSaveObservation = () => {
    void StorageService.guardarInspeccion(inspeccion);
  };

  const handleRemovePhoto = () => {
    if (!itemActual) return;

    persist({
      ...inspeccion,
      evidencias: inspeccion.evidencias.filter((evidencia) => evidencia.itemId !== itemActual.id),
    });
  };

  const handleNext = async () => {
    if (!itemActual?.respuesta) {
      setToast('Selecciona una respuesta antes de continuar.');
      return;
    }

    const updated: InspeccionSST = { ...inspeccion, estado: 'borrador' };
    await StorageService.guardarInspeccion(updated);
    setInspeccion(updated);

    if (lastItem) {
      navigate('/firma', { state: { inspectionId: updated.id } });
      return;
    }

    setIndex((current) => Math.min(current + 1, total - 1));
  };

  const handlePrevious = async () => {
    if (index === 0) return;

    await StorageService.guardarInspeccion(inspeccion);
    setIndex((current) => Math.max(current - 1, 0));
  };

  return (
    <PageShell header={{ backTo: '/listas' }}>
      <div className="inspeccion">
        <PageHeading subtitle="Revisa y responde cada ítem de la lista de chequeo" title="Formulario de inspección" />

        <section aria-label="Progreso de la inspección" className="sst-card inspeccion__progress">
          <div className="inspeccion__progress-row">
            <span>
              Pregunta {index + 1} de {total}
            </span>
            <span>{progress}% completado</span>
          </div>
          <span className="inspeccion__bar">
            <span style={{ width: `${progress}%` }} />
          </span>
        </section>

        {itemActual && (
          <section className="sst-card inspeccion__card">
            <div className="inspeccion__meta">
              <span className="inspeccion__category">
                <IonIcon aria-hidden="true" icon={shieldCheckmarkOutline} />
                {itemActual.categoria}
              </span>
              <span className="inspeccion__id">ID: {itemActual.codigo}</span>
            </div>

            <div className="inspeccion__copy">
              <h3 className="inspeccion__prompt">{itemActual.pregunta}</h3>
              <p className="inspeccion__help">{itemActual.guiaVerificacion}</p>
            </div>

            <div aria-label="Respuesta del ítem" className="inspeccion__options" role="group">
              {OPTIONS.map((option) => {
                const selected = itemActual.respuesta === option.value;

                return (
                  <button
                    aria-pressed={selected}
                    className={`inspeccion__option${selected ? ' inspeccion__option--active' : ''}`}
                    key={option.value}
                    onClick={() => updateItem({ respuesta: option.value })}
                    type="button"
                  >
                    {selected && <span aria-hidden="true" className="inspeccion__option-dot" />}
                    {option.label}
                  </button>
                );
              })}
            </div>

            <div className="inspeccion__observation">
              <div className="inspeccion__observation-head">
                <label htmlFor="inspeccion-observacion">
                  <IonIcon aria-hidden="true" icon={createOutline} />
                  Observación (opcional)
                </label>
                <span>Máx. 500 caracteres</span>
              </div>
              <textarea
                className="sst-textarea"
                id="inspeccion-observacion"
                maxLength={500}
                onBlur={handleSaveObservation}
                onChange={(event) => handleObservation(event.target.value)}
                placeholder="Escriba aquí su observación..."
                rows={2}
                value={itemActual.observacion}
              />
              <span className="inspeccion__counter">{itemActual.observacion.length}/500</span>
            </div>

            {evidenciaActual ? (
              <div className="inspeccion__evidence-preview">
                <img alt="Evidencia del ítem" src={evidenciaActual.imagenBase64OPath} />
                <div className="inspeccion__evidence-actions">
                  <button onClick={() => void capture('prompt')} type="button">
                    Cambiar foto
                  </button>
                  <button onClick={handleRemovePhoto} type="button">
                    Quitar
                  </button>
                </div>
              </div>
            ) : (
              <button className="inspeccion__evidence" onClick={() => void capture('prompt')} type="button">
                <span className="inspeccion__evidence-left">
                  <span aria-hidden="true" className="inspeccion__evidence-icon">
                    <IonIcon icon={cameraOutline} />
                  </span>
                  <span>
                    <p>Agregar evidencia</p>
                    <small>Toma una foto o adjunta una imagen</small>
                  </span>
                </span>
                <IonIcon aria-hidden="true" icon={chevronForwardOutline} />
              </button>
            )}

            <PhotoFileInput inputRef={inputRef} onChange={handleFileChange} />
            <ErrorToast message={error} onDismiss={clearError} />
          </section>
        )}

        <nav aria-label="Navegación entre preguntas" className="inspeccion__nav">
          <button
            className="inspeccion__nav-btn"
            disabled={index === 0}
            onClick={() => void handlePrevious()}
            type="button"
          >
            <IonIcon aria-hidden="true" icon={chevronBackOutline} />
            <span className="inspeccion__nav-copy">
              <strong>Anterior</strong>
              <small>{index > 0 ? `Pregunta ${index} de ${total}` : 'Inicio de la lista'}</small>
            </span>
          </button>

          <button
            className="inspeccion__nav-btn inspeccion__nav-btn--next"
            onClick={() => void handleNext()}
            type="button"
          >
            <span className="inspeccion__nav-copy">
              <strong>{lastItem ? 'Firmar' : 'Siguiente'}</strong>
              <small>{lastItem ? 'Continuar a la firma' : `Pregunta ${index + 2} de ${total}`}</small>
            </span>
            <IonIcon aria-hidden="true" icon={chevronForwardOutline} />
          </button>
        </nav>
      </div>

      <IonToast
        duration={2500}
        isOpen={toast !== null}
        message={toast ?? ''}
        onDidDismiss={() => setToast(null)}
        position="top"
      />
    </PageShell>
  );
};

const Formulario = (): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const { listaId, inspectionId } = (location.state ?? {}) as FormLocationState;

  const [inspeccion, setInspeccion] = useState<InspeccionSST | null>(() =>
    !inspectionId && listaId ? crearInspeccion(listaId, getCurrentUser()) : null,
  );
  const [loading, setLoading] = useState(Boolean(inspectionId) || !listaId);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let active = true;

    if (inspectionId) {
      StorageService.obtenerInspeccionPorId(inspectionId)
        .then((stored) => {
          if (!active) return;
          if (stored) setInspeccion(stored);
          else setNotFound(true);
          setLoading(false);
        })
        .catch(() => {
          if (active) {
            setNotFound(true);
            setLoading(false);
          }
        });

      return () => {
        active = false;
      };
    }

    if (!listaId) {
      // Opened from the "Inspecciones" tab: continue the latest draft.
      StorageService.obtenerInspecciones()
        .then((items) => {
          if (!active) return;
          const draft = items.find((item) => item.estado === 'borrador') ?? items[0] ?? null;

          if (draft) setInspeccion(draft);
          else navigate('/listas', { replace: true });

          setLoading(false);
        })
        .catch(() => {
          if (active) setLoading(false);
        });
    }

    return () => {
      active = false;
    };
  }, [inspectionId, listaId, navigate]);

  if (loading) {
    return (
      <PageShell header={{ backTo: '/listas' }}>
        <div className="inspeccion inspeccion--center">
          <IonSpinner name="crescent" />
          <p>Cargando la inspección…</p>
        </div>
      </PageShell>
    );
  }

  if (notFound || !inspeccion) {
    return (
      <PageShell header={{ backTo: '/listas' }}>
        <div className="inspeccion inspeccion--center">
          <h2 className="inspeccion__empty-title">No hay una inspección en curso</h2>
          <p className="inspeccion__help">Selecciona una lista de chequeo para comenzar.</p>
          <IonButton className="sst-action" expand="block" routerLink="/listas">
            Ver listas de chequeo
          </IonButton>
        </div>
      </PageShell>
    );
  }

  return <FormularioEditor initial={inspeccion} />;
};

export default Formulario;
