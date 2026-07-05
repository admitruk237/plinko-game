import { create } from 'zustand';

interface GameState {
  isPlaying: boolean;
  setPlaying: (playing: boolean) => void;
}

export const useGameStore = create<GameState>()((set) => ({
  isPlaying: false,
  setPlaying: (playing) => set({ isPlaying: playing }),
}));
