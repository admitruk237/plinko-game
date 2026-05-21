import { create } from 'zustand';
import type { BetResult } from './types';

interface GameState {
  recentResults: BetResult[];
  isPlaying: boolean;
  addResult: (result: BetResult) => void;
  setPlaying: (playing: boolean) => void;
  clearResults: () => void;
}

const MAX_RECENT_RESULTS = 4;

export const useGameStore = create<GameState>()((set) => ({
  recentResults: [],
  isPlaying: false,
  addResult: (result) =>
    set((state) => ({
      recentResults: [result, ...state.recentResults].slice(0, MAX_RECENT_RESULTS),
    })),
  setPlaying: (playing) => set({ isPlaying: playing }),
  clearResults: () => set({ recentResults: [] }),
}));
