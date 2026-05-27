import { useCallback, useEffect } from 'react';
import type { Risk } from '@/entities/game';
import { MAX_BET, MIN_BET, parseCredits } from '@/shared/lib/credits';
import { BET_MODES, type BetMode, MAX_NUM_BETS } from '@/shared/config';
import { usePlaceBetStore } from './store';

interface Props {
  balance: string;
  isPlaying: boolean;
  betInput: string;
  rows: number;
  risk: Risk;
  onPlaceBet: (amount: string, rows: number, risk: Risk) => Promise<void> | void;
  mode: BetMode;
}

interface UseAutoBetResult {
  numBetsInput: string;
  stopProfitInput: string;
  stopLossInput: string;
  isAutoBetting: boolean;
  currentBetCount: number;
  handleBet: () => void;
  handleNumBetsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStopProfitChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleStopLossChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const useAutoBet = ({
  balance,
  isPlaying,
  betInput,
  rows,
  risk,
  onPlaceBet,
  mode,
}: Props): UseAutoBetResult => {
  const {
    numBetsInput,
    setNumBetsInput,
    stopProfitInput,
    setStopProfitInput,
    stopLossInput,
    setStopLossInput,
    isAutoBetting,
    setIsAutoBetting,
    currentBetCount,
    setCurrentBetCount,
    startBalance,
    setStartBalance,
    isWaitingForBet,
    setIsWaitingForBet,
  } = usePlaceBetStore();

  const balanceBigInt = BigInt(balance || '0');

  if (mode === BET_MODES.MANUAL && isAutoBetting) {
    setIsAutoBetting(false);
  }

  useEffect(() => {
    if (!isAutoBetting || isWaitingForBet) return;

    const betsLeft = parseInt(numBetsInput, 10);
    if (!isNaN(betsLeft) && betsLeft > 0 && currentBetCount >= betsLeft) {
      setIsAutoBetting(false);
      return;
    }

    if (isPlaying) return;

    if (startBalance !== null) {
      try {
        const stopProfit = parseCredits(stopProfitInput);
        const stopLoss = parseCredits(stopLossInput);

        const diff = balanceBigInt - startBalance;

        if (stopProfit > 0n && diff >= stopProfit) {
          setIsAutoBetting(false);
          return;
        }

        if (stopLoss > 0n && diff <= -stopLoss) {
          setIsAutoBetting(false);
          return;
        }
      } catch {}
    }

    try {
      const amount = parseCredits(betInput);
      if (amount < MIN_BET || amount > MAX_BET || amount > balanceBigInt) {
        setIsAutoBetting(false);
        return;
      }

      setIsWaitingForBet(true);
      const res = onPlaceBet(amount.toString(), rows, risk);

      if (res instanceof Promise) {
        res
          .then(() => {
            setIsWaitingForBet(false);
            setCurrentBetCount((c) => c + 1);
          })
          .catch(() => {
            setIsAutoBetting(false);
            setIsWaitingForBet(false);
          });
      } else {
        setIsWaitingForBet(false);
        setCurrentBetCount((c) => c + 1);
      }
    } catch {
      setIsAutoBetting(false);
      setIsWaitingForBet(false);
    }
  }, [
    isAutoBetting,
    isWaitingForBet,
    isPlaying,
    currentBetCount,
    numBetsInput,
    startBalance,
    balanceBigInt,
    stopProfitInput,
    stopLossInput,
    betInput,
    rows,
    risk,
    onPlaceBet,
  ]);

  const handleNumBetsChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/[^0-9]/g, '');
    const num = parseInt(digits, 10);
    if (digits === '') {
      setNumBetsInput('');
    } else if (!isNaN(num)) {
      setNumBetsInput(String(Math.min(num, MAX_NUM_BETS)));
    }
  }, []);

  const handleStopProfitChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let clean = e.target.value.replace(/[^0-9.]/g, '');
    const dots = clean.split('.');
    if (dots.length > 2) {
      clean = `${dots[0]}.${dots.slice(1).join('')}`;
    }
    setStopProfitInput(clean);
  }, []);

  const handleStopLossChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    let clean = e.target.value.replace(/[^0-9.]/g, '');
    const dots = clean.split('.');
    if (dots.length > 2) {
      clean = `${dots[0]}.${dots.slice(1).join('')}`;
    }
    setStopLossInput(clean);
  }, []);

  const handleBet = useCallback(() => {
    let amount = 0n;
    try {
      amount = parseCredits(betInput);
      if (amount < MIN_BET || amount > MAX_BET) return;
    } catch {
      return;
    }

    if (mode === BET_MODES.AUTO) {
      if (isAutoBetting) {
        setIsAutoBetting(false);
      } else {
        setIsAutoBetting(true);
        setCurrentBetCount(0);
        setStartBalance(balanceBigInt);
      }
    } else {
      onPlaceBet(amount.toString(), rows, risk);
    }
  }, [mode, isAutoBetting, betInput, balanceBigInt, rows, risk, onPlaceBet]);

  return {
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
