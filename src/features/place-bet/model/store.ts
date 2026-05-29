import { create } from 'zustand';
import {
  BET_MODES,
  type BetMode,
  DEFAULT_BET_AMOUNT,
  DEFAULT_NUM_BETS,
  DEFAULT_ROWS,
  DEFAULT_STOP_LOSS,
  DEFAULT_STOP_PROFIT,
  RISK_LEVELS,
} from '@/shared/config';
import type { Risk } from '@/entities/game';

interface PlaceBetState {
  betAmount: string;
  mode: BetMode;
  numBetsInput: string;
  stopProfitInput: string;
  stopLossInput: string;
  isAutoBetting: boolean;
  currentBetCount: number;
  startBalance: bigint | null;
  isWaitingForBet: boolean;
  rows: number;
  risk: Risk;

  setBetAmount: (amount: string) => void;
  setMode: (mode: BetMode) => void;
  setNumBetsInput: (val: string) => void;
  setStopProfitInput: (val: string) => void;
  setStopLossInput: (val: string) => void;
  setIsAutoBetting: (val: boolean) => void;
  setCurrentBetCount: (val: number | ((prev: number) => number)) => void;
  setStartBalance: (val: bigint | null) => void;
  setIsWaitingForBet: (val: boolean) => void;
  setRows: (rows: number) => void;
  setRisk: (risk: Risk) => void;
}

export const usePlaceBetStore = create<PlaceBetState>()((set) => ({
  betAmount: DEFAULT_BET_AMOUNT,
  mode: BET_MODES.MANUAL,
  numBetsInput: DEFAULT_NUM_BETS,
  stopProfitInput: DEFAULT_STOP_PROFIT,
  stopLossInput: DEFAULT_STOP_LOSS,
  isAutoBetting: false,
  currentBetCount: 0,
  startBalance: null,
  isWaitingForBet: false,
  rows: DEFAULT_ROWS,
  risk: RISK_LEVELS.HIGH,

  setBetAmount: (betAmount) => set({ betAmount }),
  setMode: (mode) => set({ mode }),
  setNumBetsInput: (numBetsInput) => set({ numBetsInput }),
  setStopProfitInput: (stopProfitInput) => set({ stopProfitInput }),
  setStopLossInput: (stopLossInput) => set({ stopLossInput }),
  setIsAutoBetting: (isAutoBetting) => set({ isAutoBetting }),
  setCurrentBetCount: (val) =>
    set((state) => ({
      currentBetCount: typeof val === 'function' ? val(state.currentBetCount) : val,
    })),
  setStartBalance: (startBalance) => set({ startBalance }),
  setIsWaitingForBet: (isWaitingForBet) => set({ isWaitingForBet }),
  setRows: (rows) => set({ rows }),
  setRisk: (risk) => set({ risk }),
}));
