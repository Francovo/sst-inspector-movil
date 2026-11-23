import { useEffect, useState } from 'react';

import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';

import {
  cloudDoneOutline,
  cloudOfflineOutline,
  refreshOutline,
} from 'ionicons/icons';

import { InspeccionSST } from '../models/sst.models';
import { StorageService } from '../services/storage.service';

import './Sincronizacion.css';

const Sincronizacion: React.FC = () => {
  const [inspecciones, setInspecciones] = useState<InspeccionSST[]>([]);
  const [sincronizando, setSincronizando] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const cargarInspecciones = async () => {
    const datos = await StorageService.obtenerInspecciones();
    setInspecciones(datos);
  };

  useEffect(() => {
    cargarInspecciones();
  }, []);

  const pendientes = inspecciones.filter(
    (inspeccion) => inspeccion.estado === 'pendiente_sincronizar',
  ).length;

  const sincronizadas = inspecciones.filter(
    (inspeccion) => inspeccion.estado === 'sincronizada',
  ).length;

  const borradores = inspecciones.filter(
    (inspeccion) => inspeccion.estado === 'borrador',
  ).length;

  const sincronizar = async () => {
    if (pendientes === 0) {
      setMensaje('No hay inspecciones pendientes por sincronizar');
      return;
    }

    setSincronizando(true);

    const actualizadas = inspecciones.map((inspeccion) => {
      if (inspeccion.estado === 'pendiente_sincronizar') {
        return {
          ...inspeccion,
          estado: 'sincronizada' as const,
        };
      }

      return inspeccion;
    });

    for (const inspeccion of actualizadas) {
      await StorageService.guardarInspeccion(inspeccion);
    }

    setInspecciones(actualizadas);
    setSincronizando(false);

    setMensaje('Sincronización completada correctamente');
  };

  const obtenerColorEstado = (estado: InspeccionSST['estado']) => {
    switch (estado) {
      case 'sincronizada':
        return 'success';

      case 'pendiente_sincronizar':
        return 'warning';

      default:
        return 'medium';
    }
  };

  const obtenerTextoEstado = (estado: InspeccionSST['estado']) => {
    switch (estado) {
      case 'sincronizada':
        return 'Sincronizada';

      case 'pendiente_sincronizar':
        return 'Pendiente';

      default:
        return 'Borrador';
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar className="sync-toolbar">
          <IonTitle>Estado de sincronización</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="sync-content">
        <div className="sync-container">
          <IonCard className="conexion-card">
            <IonCardContent className="conexion-content">
              <IonIcon
                icon={cloudDoneOutline}
                className="conexion-icon"
              />

              <div>
                <strong>Con conexión</strong>
                <p>Dispositivo disponible para sincronización</p>
              </div>
            </IonCardContent>
          </IonCard>

          <div className="resumen-estados">
            <IonCard className="resumen-card pendiente">
              <IonCardContent>
                <strong>{pendientes}</strong>
                <span>Pendientes</span>
              </IonCardContent>
            </IonCard>

            <IonCard className="resumen-card sincronizada">
              <IonCardContent>
                <strong>{sincronizadas}</strong>
                <span>Sincronizadas</span>
              </IonCardContent>
            </IonCard>

            <IonCard className="resumen-card borrador">
              <IonCardContent>
                <strong>{borradores}</strong>
                <span>Borradores</span>
              </IonCardContent>
            </IonCard>
          </div>

          <IonButton
            expand="block"
            className="boton-sincronizar"
            disabled={sincronizando}
            onClick={sincronizar}
          >
            {sincronizando ? (
              <>
                <IonSpinner name="crescent" />
                &nbsp; Sincronizando...
              </>
            ) : (
              <>
                <IonIcon
                  slot="start"
                  icon={refreshOutline}
                />
                Sincronizar ahora
              </>
            )}
          </IonButton>

          <h2 className="titulo-inspecciones">Inspecciones</h2>

          {inspecciones.length === 0 ? (
            <IonCard className="sin-registros">
              <IonCardContent>
                <IonIcon
                  icon={cloudOfflineOutline}
                  className="sin-registros-icon"
                />

                <p>No hay inspecciones guardadas.</p>
              </IonCardContent>
            </IonCard>
          ) : (
            <IonList className="lista-inspecciones">
              {inspecciones.map((inspeccion) => (
                <IonItem key={inspeccion.id}>
                  <IonLabel>
                    <h2>{inspeccion.codigoReporte}</h2>

                    <p>{inspeccion.empresa}</p>

                    <p>{inspeccion.sedeArea}</p>
                  </IonLabel>

                  <IonBadge
                    slot="end"
                    color={obtenerColorEstado(inspeccion.estado)}
                  >
                    {obtenerTextoEstado(inspeccion.estado)}
                  </IonBadge>
                </IonItem>
              ))}
            </IonList>
          )}
        </div>

        <IonToast
          isOpen={mensaje !== ''}
          message={mensaje}
          duration={2500}
          position="bottom"
          onDidDismiss={() => setMensaje('')}
        />
      </IonContent>
    </IonPage>
  );
};

export default Sincronizacion;