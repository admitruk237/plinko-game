'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { type User, useSessionStore } from '@/entities/session';
import { usePageTransition } from '@/shared/lib/page-transition-context';
import { ROUTES } from '@/shared/config';
import { type RegisterFormValues, registerSchema } from './schemas';
import { registerAction } from '../actions/register.action';

export const useRegisterForm = () => {
  const router = useRouter();
  const setSession = useSessionStore((s) => s.setSession);
  const queryClient = useQueryClient();
  const { triggerTransition } = usePageTransition();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { email: '', password: '' },
  });

  const { mutate: register, isPending } = useMutation({
    mutationFn: (values: RegisterFormValues) => registerAction(values),
    onMutate: () => form.clearErrors('root'),
    onSuccess: (result) => {
      if (!result.ok) {
        if (result.field === 'email') {
          form.setError('email', { message: result.error });
        } else {
          form.setError('root', { message: result.error });
        }
        return;
      }
      setSession(result.accessToken, result.user);
      queryClient.setQueryData<User>(['me'], result.user);
      triggerTransition();
      router.push(ROUTES.GAME);
    },
  });

  return { form, register, isPending };
};
