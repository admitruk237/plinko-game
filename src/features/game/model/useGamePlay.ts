import { useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type { BallAnimation, Risk } from '@/entities/game/model/types';
import type { User } from '@/entities/session/model/types';
import { useGameStore } from '@/entities/game/model/store';
import { usePlaceBet } from '../api/usePlaceBet';
import { RISK_LEVELS } from '@/shared/config';

interface Props {
  isPlaying: boolean;
  setPlaying: (playing: boolean) => void;
}

interface UseGamePlayResult {
  currentAnimation: BallAnimation | null;
  selectedRows: number;
  selectedRisk: Risk;
  setSelectedRows: (rows: number) => void;
  setSelectedRisk: (risk: Risk) => void;
  handlePlaceBet: (amount: string, rows: number, risk: Risk) => Promise<void>;
  handleAnimationEnd: () => void;
}

export const useGamePlay = ({ isPlaying, setPlaying }: Props): UseGamePlayResult => {
  const queryClient = useQueryClient();
  const addResult = useGameStore((s) => s.addResult);

  const [currentAnimation, setCurrentAnimation] = useState<BallAnimation | null>(null);
  const [selectedRows, setSelectedRows] = useState<number>(12);
  const [selectedRisk, setSelectedRisk] = useState<Risk>(RISK_LEVELS.HIGH);
  const animResolveRef = useRef<(() => void) | null>(null);

  const placeBetMutation = usePlaceBet();

  const handlePlaceBet = useCallback(
    async (amount: string, rows: number, risk: Risk) => {
      if (isPlaying) return;

      setPlaying(true);
      setSelectedRows(rows);
      setSelectedRisk(risk);

      try {
        const bet = await placeBetMutation.mutateAsync({ amount, rows, risk });

        await new Promise<void>((resolve) => {
          animResolveRef.current = resolve;
          setCurrentAnimation({
            path: bet.path,
            bucketIndex: bet.bucketIndex,
            startTime: Date.now(),
          });
        });

        addResult({
          betId: bet.betId,
          multiplier: Number(bet.multiplier),
          payout: bet.payout,
          path: bet.path,
          bucketIndex: bet.bucketIndex,
          rows: bet.rows,
          risk: bet.risk,
        });

        queryClient.setQueryData<User>(['me'], (old) =>
          old ? { ...old, balance: bet.balanceAfter } : old
        );
      } catch (err) {
        console.error('Bet error:', err);
      } finally {
        setPlaying(false);
        setCurrentAnimation(null);
      }
    },
    [isPlaying, setPlaying, addResult, queryClient, placeBetMutation]
  );

  const handleAnimationEnd = useCallback(() => {
    animResolveRef.current?.();
    animResolveRef.current = null;
  }, []);

  return {
    currentAnimation,
    selectedRows,
    selectedRisk,
    setSelectedRows,
    setSelectedRisk,
    handlePlaceBet,
    handleAnimationEnd,
  };
};
