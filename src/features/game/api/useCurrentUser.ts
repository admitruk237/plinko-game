import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { bffApi, BffError } from '@/shared/api';
import { useSessionStore } from '@/entities/session';
import type { User } from '@/entities/session';
import { ROUTES } from '@/shared/config';

export const useCurrentUser = () => {
  const router = useRouter();
  const clearSession = useSessionStore((s) => s.clearSession);

  return useQuery<User>({
    queryKey: ['me'],
    queryFn: async (): Promise<User> => {
      try {
        return await bffApi.getMe();
      } catch (err: unknown) {
        if (err instanceof BffError && err.status === 401) {
          clearSession();
          router.push(ROUTES.LOGIN);
        }
        throw err;
      }
    },
    refetchInterval: 30000,
    retry: false,
  });
};
