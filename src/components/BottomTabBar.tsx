import { IonIcon, IonMenuToggle } from '@ionic/react';
import { barChartOutline, cameraOutline, clipboardOutline, home, settingsOutline } from 'ionicons/icons';
import type { JSX } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import './BottomTabBar.css';

type BottomTabBarProps = {
  /** Id of the side menu opened from the "Más" tab. */
  menuId: string;
};

type TabItem = {
  id: string;
  label: string;
  icon: string;
  to: string;
  activePaths: readonly string[];
};

const TABS: readonly TabItem[] = [
  { id: 'inicio', label: 'Inicio', icon: home, to: '/dashboard', activePaths: ['/dashboard'] },
  {
    id: 'inspecciones',
    label: 'Inspecciones',
    icon: clipboardOutline,
    to: '/listas',
    activePaths: ['/listas', '/inspeccion'],
  },
  {
    id: 'evidencias',
    label: 'Evidencias',
    icon: cameraOutline,
    to: '/evidencias',
    activePaths: ['/evidencias'],
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
 * Shared bottom navigation based on the dashboard bar shipped by main.
 * It is used by the dashboard and by the new screens so there is only one
 * implementation of the app's primary navigation.
 */
const BottomTabBar = ({ menuId }: BottomTabBarProps): JSX.Element => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav aria-label="Navegación principal" className="dashboard-tabbar">
      {TABS.map((tab) => {
        const active = tab.activePaths.includes(pathname);

        return (
          <button
            aria-current={active ? 'page' : undefined}
            className={`tab-item${active ? ' tab-active' : ''}`}
            key={tab.id}
            onClick={() => navigate(tab.to)}
            type="button"
          >
            <IonIcon aria-hidden="true" icon={tab.icon} />
            <span>{tab.label}</span>
          </button>
        );
      })}

      <IonMenuToggle menu={menuId} autoHide={false}>
        <button type="button" className="tab-item">
          <IonIcon aria-hidden="true" icon={settingsOutline} />
          <span>Más</span>
        </button>
      </IonMenuToggle>
    </nav>
  );
};

export default BottomTabBar;
