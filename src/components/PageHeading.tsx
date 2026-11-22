import { IonIcon } from '@ionic/react';
import type { JSX } from 'react';

import './PageHeading.css';

type PageHeadingProps = {
  title: string;
  subtitle?: string;
  icon?: string;
  /** `plain` renders the icon inline; `badge` puts it in a green tile. */
  variant?: 'plain' | 'badge';
};

const PageHeading = ({ title, subtitle, icon, variant = 'plain' }: PageHeadingProps): JSX.Element => (
  <header className={`sst-heading sst-heading--${variant}`}>
    {icon && variant === 'badge' && (
      <span aria-hidden="true" className="sst-heading__badge">
        <IonIcon icon={icon} />
      </span>
    )}

    <div className="sst-heading__copy">
      <h2 className="sst-heading__title">
        {icon && variant === 'plain' && <IonIcon aria-hidden="true" icon={icon} />}
        {title}
      </h2>
      {subtitle && <p className="sst-heading__subtitle">{subtitle}</p>}
    </div>
  </header>
);

export default PageHeading;
