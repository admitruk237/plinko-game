'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { type LoginFormValues, loginSchema } from '../model/schemas';
import { loginAction } from '../actions/login.action';
import { useSessionStore } from '@/entities/session/model/store';
import { AuthCard } from './AuthCard';
import { ROUTES } from '@/shared/config';

export const LoginForm = () => {
  const router = useRouter();
  const setSession = useSessionStore((s) => s.setSession);

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
      router.push(ROUTES.GAME);
    },
  });

  return (
    <AuthCard subtitle="Welcome back!">
      <Form {...form}>
        <form onSubmit={form.handleSubmit((values) => login(values))} className="flex flex-col">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="your@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="mt-[16px]">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.root && (
            <p className="text-sm text-red-500 mt-[16px]">{form.formState.errors.root.message}</p>
          )}

          <Button type="submit" disabled={isPending} variant="primary" className="mt-[16px]">
            {isPending ? 'Signing in...' : 'Sign In'}
          </Button>

          <p className="text-center text-[14px] font-normal leading-[20px] tracking-[-0.15px] text-auth-text-muted mt-[25px]">
            Don&apos;t have an account?{' '}
            <Link
              href={ROUTES.REGISTER}
              className="text-brand-green-start hover:text-brand-green-start/80 font-medium transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </form>
      </Form>
    </AuthCard>
  );
};
