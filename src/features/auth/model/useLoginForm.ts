'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useSessionStore } from '@/entities/session';
import { usePageTransition } from '@/shared/lib/page-transition-context';
import { ROUTES } from '@/shared/config';
import { type LoginFormValues, loginSchema } from './schemas';
import { loginAction } from '../actions/login.action';

export const useLoginForm = () => {
  const router = useRouter();
  const setSession = useSessionStore((s) => s.setSession);
  const { triggerTransition } = usePageTransition();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const { mutate: login, isPending } = useMutation({
    mutationFn: (values: LoginFormValues) => loginAction(values),
    onSuccess: (result) => {
      if (!result.ok) {
        form.setError('root', { message: result.error });
        return;
      }
      setSession(result.accessToken, result.user);
      triggerTransition();
      router.push(ROUTES.GAME);
    },
  });

  return { form, login, isPending };
};
