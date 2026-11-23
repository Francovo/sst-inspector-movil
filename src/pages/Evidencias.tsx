import { useState } from 'react';

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonImg,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToast,
  IonToolbar, 
  IonIcon
} from '@ionic/react';

import {
  cameraOutline,
  imagesOutline,
  saveOutline
} from 'ionicons/icons';

import {
  Camera,
  CameraResultType,
  CameraSource
} from '@capacitor/camera';

import { EvidenciaFotografica } from '../models/sst.models';

import './Evidencias.css';

const Evidencias: React.FC = () => {

  const [imagen, setImagen] = useState<string>('');
  const [descripcion, setDescripcion] = useState<string>('');
  const [mensaje, setMensaje] = useState<string>('');

  const tomarFoto = async () => {
    try {
      const foto = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera
      });

      if (foto.webPath) {
        setImagen(foto.webPath);
      }

    } catch (error) {
      console.error('Error al tomar fotografía:', error);
      setMensaje('No se pudo tomar la fotografía');
    }
  };

  const seleccionarGaleria = async () => {
    try {
      const foto = await Camera.getPhoto({
        quality: 70,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos
      });

      if (foto.webPath) {
        setImagen(foto.webPath);
      }

    } catch (error) {
      console.error('Error al seleccionar imagen:', error);
      setMensaje('No se pudo seleccionar la imagen');
    }
  };

  const guardarEvidencia = () => {

    if (!imagen) {
      setMensaje('Debes tomar o seleccionar una fotografía');
      return;
    }

    if (!descripcion.trim()) {
      setMensaje('Debes ingresar una descripción del hallazgo');
      return;
    }

    const evidencia: EvidenciaFotografica = {
      id: Date.now().toString(),
      itemId: 'item-temporal',
      imagenBase64OPath: imagen,
      descripcionHallazgo: descripcion.trim(),
      fechaCaptura: new Date().toISOString()
    };

    console.log('Evidencia creada:', evidencia);

    setMensaje('Evidencia guardada correctamente');

    setImagen('');
    setDescripcion('');
  };

  return (
    <IonPage>

      <IonHeader>
        <IonToolbar className="evidencias-toolbar">
          <IonTitle>Captura de evidencias</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="evidencias-content">

        <div className="evidencias-container">

          <h2>Evidencia fotográfica</h2>

          <p className="evidencias-subtitulo">
            Registra una fotografía del hallazgo encontrado
            durante la inspección.
          </p>

          <IonCard className="evidencias-card">

            <IonCardContent>

              {imagen ? (

                <IonImg
                  src={imagen}
                  className="evidencias-imagen"
                  alt="Vista previa de la evidencia"
                />

              ) : (

                <div className="evidencias-placeholder">

                  <IonIcon
                    icon={cameraOutline}
                    className="evidencias-placeholder-icon"
                  />

                  <p>No hay fotografía seleccionada</p>

                </div>

              )}

            </IonCardContent>

          </IonCard>

          <IonButton
            expand="block"
            className="boton-camara"
            onClick={tomarFoto}
          >

            <IonIcon
              slot="start"
              icon={cameraOutline}
            />

            Tomar fotografía

          </IonButton>

          <IonButton
            expand="block"
            fill="outline"
            className="boton-galeria"
            onClick={seleccionarGaleria}
          >

            <IonIcon
              slot="start"
              icon={imagesOutline}
            />

            Seleccionar de galería

          </IonButton>

          <div className="descripcion-container">

            <h3>Descripción del hallazgo</h3>

            <IonTextarea
              className="descripcion-textarea"
              placeholder="Describe el hallazgo encontrado..."
              value={descripcion}
              maxlength={500}
              autoGrow={true}
              onIonInput={(event) =>
                setDescripcion(event.detail.value ?? '')
              }
            />

          </div>

          <IonButton
            expand="block"
            className="boton-guardar"
            onClick={guardarEvidencia}
          >

            <IonIcon
              slot="start"
              icon={saveOutline}
            />

            Guardar evidencia

          </IonButton>

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

export default Evidencias;