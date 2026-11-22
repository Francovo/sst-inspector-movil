import { createContext, useContext } from 'react';

export type AppMenuValue = {
  isOpen: boolean;
  openMenu: () => void;
  closeMenu: () => void;
};

export const AppMenuContext = createContext<AppMenuValue | null>(null);

export const useAppMenu = (): AppMenuValue => {
  const context = useContext(AppMenuContext);

  if (!context) {
    throw new Error('useAppMenu debe usarse dentro de <AppMenuProvider>');
  }

  return context;
};
