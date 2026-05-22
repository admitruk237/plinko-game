import { useCallback, useState } from 'react';
import type { GameConfig, Risk } from '@/entities/game';
import { useAutoBet, useBetForm } from '@/features/place-bet';
import { BET_MODES, type BetMode } from '@/shared/config';

interface Props {
  config: GameConfig;
  balance: string;
  isPlaying: boolean;
  rows: number;
  risk: Risk;
  onRowsChange: (rows: number) => void;
  onPlaceBet: (amount: string, rows: number, risk: Risk) => void;
}

export const useGameSidebar = ({
  config: _config,
  balance,
  isPlaying,
  rows,
  risk,
  onRowsChange,
  onPlaceBet,
}: Props) => {
  const [mode, setMode] = useState<BetMode>(BET_MODES.MANUAL);

  const handleRowsChange = useCallback(
    (val: number | readonly number[]) => {
      const v = Array.isArray(val) ? val[0] : val;
      if (typeof v === 'number') {
        onRowsChange(v);
      }
    },
    [onRowsChange]
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
