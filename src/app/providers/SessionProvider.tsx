'use client';

import { type ReactNode, useRef } from 'react';
import { type User, useSessionStore } from '@/entities/session';

interface Props {
  accessToken: string;
  user: User;
  children: ReactNode;
}

export const SessionProvider = ({ accessToken, user, children }: Props) => {
  const initialized = useRef<true | null>(null);
  if (initialized.current == null) {
    useSessionStore.setState({ accessToken, user });
    initialized.current = true;
  }

  return <>{children}</>;
};
