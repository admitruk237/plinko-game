import { useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { BallAnimation, Risk } from '@/entities/game/model/types';
import type { User } from '@/entities/session/model/types';
import { useGameStore } from '@/entities/game/model/store';
import { formatCredits } from '@/shared/lib/credits';
import { usePlaceBet } from '../api/usePlaceBet';

interface Props {
  setPlaying: (playing: boolean) => void;
}

interface UseGamePlayResult {
  currentAnimations: BallAnimation[];
  handlePlaceBet: (amount: string, rows: number, risk: Risk) => Promise<void>;
  handleAnimationEnd: (id: string) => void;
}

export const useGamePlay = ({ setPlaying }: Props): UseGamePlayResult => {
  const queryClient = useQueryClient();
  const addResult = useGameStore((s) => s.addResult);

  const [currentAnimations, setCurrentAnimations] = useState<BallAnimation[]>([]);
  const animResolveMap = useRef<Map<string, () => void>>(new Map());
  const activeCount = useRef(0);

  const placeBetMutation = usePlaceBet();

  const handlePlaceBet = useCallback(
    async (amount: string, rows: number, risk: Risk) => {
      try {
        const bet = await placeBetMutation.mutateAsync({ amount, rows, risk });

        activeCount.current += 1;
        setPlaying(true);

        await new Promise<void>((resolve) => {
          const id = bet.betId;
          animResolveMap.current.set(id, resolve);
          setCurrentAnimations((prev) => [
            ...prev,
            {
              id,
              path: bet.path,
              bucketIndex: bet.bucketIndex,
              startTime: Date.now(),
            },
          ]);
        });

        const multiplier = Number(bet.multiplier);
        const payout = formatCredits(bet.payout);

        addResult({
          betId: bet.betId,
          multiplier,
          payout: bet.payout,
          path: bet.path,
          bucketIndex: bet.bucketIndex,
          rows: bet.rows,
          risk: bet.risk,
        });

        if (multiplier >= 1) {
          toast.success(`${multiplier}x — ${payout}`, { duration: 3000 });
        } else {
          toast.error(`${multiplier}x — ${payout}`, { duration: 2500 });
        }

        queryClient.setQueryData<User>(['me'], (old) =>
          old ? { ...old, balance: bet.balanceAfter } : old
        );
      } catch (err) {
        console.error('Bet error:', err);
      } finally {
        activeCount.current -= 1;
        if (activeCount.current === 0) setPlaying(false);
      }
    },
    [setPlaying, addResult, queryClient, placeBetMutation]
  );

  const handleAnimationEnd = useCallback((id: string) => {
    animResolveMap.current.get(id)?.();
    animResolveMap.current.delete(id);
    setCurrentAnimations((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return {
    currentAnimations,
    handlePlaceBet,
    handleAnimationEnd,
  };
};
