import type { PluginListenerHandle } from '@capacitor/core';
import { Network } from '@capacitor/network';
import type { JSX, ReactNode } from 'react';
import { useEffect, useState } from 'react';

import { NetworkStatusContext } from './networkContext';
import type { NetworkStatusValue } from './networkContext';

type NetworkStatusProviderProps = {
  children: ReactNode;
};

const INITIAL_STATUS: NetworkStatusValue = {
  online: typeof navigator === 'undefined' ? true : navigator.onLine,
  connectionType: 'unknown',
};

/**
 * Keeps the real connectivity state available to every screen.
 * The Network plugin reports Wi-Fi/cellular changes on device and browser
 * online/offline events on the web.
 */
export const NetworkStatusProvider = ({ children }: NetworkStatusProviderProps): JSX.Element => {
  const [status, setStatus] = useState<NetworkStatusValue>(INITIAL_STATUS);

  useEffect(() => {
    let active = true;
    let listener: PluginListenerHandle | undefined;

    const apply = (connected: boolean, connectionType: string) => {
      if (active) setStatus({ online: connected, connectionType });
    };

    Network.getStatus()
      .then((current) => apply(current.connected, current.connectionType))
      .catch(() => undefined);

    Network.addListener('networkStatusChange', (current) => {
      apply(current.connected, current.connectionType);
    })
      .then((handle) => {
        if (active) listener = handle;
        else void handle.remove();
      })
      .catch(() => undefined);

    return () => {
      active = false;
      void listener?.remove();
    };
  }, []);

  return <NetworkStatusContext.Provider value={status}>{children}</NetworkStatusContext.Provider>;
};
