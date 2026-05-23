'use client';

import { useCallback } from 'react';
import { Howler } from 'howler';
import { useSettingsStore } from '@/entities/settings';
import { SoundEngine } from '@/shared/lib/sound-engine';

export const useSound = () => {
  const soundEffectsEnabled = useSettingsStore((s) => s.soundEffectsEnabled);

  if (typeof window !== 'undefined') {
    Howler.mute(!soundEffectsEnabled);
  }

  const playDrop = useCallback(() => {
    if (soundEffectsEnabled) SoundEngine.playDrop();
  }, [soundEffectsEnabled]);

  const playPegHit = useCallback(() => {
    if (soundEffectsEnabled) SoundEngine.playPegHit();
  }, [soundEffectsEnabled]);

  const playResult = useCallback(
    (multiplier: number) => {
      if (!soundEffectsEnabled) return;
      if (multiplier >= 5) {
        SoundEngine.playBigWin();
      } else if (multiplier >= 1) {
        SoundEngine.playWin();
      } else {
        SoundEngine.playLoss();
      }
    },
    [soundEffectsEnabled]
  );

  const playRowsChange = useCallback(() => {
    if (soundEffectsEnabled) SoundEngine.playRowsChange();
  }, [soundEffectsEnabled]);

  return { playDrop, playPegHit, playResult, playRowsChange };
};
