'use client';

import Link from 'next/link';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/shared/ui/form';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { AuthCard } from './AuthCard';
import { ROUTES } from '@/shared/config';
import { useRegisterForm } from '../model/useRegisterForm';

export const RegisterForm = () => {
  const { form, register, isPending } = useRegisterForm();

  return (
    <AuthCard subtitle="Create your account">
      <Form {...form}>
        <form onSubmit={form.handleSubmit((values) => register(values))} className="flex flex-col">
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
                <p className="text-xs text-zinc-500">
                  At least 8 characters with a letter and digit
                </p>
              </FormItem>
            )}
          />

          {form.formState.errors.root && (
            <p className="text-sm text-red-500 mt-[16px]">{form.formState.errors.root.message}</p>
          )}

          <Button type="submit" disabled={isPending} variant="primary" className="mt-[16px]">
            {isPending ? 'Creating account...' : 'Create Account'}
          </Button>

          <p className="text-center text-[14px] font-normal leading-[20px] tracking-[-0.15px] text-auth-text-muted mt-[25px]">
            Already have an account?{' '}
            <Link
              href={ROUTES.LOGIN}
              className="text-brand-green-start hover:text-brand-green-start/80 font-medium transition-colors"
            >
              Sign In
            </Link>
          </p>
        </form>
      </Form>
    </AuthCard>
  );
};
