import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { bffApi, BffError } from '@/shared/api';
import type { ProfileDto } from '@/shared/api/types';
import { useSessionStore } from '@/entities/session';
import { ROUTES } from '@/shared/config';

export const useProfile = () => {
  const router = useRouter();
  const clearSession = useSessionStore((s) => s.clearSession);

  return useQuery<ProfileDto>({
    queryKey: ['profile'],
    queryFn: async (): Promise<ProfileDto> => {
      try {
        return await bffApi.getProfile();
      } catch (err: unknown) {
        if (err instanceof BffError && err.status === 401) {
          clearSession();
          router.push(ROUTES.LOGIN);
        }
        throw err;
      }
    },
    retry: false,
  });
};
