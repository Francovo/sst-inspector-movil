import { IonIcon } from '@ionic/react';
import { cloudOfflineOutline, ellipsisVertical, menuOutline } from 'ionicons/icons';
import type { JSX } from 'react';

import BrandMark from './BrandMark';
import './AppHeader.css';

type AppHeaderProps = {
  /** Connection state rendered by the status pill on the right. */
  online?: boolean;
  /** Renders the hamburger button. Visual only while the shell is not built. */
  withMenu?: boolean;
  /** Renders the overflow button. Visual only while the shell is not built. */
  withOverflow?: boolean;
};

const AppHeader = ({ online = true, withMenu = false, withOverflow = false }: AppHeaderProps): JSX.Element => (
  <header className="sst-header">
    <div className="sst-header__brand">
      {withMenu && (
        <button aria-label="Abrir menú" className="sst-header__icon-button" type="button">
          <IonIcon aria-hidden="true" icon={menuOutline} />
        </button>
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

export default AppHeader;
