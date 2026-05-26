import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bffApi } from '@/shared/api';
import type { ClaimResultDto, ProfileDto, ProgressionAggregateDto } from '@/shared/api/types';
import type { User } from '@/entities/session';

export const useClaimDaily = () => {
  const queryClient = useQueryClient();

  return useMutation<ClaimResultDto, Error, void>({
    mutationFn: () => bffApi.claimDaily(),
    onSuccess: (result) => {
      queryClient.setQueryData<ProgressionAggregateDto>(['progression'], result.progression);
      queryClient.setQueryData<User>(['me'], (old) =>
        old ? { ...old, balance: result.reward.balanceAfter } : old
      );
      queryClient.setQueryData<ProfileDto>(['profile'], (old) =>
        old ? { ...old, balance: result.reward.balanceAfter } : old
      );
    },
  });
};
