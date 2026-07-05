import { useCallback } from 'react';
import { type Risk, useGameStore } from '@/entities/game';
import { useAutoBet, useBetForm, usePlaceBetStore } from '@/features/place-bet';
import { useSound } from '@/features/game';
import { type BetMode } from '@/shared/config';

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
  const { playRowsChange, playClick } = useSound();

  const handleRiskSelect = useCallback(
    (r: Risk) => {
      setRisk(r);
      playClick();
    },
    [setRisk, playClick]
  );

  const handleModeChange = useCallback(
    (m: BetMode) => {
      setMode(m);
      playClick();
    },
    [setMode, playClick]
  );

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
    playClick();
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, [playClick]);

  const {
    form,
    betInput,
    handleHalf: handleHalfBase,
    handleDouble: handleDoubleBase,
    handleMax: handleMaxBase,
    handleInputChange,
    handleInputFocus,
  } = useBetForm({ balance, disabled: false });

  const handleHalf = useCallback(() => {
    handleHalfBase();
    playClick();
  }, [handleHalfBase, playClick]);

  const handleDouble = useCallback(() => {
    handleDoubleBase();
    playClick();
  }, [handleDoubleBase, playClick]);

  const handleMax = useCallback(() => {
    handleMaxBase();
    playClick();
  }, [handleMaxBase, playClick]);

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
    handleModeChange,
    rows,
    risk,
    handleRiskSelect,
    isPlaying,
    handleRowsChange,
    handleFullscreenToggle,
    form,
    betInput,
    handleHalf,
    handleDouble,
    handleMax,
    handleInputChange,
    handleInputFocus,
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
