import { createContext, useContext } from 'react';

export type NetworkStatusValue = {
  online: boolean;
  connectionType: string;
};

export const NetworkStatusContext = createContext<NetworkStatusValue | null>(null);

export const useNetworkStatus = (): NetworkStatusValue => {
  const context = useContext(NetworkStatusContext);

  if (!context) {
    throw new Error('useNetworkStatus debe usarse dentro de <NetworkStatusProvider>');
  }

  return context;
};
