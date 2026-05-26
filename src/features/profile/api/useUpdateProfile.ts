import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bffApi } from '@/shared/api';
import type { ProfileDto, UpdateProfileDto } from '@/shared/api/types';
import type { User } from '@/entities/session';

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();

  return useMutation<ProfileDto, Error, UpdateProfileDto>({
    mutationFn: (dto) => bffApi.updateProfile(dto),
    onSuccess: (profile) => {
      queryClient.setQueryData<ProfileDto>(['profile'], profile);
      queryClient.setQueryData<User>(['me'], (old) =>
        old ? { ...old, balance: profile.balance } : old
      );
    },
  });
};
