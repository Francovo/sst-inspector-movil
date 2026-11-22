import { IonIcon } from '@ionic/react';
import type { JSX, ReactNode } from 'react';

type NoteBannerProps = {
  children: ReactNode;
  icon: string;
  tone?: 'info' | 'success';
  title?: string;
  className?: string;
};

/**
 * Contextual note used for connectivity, offline mode and data protection.
 * Styles live in `theme/ui.css` next to the other shared primitives.
 */
const NoteBanner = ({ children, icon, tone = 'info', title, className }: NoteBannerProps): JSX.Element => (
  <section className={`sst-note sst-note--${tone}${className ? ` ${className}` : ''}`}>
    <IonIcon aria-hidden="true" icon={icon} />
    <div>
      {title && <h3>{title}</h3>}
      <p>{children}</p>
    </div>
  </section>
);

export default NoteBanner;
