import { IonContent, IonIcon, IonItem, IonLabel, IonList, IonMenu, IonMenuToggle } from '@ionic/react';
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
import type { JSX } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { logoutUser } from '../services/auth.service';

import './SideMenu.css';

type SideMenuProps = {
  /** Unique id for this menu instance; shared with the header and tab bar. */
  menuId: string;
  /** Id of the IonContent controlled by this menu. */
  contentId: string;
  /** Optional handler so the dashboard can show its own logout toast. */
  onLogout?: () => void;
};

type MenuItem = {
  id: string;
  label: string;
  icon: string;
  to: string;
  activePaths: readonly string[];
};

const MENU_ITEMS: readonly MenuItem[] = [
  {
    id: 'inicio',
    label: 'Inicio',
    icon: homeOutline,
    to: '/dashboard',
    activePaths: ['/dashboard'],
  },
  {
    id: 'inspecciones',
    label: 'Inspecciones',
    icon: clipboardOutline,
    to: '/listas',
    activePaths: ['/listas', '/inspeccion'],
  },
  {
    id: 'evidencias',
    label: 'Captura de evidencias',
    icon: cameraOutline,
    to: '/evidencias',
    activePaths: ['/evidencias'],
  },
  {
    id: 'sincronizacion',
    label: 'Sincronización',
    icon: cloudUploadOutline,
    to: '/sincronizacion',
    activePaths: ['/sincronizacion'],
  },
  {
    id: 'reportes',
    label: 'Reportes',
    icon: barChartOutline,
    to: '/resumen',
    activePaths: ['/resumen'],
  },
];

/**
 * Shared side menu based on the one shipped by main.
 * Every screen renders its own instance with a unique content id so the
 * drawer works after Ionic route transitions without duplicate ids.
 */
const SideMenu = ({ menuId, contentId, onLogout }: SideMenuProps): JSX.Element => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
      return;
    }

    logoutUser();
    navigate('/login', { replace: true });
  };

  return (
    <IonMenu aria-label="Menú lateral" menuId={menuId} contentId={contentId} type="overlay" side="start">
      <IonContent className="side-menu-content">
        <div className="side-menu-header">
          <div className="side-menu-logo">
            <IonIcon icon={shieldCheckmark} />
          </div>

          <div className="side-menu-brand">
            <strong>SST-Inspector Móvil</strong>
            <span>Inspecciones más seguras</span>
          </div>

          <IonMenuToggle menu={menuId}>
            <button type="button" className="side-menu-close" aria-label="Cerrar menú">
              <IonIcon icon={closeOutline} />
            </button>
          </IonMenuToggle>
        </div>

        <IonList className="side-menu-list">
          {MENU_ITEMS.map((item) => {
            const active = item.activePaths.includes(pathname);

            return (
              <IonMenuToggle key={item.id} menu={menuId} autoHide>
                <IonItem
                  routerLink={item.to}
                  routerDirection="forward"
                  lines="none"
                  className={`side-menu-item${active ? ' side-menu-item--active' : ''}`}
                >
                  <IonIcon slot="start" icon={item.icon} />
                  <IonLabel>{item.label}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>

        <div className="side-menu-footer">
          <IonMenuToggle menu={menuId} autoHide>
            <IonItem button lines="none" className="side-menu-item side-menu-logout" onClick={handleLogout}>
              <IonIcon slot="start" icon={logOutOutline} />
              <IonLabel>Cerrar sesión</IonLabel>
            </IonItem>
          </IonMenuToggle>
        </div>
      </IonContent>
    </IonMenu>
  );
};

export default SideMenu;
