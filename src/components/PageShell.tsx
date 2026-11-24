import { IonContent, IonPage } from '@ionic/react';
import type { JSX, ReactNode } from 'react';
import { useId } from 'react';

import AppHeader from './AppHeader';
import type { AppHeaderProps } from './AppHeader';
import BottomTabBar from './BottomTabBar';
import SideMenu from './SideMenu';

type PageShellProps = {
  children: ReactNode;
  /** Header configuration: connection pill, menu, back button or overflow. */
  header?: AppHeaderProps;
  /** Modal or toast rendered beside the scrollable content. */
  overlay?: ReactNode;
};

/**
 * Standard screen frame for the screens added on top of main's app.
 * It uses main's side menu and bottom bar so the whole app shares a single
 * navigation model.
 */
const PageShell = ({ children, header = {}, overlay }: PageShellProps): JSX.Element => {
  const suffix = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const contentId = `page-content-${suffix}`;
  const menuId = `page-menu-${suffix}`;

  return (
    <IonPage>
      <AppHeader {...header} menuId={menuId} />
      <IonContent className="sst-screen" id={contentId}>
        {children}
      </IonContent>
      {overlay}
      <SideMenu contentId={contentId} menuId={menuId} />
      <BottomTabBar menuId={menuId} />
    </IonPage>
  );
};

export default PageShell;
