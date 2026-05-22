import { useQuery } from '@tanstack/react-query';
import { bffApi } from '@/shared/api';
import type { GameConfig } from '@/entities/game';

export const useGameConfig = () => {
  return useQuery<GameConfig>({
    queryKey: ['game', 'config'],
    queryFn: bffApi.getGameConfig,
    staleTime: Infinity,
  });
};
