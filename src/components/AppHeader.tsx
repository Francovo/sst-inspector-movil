import { IonIcon } from '@ionic/react';
import { chevronBackOutline, cloudOfflineOutline, ellipsisVertical, menuOutline } from 'ionicons/icons';
import type { JSX } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppMenu } from '../features/navigation/menuContext';
import { useNetworkStatus } from '../features/network/networkContext';

import BrandMark from './BrandMark';
import './AppHeader.css';

export type AppHeaderProps = {
  /** Renders the hamburger button. */
  withMenu?: boolean;
  /** Renders the overflow button. Visual only while the menu is not built. */
  withOverflow?: boolean;
  /** Renders a back button that navigates to this route instead of the menu. */
  backTo?: string;
};

const AppHeader = ({ withMenu = false, withOverflow = false, backTo }: AppHeaderProps): JSX.Element => {
  const navigate = useNavigate();
  const { isOpen, openMenu } = useAppMenu();
  const { online } = useNetworkStatus();

  return (
    <header className="sst-header">
      <div className="sst-header__brand">
        {backTo ? (
          <button
            aria-label="Volver"
            className="sst-header__icon-button"
            onClick={() => navigate(backTo)}
            type="button"
          >
            <IonIcon aria-hidden="true" icon={chevronBackOutline} />
          </button>
        ) : (
          withMenu && (
            <button
              aria-controls="app-menu"
              aria-expanded={isOpen}
              aria-label="Abrir menú"
              className="sst-header__icon-button"
              onClick={openMenu}
              type="button"
            >
              <IonIcon aria-hidden="true" icon={menuOutline} />
            </button>
          )
        )}

        <span className="sst-header__mark">
          <BrandMark />
        </span>

        <div>
          <h1 className="sst-header__title">SST-Inspector Móvil</h1>
          <p className="sst-header__subtitle">Inspecciones más seguras</p>
        </div>
      </div>

      <div className="sst-header__actions">
        <span className={`sst-conn sst-conn--${online ? 'online' : 'offline'}`}>
          {online ? (
            <span aria-hidden="true" className="sst-conn__dot" />
          ) : (
            <IonIcon aria-hidden="true" className="sst-conn__icon" icon={cloudOfflineOutline} />
          )}
          <span className="sst-conn__text">
            <strong>{online ? 'En línea' : 'Sin conexión'}</strong>
            <small>{online ? 'Conectado a Internet' : 'En este dispositivo'}</small>
          </span>
        </span>

        {withOverflow && (
          <button aria-label="Más opciones" className="sst-header__icon-button" type="button">
            <IonIcon aria-hidden="true" icon={ellipsisVertical} />
          </button>
        )}
      </div>
    </header>
  );
};

export default AppHeader;
