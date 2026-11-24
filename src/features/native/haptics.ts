import { Capacitor } from '@capacitor/core';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

/** Subtle native confirmation for saved signatures and photos. */
export const lightImpact = (): void => {
  if (!Capacitor.isNativePlatform()) return;

  void Haptics.impact({ style: ImpactStyle.Light }).catch(() => undefined);
};
