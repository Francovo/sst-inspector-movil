import type { JSX, ReactNode } from 'react';
import { useCallback, useMemo, useState } from 'react';

import AppMenu from '../../components/AppMenu';

import { AppMenuContext } from './menuContext';
import type { AppMenuValue } from './menuContext';

type AppMenuProviderProps = {
  children: ReactNode;
};

/**
 * Owns the side menu state so the header and the bottom tab bar can open the
 * same drawer from any screen.
 */
export const AppMenuProvider = ({ children }: AppMenuProviderProps): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  const openMenu = useCallback(() => setIsOpen(true), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  const value = useMemo<AppMenuValue>(() => ({ isOpen, openMenu, closeMenu }), [isOpen, openMenu, closeMenu]);

  return (
    <AppMenuContext.Provider value={value}>
      {children}
      <AppMenu />
    </AppMenuContext.Provider>
  );
};
