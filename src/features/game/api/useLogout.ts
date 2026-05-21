import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { bffApi } from '@/shared/api';
import { useSessionStore } from '@/entities/session';
import { ROUTES } from '@/shared/config';

export const useLogout = () => {
  const router = useRouter();
  const clearSession = useSessionStore((s) => s.clearSession);

  return useMutation<void, Error, void>({
    mutationFn: bffApi.logout,
    onSuccess: () => {
      clearSession();
      router.push(ROUTES.LOGIN);
    },
    onError: () => {
      clearSession();
      router.push(ROUTES.LOGIN);
    },
  });
};
