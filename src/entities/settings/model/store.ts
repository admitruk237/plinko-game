import { create } from 'zustand';
import { useShallow } from 'zustand/react/shallow';

const STORAGE_DAYS = 365;

const setCookie = (name: string, value: string, days = STORAGE_DAYS) => {
  if (typeof document === 'undefined') return;
  const date = new Date();
  date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
  const expires = `; expires=${date.toUTCString()}`;
  document.cookie = `${name}=${value || ''}${expires}; path=/`;
};

const STORAGE_KEYS = {
  SOUND: 'soundEffectsEnabled',
  ANIMATIONS: 'animationsEnabled',
} as const;

interface SettingsState {
  soundEffectsEnabled: boolean;
  animationsEnabled: boolean;
  setSoundEffectsEnabled: (val: boolean) => void;
  setAnimationsEnabled: (val: boolean) => void;
}

export const useSettingsStore = create<SettingsState>()((set) => ({
  soundEffectsEnabled: true,
  animationsEnabled: true,
  setSoundEffectsEnabled: (val) => {
    set({ soundEffectsEnabled: val });
    setCookie(STORAGE_KEYS.SOUND, String(val));
  },
  setAnimationsEnabled: (val) => {
    set({ animationsEnabled: val });
    setCookie(STORAGE_KEYS.ANIMATIONS, String(val));
  },
}));

export const useSettings = () =>
  useSettingsStore(
    useShallow((s) => ({
      soundEffectsEnabled: s.soundEffectsEnabled,
      animationsEnabled: s.animationsEnabled,
      setSoundEffectsEnabled: s.setSoundEffectsEnabled,
      setAnimationsEnabled: s.setAnimationsEnabled,
    }))
  );
