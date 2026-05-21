'use client';

import { type ReactNode, useRef } from 'react';
import { useSettingsStore } from '@/entities/settings';

interface Props {
  soundEffectsEnabled: boolean;
  animationsEnabled: boolean;
  children: ReactNode;
}

export const SettingsProvider = ({ soundEffectsEnabled, animationsEnabled, children }: Props) => {
  const initialized = useRef<true | null>(null);
  if (initialized.current == null) {
    useSettingsStore.setState({ soundEffectsEnabled, animationsEnabled });
    initialized.current = true;
  }

  return <>{children}</>;
};
