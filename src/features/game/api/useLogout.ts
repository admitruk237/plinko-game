import { useMutation } from '@tanstack/react-query';
import { bffApi } from '@/shared/api';
import { useSessionStore } from '@/entities/session';
import { ROUTES } from '@/shared/config';

export const useLogout = () => {
  const clearSession = useSessionStore((s) => s.clearSession);

  return useMutation<void, Error, void>({
    mutationFn: bffApi.logout,
    onSuccess: () => {
      clearSession();
      window.location.replace(ROUTES.LOGIN);
    },
    onError: () => {
      clearSession();
      window.location.replace(ROUTES.LOGIN);
    },
  });
};
