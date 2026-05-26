import { useMutation, useQueryClient } from '@tanstack/react-query';
import { bffApi } from '@/shared/api';
import type { ProfileDto } from '@/shared/api/types';

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();

  return useMutation<ProfileDto, Error, File>({
    mutationFn: (file) => bffApi.uploadAvatar(file),
    onSuccess: (profile) => {
      queryClient.setQueryData<ProfileDto>(['profile'], profile);
    },
  });
};
