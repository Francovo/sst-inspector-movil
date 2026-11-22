import { IonContent, IonPage } from '@ionic/react';
import type { JSX, ReactNode } from 'react';

import AppHeader from './AppHeader';
import type { AppHeaderProps } from './AppHeader';
import AppTabBar from './AppTabBar';
import type { TabId } from './AppTabBar';

type PageShellProps = {
  children: ReactNode;
  /** Header configuration: connection pill, menu, back button or overflow. */
  header?: AppHeaderProps;
  /** Bottom tab to highlight; omit it for screens without the app shell. */
  tab?: TabId;
  /** Modal or toast rendered beside the scrollable content. */
  overlay?: ReactNode;
};

/**
 * Standard screen frame: page, header, scrollable content and tab bar.
 * Authentication screens keep their own layout because they have no shell.
 */
const PageShell = ({ children, header = {}, tab, overlay }: PageShellProps): JSX.Element => (
  <IonPage>
    <AppHeader {...header} />
    <IonContent className="sst-screen">{children}</IonContent>
    {overlay}
    {tab && <AppTabBar active={tab} />}
  </IonPage>
);

export default PageShell;
