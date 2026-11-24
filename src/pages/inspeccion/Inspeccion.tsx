import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import { cameraOutline, imagesOutline } from 'ionicons/icons';
import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

import ErrorToast from '../../components/ErrorToast';
import SignaturePad from '../../components/SignaturePad';
import PhotoFileInput from '../../features/media/PhotoFileInput';
import { usePhotoCapture } from '../../features/media/usePhotoCapture';
import { useInspeccionFlow } from '../../hooks/useInspeccionFlow';
import type { EstadoRespuesta, InspeccionSST } from '../../models/sst.models';
import { LISTAS_BASE } from '../../services/storage.service';

import './Inspeccion.css';

const RESPUESTAS: readonly {
  value: Exclude<EstadoRespuesta, null>;
  label: string;
}[] = [
  { value: 'cumple', label: 'Cumple' },
  { value: 'no_cumple', label: 'No cumple' },
  { value: 'no_aplica', label: 'No aplica' },
];

const INSPECCION_INICIAL: InspeccionSST = {
  id: 'insp-001',
  codigoReporte: 'SST-2026-001',
  empresa: 'Empresa Demo SST S.A.S.',
  sedeArea: 'Planta Principal - Área Operativa',
  listaChequeoId: 'chk-0312',
  listaChequeoTitulo: 'Lista de Chequeo SG-SST',
  inspectorNombre: 'Inspector SST',
  fechaInspeccion: new Date().toISOString().split('T')[0],
  estado: 'borrador',
  porcentajeCumplimiento: 0,
  hallazgosCriticos: 0,
  evidencias: [],
  items: [
    {
      id: 'item-1',
      codigo: 'SST-01',
      categoria: 'Elementos de Protección Personal',
      pregunta: '¿El personal utiliza casco y calzado de seguridad en el área?',
      guiaVerificacion: 'Verificar uso correcto y buen estado de EPP durante el recorrido.',
      respuesta: 'cumple',
      observacion: '',
    },
    {
      id: 'item-2',
      codigo: 'SST-02',
      categoria: 'Señalización y Emergencias',
      pregunta: '¿Las rutas de evacuación y extintores están libres de obstáculos?',
      guiaVerificacion: 'Comprobar visibilidad, acceso libre y vigencia de inspección.',
      respuesta: 'cumple',
      observacion: '',
    },
    {
      id: 'item-3',
      codigo: 'SST-03',
      categoria: 'Orden y Aseo',
      pregunta: '¿Las superficies de trabajo están libres de derrames o residuos?',
      guiaVerificacion: 'Revisar pisos, pasillos y zonas de carga/descarga.',
      respuesta: 'no_aplica',
      observacion: '',
    },
  ],
};

const Inspeccion: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const listaSeleccionada = useMemo(() => {
    const state = location.state as { listaId?: string } | null;
    return LISTAS_BASE.find((lista) => lista.id === state?.listaId);
  }, [location.state]);

  const inspeccionInicial = useMemo<InspeccionSST>(
    () => ({
      ...INSPECCION_INICIAL,
      listaChequeoId: listaSeleccionada?.id ?? INSPECCION_INICIAL.listaChequeoId,
      listaChequeoTitulo: listaSeleccionada?.titulo ?? INSPECCION_INICIAL.listaChequeoTitulo,
    }),
    [listaSeleccionada],
  );

  const {
    inspeccion,
    itemActual,
    indiceActual,
    totalPreguntas,
    irSiguiente,
    irAnterior,
    responderItem,
    agregarEvidencia,
    registrarFirma,
    guardarBorrador,
    finalizarYGuardar,
  } = useInspeccionFlow(inspeccionInicial);

  const [observacionTexto, setObservacionTexto] = useState<string>(itemActual?.observacion ?? '');
  const [descripcionHallazgo, setDescripcionHallazgo] = useState<string>('');
  const [fotoHallazgo, setFotoHallazgo] = useState<string | null>(null);
  const [responsableNombre, setResponsableNombre] = useState<string>(inspeccion.firma?.nombre ?? '');
  const [responsableCargo, setResponsableCargo] = useState<string>(inspeccion.firma?.cargo ?? '');
  const [firmaTexto, setFirmaTexto] = useState<string>(inspeccion.firma?.firmaBase64 ?? '');
  const [mensajeToast, setMensajeToast] = useState<string>('');
  const [mostrarToast, setMostrarToast] = useState<boolean>(false);

  const { capture, inputRef, handleFileChange, error, clearError } = usePhotoCapture({
    onPhoto: (foto) => setFotoHallazgo(foto.dataUrl),
  });

  const notificar = (msg: string) => {
    setMensajeToast(msg);
    setMostrarToast(true);
  };

  const handleSeleccionRespuesta = (valor: EstadoRespuesta) => {
    responderItem(valor, observacionTexto);
  };

  const handleGuardarObservacion = () => {
    if (!itemActual) return;
    responderItem(itemActual.respuesta, observacionTexto);
    notificar('Observación actualizada en el ítem.');
  };

  const handleCambiarPregunta = (direccion: 'anterior' | 'siguiente') => {
    if (itemActual) {
      responderItem(itemActual.respuesta, observacionTexto);
    }
    const nuevoIndice =
      direccion === 'anterior' ? Math.max(indiceActual - 1, 0) : Math.min(indiceActual + 1, totalPreguntas - 1);

    const siguienteItem = inspeccion.items[nuevoIndice];
    setObservacionTexto(siguienteItem?.observacion ?? '');

    if (direccion === 'anterior') {
      irAnterior();
    } else {
      irSiguiente();
    }
  };

  const handleAgregarEvidencia = () => {
    if (!itemActual) return;
    if (!descripcionHallazgo.trim()) {
      notificar('Escribe una breve descripción del hallazgo o evidencia.');
      return;
    }
    agregarEvidencia({
      id: `ev-${Date.now()}`,
      itemId: itemActual.id,
      imagenBase64OPath: fotoHallazgo ?? 'sin-foto',
      descripcionHallazgo: descripcionHallazgo.trim(),
      fechaCaptura: new Date().toISOString(),
    });
    setDescripcionHallazgo('');
    setFotoHallazgo(null);
    notificar('Evidencia agregada a la inspección.');
  };

  const handleGuardarFirma = () => {
    if (!responsableNombre.trim() || !responsableCargo.trim() || !firmaTexto.trim()) {
      notificar('Completa nombre, cargo y firma antes de registrar.');
      return;
    }
    registrarFirma({
      nombre: responsableNombre.trim(),
      cargo: responsableCargo.trim(),
      firmaBase64: firmaTexto.trim(),
      fechaFirma: new Date().toISOString(),
    });
    notificar('Firma del responsable registrada.');
  };

  const handleBorrador = async () => {
    try {
      if (itemActual) {
        responderItem(itemActual.respuesta, observacionTexto);
      }
      await guardarBorrador();
      notificar('Borrador guardado en almacenamiento local.');
    } catch {
      notificar('No se pudo guardar el borrador.');
    }
  };

  const handleFinalizar = async () => {
    try {
      if (responsableNombre.trim() && responsableCargo.trim() && firmaTexto.trim() && !inspeccion.firma) {
        registrarFirma({
          nombre: responsableNombre.trim(),
          cargo: responsableCargo.trim(),
          firmaBase64: firmaTexto.trim(),
          fechaFirma: new Date().toISOString(),
        });
      }
      await finalizarYGuardar();
      notificar('Inspección finalizada y lista para sincronizar.');
      navigate('/resumen');
    } catch (error) {
      const textoError = error instanceof Error ? error.message : 'Completa los datos y la firma del responsable.';
      notificar(textoError);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="inspeccion-toolbar">
          <IonTitle>Inspección SST</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="inspeccion-content ion-padding">
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>{inspeccion.listaChequeoTitulo}</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <p>
              <strong>Código:</strong> {inspeccion.codigoReporte} | <strong>Estado:</strong>{' '}
              <IonBadge>{inspeccion.estado}</IonBadge>
            </p>
            <p>
              <strong>Empresa:</strong> {inspeccion.empresa}
            </p>
            <p>
              <strong>Área/Sede:</strong> {inspeccion.sedeArea}
            </p>
            <p>
              <strong>Avance:</strong> Pregunta {totalPreguntas > 0 ? indiceActual + 1 : 0} de {totalPreguntas} |{' '}
              <strong>Evidencias:</strong> {inspeccion.evidencias.length}
            </p>
          </IonCardContent>
        </IonCard>

        {itemActual && (
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>
                {itemActual.codigo} - {itemActual.categoria}
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>
                <strong>Pregunta:</strong> {itemActual.pregunta}
              </p>
              <p>
                <strong>Guía de verificación:</strong> {itemActual.guiaVerificacion}
              </p>

              <div className="inspeccion__options">
                <span className="inspeccion__field-label">Respuesta</span>
                <div aria-label="Respuesta del ítem" className="inspeccion__options-grid" role="group">
                  {RESPUESTAS.map((option) => {
                    const selected = itemActual.respuesta === option.value;

                    return (
                      <button
                        aria-pressed={selected}
                        className={`inspeccion__option${selected ? ' inspeccion__option--active' : ''}`}
                        key={option.value}
                        onClick={() => handleSeleccionRespuesta(option.value)}
                        type="button"
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <IonItem>
                <IonLabel position="stacked">Observación del ítem</IonLabel>
                <IonTextarea
                  value={observacionTexto}
                  placeholder="Escribe aquí una observación..."
                  onIonInput={(e) => setObservacionTexto(e.detail.value ?? '')}
                />
              </IonItem>

              <IonButton expand="block" fill="outline" className="ion-margin-top" onClick={handleGuardarObservacion}>
                Guardar observación
              </IonButton>

              <div className="ion-margin-top" style={{ display: 'flex', gap: '8px' }}>
                <IonButton
                  expand="block"
                  disabled={indiceActual === 0}
                  onClick={() => handleCambiarPregunta('anterior')}
                >
                  Anterior
                </IonButton>
                <IonButton
                  expand="block"
                  disabled={indiceActual >= totalPreguntas - 1}
                  onClick={() => handleCambiarPregunta('siguiente')}
                >
                  Siguiente
                </IonButton>
              </div>
            </IonCardContent>
          </IonCard>
        )}

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Evidencia fotográfica / Hallazgo</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="stacked">Descripción del hallazgo</IonLabel>
              <IonInput
                value={descripcionHallazgo}
                placeholder="Ej. Extintor obstruido en pasillo B"
                onIonInput={(e) => setDescripcionHallazgo(e.detail.value ?? '')}
              />
            </IonItem>

            {fotoHallazgo ? (
              <figure className="inspeccion__foto">
                <img alt="Evidencia del hallazgo" src={fotoHallazgo} />
                <button type="button" onClick={() => setFotoHallazgo(null)}>
                  Quitar foto
                </button>
              </figure>
            ) : (
              <div className="inspeccion__foto-actions">
                <IonButton expand="block" onClick={() => void capture('camera')}>
                  <IonIcon slot="start" icon={cameraOutline} />
                  Tomar foto
                </IonButton>
                <IonButton expand="block" fill="outline" onClick={() => void capture('gallery')}>
                  <IonIcon slot="start" icon={imagesOutline} />
                  Galería
                </IonButton>
              </div>
            )}

            <PhotoFileInput inputRef={inputRef} onChange={handleFileChange} />
            <ErrorToast message={error} onDismiss={clearError} />

            <IonButton expand="block" className="ion-margin-top" onClick={handleAgregarEvidencia}>
              Agregar evidencia al ítem actual
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Firma del responsable</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem>
              <IonLabel position="stacked">Nombre completo</IonLabel>
              <IonInput
                value={responsableNombre}
                placeholder="Nombre del responsable"
                onIonInput={(e) => setResponsableNombre(e.detail.value ?? '')}
              />
            </IonItem>
            <IonItem>
              <IonLabel position="stacked">Cargo</IonLabel>
              <IonInput
                value={responsableCargo}
                placeholder="Ej. Supervisor SST"
                onIonInput={(e) => setResponsableCargo(e.detail.value ?? '')}
              />
            </IonItem>
            <div className="inspeccion__signature">
              <span className="inspeccion__field-label">Firma del responsable</span>
              <SignaturePad onClear={() => setFirmaTexto('')} onSave={setFirmaTexto} />
            </div>
            <IonButton expand="block" fill="outline" className="ion-margin-top" onClick={handleGuardarFirma}>
              Registrar firma
            </IonButton>
          </IonCardContent>
        </IonCard>

        <IonButton expand="block" color="medium" onClick={handleBorrador}>
          Guardar borrador
        </IonButton>
        <IonButton expand="block" color="success" className="ion-margin-top" onClick={handleFinalizar}>
          Finalizar y guardar inspección
        </IonButton>
        <IonButton expand="block" fill="clear" className="ion-margin-top" onClick={() => navigate('/dashboard')}>
          Volver al Dashboard
        </IonButton>

        <IonToast
          isOpen={mostrarToast}
          message={mensajeToast}
          duration={2500}
          onDidDismiss={() => setMostrarToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Inspeccion;
