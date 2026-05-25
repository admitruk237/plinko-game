'use client';

import { useCallback, useEffect } from 'react';

import { useSettingsStore } from '@/entities/settings';
import { SoundEngine } from '@/shared/lib/sound-engine';
import { Howler } from 'howler';

export const useSound = () => {
  const soundEffectsEnabled = useSettingsStore((s) => s.soundEffectsEnabled);

  useEffect(() => {
    Howler.mute(!soundEffectsEnabled);
  }, [soundEffectsEnabled]);

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

  const playClick = useCallback(() => {
    if (soundEffectsEnabled) SoundEngine.playClick();
  }, [soundEffectsEnabled]);

  return { playDrop, playPegHit, playResult, playRowsChange, playClick };
};
