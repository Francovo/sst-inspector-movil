import { IonIcon } from '@ionic/react';
import {
  addCircleOutline,
  barChartOutline,
  chevronForward,
  clipboardOutline,
  closeOutline,
  helpCircleOutline,
  homeOutline,
  locationOutline,
  logOutOutline,
  personOutline,
  settingsOutline,
  syncOutline,
} from 'ionicons/icons';
import type { JSX } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppMenu } from '../features/navigation/menuContext';

import BrandMark from './BrandMark';
import './AppMenu.css';

type MenuItem = {
  id: string;
  label: string;
  icon: string;
  to?: string;
  activePaths?: readonly string[];
};

const PRIMARY_ITEMS: readonly MenuItem[] = [
  { id: 'inicio', label: 'Inicio', icon: homeOutline, to: '/inicio', activePaths: ['/inicio'] },
  {
    id: 'nueva',
    label: 'Nueva inspección',
    icon: addCircleOutline,
    to: '/listas',
    activePaths: ['/listas'],
  },
  {
    id: 'guardadas',
    label: 'Inspecciones guardadas',
    icon: clipboardOutline,
    to: '/listas',
  },
  { id: 'sync', label: 'Sincronización', icon: syncOutline },
  {
    id: 'reportes',
    label: 'Reportes',
    icon: barChartOutline,
    to: '/resumen',
    activePaths: ['/resumen'],
  },
  { id: 'sitios', label: 'Sitios / Áreas', icon: locationOutline },
];

const SECONDARY_ITEMS: readonly MenuItem[] = [
  { id: 'perfil', label: 'Mi perfil', icon: personOutline },
  { id: 'configuracion', label: 'Configuración', icon: settingsOutline },
  { id: 'ayuda', label: 'Ayuda y soporte', icon: helpCircleOutline },
];

/**
 * Side drawer from the "Menú Lateral" mockup.
 * It is shared by the header and the "Más" tab; entries without a route are
 * visual only and just close the drawer.
 */
const AppMenu = (): JSX.Element | null => {
  const { isOpen, closeMenu } = useAppMenu();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeMenu();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.classList.add('sst-menu-open');

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.classList.remove('sst-menu-open');
    };
  }, [isOpen, closeMenu]);

  if (!isOpen) return null;

  const goTo = (item: MenuItem) => {
    closeMenu();
    if (item.to) navigate(item.to);
  };

  const renderItem = (item: MenuItem) => {
    const isActive = item.activePaths?.includes(pathname) ?? false;

    return (
      <button
        aria-current={isActive ? 'page' : undefined}
        className={`app-menu__item${isActive ? ' app-menu__item--active' : ''}`}
        key={item.id}
        onClick={() => goTo(item)}
        type="button"
      >
        <IonIcon aria-hidden="true" icon={item.icon} />
        <span>{item.label}</span>
      </button>
    );
  };

  return (
    <div className="app-menu">
      <button aria-label="Cerrar menú" className="app-menu__backdrop" onClick={closeMenu} type="button" />

      <aside aria-label="Menú lateral" aria-modal="true" className="app-menu__drawer" id="app-menu" role="dialog">
        <div className="app-menu__scroll">
          <header className="app-menu__head">
            <div className="app-menu__brand">
              <span aria-hidden="true" className="app-menu__logo">
                <BrandMark />
              </span>
              <div>
                <h1>SST-Inspector Móvil</h1>
                <p>
                  Trabajo seguro,
                  <br />
                  empresas más fuertes
                </p>
              </div>
            </div>

            <button aria-label="Cerrar menú" className="app-menu__close" onClick={closeMenu} type="button">
              <IonIcon aria-hidden="true" icon={closeOutline} />
            </button>
          </header>

          <button className="app-menu__profile" onClick={closeMenu} type="button">
            <span className="app-menu__profile-left">
              <span aria-hidden="true" className="app-menu__avatar">
                JM
              </span>
              <span>
                <strong>Sebastián Montealegre</strong>
                <small>Inspector SST</small>
              </span>
            </span>
            <IonIcon aria-hidden="true" icon={chevronForward} />
          </button>

          <nav aria-label="Menú principal" className="app-menu__nav">
            {PRIMARY_ITEMS.map(renderItem)}
            <hr className="app-menu__divider" />
            {SECONDARY_ITEMS.map(renderItem)}
            <hr className="app-menu__divider" />
            <button
              className="app-menu__item app-menu__item--danger"
              onClick={() => {
                closeMenu();
                navigate('/login');
              }}
              type="button"
            >
              <IonIcon aria-hidden="true" icon={logOutOutline} />
              <span>Cerrar sesión</span>
            </button>
          </nav>
        </div>

        <footer className="app-menu__footer">
          <span aria-hidden="true" className="app-menu__footer-mark">
            <BrandMark />
          </span>
          <div>
            <p>Prevención hoy, bienestar mañana</p>
            <small>SST-Inspector Móvil v1.0.0</small>
          </div>
        </footer>
      </aside>
    </div>
  );
};

export default AppMenu;
