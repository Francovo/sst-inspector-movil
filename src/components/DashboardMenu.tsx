import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonMenuToggle,
} from '@ionic/react';

import {
  barChartOutline,
  cameraOutline,
  clipboardOutline,
  closeOutline,
  cloudUploadOutline,
  homeOutline,
  logOutOutline,
  shieldCheckmark,
} from 'ionicons/icons';

import './DashboardMenu.css';

interface DashboardMenuProps {
  onLogout: () => void;
}

const DashboardMenu: React.FC<DashboardMenuProps> = ({
  onLogout,
}) => {
  return (
    <IonMenu
      menuId="dashboard-menu"
      contentId="dashboard-content"
      type="overlay"
      side="start"
    >
      <IonContent className="dashboard-side-menu">
        <div className="side-menu-header">
          <div className="side-menu-logo">
            <IonIcon icon={shieldCheckmark} />
          </div>

          <div className="side-menu-brand">
            <strong>SST-Inspector Móvil</strong>
            <span>Inspecciones más seguras</span>
          </div>

          <IonMenuToggle>
            <button
              type="button"
              className="side-menu-close"
              aria-label="Cerrar menú"
            >
              <IonIcon icon={closeOutline} />
            </button>
          </IonMenuToggle>
        </div>

        <IonList className="side-menu-list">
          <IonMenuToggle autoHide>
            <IonItem
              routerLink="/dashboard"
              routerDirection="root"
              lines="none"
              className="side-menu-item"
            >
              <IonIcon slot="start" icon={homeOutline} />
              <IonLabel>Inicio</IonLabel>
            </IonItem>
          </IonMenuToggle>

          <IonMenuToggle autoHide>
            <IonItem
              lines="none"
              className="side-menu-item"
              button
            >
              <IonIcon
                slot="start"
                icon={clipboardOutline}
              />

              <IonLabel>Inspecciones</IonLabel>
            </IonItem>
          </IonMenuToggle>

          <IonMenuToggle autoHide>
            <IonItem
              routerLink="/evidencias"
              routerDirection="forward"
              lines="none"
              className="side-menu-item"
            >
              <IonIcon slot="start" icon={cameraOutline} />
              <IonLabel>Captura de evidencias</IonLabel>
            </IonItem>
          </IonMenuToggle>

          <IonMenuToggle autoHide>
            <IonItem
              routerLink="/sincronizacion"
              routerDirection="forward"
              lines="none"
              className="side-menu-item"
            >
              <IonIcon
                slot="start"
                icon={cloudUploadOutline}
              />

              <IonLabel>Sincronización</IonLabel>
            </IonItem>
          </IonMenuToggle>

          <IonMenuToggle autoHide>
            <IonItem
              lines="none"
              className="side-menu-item"
              button
            >
              <IonIcon
                slot="start"
                icon={barChartOutline}
              />

              <IonLabel>Reportes</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </IonList>

        <div className="side-menu-footer">
          <IonMenuToggle autoHide>
            <IonItem
              button
              lines="none"
              className="side-menu-item side-menu-logout"
              onClick={onLogout}
            >
              <IonIcon slot="start" icon={logOutOutline} />
              <IonLabel>Cerrar sesión</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </div>
      </IonContent>
    </IonMenu>
  );
};

export default DashboardMenu;
