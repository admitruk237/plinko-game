import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { bffApi } from '@/shared/api';
import { useSessionStore } from '@/entities/session';
import { usePageTransition } from '@/shared/lib/page-transition-context';
import { ROUTES } from '@/shared/config';

export const useLogout = () => {
  const clearSession = useSessionStore((s) => s.clearSession);
  const router = useRouter();
  const { triggerTransition } = usePageTransition();

  return useMutation<void, Error, void>({
    mutationFn: () => {
      triggerTransition();
      return bffApi.logout();
    },
    onSuccess: () => {
      clearSession();
      router.replace(ROUTES.LOGIN);
    },
    onError: () => {
      clearSession();
      router.replace(ROUTES.LOGIN);
    },
  });
};
