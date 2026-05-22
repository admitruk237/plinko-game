import { useMutation } from '@tanstack/react-query';
import { bffApi } from '@/shared/api';
import type { BetResponse, CreateBetDto } from '@/entities/game';

export const usePlaceBet = () => {
  return useMutation<BetResponse, Error, CreateBetDto>({
    mutationFn: bffApi.placeBet,
  });
};
