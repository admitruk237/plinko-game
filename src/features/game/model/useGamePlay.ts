import { useCallback, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import type { BallAnimation, Risk } from '@/entities/game';
import type { User } from '@/entities/session';
import { formatCredits } from '@/shared/lib/credits';
import { BffError } from '@/shared/api';
import { useSound } from './use-sound';
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
  const { playDrop, playResult } = useSound();

  const [currentAnimations, setCurrentAnimations] = useState<BallAnimation[]>([]);
  const animResolveMap = useRef<Map<string, () => void>>(new Map());
  const betResultMap = useRef<Map<string, number>>(new Map());
  const activeCount = useRef(0);

  const placeBetMutation = usePlaceBet();

  const handlePlaceBet = useCallback(
    async (amount: string, rows: number, risk: Risk) => {
      try {
        const bet = await placeBetMutation.mutateAsync({ amount, rows, risk });

        playDrop();
        activeCount.current += 1;
        setPlaying(true);

        const multiplier = Number(bet.multiplier);
        betResultMap.current.set(bet.betId, multiplier);

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

        const payout = formatCredits(bet.payout);

        playResult(multiplier);

        if (multiplier >= 1) {
          toast.success(`${multiplier}x — ${payout}`, { duration: 3000 });
        } else {
          toast.error(`${multiplier}x — ${payout}`, { duration: 2500 });
        }

        queryClient.setQueryData<User>(['me'], (old) =>
          old ? { ...old, balance: bet.balanceAfter } : old
        );
      } catch (err) {
        if (err instanceof BffError) {
          toast.error(err.message, { duration: 3000 });
        } else {
          toast.error('Failed to place bet', { duration: 3000 });
        }
      } finally {
        activeCount.current -= 1;
        if (activeCount.current === 0) setPlaying(false);
      }
    },
    [setPlaying, queryClient, placeBetMutation, playDrop, playResult]
  );

  const handleAnimationEnd = useCallback((id: string) => {
    animResolveMap.current.get(id)?.();
    animResolveMap.current.delete(id);
    betResultMap.current.delete(id);
    setCurrentAnimations((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return {
    currentAnimations,
    handlePlaceBet,
    handleAnimationEnd,
  };
};
