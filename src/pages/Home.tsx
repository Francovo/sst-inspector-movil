import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonItem, IonLabel, IonCheckbox } from '@ionic/react';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Inspección SST</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Inspección SST</IonTitle>
          </IonToolbar>
        </IonHeader>
        
        {/* Contenido principal de la inspección */}
        <div style={{ padding: '20px' }}>
          <IonCard>
            <IonCardHeader>
              <IonCardTitle>Módulo de Verificación de Seguridad</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <p>Seleccione los elementos de control revisados en campo:</p>
              
              <IonItem lines="none">
                <IonCheckbox slot="start" />
                <IonLabel>Uso adecuado de EPP (Casco, Gafas, Botas)</IonLabel>
              </IonItem>

              <IonItem lines="none">
                <IonCheckbox slot="start" />
                <IonLabel>Señalización de áreas de riesgo visible</IonLabel>
              </IonItem>

              <IonItem lines="none">
                <IonCheckbox slot="start" />
                <IonLabel>Extintores y rutas de evacuación despejadas</IonLabel>
              </IonItem>

              <IonButton expand="block" style={{ marginTop: '20px' }}>
                Registrar Inspección
              </IonButton>
            </IonCardContent>
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default Home;