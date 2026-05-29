import { useCallback } from 'react';
import { type Risk, useGameStore } from '@/entities/game';
import { useAutoBet, useBetForm, usePlaceBetStore } from '@/features/place-bet';
import { useSound } from '@/features/game';

interface Props {
  balance: string;
  onPlaceBet: (amount: string, rows: number, risk: Risk) => Promise<void> | void;
}

export const useGameSidebar = ({ balance, onPlaceBet }: Props) => {
  const mode = usePlaceBetStore((state) => state.mode);
  const setMode = usePlaceBetStore((state) => state.setMode);
  const rows = usePlaceBetStore((state) => state.rows);
  const risk = usePlaceBetStore((state) => state.risk);
  const setRows = usePlaceBetStore((state) => state.setRows);
  const setRisk = usePlaceBetStore((state) => state.setRisk);
  const isPlaying = useGameStore((state) => state.isPlaying);
  const { playRowsChange } = useSound();

  const handleRowsChange = useCallback(
    (val: number | readonly number[]) => {
      const v = Array.isArray(val) ? val[0] : val;
      if (typeof v === 'number' && v !== rows) {
        setRows(v);
        playRowsChange();
      }
    },
    [rows, setRows, playRowsChange]
  );

  const handleFullscreenToggle = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  const { form, betInput, handleHalf, handleDouble, handleMax, handleInputChange } = useBetForm({
    balance,
    disabled: false,
  });

  const {
    numBetsInput,
    stopProfitInput,
    stopLossInput,
    isAutoBetting,
    currentBetCount,
    handleBet,
    handleNumBetsChange,
    handleStopProfitChange,
    handleStopLossChange,
  } = useAutoBet({
    balance,
    isPlaying,
    betInput,
    rows,
    risk,
    onPlaceBet,
    mode,
  });

  return {
    mode,
    setMode,
    rows,
    risk,
    setRisk,
    isPlaying,
    handleRowsChange,
    handleFullscreenToggle,
    form,
    betInput,
    handleHalf,
    handleDouble,
    handleMax,
    handleInputChange,
    numBetsInput,
    stopProfitInput,
    stopLossInput,
    isAutoBetting,
    currentBetCount,
    handleBet,
    handleNumBetsChange,
    handleStopProfitChange,
    handleStopLossChange,
  };
};
