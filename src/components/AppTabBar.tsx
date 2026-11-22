import { IonIcon } from '@ionic/react';
import { cameraOutline, clipboardOutline, homeOutline, settingsOutline } from 'ionicons/icons';
import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppMenu } from '../features/navigation/menuContext';
import './AppTabBar.css';

export type TabId = 'inicio' | 'inspecciones' | 'evidencias' | 'mas';

type AppTabBarProps = {
  active?: TabId;
};

const TABS = [
  { id: 'inicio', label: 'Inicio', icon: homeOutline },
  { id: 'inspecciones', label: 'Inspecciones', icon: clipboardOutline },
  { id: 'evidencias', label: 'Evidencias', icon: cameraOutline },
  { id: 'mas', label: 'Más', icon: settingsOutline },
] as const;

const TAB_ROUTES = {
  inicio: '/inicio',
  inspecciones: '/listas',
  evidencias: '/evidencias',
} as const;

const AppTabBar = ({ active = 'inspecciones' }: AppTabBarProps): JSX.Element => {
  const navigate = useNavigate();
  const { isOpen, openMenu } = useAppMenu();

  const handleClick = (id: TabId) => {
    if (id === 'mas') {
      openMenu();
      return;
    }

    navigate(TAB_ROUTES[id]);
  };

  return (
    <nav aria-label="Navegación principal" className="sst-tabbar">
      {TABS.map((tab) => (
        <button
          aria-current={tab.id === active ? 'page' : undefined}
          aria-expanded={tab.id === 'mas' ? isOpen : undefined}
          className={`sst-tabbar__item${tab.id === active ? ' sst-tabbar__item--active' : ''}`}
          key={tab.id}
          onClick={() => handleClick(tab.id)}
          type="button"
        >
          <IonIcon aria-hidden="true" className="sst-tabbar__icon" icon={tab.icon} />
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default AppTabBar;
