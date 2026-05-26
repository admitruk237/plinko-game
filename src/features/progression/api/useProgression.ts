import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { bffApi, BffError } from '@/shared/api';
import type { ProgressionAggregateDto } from '@/shared/api/types';
import { useSessionStore } from '@/entities/session';
import { ROUTES } from '@/shared/config';

export const useProgression = () => {
  const router = useRouter();
  const clearSession = useSessionStore((s) => s.clearSession);

  return useQuery<ProgressionAggregateDto>({
    queryKey: ['progression'],
    queryFn: async (): Promise<ProgressionAggregateDto> => {
      try {
        return await bffApi.getProgression();
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
