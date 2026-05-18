import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SessionState {
  isAuth: boolean;
  user: {
    id: string;
    balance: number;
    username: string;
  } | null;
  setAuth: (isAuth: boolean) => void;
  updateBalance: (amount: number) => void;
  reset: () => void;
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      isAuth: false,
      user: null,
      setAuth: (isAuth) => set({ isAuth }),
      updateBalance: (amount) =>
        set((state) => ({
          user: state.user ? { ...state.user, balance: amount } : null,
        })),
      reset: () => set({ isAuth: false, user: null }),
    }),
    {
      name: 'session-storage',
    }
  )
);
